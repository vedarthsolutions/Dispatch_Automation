import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_fields

def execute():
	frappe.reload_doc("stock", "doctype", "pick_list")

	custom_fields = {
		"Pick List": [
			dict(fieldname="transportation_details", fieldtype="Tab Break",
				label="Transportation Section", insert_after="custom_items"),
			dict(fieldname="transporter", fieldtype="Link", options="Supplier",
				label="Transporter", insert_after="transportation_details"),
			dict(fieldname="vehicle_no", fieldtype="Data",
				label="Vehicle No", insert_after="transporter"),
			dict(fieldname="lr_no", fieldtype="Data",
				label="Transport Receipt No", insert_after="vehicle_no"),
			dict(fieldname="coll_brk_transportation_details", fieldtype="Column Break", insert_after="lr_no"),
			dict(fieldname="gst_transporter_id", fieldtype="Data", fetch_from="transporter.gst_transporter_id",
				read_only=1, label="GST Transporter ID", insert_after="coll_brk_transportation_details"),
			dict(fieldname="transporter_name", fieldtype="Data", fetch_from="transporter.supplier_name",
				read_only=1, label="Transporter Name", insert_after="gst_transporter_id"),
			dict(fieldname="distance", fieldtype="Float",
				read_only=1, label="Distance (in km)", insert_after="transporter_name"),
		]
	}

	create_custom_fields(custom_fields)
