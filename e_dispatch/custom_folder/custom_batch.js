frappe.ui.form.on("Batch", {
	refresh(frm) {
		if (!frm.doc.expiry_date) {
			frm.add_custom_button("Close Batch", () => {
				frappe.confirm(__('Do you want to close the batch permanently?'), () => {
					frm.set_value("expiry_date", frappe.datetime.get_today())
					frm.set_value("is_closed", 1)
					frm.save()
				})
			})
		}

		if (frm.doc.is_closed && frm.doc.expiry_date) {
			frm.set_df_property("expiry_date", "read_only", 1);
		}

		frm.set_df_property("qrcode_details", "cannot_add_rows", true);
		frm.set_df_property("qrcode_details", "cannot_delete_rows", true);
	}
})
