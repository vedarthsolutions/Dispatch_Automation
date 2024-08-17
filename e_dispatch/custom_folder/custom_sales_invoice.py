import frappe, json
from frappe import _

def on_validate_event(doc, method=None):
	if doc.set_warehouse and not doc.business_unit:
		doc.business_unit = frappe.db.get_value("Warehouse", doc.set_warehouse, "business_unit")

def on_submit_event(doc, method=None):
	if doc.pick_list and not doc.is_return:
		update_qr_code_picking_status(doc, status="Delivered")
	if doc.is_return:
		if doc.strict_scan:
			validate_scanned_labels(doc)
		update_qr_code_warehouse(doc)


def validate_scanned_labels(doc):

	if not doc.return_against:
		return

	for row in doc.items:
		if not row.batch_no and not row.serial_and_batch_bundle:
			continue

		pick_list = frappe.db.get_value("Sales Invoice", doc.return_against, "pick_list")

		original_scanned_qr_labels = frappe.get_all("Pick List QRCode", filters = {"parent": pick_list}, pluck="qr_code")
		if not row.scanned_qr_labels and original_scanned_qr_labels:
			frappe.throw(_("At row {0}: Qr Code not scanned for the item {1}").format(row.idx, row.item_code))

		if original_scanned_qr_labels:
			scanned_qr_labels = list(json.loads(row.scanned_qr_labels))
			for qr_label in scanned_qr_labels:
				if qr_label not in original_scanned_qr_labels:
					frappe.throw(f"Incorrect qr code {qr_label} has scanned")

def update_qr_code_warehouse(doc):
	for row in doc.items:
		if not row.scanned_qr_labels:
			continue

		scanned_qr_labels = json.loads(row.scanned_qr_labels)
		if doc.docstatus == 1:
			for qr_code in scanned_qr_labels:
				qr_table = frappe.qb.DocType("Work Order Qrcode")
				(
					frappe.qb.update(qr_table).set(qr_table.warehouse, row.warehouse).where(qr_table.qr_code_id == qr_code)
				).run()
		else:
			for qr_code in scanned_qr_labels:
                                qr_table = frappe.qb.DocType("Work Order Qrcode")
                                (
                                        frappe.qb.update(qr_table).set(qr_table.warehouse, "").where(qr_table.qr_code_id == qr_code)
                                ).run()

def on_cancel_event(doc, method=None):
	if doc.pick_list:
                update_qr_code_picking_status(doc)

def update_qr_code_picking_status(doc, status=None):
	if not doc.update_stock:
		return

	batchwise_warehouse = {}
	warehouse = ""
	has_picked = 0
	if doc.docstatus == 2:
		has_picked = 1
		warehouse = frappe.db.get_value("Pick List", doc.pick_list, "warehouse")
	qr_codes = frappe.get_all("Pick List QRCode", filters={"parent": doc.pick_list, "docstatus": 1}, fields=["qr_code", "batch"])
	for row in qr_codes:
		qr_table = frappe.qb.DocType("Work Order Qrcode")
		(
			frappe.qb.update(qr_table)
			.set(qr_table.warehouse, warehouse)
			.where(qr_table.qr_code_id == row.qr_code)
		).run()
