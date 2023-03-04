import frappe
import json
import qrcode
from frappe.utils import cint

@frappe.whitelist()
def make_qr_code(work_order):
	doc = frappe.get_doc("Work Order", work_order)

	if frappe.db.get_value("Item", doc.production_item, "has_batch_no"):
		batch = frappe.get_doc({
			"doctype": "Batch",
			"item": doc.production_item,
			"batch_id": doc.name,
		}).insert(ignore_permissions=True)

		qty_per_box = frappe.db.get_value("Item",
			doc.production_item, "qty_per_box")

		args = {
			"item_no": doc.production_item,
			"batch_no": batch.name,
			"production_warehouse": doc.fg_warehouse,
			"qty": qty_per_box
		}

		no_of_qr_codes = cint(doc.qty / qty_per_box)

		qr_code_created = False
		for i in range(no_of_qr_codes):
			qr_code_id = f"{batch.name} - {i + 1}"
			args.update({
				"box_no": qr_code_id,
			})

			content = json.dumps(args)

			img = qrcode.make(content)
			file_name = frappe.generate_hash("", 12)
			path = frappe.get_site_path("public", "files", file_name + ".png")
			img.save(path)

			frappe.get_doc(
				doctype="File",
				file_url=f"/files/{file_name}.png",
				attached_to_name=doc.name,
				attached_to_doctype=doc.doctype,
				file_name=qr_code_id,
				folder="Home/Attachments",
			).insert(ignore_permissions=True)

			qr_code_created = True

		if qr_code_created:
			doc.db_set("qr_code_created", 1)
			frappe.msgprint(f"QR Code Created for the work order {doc.name}")