import frappe
import json
import qrcode
from frappe.utils import cint, cstr
import base64, io

@frappe.whitelist()
def make_qr_code(work_order):
	frappe.enqueue(
		method=_make_qr_code,
		queue="long",
		work_order=work_order,
		timeout=4000,
	)

	frappe.msgprint("The qr-code creation is running in the background and it will take 5-10 mins to generate qr-codes")


def _make_qr_code(work_order):
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
				"content": img_data
			})

			'''


			# img = qrcode.make(content)
			file_name = frappe.generate_hash("", 12)
			path = frappe.get_site_path("public", "files", file_name + ".png")
			img.save(path)

			file_doc = frappe.get_doc(
				doctype="File",
				file_url=f"/files/{file_name}.png",
				attached_to_name=doc.name,
				attached_to_doctype=doc.doctype,
				file_name=qr_code_id,
				folder="Home/Attachments",
			).insert(ignore_permissions=True)

			frappe.db.set_value("File", file_doc.name, "file_name", qr_code_id)
			'''
			qr_code_created = True

		batch.save()

		if qr_code_created:
			doc.db_set("qr_code_created", 1)
			frappe.msgprint(f"QR Code Created for the work order {doc.name}")
