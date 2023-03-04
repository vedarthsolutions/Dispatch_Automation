import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
	frappe.reload_doc("stock", "doctype", "item")
	frappe.reload_doc("stock", "doctype", "pick_list")
	frappe.reload_doc("manufacturing", "doctype", "work_order")

	create_custom_field("Work Order",
		dict(fieldname="qr_code_created", fieldtype="Check",
			label="QR Code Created", insert_after="bom_no", read_only=1, no_copy=1)
	)

	create_custom_field("Item",
		dict(fieldname="qty_per_box", label="Qty Per BOX",
			fieldtype="Int", insert_after="item_name", no_copy=1))

	create_custom_field("Pick List",
		dict(fieldname="warehouse", label="Pick from Warehouse",
			fieldtype="Link", options="Warehouse", insert_after="get_item_locations", no_copy=1))

	create_custom_field("Pick List",
		dict(fieldname="qrcode_scanner", label="Qrcode Scanner",
			fieldtype="HTML", insert_after="warehouse", no_copy=1))

	create_custom_field("Pick List",
		dict(fieldname="custom_section_break", label="Items",
			fieldtype="Section Break", insert_after="scan_qrcode_button"))

	create_custom_field("Pick List",
		dict(fieldname="picklist_items", label="Items",
			fieldtype="Table", options="Custom Pick List Item", insert_after="custom_section_break", no_copy=1))

	create_custom_field("Pick List",
		dict(fieldname="custom_items", label="Items",
			fieldtype="Table", options="Pick List QRCode", insert_after="locations"))