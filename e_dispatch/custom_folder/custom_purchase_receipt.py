import frappe, json


def on_submit_event(doc, method=None):
	update_warehouse_in_scanned_box(doc)

def on_cancel_event(doc, method=None):
	update_warehouse_in_scanned_box(True)

def update_warehouse_in_scanned_box(doc, is_canceled=False):

	batchwise_picked_boxes = []
	for row in doc.items:
		warehouse = row.warehouse
		has_picked = 0
		if is_canceled:
			has_picked = 1
			warehouse = None

		qr_codes = row.received_qr_labels
		if isinstance(qr_codes, str):
			qr_codes = json.loads(data)
			qr_codes = list(qr_codes.keys())

		qr_table = frappe.qb.DocType("Work Order Qrcode")
			(
				frappe.qb.update(qr_table).set(qr_table.warehouse, warehouse).set(qr_table.has_picked, has_picked).where(qr_table.qr_code_id.isin(qr_codes))
			).run()
