import frappe
import copy
from frappe.utils import get_link_to_form

@frappe.whitelist()
def get_bom_tree(bom_no, level=0, parent_qty = 0, bom_items=[]):
	if not parent_qty:
		parent_qty = frappe.db.get_value("BOM", bom_no, "quantity")

	if isinstance(bom_items, str):
		bom_items = []

	if isinstance(level, str):
		level = 0

	bom = frappe.get_doc("BOM", bom_no)
	for item in bom.items:
		new_item = copy.copy(item.as_dict())
		new_item["indent"] = level
		new_item["parent_bom"] = get_link_to_form("BOM", bom_no)
		new_item["production_state"] = get_production_state(item)
		new_item["qty"] = item.qty / bom.quantity * parent_qty
		bom_items.append(new_item)
		if item.bom_no:
			bom_items += get_bom_tree(item.bom_no, level+1, new_item["qty"], [])

	return bom_items

@frappe.whitelist()
def get_custom_bom_items(bom_no):
	data = frappe.get_all("Custom BOM Item", {"parent": bom_no}, ["*"], order_by="idx asc")

	return data

def get_production_state(item):
	fields = ["is_sub_contracted_item", "include_item_in_manufacturing",
		"is_purchase_item", "is_stock_item", "default_bom", "production_state"]
	item_details = frappe.get_cached_value("Item",
		item.item_code, fields, as_dict=1)

	if item_details.production_state:
		return item_details.production_state

	if item_details.is_sub_contracted_item and item_details.default_bom:
		return "Purchase"
	elif item_details.default_bom and item_details.is_stock_item:
		return "In House"
	else:
		return "Purchase"

@frappe.whitelist()
def update_production_state(name, value):
	frappe.db.set_value("Custom BOM Item", name, "production_state", value)
	frappe.msgprint("Production State updated", alert=True)

@frappe.whitelist()
def update_default_customer(name, value):
	frappe.db.set_value("Custom BOM Item", name, "default_customer", value)
	frappe.msgprint("Production State updated", alert=True)

@frappe.whitelist()
def update_bom_custom_items(bom_no):
	bom_data = get_bom_tree(bom_no, 0, 0, [])

	doc = frappe.get_doc("BOM", bom_no)
	doc.custom_bom_items = []
	item_customers = itemwise_customers(bom_data)

	for d in bom_data:
		customers = item_customers.get(d.item_code, []) or []
		doc.append("custom_bom_items", {
			"item_code": d.item_code,
			"qty": d.qty,
			"bom": d.parent_bom,
			"production_state": d.production_state or frappe.get_cached_value("Item",
				d.item_code, "production_state") or "Ignore",
			"indent": d.indent,
			"bom_no": d.bom_no
		})

	doc.save()

def itemwise_customers(bom_data):
	items = [d.item_code for d in bom_data]
	data = frappe.get_all("Custom Customer Item",
		filters={"parent": ("in", items)},
		fields=["parent", "customer"]
	)

	itemwise_customers = {}
	for d in data:
		itemwise_customers.setdefault(d.parent, []).append(d.customer)

	return itemwise_customers