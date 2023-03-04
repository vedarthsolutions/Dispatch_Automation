import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
	frappe.reload_doc("e_dispatch", "doctype", "boughtout_raw_materials")
	frappe.reload_doc("manufacturing", "doctype", "production_plan")

	create_custom_field("Production Plan",
		dict(fieldname="boughtout_raw_materials_section", fieldtype="Section Break",
			label="Boughtout Raw Materials", insert_after="mr_items")
	)

	create_custom_field("Production Plan",
		dict(fieldname="get_boughtout_raw_materials", fieldtype="Button",
			label="Get Boughtout Raw Materials", insert_after="boughtout_raw_materials_section")
	)

	create_custom_field("Production Plan",
		dict(fieldname="boughtout_items", fieldtype="Table",
			label="Boughtout Raw Materials", options="Boughtout Raw Materials", insert_after="get_raw_materials")
	)

	create_custom_field("Material Request Item",
		dict(fieldname="boughtout_raw_material", fieldtype="Data",
			label="Boughtout Raw Materials", insert_after="production_plan", read_only=1, no_copy=1)
	)