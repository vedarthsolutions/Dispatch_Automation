import frappe, json
import qrcode
from frappe.utils import cint, cstr, flt
import base64, io

def before_save_event(doc, method):
	set_batch_for_fg_item(doc)

def set_batch_for_fg_item(doc):
	if doc.purpose == "Manufacture":
		batch_no = ""
		if frappe.db.exists("Batch", doc.work_order):
			batch_no = doc.work_order

		if not batch_no:
			return

		for item in doc.items:
			if not item.s_warehouse and item.t_warehouse and item.is_finished_item:
				item.batch_no = batch_no
				item.use_serial_batch_fields = 1
			if not item.scanned_qr_labels and doc.scanned_qr_labels:
				item.scanned_qr_labels = doc.scanned_qr_labels


def on_submit_event(doc, method=None):
	if doc.purpose == "Manufacture":
		update_warehouse_in_batch(doc)
	if doc.purpose == "Material Issue":
                discard_boxes_in_batch(doc)


def on_submit_event_sabb(doc, method=None):
	if doc.voucher_type == "Stock Entry" and frappe.db.get_value("Stock Entry", doc.voucher_no, "purpose") == "Material Receipt":
		add_qr_codes_for_batch(doc)

def add_qr_codes_for_batch(doc):
	for row in doc.entries:
		if not row.batch_no:
			continue

		qty_per_box = frappe.db.get_value("Item",
			doc.item_code, "qty_per_box")

		args = {
			"item_no": doc.item_code,
			"batch_no": row.batch_no,
			"production_warehouse": doc.warehouse,
			"qty": row.qty
		}

		batch = frappe.get_doc("Batch", row.batch_no)

		last_row = frappe.get_all("Work Order Qrcode", fields = ["qr_code_id"], filters={"parent": row.batch_no}, order_by="idx desc", limit=1)
		count = 0
		if last_row:
			count = cint(last_row[0].qr_code_id.split("-")[-1])

		no_of_qr_codes = cint(row.qty / qty_per_box) + count
		qr_code_created = False
		for i in range(count, no_of_qr_codes):
			qr_code_id = f"{batch.name} - {i + 1}"
			args.update({
				"box_no": qr_code_id,
			})

			content = json.dumps(args)

			qr = qrcode.QRCode(
				version=1,
				error_correction=qrcode.constants.ERROR_CORRECT_L,
				box_size=3,
				border=4,
			)
			qr.add_data(content)
			qr.make(fit=True)

			img = qr.make_image(fill_color="black", back_color="white")
			buffer = io.BytesIO()
			img.save(buffer)
			myimage = buffer.getvalue()

			img_data = cstr(base64.b64encode(myimage))
			img_data = "data:image/jpeg;base64," + img_data

			batch.append("qrcode_details", {
				"qr_code_id": qr_code_id,
				"content": img_data,
				"warehouse": doc.warehouse,
				"stock_entry_receipt": doc.voucher_no
			})

		batch.save()

def discard_boxes_in_batch(doc, discard_box=1):
	for row in doc.items:
		if not row.scanned_qr_labels and row.batch_no:
			frappe.throw("Scan Boxes that has to be discarded")

		scanned_qr_labels = row.scanned_qr_labels
		if scanned_qr_labels and isinstance(scanned_qr_labels, str):
			scanned_qr_labels = json.loads(scanned_qr_labels)
			scanned_qr_labels = list(scanned_qr_labels.keys())

		if not scanned_qr_labels:
			continue

		batch_table = frappe.qb.DocType("Work Order Qrcode")
		(
			frappe.qb.update(batch_table)
			.set(batch_table.is_discarded, discard_box)
			.where(batch_table.qr_code_id.isin(scanned_qr_labels))
		).run()

def remove_auto_created_qr_codes(doc):
	frappe.db.sql("Delete from `tabWork Order Qrcode` where stock_entry_receipt = %s", doc.name)

def on_cancel_event(doc, method=None):
	if doc.purpose == "Material Issue":
		discard_boxes_in_batch(doc, 0)

	if doc.purpose == "Material Receipt":
		remove_auto_created_qr_codes(doc)

	if doc.purpose == "Manufacture":
		update_warehouse_in_batch(doc)

		if doc.scanned_qr_labels:
			doc.db_set("scanned_qr_labels", "")

def update_warehouse_in_batch(doc):
	for row in doc.items:
		if not row.batch_no or not row.t_warehouse:
			continue

		warehouse = row.t_warehouse
		if doc.docstatus == 2:
			warehouse = ""

		scanned_qr_labels = row.scanned_qr_labels
		if scanned_qr_labels and isinstance(scanned_qr_labels, str):
			scanned_qr_labels = json.loads(scanned_qr_labels)
			scanned_qr_labels = list(scanned_qr_labels.keys())

		if scanned_qr_labels:
			has_warehouse_qr_codes = frappe.get_all("Work Order Qrcode", fields = ["qr_code_id"], filters = {"warehouse": ("is", "set"), "parent": row.batch_no, "qr_code_id": ("in", scanned_qr_labels)})
			if has_warehouse_qr_codes:
				frappe.throw(f"Qr Codes: already received qr codes {','.join(d.qr_code_id for d in has_warehouse_qr_codes)}")

		batch_table = frappe.qb.DocType("Work Order Qrcode")

		(
			frappe.qb.update(batch_table)
			.set(batch_table.warehouse, warehouse)
			.where(batch_table.parent == row.batch_no)
			.where(batch_table.qr_code_id.isin(scanned_qr_labels))
		).run()
