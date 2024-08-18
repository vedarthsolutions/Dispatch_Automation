import frappe
import json
from frappe import _
from frappe.model.mapper import get_mapped_doc
from collections import defaultdict
from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice
from frappe.utils import flt, nowdate, get_link_to_form, cstr

from erpnext.stock.doctype.pick_list.pick_list import (PickList,
	get_available_item_locations, get_items_with_location_and_quantity)

class CustomPickList(PickList):
	def before_save(self):

		if not self.business_unit:
			self.business_unit = frappe.db.get_value("Warehouse", self.warehouse, "business_unit")

		self.auto_submit_sales_invoice = 1
		self.set_sales_order_reference()

	def validate(self):
		super().validate()
		self.validate_so_details()
		self.update_idx_in_custom_items()

	def validate_so_details(self):
		for row in self.picklist_items:
			if row.sales_order and row.sales_order_item:
				order_details = frappe.db.get_value("Sales Order Item", row.sales_order_item, ["stock_qty", "picked_qty"], as_dict=1)
				if order_details and flt(order_details.stock_qty) < flt(flt(order_details.picked_qty) + flt(row.qty)):
					frappe.throw(f"Cannot pick qty {cstr(flt(flt(order_details.picked_qty) + flt(row.qty)))} (already picked {cstr(order_details.picked_qty)} + picking {row.qty}) which is more than sales order qty {cstr(flt(order_details.stock_qty))}")

	def update_idx_in_custom_items(self, save=False):
		idx = 0
		for row in self.locations:
			if row.qty != row.picked_qty:
				row.qty = row.picked_qty
				row.stock_qty = row.picked_qty

		for row in self.custom_items:
			idx += 1
			row.idx = idx

			if save:
				row.db_set("idx", row.idx)
		return idx

	def on_submit(self):
		super().on_submit()
		self.set_qr_code_picked()

	def set_qr_code_picked(self):
		boxes = []
		for row in self.custom_items:
			box_no = row.get("qr_code")
			if not box_no:
				continue

			boxes.append(box_no)

		if boxes:
			qr_table = frappe.qb.DocType("Work Order Qrcode")
			(
				frappe.qb.update(qr_table)
				.set(qr_table.has_picked, 1)
				.where(qr_table.qr_code_id.isin(boxes))
			).run()

	def on_cancel(self):
		super().on_cancel()
		self.update_is_picked()

	def on_trash(self):
		super().on_trash()
		self.update_is_picked()

	def update_is_picked(self, is_picked=0):
		batchwise_picked_boxes = {}
		for row in self.custom_items:
			batchwise_picked_boxes.setdefault(row.batch, []).append(row.qr_code)

		if batchwise_picked_boxes:
			for batch_no, qr_codes in batchwise_picked_boxes.items():
				qr_table = frappe.qb.DocType("Work Order Qrcode")
				(
					frappe.qb.update(qr_table).set(qr_table.has_picked, is_picked).where(qr_table.qr_code_id.isin(qr_codes))
				).run()

	def set_sales_order_reference(self):
		item_warehouse_wise_reference = {}

		for row in self.picklist_items:
			key = (row.item_code, row.warehouse)
			item_warehouse_wise_reference.setdefault(key, (row.sales_order, row.sales_order_item))
			row.stock_qty = flt(row.qty) * (row.conversion_factor or 1.0)

		for nrow in self.locations:
			if not (nrow.sales_order and nrow.sales_order_item):
				data = item_warehouse_wise_reference.get((nrow.item_code, nrow.warehouse))
				if data:
					nrow.sales_order = data[0]
					nrow.sales_order_item = data[1]


	@frappe.whitelist()
	def custom_scan_qrcode(self, scanned_qrcode):
		if isinstance(scanned_qrcode, str):
			scan_qrcode = json.loads(scanned_qrcode)
		else:
			scan_qrcode = scanned_qrcode

		picked_scanned_qr_code = frappe.get_all("Work Order Qrcode",
			fields = ["has_picked", "warehouse", "is_discarded"],
			filters = {
				"qr_code_id": scan_qrcode.get("box_no")
			}
		)


		picked_qr_code = frappe.get_all("Pick List QRCode",
			fields=["parent as name"],
			filters = {
				"qr_code": scan_qrcode.get("box_no"),
				"docstatus": 0,
			}
		)

		if picked_qr_code and len(picked_qr_code) > 0:
			box_no = scan_qrcode.get("box_no")
			name = picked_qr_code[0].name
			frappe.msgprint(f"The qr code {box_no} has already scanned in pick list {name}", alert=True)
			return

		if not picked_scanned_qr_code:
			frappe.msgprint(f"Qr Code {scan_qrcode.get('box_no')} not found", alert=True)
			return

		if picked_scanned_qr_code and picked_scanned_qr_code[0].has_picked:
			pick_list = frappe.db.get_value("Pick List QRCode", {"qr_code": scan_qrcode.get('box_no')}, "parent")
			frappe.msgprint(f"<div style='color:red'>QR Code {scan_qrcode.get('box_no')} has already scanned in the pick list {pick_list}</div>", title="Error Message 1", alert=True)
			return
		elif picked_scanned_qr_code and picked_scanned_qr_code[0].is_discarded:
			frappe.msgprint(f"QR Code {scan_qrcode.get('box_no')} has discarded, please scan another qr code", title="Qr Code Discarded", alert=True)
			return
		elif picked_scanned_qr_code and (not picked_scanned_qr_code[0].warehouse or (self.warehouse and picked_scanned_qr_code[0].warehouse != self.warehouse)):
			if not picked_scanned_qr_code[0].warehouse:
				frappe.msgprint(f"QR Code {scan_qrcode.get('box_no')} has not available in the warehouse", alert=True)
				return
			else:
				frappe.msgprint(f"QR Code {scan_qrcode.get('box_no')} has not available in the warehouse {self.warehouse} but available in the warehouse {picked_scanned_qr_code[0].warehouse}", alert=True)
				return

		self.reload()

		return self.add_custom_items(scan_qrcode)

	def add_custom_items(self, scan_qrcode):
		picklist_row = ''
		custom_picklist_row = ''
		for row in self.picklist_items:
			if row.item_code == scan_qrcode.get("item_no"):
				picklist_row = row
				break

		if not picklist_row:
			item_code = scan_qrcode.get('item_no')
			frappe.throw(f"Item {item_code} is not in the pick list")

		for row in self.custom_items:
			if row.item_code == scan_qrcode.get("item_no") and row.batch == scan_qrcode.get("batch_no") and row.qr_code == scan_qrcode.get("box_no"):
				custom_picklist_row = row
				break

		idx = self.update_idx_in_custom_items(save=True)
		if not custom_picklist_row:
			c_row = self.append("custom_items", {
				"item_code": scan_qrcode.get("item_no"),
				"idx": idx+1,
				"batch": scan_qrcode.get("batch_no"),
				"qr_code": scan_qrcode.get("box_no"),
				"no_of_quantity": scan_qrcode.get("qty"), 
				"warehouse": self.warehouse,
				"qty": picklist_row.qty,
				"stock_qty": picklist_row.stock_qty,
				"sales_order": picklist_row.sales_order,
				"sales_order_item": picklist_row.sales_order_item
			})

			validate_picked_qty(self)
			c_row.db_update()
		else:
			box_no = scan_qrcode.get("box_no")
			frappe.msgprint(_(f"The QR Code {box_no} is already scanned"));

		item_locations = {}
		for n_row in self.custom_items:
			key = (n_row.item_code, n_row.warehouse, n_row.batch, n_row.sales_order, n_row.sales_order_item)
			if key not in item_locations:
				item_locations[key] = [n_row.no_of_quantity, n_row.qty, n_row.stock_qty]
			else:
				item_locations[key][0] += n_row.no_of_quantity

		frappe.db.sql("delete from `tabPick List Item` where parent = %s", self.name)
		for key, values in item_locations.items():
			c_row = self.append("locations", {
				"item_code": key[0],
				"warehouse": key[1],
				"batch_no": key[2],
				"qty": values[1],
				"stock_qty": values[2],
				"sales_order": key[3],
				"sales_order_item": key[4],
				"picked_qty": values[0],
				"use_serial_batch_fields": 1,
			})
			c_row.db_update()

		'''
		box_no = scan_qrcode.get("box_no")
		if box_no:
			qr_table = frappe.qb.DocType("Work Order Qrcode")
			(
				frappe.qb.update(qr_table)
				.set(qr_table.has_picked, 1)
				.where(qr_table.qr_code_id.isin([box_no]))
                	).run()

		'''
		self.reload()
		return {
			"locations": self.locations,
			"custom_items": self.custom_items
		}

	@frappe.whitelist()
	def set_item_locations(self, save=False):
		return
		if self.locations:
			return

		self.validate_for_qty()
		items = self.aggregate_item_qty()
		self.item_location_map = frappe._dict()

		from_warehouses = None
		if self.parent_warehouse:
			from_warehouses = frappe.db.get_descendants("Warehouse", self.parent_warehouse)

		# Create replica before resetting, to handle empty table on update after submit.
		locations_replica = self.get("locations")

		# reset
		self.delete_key("locations")
		for item_doc in items:
			item_code = item_doc.item_code

			self.item_location_map.setdefault(
				item_code,
				get_available_item_locations(
					item_code, from_warehouses, self.item_count_map.get(item_code), self.company
				),
			)

			locations = get_items_with_location_and_quantity(
				item_doc, self.item_location_map, self.docstatus
			)

			item_doc.idx = None
			item_doc.name = None

			for row in locations:
				location = item_doc.as_dict()
				location.update(row)
				self.append("locations", location)

		if save:
			self.save()


@frappe.whitelist()
def scan_qrcode(warehouse, company, scan_qrcode, name):


	# data = get_available_batches(scan_qrcode.get("item_no"), warehouse, company, scan_qrcode.get("batch_no"))
	# scan_qrcode["batch_qty"] = data[0][8] if data else 0
	# if not flt(scan_qrcode["batch_qty"]):
	# 	frappe.throw(f"Batch {frappe.bold(scan_qrcode.get('batch_no'))} has no available qty in the warehouse {frappe.bold(warehouse)}")

	scan_qrcode["warehouse"] = warehouse

	pl_doc = frappe.get_doc("Pick List", name)

	picklist_row = ''
	custom_picklist_row = ''
	for row in pl_doc.picklist_items:
		if row.item_code == scan_qrcode.get("item_no"):
			picklist_row = row
			break

	for row in pl_doc.custom_items:
		if row.item_code == scan_qrcode.get("item_no") and row.batch == scan_qrcode.get("batch_no") and row.qr_code == scan_qrcode.get("box_no"):
			custom_picklist_row = row
			break

	if not custom_picklist_row:
		pl_doc.append("custom_items", {
			"item_code": scan_qrcode.get("item_no"),
			"batch": scan_qrcode.get("batch_no"),
			"qr_code": scan_qrcode.get("box_no"),
			"no_of_quantity": scan_qrcode.get("qty"),
			"warehouse": warehouse,
			"qty": picklist_row.qty,
			"stock_qty": picklist_row.stock_qty,
			"sales_order": picklist_row.sales_order,
			"sales_order_item": picklist_row.sales_order_item
		})
	else:
		custom_picklist_row.no_of_quantity = scan_qrcode.get("qty")
		custom_picklist_row.batch = scan_qrcode.get("batch_no")
		custom_picklist_row.warehouse = scan_qrcode.get("warehouse")

		box_no = scan_qrcode.get("box_no")
		frappe.msgprint(_(f"The QR Code {box_no} is already scanned"));

	item_locations = {}
	for n_row in pl_doc.custom_items:
		key = (n_row.item_code, n_row.warehouse, n_row.batch, n_row.sales_order, n_row.sales_order_item)
		if key not in item_locations:
			item_locations[key] = [n_row.no_of_quantity, n_row.qty, n_row.stock_qty]
		else:
			item_locations[key][0] += n_row.no_of_quantity

	pl_doc.locations = []
	for key, values in item_locations.items():
		pl_doc.append("locations", {
			"item_code": key[0],
			"warehouse": key[1],
			"batch_no": key[2],
			"qty": values[1],
			"stock_qty": values[2],
			"sales_order": key[3],
			"sales_order_item": key[4],
			"picked_qty": values[0]
		})

	pl_doc.save(ignore_permissions=True)

	return pl_doc.custom_items


def get_available_batches(item_code, warehouse, company, batch):
	from erpnext.stock.report.batch_wise_balance_history.batch_wise_balance_history import execute

	filters = frappe._dict({
		'item_code': item_code,
		'warehouse': warehouse,
		'company': company,
		'batch_no': batch,
		'from_date': nowdate(),
		'to_date': nowdate()
	})

	columns, data = execute(filters)

	return data


def validate_event(doc, method=None):
	validate_warehouse(doc)
	validate_picked_qty(doc)

def validate_warehouse(doc):
	for row in doc.locations:
		if doc.warehouse and row.warehouse and row.warehouse != doc.warehouse:
			frappe.throw(f"Row {row.idx}: Warehouse should be same as Pick From Warehouse {doc.warehouse}")

def validate_picked_qty(doc, item_code=None, warehouse=None, qty=0, save=False):
	item_warehouse_wise_batch_qty = defaultdict(float)
	for item in doc.custom_items:
		item_warehouse_wise_batch_qty[(item.item_code, item.warehouse)] += item.no_of_quantity

	if item_code and qty:
		item_warehouse_wise_batch_qty[(item_code, warehouse)] += qty

	if not item_warehouse_wise_batch_qty:
		return

	for row in doc.picklist_items:
		if (row.item_code, row.warehouse) in item_warehouse_wise_batch_qty:
			picked_qty = flt(item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)])
			if picked_qty > row.stock_qty:
				frappe.throw(f"Extra qty picked for the item {row.item_code}")


	for row in doc.locations:
		if (row.item_code, row.warehouse) in item_warehouse_wise_batch_qty:
			picked_qty = flt(item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)])
			if row.picked_qty != picked_qty:
				row.picked_qty = picked_qty

			row.qty = picked_qty
			row.stock_qty = picked_qty
			if save:
				frappe.errprint(picked_qty)
				row.db_set({
					"qty": picked_qty,
					"stock_qty": picked_qty
				})

def on_submit_event(doc, method=None):
	validate_scanned_item(doc)
	update_qr_code_status(doc, 1)
	create_sales_invoice(doc)

def on_cancel_event(doc, method=None):
	update_qr_code_status(doc)

def update_qr_code_status(doc, has_picked=0):
	qr_codes = [d.qr_code for d in doc.custom_items if d.qr_code]
	if qr_codes:
		qr_table = frappe.qb.DocType("Work Order Qrcode")
		(
			frappe.qb.update(qr_table)
			.set(qr_table.has_picked, has_picked)
			.where(qr_table.qr_code_id.isin(qr_codes))
		).run()

def validate_scanned_item(doc):
	if doc.purpose != "Delivery":
		return

	if not doc.vehicle_no:
		frappe.throw("Enter the Vehicle No")

	if not doc.custom_items:
		frappe.throw("Please scan the QR Code")

	items = [d.item_code for d in doc.custom_items]

	for row in doc.locations:
		if row.item_code not in items:
			frappe.throw(f"Item {row.item_no} not scanned")

def create_sales_invoice(doc):
	sales_order_items = {}

	# item_warehouse_batch = {}
	# for item in doc.custom_items:
	# 	item_warehouse_batch[(item.item_code, item.warehouse)] = item.batch

	if not doc.business_unit:
		frappe.throw(f"Set Business Unit in the pick list {doc.name}")

	for row in doc.locations:
		sales_order_items.setdefault(row.sales_order, []).append(row)

	for sales_order, items in sales_order_items.items():
		si = make_sales_invoice(sales_order)

		si.items = []
		for row in items:
			si.append("items", {
				"item_code": row.item_code,
				"item_name": row.item_name,
				"description": row.description,
				"business_unit": doc.business_unit,
				"qty": row.picked_qty,
				"uom": row.stock_uom,
				"stock_uom": row.stock_uom,
				"conversion_factor": 1.0,
				"rate": frappe.db.get_value("Sales Order Item", row.sales_order_item, "rate"),
				"amount": row.picked_qty * frappe.db.get_value("Sales Order Item", row.sales_order_item, "rate"),
				"warehouse": row.warehouse,
				"batch_no": row.batch_no,
				"use_serial_batch_fields": 1,
				"sales_order": row.sales_order,
				"so_detail": row.sales_order_item,
				"income_account": frappe.db.get_value("Company", doc.company, "default_income_account")
			})

		si.update({
			"transporter": doc.transporter,
			"vehicle_no": doc.vehicle_no,
			"lr_no": doc.lr_no,
			"gst_transporter_id": doc.gst_transporter_id,
			"transporter_name": doc.transporter_name,
			"mode_of_transport": "Road",
			"gst_vehicle_type": "Regular"
		})

		si.flags.ignore_permissions = True
		si.update_stock = 1
		si.due_date= frappe.utils.nowdate()
		si.posting_date = si.due_date
		si.company = doc.company
		si.pick_list = doc.name
		si.flags.ignore_mandatory = True
		if si.payment_schedule:
			for row in si.payment_schedule:
				row.due_date = frappe.utils.nowdate()

		try:
			if doc.auto_submit_sales_invoice:
				si.submit()
			else:
				si.save()
		except Exception as e:
			frappe.db.rollback()
			traceback = frappe.get_traceback(with_context=True)
			doc.log_error(traceback)

			si.flags.ignore_mandatory = True
			si.flags.ignore_validate = True
			si.save()

		name = get_link_to_form("Sales Invoice", si.name)

		if si.docstatus == 1 and si.gst_category in ["Registered Regular", "Overseas", "Registered Composition"]:
			make_irn_entry(si)

		frappe.msgprint(f"Sales Invoice {name} created")

def make_irn_entry(si):
	from india_compliance.gst_india.utils.e_invoice import generate_e_invoice

	generate_e_invoice(si.name, force=True)

def remove_non_picked_items(si, items):
	remove_row = []
	for row in si.items:
		if (row.item_code, row.warehouse) not in [(item.item_code, item.warehouse) for item in items]:
			remove_row.append(row)

	for d in remove_row:
		si.remove(d)

	return si

def update_qty_batch_in_invoice(si, items):
	for row in si.items:
		for item in items:
			if row.item_code == item.item_code and row.warehouse == item.warehouse:
				row.qty = item.picked_qty
				row.batch_no = item.batch_no

	return si


@frappe.whitelist()
def create_pick_list(source_name, target_doc=None):
	def update_item_quantity(source, target, source_parent):
		target.qty = flt(source.qty) - flt(source.delivered_qty)
		target.stock_qty = (flt(source.qty) - flt(source.delivered_qty)) * flt(source.conversion_factor)

	doc = get_mapped_doc(
		"Sales Order",
		source_name,
		{
			"Sales Order": {
				"doctype": "Pick List",
				"validation": {
					"docstatus": ["=", 1]
				},
				"field_no_map": ["naming_series"],
			},
			"Sales Order Item": {
				"doctype": "Custom Pick List Item",
				"field_map": {"parent": "sales_order", "name": "sales_order_item"},
				"postprocess": update_item_quantity,
				"condition": lambda doc: abs(doc.delivered_qty) < abs(doc.qty)
				and doc.delivered_by_supplier != 1,
			},
		},
		target_doc,
	)

	doc.purpose = "Delivery"

	doc.set_item_locations()

	return doc
