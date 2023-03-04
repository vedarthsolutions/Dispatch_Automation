import frappe
from frappe.custom.doctype.custom_field.custom_field import create_custom_field

def execute():
	frappe.reload_doc("manufacturing", "doctype", "bom")
	frappe.reload_doc("manufacturing", "doctype", "bom_item")
	frappe.reload_doc("e_dispatch", "doctype", "custom_bom_item")
	frappe.reload_doc("selling", "doctype", "sales_order_item")
	frappe.reload_doc("selling", "doctype", "sales_order")

	create_custom_field("BOM",
		dict(fieldname="bom_browse_section", fieldtype="Section Break",
			label="BOM Browse Section", insert_after="scrap_items")
	)

	create_custom_field("BOM",
		dict(fieldname="prepare_bom_tree", fieldtype="Button",
			label="Get BOM Tree", insert_after="bom_browse_section", depends_on="eval:!doc.__islocal")
	)

	create_custom_field("BOM",
		dict(fieldname="bom_browse_html", fieldtype="HTML",
			label="BOM Browse", insert_after="prepare_bom_tree")
	)

	create_custom_field("Item",
		dict(fieldname="production_state", fieldtype="Select",
			options="\nIgnore\nIn House\nSubcontract\nPurchase\nPurchase and Resale",
			label="Production State", insert_after="stock_uom", no_copy=1)
	)

	create_custom_field("Item",
		dict(fieldname="default_customer_for_rs", fieldtype="Link",
			options="Customer",
			label="Default Customer for Resale", insert_after="production_state", no_copy=1)
	)

	create_custom_field("Production Plan Sub Assembly Item",
		dict(fieldname="production_state", fieldtype="Select",
			options="\nIgnore\nIn House\nSubcontract\nPurchase\nPurchase and Resale",
			label="Production State", insert_after="bom_no", no_copy=1, in_list_view=1)
	)

	create_custom_field("Material Request Plan Item",
		dict(fieldname="production_state", fieldtype="Select",
			options="\nIgnore\nPurchase\nPurchase and Resale",
			label="Production State", insert_after="item_name", no_copy=1, in_list_view=1)
	)

	create_custom_field("Material Request Plan Item",
		dict(fieldname="sales_order_qty", fieldtype="Float",
			label="SO Qty", insert_after="production_state", read_only=1, no_copy=1, in_list_view=1)
	)

	create_custom_field("BOM",
		dict(fieldname="custom_bom_items", fieldtype="Table",
			options="Custom BOM Item",
			label="Custom BOM Item", insert_after="uom", no_copy=1)
	)

	create_custom_field("Sales Order",
		dict(fieldname="production_plan", fieldtype="Link",
			options="Production Plan",
			label="Production Plan", insert_after="customer_name",
			no_copy=1, in_list_view=1, read_only=1
		)
	)

	create_custom_field("Sales Order Item",
		dict(fieldname="production_plan_mr_item", fieldtype="Data",
			label="Production Plan MR Item", insert_after="purchase_order_item",
			no_copy=1, in_list_view=1, read_only=1
		)
	)