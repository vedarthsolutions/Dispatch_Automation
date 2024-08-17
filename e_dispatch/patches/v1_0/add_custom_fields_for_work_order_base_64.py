import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field
from frappe.custom.doctype.property_setter.property_setter import make_property_setter

def execute():
	frappe.reload_doc("stock", "doctype", "batch")
	frappe.reload_doc("stock", "doctype", "stock_entry")
	frappe.reload_doc("e_dispatch", "doctype", "work_order_qrcode")
	frappe.reload_doc("accounts", "doctype", "sales_invoice")

	frappe.reload_doc("stock", "doctype", "pick_list")

	create_custom_field("Pick List",
		dict(fieldname="auto_submit_sales_invoice", fieldtype="Check",
			label="Auto Submit Sales Invoice", insert_after="consider_rejected_warehouses")
	)

	create_custom_field("Pick List",
		dict(fieldname="business_unit", fieldtype="Link", options="Business Unit",
			label="Business Unit", insert_after="distance")
	)

	create_custom_field("Sales Invoice",
		dict(fieldname="strict_scan", fieldtype="Check",
			label="Strict Scan", insert_after="due_date", default=1, depends_on="eval:doc.is_return == 1")
	)

	create_custom_field("Batch",
		dict(fieldname="work_order_qr_code_section", fieldtype="Tab Break",
			label="Qr Code Details", insert_after="produced_qty")
	)

	create_custom_field("Batch",
		dict(fieldname="qrcode_details", fieldtype="Table", options="Work Order Qrcode",
			label="Qr Code", insert_after="work_order_qr_code_section")
	)

	create_custom_field("Batch",
                dict(fieldname="is_closed", fieldtype="Check", read_only=1,
                        label="Is Closed", insert_after="expiry_date")
        )

	create_custom_field("Stock Entry",
		dict(fieldname="qrcode_scanner", fieldtype="HTML",
 			label="Scan Qr-code", insert_after="scan_barcode")
	)

	create_custom_field("Stock Entry Detail",
		dict(fieldname="qrcode_discard", fieldtype="Button",
			label="Discard Qr-code", insert_after="batch_no", depends_on="eval:doc.batch_no && parent.purpose == 'Material Issue' ")
	)

	create_custom_field("Stock Entry",
		dict(fieldname="scanned_qr_labels", fieldtype="Small Text", hidden=1,
			label="Scanned Qr-code", insert_after="items")
	)

	create_custom_field("Purchase Receipt",
		dict(fieldname="qrcode_scanner", fieldtype="HTML",
			label="Scan Qr-code", insert_after="scanning_section")
	)

	create_custom_field("Sales Invoice",
		dict(fieldname="qrcode_scanner", fieldtype="HTML",
			label="Scan Qr-code", insert_after="update_stock")
	)

	create_custom_field("Sales Invoice Item",
		dict(fieldname="scanned_qr_labels", fieldtype="Small Text",
			label="Scanned QR Labels", insert_after="qty")
	)

	create_custom_field("Warehouse",
		dict(fieldname="accounting_dimension_section", fieldtype="Section Break",
			label="Accounting Dimension", insert_after="company")
	)

	create_custom_field("Warehouse",
		dict(fieldname="business_unit", fieldtype="Link",
			label="Business Unit", insert_after="accounting_dimension_section", options="Business Unit")
	)


	make_property_setter("Stock Entry", "scan_barcode", "hidden", 1, "Check")

