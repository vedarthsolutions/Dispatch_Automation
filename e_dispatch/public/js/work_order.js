
frappe.ui.form.on("Work Order", {
	refresh(frm) {
		frm.trigger("make_qr_code");
	},

	make_qr_code(frm) {
		if (frm.doc.docstatus === 1 && frm.doc.has_batch_no && !frm.doc.qr_code_created) {
			frm.add_custom_button(__("Make QR Code"), () => {
				frappe.call({
					method: "e_dispatch.custom_folder.custom_work_order.make_qr_code",
					freeze: true,
					args: {
						"work_order": frm.doc.name
					},
					callback: function() {
						frm.reload_doc();
					}
				})
			});
		}
	}
})