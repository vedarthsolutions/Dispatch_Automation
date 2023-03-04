import frappe
from collections import defaultdict

def on_submit_event(doc, method):
	update_boughtout_raw_materials(doc)

def update_boughtout_raw_materials(doc):
	boughtout_raw_materials = [row.boughtout_raw_material for row in doc.items if row.boughtout_raw_material]

	boughtout_raw_material_dict = defaultdict(float)
	if boughtout_raw_materials:
		data = frappe.get_all("Material Request Item",
			fields=["boughtout_raw_material", "qty"],
			filters={"boughtout_raw_material": ("in", boughtout_raw_materials), "docstatus": ("<", 2)})

		for row in data:
			boughtout_raw_material_dict[row.boughtout_raw_material] += row.qty

	for row in doc.items:
		if row.boughtout_raw_material and boughtout_raw_material_dict.get(row.boughtout_raw_material):
			frappe.db.set_value("Boughtout Raw Materials", row.boughtout_raw_material,
				"requested_qty", boughtout_raw_material_dict.get(row.boughtout_raw_material))