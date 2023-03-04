


frappe.ui.form.on("BOM", {
	refresh(frm) {
		frm.toggle_display("custom_bom_items", false);
		frm.fields_dict.bom_browse_html.$wrapper.html('');
		if (!frm.is_new()) {
			frm.trigger("prepare_bom_browser");
		}

		if (frm.doc.docstatus === 1) {
			frm.toggle_display("prepare_bom_tree", false);
		}
	},

	prepare_bom_browser(frm) {
		let div = `<div id="bom-browser">BOM</div>`;
		frm.fields_dict.bom_browse_html.$wrapper.html(div);
		frm.fields_dict.bom_browse_html.$wrapper.find('#bom-browser').empty();
		frm.trigger("render_bom_browser");
	},

	prepare_bom_tree(frm) {
		frappe.call({
			method: 'e_dispatch.custom_folder.custom_bom.update_bom_custom_items',
			freeze: true,
			args: {
				bom_no: frm.doc.name,
			},
			callback(r) {
				frm.trigger("render_bom_browser");
				frm.reload_doc();
			}
		})
	},

	render_bom_browser(frm) {
		frappe.call({
			method: 'e_dispatch.custom_folder.custom_bom.get_custom_bom_items',
			freeze: true,
			args: {
				bom_no: frm.doc.name,
			},
			callback(r) {
				if(r.message.length) {
					let bom_data = r.message.map(d => {
						return {
							"item_code": d.item_code,
							"qty": d.qty,
							"bom": d.bom,
							"production_state": d.production_state || "Ignore",
							"indent": d.indent,
							"bom_no": d.bom_no,
							"name": d.name,
							"customers": d.customers,
							"default_customer": d.default_customer,
							frm: frm
						}
					});

					let selector = frm.fields_dict.bom_browse_html.$wrapper.find('#bom-browser');
					frm.datatable = new frappe.DataTable(selector[0], {
						columns: [{
							id: "item_code",
							name: "Item Code",
							editable: false,
							width: 200
						}, {
							id: "indent",
							name: "BOM Level",
							editable: false,
							width: 100
						}, {
							id: "qty",
							name: "QTY",
							editable: false,
							width: 100
						}, {
							id: "bom",
							name: "BOM",
							editable: false,
							width: 200
						}, {
							id: "production_state",
							name: "State",
							editable: false,
							width: 200,
							format: (value, row, column, data) => {
								value = value;

								if (data.frm && data.frm.datatable) {
									frm.events.bind_events(data.frm);
								}

								if (data.bom_no) {
									return `<select id="${data.name}" class="input-with-feedback form-control production_state" style="height:30px">
										<option value="Ignore" ${value == "Ignore" ? "selected" : ""}>Ignore</option>
										<option value="In House" ${value == "In House" ? "selected" : ""}>In House</option>
										<option value="Subcontract" ${value == "Subcontract" ? "selected" : ""}>Subcontract</option>
										<option value="Purchase" ${value == "Purchase" ? "selected" : ""}>Purchase</option>
										<option value="Purchase and Resale" ${value == "Purchase and Resale" ? "selected" : ""}>Purchase and Resale</option>
									</select>`;
								} else {
									return `<select id="${data.name}" class="input-with-feedback form-control production_state" style="height:30px">
										<option value="Ignore" ${value == "Ignore" ? "selected" : ""}>Ignore</option>
										<option value="Purchase" ${value == "Purchase" ? "selected" : ""}>Purchase</option>
										<option value="Purchase and Resale" ${value == "Purchase and Resale" ? "selected" : ""}>Purchase and Resale</option>
									</select>`;
								}
							}
						}, {
							id: "default_customer",
							name: "Default Customer",
							editable: false,
							width: 200,
							format: (value, row, column, data) => {
								value = value;
								if (data.frm && data.frm.datatable) {
									frm.events.bind_events(data.frm);
								}

								value = add_select(value, data);
								return value;
							}
						}],
						data: bom_data,
						name_field: "item_code",
						treeView: true,
					});

					frm.datatable.rowmanager.setTreeDepth(10);
					if (frm.doc.docstatus != 0) {
						$(frm.datatable.wrapper).find(".production_state").attr("disabled", true);
					}

					frm.events.bind_events(frm);
				}
			}
		})
	},

	bind_events(frm) {
		frm.events.update_production_state(frm);
		frm.events.update_default_customer(frm);
	},

	update_production_state(frm) {
		$(frm.datatable.rowmanager.wrapper).find(".production_state")
			.change((e) => {
				let name = $(e.target).attr('id');
				let value = $(e.target).val();

				if (name && value) {
					frappe.call({
						method: "e_dispatch.custom_folder.custom_bom.update_production_state",
						freeze: true,
						args: {
							name: name,
							value: value
						},
						callback: (r) => {
							frm.reload_doc();
						}
					})
				}
			});
	},

	update_default_customer(frm) {
		$(frm.datatable.rowmanager.wrapper).find(".default_customer")
			.change((e) => {
				let name = $(e.target).attr('id');
				let value = $(e.target).val();

				if (name && value) {
					frappe.call({
						method: "e_dispatch.custom_folder.custom_bom.update_default_customer",
						freeze: true,
						args: {
							name: name,
							value: value
						},
						callback: (r) => {
							frm.reload_doc();
						}
					})
				}
			});
	}
});

// columns: [{
//     label: 'Item Code',
//     fieldname: 'item_code',
//     fieldtype: 'Link',
//     options: 'Item',
//     width: 200
// }, {
//     label: 'Quantity',
//     fieldname: 'qty',
//     fieldtype: 'Float',
//     width: 100
// }, {
//     label: 'Indent',
//     fieldname: 'indent',
//     fieldtype: 'Int',
// }]

function add_select(value, data) {
	let options = '<option value=""></option>';
	if (data.customers && data.customers.length > 0) {
		data.customers.forEach((customer) => {
			options += `<option value="${customer}" ${value == customer ? "selected" : ""}>${customer}</option>`;
		});
	}

	return `<select id="${data.name}" class="input-with-feedback form-control default_customer" style="height:30px">
		${options}
	</select>`;
}