
import frappe
from frappe import _, msgprint
from frappe.utils import today
from erpnext.manufacturing.doctype.production_plan.production_plan import ProductionPlan

class CustomProductionPlan(ProductionPlan):
	@frappe.whitelist()
	def set_boughtout_raw_materials(self):
		self.set("boughtout_items", [])
		for item in self.get("mr_items"):
			item_details = frappe.get_cached_value("Item", item.item_code, ["default_bom", "is_sub_contracted_item"], as_dict=1)
			if item_details.is_sub_contracted_item and item_details.default_bom:
				bom_qty = frappe.get_cached_value("BOM", item_details.default_bom, "quantity")
				exploded_items = frappe.get_all("BOM Explosion Item",
					filters={"parent": item_details.default_bom},
					fields=["*"]
				)

				for bom_item in exploded_items:
					self.append("boughtout_items", {
						"item_code": bom_item.item_code,
						"item_name": bom_item.item_name,
						"warehouse": self.for_warehouse,
						"qty": bom_item.stock_qty * item.quantity / bom_qty,
						"uom": bom_item.stock_uom,
						"stock_uom": bom_item.stock_uom,
						"conversion_factor": bom_item.conversion_factor,
						"production_plan": self.name
					})

		self.save()

	@frappe.whitelist()
	def make_raw_materials_for_boughtout_items(self):
		for item in self.get("boughtout_items"):
			if item.qty > 0:
				material_request = frappe.new_doc("Material Request")
				material_request.company = self.company

				# add item
				material_request.append(
					"items",
					{
						"item_code": item.item_code,
						"item_name": item.item_name,
						"uom": item.uom,
						"stock_uom": item.stock_uom,
						"qty": item.qty,
						"schedule_date": today(),
						"warehouse": item.warehouse,
						"production_plan": self.name,
						"boughtout_raw_material": item.name
					},
				)


				material_request.flags.ignore_permissions = 1
				material_request.run_method("set_missing_values")


				material_request.submit()

				msgprint(_(f"{material_request.name} created"))
