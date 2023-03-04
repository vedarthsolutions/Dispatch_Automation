import frappe

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
			if not item.s_warehouse and item.t_warehouse:
				item.batch_no = batch_no