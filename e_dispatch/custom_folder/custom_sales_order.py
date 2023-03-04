import frappe
from frappe.utils import flt
from collections import defaultdict


def on_update_event(doc, method=None):
	pass

def on_submit_event(doc, method=None):
	update_production_plan_qty(doc)

def on_cancel_event(doc, method=None):
	update_production_plan_qty(doc)

def on_trash_event(doc, method=None):
	pass

def update_production_plan_qty(doc):
	if not doc.production_plan:
		return

	mr_items = [row.production_plan_mr_item for row in doc.items if row.production_plan_mr_item]

	if mr_items:
		pp_items = frappe.get_all("Sales Order Item",
			fields = ["production_plan_mr_item", "qty"],
			filters = {
				"production_plan_mr_item": ("in", mr_items),
				"docstatus": 1
			}
		)

		pp_item_map = defaultdict(float)
		for d in pp_items:
			pp_item_map[d.production_plan_mr_item] += d.qty

		for production_plan_mr_item in mr_items:
			frappe.db.set_value("Material Request Plan Item",
				production_plan_mr_item, "sales_order_qty", flt(pp_item_map.get(production_plan_mr_item, 0.0)))


	mr_items = [row.production_plan_sub_assembly_item for row in doc.items if row.production_plan_sub_assembly_item]

	if not mr_items:
		return

	pp_items = frappe.get_all("Sales Order Item",
		fields = ["production_plan_sub_assembly_item", "qty"],
		filters = {
			"production_plan_sub_assembly_item": ("in", mr_items),
			"docstatus": 1
		}
	)

	pp_item_map = defaultdict(float)
	for d in pp_items:
		pp_item_map[d.production_plan_sub_assembly_item] += d.qty

	for production_plan_sub_assembly_item in mr_items:
		frappe.db.set_value("Production Plan Sub Assembly Item",
			production_plan_sub_assembly_item, "sales_order_qty", flt(pp_item_map.get(production_plan_sub_assembly_item, 0.0)))