import frappe
import json
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
	if isinstance(scan_qrcode, str):
		scan_qrcode = json.loads(scan_qrcode)

	picked_scanned_qr_code = frappe.get_all("Pick List QRCode",
		fields = ["parent"],
		filters = {
			"qr_code": scan_qrcode.get("box_no"), "parent": ["!=", name], "docstatus": ("!=", 2)
		}
	)

	if picked_scanned_qr_code and picked_scanned_qr_code[0].parent:
		frappe.throw(f"QR Code {scan_qrcode.get('box_no')} has already scanned in the pick list {picked_scanned_qr_code[0].parent}", title="Error Message 1")

	data = get_available_batches(scan_qrcode.get("item_no"), warehouse, company, scan_qrcode.get("batch_no"))
	scan_qrcode["batch_qty"] = data[0][8] if data else 0
	if not flt(scan_qrcode["batch_qty"]):
		frappe.throw(f"Batch {frappe.bold(scan_qrcode.get('batch_no'))} has no available qty in the warehouse {frappe.bold(warehouse)}")

	scan_qrcode["warehouse"] = warehouse

	return scan_qrcode


def get_available_batches(item_code, warehouse, company, batch):
	from erpnext.stock.report.batch_wise_balance_history.batch_wise_balance_history import execute

	print(item_code, warehouse, company, batch)
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
	if doc.is_new():
		doc.locations = []

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

	# for row in doc.locations:
	# 	if (row.item_code, row.warehouse) in item_warehouse_wise_batch_qty:
	# 		if abs(flt(row.picked_qty) - flt(item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)])) > 0.1:
	# 			frappe.throw(f"Row {row.idx}: Picked Qty {row.picked_qty} does not match with Scanned Item Qty {item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)]}")


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

		si = remove_non_picked_items(si, items)
		si = update_qty_batch_in_invoice(si, items)
		si.flags.ignore_permissions = True
		si.update_stock = 1
		si.company = doc.company
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