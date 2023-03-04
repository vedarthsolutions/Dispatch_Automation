import frappe
import json
from frappe import _
from frappe.model.mapper import get_mapped_doc
from collections import defaultdict
from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice
from frappe.utils import flt, nowdate, get_link_to_form

from erpnext.stock.doctype.pick_list.pick_list import (PickList,
	get_available_item_locations, get_items_with_location_and_quantity)

class CustomPickList(PickList):
	def before_save(self):
		pass

	@frappe.whitelist()
	def custom_scan_qrcode(self, scanned_qrcode):
		if isinstance(scanned_qrcode, str):
			scan_qrcode = json.loads(scanned_qrcode)
		else:
			scan_qrcode = scanned_qrcode

		picked_scanned_qr_code = frappe.get_all("Pick List QRCode",
			fields = ["parent"],
			filters = {
				"qr_code": scan_qrcode.get("box_no"), "parent": ["!=", self.name], "docstatus": ("!=", 2)
			}
		)

		if picked_scanned_qr_code and picked_scanned_qr_code[0].parent:
			frappe.throw(f"QR Code {scan_qrcode.get('box_no')} has already scanned in the pick list {picked_scanned_qr_code[0].parent}", title="Error Message 1")

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

		if not custom_picklist_row:
			self.append("custom_items", {
				"item_code": scan_qrcode.get("item_no"),
				"batch": scan_qrcode.get("batch_no"),
				"qr_code": scan_qrcode.get("box_no"),
				"no_of_quantity": scan_qrcode.get("qty"),
				"warehouse": self.warehouse,
				"qty": picklist_row.qty,
				"stock_qty": picklist_row.stock_qty,
				"sales_order": picklist_row.sales_order,
				"sales_order_item": picklist_row.sales_order_item
			})
		else:
			custom_picklist_row.no_of_quantity = scan_qrcode.get("qty")
			custom_picklist_row.batch = scan_qrcode.get("batch_no")
			custom_picklist_row.warehouse = self.warehouse

			box_no = scan_qrcode.get("box_no")
			frappe.msgprint(_(f"The QR Code {box_no} is already scanned"));

		item_locations = {}
		for n_row in self.custom_items:
			key = (n_row.item_code, n_row.warehouse, n_row.batch, n_row.sales_order, n_row.sales_order_item)
			if key not in item_locations:
				item_locations[key] = [n_row.no_of_quantity, n_row.qty, n_row.stock_qty]
			else:
				item_locations[key][0] += n_row.no_of_quantity

		self.locations = []
		for key, values in item_locations.items():
			self.append("locations", {
				"item_code": key[0],
				"warehouse": key[1],
				"batch_no": key[2],
				"qty": values[1],
				"stock_qty": values[2],
				"sales_order": key[3],
				"sales_order_item": key[4],
				"picked_qty": values[0]
			})

		self.save(ignore_permissions=True)

		return {
			"locations": self.locations,
			"custom_items": self.custom_items
		}

	@frappe.whitelist()
	def set_item_locations(self, save=False):
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

def validate_picked_qty(doc):
	item_warehouse_wise_batch_qty = defaultdict(float)
	for item in doc.custom_items:
		item_warehouse_wise_batch_qty[(item.item_code, item.warehouse)] += item.no_of_quantity

	if not item_warehouse_wise_batch_qty:
		return

	for row in doc.picklist_items:
		if (row.item_code, row.warehouse) in item_warehouse_wise_batch_qty:
			picked_qty = flt(item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)])
			if picked_qty > row.qty:
				frappe.throw(f"Extra qty picked for the item {row.item_code}")


def on_submit_event(doc, method=None):
	validate_scanned_item(doc)
	create_sales_invoice(doc)

def validate_scanned_item(doc):
	if doc.purpose != "Delivery":
		return

	if not doc.custom_items:
		frappe.throw("Please scan the QR Code")

	items = [d.item_code for d in doc.custom_items]

	for row in doc.locations:
		if row.item_code not in items:
			frappe.throw(f"Item {row.item_no} not scanned")

def create_sales_invoice(doc):
	sales_order_items = {}

	item_warehouse_batch = {}
	for item in doc.custom_items:
		item_warehouse_batch[(item.item_code, item.warehouse)] = item.batch

	for row in doc.locations:
		row.batch_no = item_warehouse_batch.get((row.item_code, row.warehouse))
		sales_order_items.setdefault(row.sales_order, []).append(row)

	for sales_order, items in sales_order_items.items():
		si = make_sales_invoice(sales_order)

		si.items = []
		for row in items:
			si.append("items", {
				"item_code": row.item_code,
				"item_name": row.item_name,
				"description": row.description,
				"qty": row.picked_qty,
				"uom": row.stock_uom,
				"stock_uom": row.stock_uom,
				"conversion_factor": 1.0,
				"rate": frappe.db.get_value("Sales Order Item", row.sales_order_item, "rate"),
				"amount": row.picked_qty * frappe.db.get_value("Sales Order Item", row.sales_order_item, "rate"),
				"warehouse": row.warehouse,
				"batch_no": row.batch_no,
				"sales_order": row.sales_order,
				"so_detail": row.sales_order_item,
				"income_account": frappe.db.get_value("Company", doc.company, "default_income_account")
			})

		si.flags.ignore_permissions = True
		si.update_stock = 1
		si.company = doc.company
		si.pick_list = doc.name
		si.flags.ignore_mandatory = True
		si.flags.ignore_validate = True
		si.save()

		name = get_link_to_form("Sales Invoice", si.name)
		frappe.msgprint(f"Sales Invoice {name} created")

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