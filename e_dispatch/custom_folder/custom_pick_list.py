import frappe
import json
from collections import defaultdict
from erpnext.selling.doctype.sales_order.sales_order import make_sales_invoice
from frappe.utils import flt, nowdate

@frappe.whitelist()
def scan_qrcode(locations, warehouse, company, scan_qrcode, name):
	if isinstance(locations, str):
		locations = json.loads(locations)

	if isinstance(scan_qrcode, str):
		scan_qrcode = json.loads(scan_qrcode)

	if not locations:
		frappe.throw("Please add Item Locations")


	item_locations = [location.get("item_code") for location in locations ]

	if scan_qrcode.get("item_no") not in item_locations:
		frappe.throw(f"Item {scan_qrcode.get('item_no')} not in Item Locations")

	if frappe.get_all("Pick List QRCode", filters = {"qr_code": scan_qrcode.get("box_no"), "parent": ["!=", name]}):
		frappe.throw(f"QR Code {scan_qrcode.get('box_no')} already scanned")

	data = get_available_batches(scan_qrcode.get("item_no"), warehouse, company, scan_qrcode.get("batch_no"))
	scan_qrcode["batch_qty"] = data[0][8] if data else 0
	if not flt(scan_qrcode["batch_qty"]):
		frappe.throw(f"Batch {frappe.bold(scan_qrcode.get('batch_no'))} has no available qty in the warehouse {frappe.bold(warehouse)}")

	if not frappe.db.exists("File", {"file_name": scan_qrcode.get("box_no")}):
		frappe.throw(f"QR Code {scan_qrcode.get('box_no')} not found")

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
	validate_warehouse(doc)
	validate_picked_qty(doc)

def validate_warehouse(doc):
	for row in doc.locations:
		if row.warehouse != doc.warehouse:
			frappe.throw(f"Row {row.idx}: Warehouse should be same as Pick From Warehouse {doc.warehouse}")

def validate_picked_qty(doc):
	item_warehouse_wise_batch_qty = defaultdict(float)
	for item in doc.custom_items:
		item_warehouse_wise_batch_qty[(item.item_code, item.warehouse)] += item.no_of_quantity

	if not item_warehouse_wise_batch_qty:
		return

	for row in doc.locations:
		if (row.item_code, row.warehouse) in item_warehouse_wise_batch_qty:
			if abs(flt(row.picked_qty) - flt(item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)])) > 0.1:
				frappe.throw(f"Row {row.idx}: Picked Qty {row.picked_qty} does not match with Scanned Item Qty {item_warehouse_wise_batch_qty[(row.item_code, row.warehouse)]}")


def on_submit_event(doc, method=None):
	create_sales_invoice(doc)

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
		si.save()
		si.submit()

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
