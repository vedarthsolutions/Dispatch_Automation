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

    refresh(frm) {
        if (frm.doc.docstatus == 1) {
            frm.add_custom_button(__('Request for Raw Materials'), function() {
                frm.call({
                    method: "make_raw_materials_for_boughtout_items",
                    freeze: true,
                    doc: frm.doc,
                    callback: function(r) {
                        frm.reload_doc();
                    }
                })
            });
        }
    }
})