import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
	frappe.reload_doc("manufacturing", "doctype", "bom")
	frappe.reload_doc("manufacturing", "doctype", "bom_item")
	frappe.reload_doc("e_dispatch", "doctype", "custom_bom_item")
	frappe.reload_doc("selling", "doctype", "sales_order_item")
	frappe.reload_doc("selling", "doctype", "sales_order")
	frappe.reload_doc("e_dispatch", "doctype", "custom_customer_item")

	create_custom_field("Production Plan Sub Assembly Item",
		dict(fieldname="production_state", fieldtype="Select",
			options="\nIgnore\nIn House\nSubcontract\nPurchase\nPurchase and Resale\nSubcontract and Resale\nIn House and Resale",
			label="Production State", insert_after="bom_no", no_copy=1, in_list_view=1)
	)

	create_custom_field("Production Plan Sub Assembly Item",
		dict(fieldname="default_customer", fieldtype="Link",
			options="Customer", label="Default Customer",
			insert_after="production_state", no_copy=1)
	)

	create_custom_field("Sales Order Item",
		dict(fieldname="production_plan_sub_assembly_item", fieldtype="Data",
			label="Production Plan Sub-assembly Item", insert_after="production_plan_mr_item",
			no_copy=1, in_list_view=1, read_only=1
		)
	)

	create_custom_field("Production Plan Sub Assembly Item",
		dict(fieldname="sales_order_qty", fieldtype="Float",
			label="SO Qty", insert_after="default_customer", read_only=1, no_copy=1, in_list_view=1)
	)