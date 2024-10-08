
import frappe, json
from frappe import _, msgprint
from frappe.utils import today, flt, comma_and, add_days, cint, nowdate, ceil
from e_dispatch.custom_folder.custom_bom import get_custom_bom_items
from erpnext.setup.doctype.item_group.item_group import get_item_group_defaults
from erpnext.stock.get_item_details import get_conversion_factor, get_item_warehouse

from erpnext.manufacturing.doctype.production_plan.production_plan import (
	ProductionPlan, get_materials_from_other_locations,
	get_bin_details, get_uom_conversion_factor, get_exploded_items, get_subitems,
	get_warehouse_list)

class CustomProductionPlan(ProductionPlan):
	def set_sub_assembly_items_based_on_level(self, row, bom_data, manufacturing_type=None):
		super(CustomProductionPlan, self).set_sub_assembly_items_based_on_level(row, bom_data, manufacturing_type=manufacturing_type)

		type_of_manufacturing = {
			"Purchase": "Material Request",
			"Purchase and Resale": "Material Request",
			"In House": "In House",
			"In House and Resale": "In House",
			"Subcontract and Resale": "Subcontract",
			"Subcontract": "Subcontract"
		}

		bom_details = get_parent_bom_details(self)
		for data in bom_data:
			bom_information = bom_details.get(data.production_plan_item)
			data.default_customer = get_default_customer(data.production_item,
				bom_information)

			if not data.production_state:
				data.production_state = get_production_state(data.production_item, bom_information)
				data.type_of_manufacturing = type_of_manufacturing.get(data.production_state)

	def make_work_order_for_subassembly_items(self, wo_list, subcontracted_po, default_warehouses):
		for row in self.sub_assembly_items:
			if row.production_state in ["Subcontract", "Subcontract and Resale"]:
				subcontracted_po.setdefault(row.supplier, []).append(row)
				continue

			if row.production_state in ["Ignore", "Subcontract",
				"Subcontract and Resale", "Purchase and Resale"]:
				continue

			if row.type_of_manufacturing == "Material Request":
				continue

			work_order_data = {
				"wip_warehouse": default_warehouses.get("wip_warehouse"),
				"fg_warehouse": default_warehouses.get("fg_warehouse"),
				"company": self.get("company"),
			}

			self.prepare_data_for_sub_assembly_items(row, work_order_data)
			work_order = self.create_work_order(work_order_data)
			if work_order:
				wo_list.append(work_order)

	@frappe.whitelist()
	def make_material_request(self):
		"""Create Material Requests grouped by Sales Order and Material Request Type"""
		material_request_list = []
		material_request_map = {}

		for item in self.mr_items:
			if item.production_state == "Ignore":
				continue

			item_doc = frappe.get_cached_doc("Item", item.item_code)

			material_request_type = item.material_request_type or item_doc.default_material_request_type

			# key for Sales Order:Material Request Type:Customer
			key = "{}:{}:{}".format(item.sales_order, material_request_type, item_doc.customer or "")
			schedule_date = add_days(nowdate(), cint(item_doc.lead_time_days))

			if not key in material_request_map:
				# make a new MR for the combination
				material_request_map[key] = frappe.new_doc("Material Request")
				material_request = material_request_map[key]
				material_request.update(
					{
						"transaction_date": nowdate(),
						"status": "Draft",
						"company": self.company,
						"material_request_type": material_request_type,
						"customer": item_doc.customer or "",
					}
				)
				material_request_list.append(material_request)
			else:
				material_request = material_request_map[key]

			# add item
			material_request.append(
				"items",
				{
					"item_code": item.item_code,
					"from_warehouse": item.from_warehouse,
					"qty": item.quantity,
					"schedule_date": schedule_date,
					"warehouse": item.warehouse,
					"sales_order": item.sales_order,
					"production_plan": self.name,
					"material_request_plan_item": item.name,
					"project": frappe.db.get_value("Sales Order", item.sales_order, "project")
					if item.sales_order
					else None,
				},
			)

		for material_request in material_request_list:
			# submit
			material_request.flags.ignore_permissions = 1
			material_request.run_method("set_missing_values")

			if self.get("submit_material_request"):
				material_request.submit()
			else:
				material_request.save()

		frappe.flags.mute_messages = False

		if material_request_list:
			material_request_list = [
				"""<a href="/app/Form/Material Request/{0}">{1}</a>""".format(m.name, m.name)
				for m in material_request_list
			]
			msgprint(_("{0} created").format(comma_and(material_request_list)))
		else:
			msgprint(_("No material request created"))

	@frappe.whitelist()
	def make_sales_order(self):
		items = {}

		for row in self.boughtout_items:
			if row.production_state not in ["Subcontract and Resale", "In House and Resale", "Purchase and Resale"]:
				continue

			default_customer_for_rs = row.default_customer
			if row.qty > row.so_qty:
				items.setdefault(default_customer_for_rs, []).append(frappe._dict({
					"item_code": row.item_code,
					"item_name": row.item_name,
					"uom": row.uom,
					"conversion_factor": 1.0,
					"quantity": row.qty,
					"warehouse": row.warehouse,
					"production_plan_mr_item": row.name
				}))

		for default_customer, items in items.items():
			sales_order = frappe.new_doc("Sales Order")
			sales_order.customer = default_customer
			sales_order.company = self.company
			sales_order.transaction_date = nowdate()
			sales_order.delivery_date = add_days(nowdate(), 7)
			sales_order.production_plan = self.name
			sales_order.flags.ignore_permissions = 1

			for row in items:
				sales_order.append("items", {
					"item_code": row.item_code,
					"qty": row.quantity,
					"delivery_date": add_days(nowdate(), 7),
					"warehouse": row.warehouse,
					"production_plan_mr_item": row.get("production_plan_mr_item")
				})

			sales_order.run_method("set_missing_values")
			sales_order.run_method("calculate_taxes_and_totals")
			sales_order.flags.ignore_mandatory = True
			sales_order.flags.ignore_validate = True
			sales_order.flags.ignore_permissions = True
			sales_order.save()
			frappe.msgprint(_("Sales Order {0} created").format(sales_order.name))

	def combine_subassembly_items(self, sub_assembly_items_store):
		"Aggregate if same: Item, Warehouse, Inhouse/Outhouse Manu.g, BOM No."
		key_wise_data = {}
		for row in sub_assembly_items_store:
			key = (
				row.get("production_item"),
				row.get("fg_warehouse"),
				row.get("bom_no"),
				row.get("production_state"),
			)
			if key not in key_wise_data:
				# intialise (item, wh, bom no, man.g type) wise dict
				key_wise_data[key] = row
				continue

			existing_row = key_wise_data[key]
			if existing_row:
				# if row with same (item, wh, bom no, man.g type) key, merge
				existing_row.qty += flt(row.qty)
				existing_row.stock_qty += flt(row.stock_qty)
				existing_row.bom_level = max(existing_row.bom_level, row.bom_level)
				continue
			else:
				# add row with key
				key_wise_data[key] = row

		sub_assembly_items_store = [
			key_wise_data[key] for key in key_wise_data
		]  # unpack into single level list
		return sub_assembly_items_store

	@frappe.whitelist()
	def set_sales_order_materials(self):
		bom_details = get_parent_bom_details(self)
		self.set("boughtout_items", [])

		parent_bom_details = {}
		for row in self.po_items:
			parent_bom_details[row.name] = {
				"warehouse": row.warehouse,
				"planned_qty": row.planned_qty
			}

		for key, bom_data in bom_details.items():
			for row in bom_data:
				if row.production_state not in [
					"Purchase and Resale", "Subcontract and Resale", "In House and Resale"
				]:
					continue

				bom_info = parent_bom_details.get(key) or {}

				item_doc = frappe.get_cached_doc("Item", row.item_code)
				self.append("boughtout_items", {
					"item_code": row.item_code,
					"item_name": row.item_name,
					"uom": row.uom,
					"qty": row.qty * flt(bom_info.get("planned_qty")),
					"default_customer": row.default_customer,
					"production_state": row.production_state,
					"warehouse": get_item_warehouse(item_doc, self, overwrite_warehouse=False) or bom_info.get("warehouse")
				})

		self.save()


def get_bom_details(doc):
	bom_details = []
	for row in doc.po_items:
		if isinstance(row, dict):
			row = frappe._dict(row)

		if not row.bom_no:
			continue

		bom_details.extend(get_custom_bom_items(row.bom_no))

	return bom_details

def get_production_state(item_code, bom_details):
	for row in bom_details:
		if row.get("item_code") == item_code:
			return row.production_state

def get_default_customer(item_code, bom_details):
	for row in bom_details:
		if row.get("item_code") == item_code:
			return row.default_customer

def validate_event(doc, method=None):
	pass

def on_submit_event(doc, method=None):
	validate_default_customer(doc)

def validate_default_customer(doc):
	for row in doc.boughtout_items:
		if not row.production_state in ["Purchase and Resale",
			"Subcontract and Resale", "In House and Resale"]:
			continue

		if not row.default_customer:
			frappe.throw(_("Default Customer is required for item {0} in sales orders materials").format(row.item_code))

		if not row.warehouse:
			frappe.throw(_("Warehouse is required for item {0} in sales orders materials").format(row.item_code))

def get_parent_bom_details(doc):
	bom_details = {}
	for row in doc.po_items:
		if isinstance(row, dict):
			row = frappe._dict(row)

		if not row.bom_no:
			continue

		bom_details.setdefault(row.name, []).extend(get_custom_bom_items(row.bom_no))

	return bom_details


@frappe.whitelist()
def get_items_for_material_requests(doc, warehouses=None, get_parent_warehouse_data=None):
	if isinstance(doc, str):
		doc = frappe._dict(json.loads(doc))

	if warehouses:
		warehouses = list(set(get_warehouse_list(warehouses)))

		if (
			doc.get("for_warehouse")
			and not get_parent_warehouse_data
			and doc.get("for_warehouse") in warehouses
		):
			warehouses.remove(doc.get("for_warehouse"))

	doc["mr_items"] = []

	po_items = doc.get("po_items") if doc.get("po_items") else doc.get("items")
	bom_details = []
	if doc.get("po_items"):
		bom_details = get_parent_bom_details(doc)


	if doc.get("sub_assembly_items"):
		for sa_row in doc.sub_assembly_items:
			sa_row = frappe._dict(sa_row)
			if sa_row.type_of_manufacturing == "Material Request":
				po_items.append(
					frappe._dict(
						{
							"item_code": sa_row.production_item,
							"production_plan_item": sa_row.production_plan_item,
							"required_qty": sa_row.qty,
							"include_exploded_items": 0
						}
					)
				)

	# Check for empty table or empty rows
	if not po_items or not [row.get("item_code") for row in po_items if row.get("item_code")]:
		frappe.throw(
			_("Items to Manufacture are required to pull the Raw Materials associated with it."),
			title=_("Items Required"),
		)

	company = doc.get("company")
	ignore_existing_ordered_qty = doc.get("ignore_existing_ordered_qty")
	include_safety_stock = doc.get("include_safety_stock")

	so_item_details = frappe._dict()

	for data in doc.get("po_items"):
		if not data.get("name"):
			continue

		bom_qty = frappe.get_cached_value("BOM", data.get("bom_no"), "quantity")

		if not data.get("include_exploded_items") and doc.get("sub_assembly_items"):
			data["include_exploded_items"] = 1

		planned_qty = data.get("required_qty") or data.get("planned_qty")
		ignore_existing_ordered_qty = (
			data.get("ignore_existing_ordered_qty") or ignore_existing_ordered_qty
		)
		warehouse = doc.get("for_warehouse")

		item_details = {}
		parent_bom_details = bom_details.get(data.get("name"))
		for row in parent_bom_details:
			if row.production_state not in ["Purchase and Resale","Purchase", "Ignore"]:
				continue

			key = (row.item_code, row.production_state)

			if key not in item_details:
				item_master = frappe.get_doc("Item", row.item_code)
				purchase_uom = item_master.purchase_uom or item_master.stock_uom
				conversion_factor = (
					get_uom_conversion_factor(item_master.name, purchase_uom) if item_master.purchase_uom else 1.0
				)

				item_details.setdefault(key, frappe._dict({
					"item_code": row.item_code,
					"qty": (row.qty * planned_qty) / bom_qty,
					"production_state": row.production_state,
					"min_order_qty": item_master.min_order_qty,
					"description": item_master.description,
					"stock_uom": item_master.stock_uom,
					"safety_stock": item_master.safety_stock,
					"conversion_factor": conversion_factor,
					"purchase_uom": purchase_uom,
					"default_customer": row.default_customer,
					"warehouse": warehouse,
					"include_safety_stock": include_safety_stock,
					"ignore_existing_ordered_qty": ignore_existing_ordered_qty,
					"company": company,
					"sales_order": doc.get("sales_order"),
					"production_plan_item": data.get("production_plan_item") or data.get("name")
				}))
			else:
				item_details[key].qty += (row.qty * planned_qty) / bom_qty

		sales_order = doc.get("sales_order")

		for key, details in item_details.items():
			so_item_details.setdefault(sales_order, frappe._dict())
			if key in so_item_details.get(sales_order, {}):
				so_item_details[sales_order][key]["qty"] = so_item_details[sales_order][key].get(
					"qty", 0
				) + flt(details.qty)
			else:
				so_item_details[sales_order][key] = details

	mr_items = []
	for sales_order, item_code in so_item_details.items():
		item_dict = so_item_details[sales_order]
		for details in item_dict.values():
			bin_dict = get_bin_details(details, doc.company, warehouse)
			bin_dict = bin_dict[0] if bin_dict else {}

			if details.qty > 0:
				items = get_material_request_items(
					details,
					sales_order,
					company,
					ignore_existing_ordered_qty,
					include_safety_stock,
					warehouse,
					bin_dict,
				)
				if items:
					mr_items.append(items)

	if (not ignore_existing_ordered_qty or get_parent_warehouse_data) and warehouses:
		new_mr_items = []
		for item in mr_items:
			get_materials_from_other_locations(item, warehouses, new_mr_items, company)

		mr_items = new_mr_items

	if not mr_items:
		to_enable = frappe.bold(_("Ignore Existing Projected Quantity"))
		warehouse = frappe.bold(doc.get("for_warehouse"))
		message = (
			_(
				"As there are sufficient raw materials, Material Request is not required for Warehouse {0}."
			).format(warehouse)
			+ "<br><br>"
		)
		message += _("If you still want to proceed, please enable {0}.").format(to_enable)

		frappe.msgprint(message, title=_("Note"))

	return mr_items


def get_material_request_items(
	row, sales_order, company, ignore_existing_ordered_qty, include_safety_stock, warehouse, bin_dict
):
	total_qty = row["qty"]

	required_qty = 0
	if ignore_existing_ordered_qty or bin_dict.get("projected_qty", 0) < 0:
		required_qty = total_qty
	elif total_qty > bin_dict.get("projected_qty", 0):
		required_qty = total_qty - bin_dict.get("projected_qty", 0)
	if required_qty > 0 and required_qty < row["min_order_qty"]:
		required_qty = row["min_order_qty"]
	item_group_defaults = get_item_group_defaults(row.item_code, company)

	if not row["purchase_uom"]:
		row["purchase_uom"] = row["stock_uom"]

	if row["purchase_uom"] != row["stock_uom"]:
		if not (row["conversion_factor"] or frappe.flags.show_qty_in_stock_uom):
			frappe.throw(
				_("UOM Conversion factor ({0} -> {1}) not found for item: {2}").format(
					row["purchase_uom"], row["stock_uom"], row.item_code
				)
			)

			required_qty = required_qty / row["conversion_factor"]

	if frappe.db.get_value("UOM", row["purchase_uom"], "must_be_whole_number"):
		required_qty = ceil(required_qty)

	if include_safety_stock:
		required_qty += flt(row["safety_stock"])

	item_details = frappe.get_cached_value(
		"Item", row.item_code, ["purchase_uom", "stock_uom"], as_dict=1
	)

	conversion_factor = 1.0
	if (
		row.get("default_material_request_type") == "Purchase"
		and item_details.purchase_uom
		and item_details.purchase_uom != item_details.stock_uom
	):
		conversion_factor = (
			get_conversion_factor(row.item_code, item_details.purchase_uom).get("conversion_factor") or 1.0
		)

	if required_qty > 0:
		return {
			"item_code": row.item_code,
			"production_state": row.production_state,
			"default_customer": row.default_customer,
			"item_name": row.item_name,
			"quantity": required_qty / conversion_factor,
			"required_bom_qty": total_qty,
			"stock_uom": row.get("stock_uom"),
			"warehouse": warehouse
			or row.get("source_warehouse")
			or row.get("default_warehouse")
			or item_group_defaults.get("default_warehouse"),
			"safety_stock": row.safety_stock,
			"actual_qty": bin_dict.get("actual_qty", 0),
			"projected_qty": bin_dict.get("projected_qty", 0),
			"ordered_qty": bin_dict.get("ordered_qty", 0),
			"reserved_qty_for_production": bin_dict.get("reserved_qty_for_production", 0),
			"min_order_qty": row["min_order_qty"],
			"material_request_type": row.get("default_material_request_type"),
			"sales_order": sales_order,
			"description": row.get("description"),
			"uom": row.get("purchase_uom") or row.get("stock_uom"),
		}