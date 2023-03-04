frappe.ui.form.on("Production Plan", {
	get_boughtout_raw_materials(frm) {
		frm.call({
			method: "set_boughtout_raw_materials",
			freeze: true,
			doc: frm.doc,
			callback: function(r) {
				frm.reload_doc();
			}
		})
	},

	get_items_for_material_requests(frm, warehouses) {
		let set_fields = ['actual_qty', 'item_code','item_name', 'description', 'uom', 'from_warehouse',
			'min_order_qty', 'required_bom_qty', 'quantity', 'sales_order', 'warehouse', 'projected_qty', 'ordered_qty',
			'reserved_qty_for_production', 'material_request_type', 'production_state'];

		frappe.call({
			method: "erpnext.manufacturing.doctype.production_plan.production_plan.get_items_for_material_requests",
			freeze: true,
			args: {
				doc: frm.doc,
				warehouses: warehouses || []
			},
			callback: function(r) {
				if(r.message) {
					frm.set_value('mr_items', []);
					r.message.forEach(row => {
						let d = frm.add_child('mr_items');
						set_fields.forEach(field => {
							if (row[field]) {
								d[field] = row[field];
							}
						});
					});
				}
				refresh_field('mr_items');
			}
		});
	},

	refresh(frm) {
		frm.toggle_display("boughtout_raw_materials_section", false);

		if (frm.doc.docstatus == 1 && frm.doc.mr_items && frm.doc.mr_items.length > 0) {
			let items = frm.doc.mr_items.filter(
				item => (item.quantity > flt(item.sales_order_qty) && item.production_state == "Purchase and Resale")
			);

			if (items && items.length > 0) {
				frm.trigger("make_sales_order");
			}
		}

	},

	make_sales_order(frm) {
		frm.add_custom_button(__('Make Sales Order'), function() {
			frm.call({
				method: "make_sales_order",
				freeze: true,
				doc: frm.doc,
				callback: function(r) {
					frm.reload_doc();
				}
			})
		}, __("Create"));
	},

	make_material_request_button(frm) {
		let items = frm.doc.boughtout_items.filter(item => item.qty > flt(item.requested_qty));

		if (items && items.length > 0) {
			frm.add_custom_button(__('Request for Raw Materials'), function() {
				frm.call({
					method: "make_raw_materials_for_boughtout_items",
					freeze: true,
					doc: frm.doc,
					callback: function(r) {
						frm.reload_doc();
					}
				})
			}, __("Create"));
		}
	}
})