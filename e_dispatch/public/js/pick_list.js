frappe.ui.form.on("Pick List", {
	refresh(frm) {
		frm.set_df_property("scan_qrcode", "hidden", frm.is_new() == 1);
	},

	scan_qrcode(frm) {
		if (frm.doc.scan_qrcode) {
			frappe.call({
				method: "e_dispatch.custom_folder.custom_pick_list.scan_qrcode",
				freeze: true,
				args: {
					"locations": frm.doc.locations || [],
					"warehouse": frm.doc.warehouse,
					"company": frm.doc.company,
					"scan_qrcode": frm.doc.scan_qrcode,
					"name": frm.doc.name
				},
				callback: function(r) {
					if (r.message) {
						let l_row = frm.doc.locations.filter(d => {
							return d.item_code == r.message.item_no && d.batch_no == r.message.batch_no
						}) || [];

						if (!l_row.length) {
							frappe.throw(__("The batch {0} for item {1} has not picked", [r.message.batch_no, r.message.item_no]));
						}

						let row = frm.doc.custom_items.filter(d => {
							return d.item_code == r.message.item_no && d.batch == r.message.batch_no && d.qr_code == r.message.box_no
						}) || [];

						if (!row.length) {
							frm.add_child("custom_items", {
								"item_code": r.message.item_no,
								"warehouse": r.message.warehouse,
								"qr_code": r.message.box_no,
								"no_of_quantity": r.message.batch_qty ? r.message.qty : 0,
								"batch": r.message.batch_no
							});
						} else {
							frappe.model.set_value(row[0].doctype, row[0].name,
								{
									"no_of_quantity": r.message.batch_qty ? r.message.qty : 0,
									"batch": r.message.batch_no,
									"warehouse": r.message.warehouse
								}
							);

							frappe.msgprint(__("The QR Code {0} is already scanned", [r.message.box_no]));
						}

						refresh_field("custom_items");
						frm.events.set_picked_qty(frm);
						frm.set_value("scan_qrcode", "");
					}
				}
			})
		}
	},

	set_picked_qty(frm) {
		if (frm.doc.custom_items && frm.doc.custom_items.length > 0) {
			let item_locations = {}
			let item_batch = {}
			frm.doc.custom_items.forEach(row => {
				let key = [row.item_code, row.warehouse, row.batch]
				if (key in item_locations) {
					item_locations[key] += row.no_of_quantity
				} else {
					item_locations[key] = row.no_of_quantity
				}

				if (key in item_batch) {
					item_batch[key] = row.batch;
				} else {
					item_batch[key] = row.batch;
				}
			});

			frm.doc.locations.forEach(l_row => {
				let key = [l_row.item_code, l_row.warehouse, l_row.batch_no]
				if (item_locations[key]) {
					frappe.model.set_value(l_row.doctype, l_row.name, {
						"picked_qty": item_locations[key],
						"batch_no": item_batch[key]
					});
				}
			})
		}
	}
})


frappe.ui.form.on("Pick List", {
	refresh(frm) {
		frm.fields_dict.qrcode_scanner.$wrapper.append("<div id='app'>Test</div>")
	},

	scan_qrcode_button(frm, cdt, cdn) {
		frappe.customscan_qrcode.make();
	}
});