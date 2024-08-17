frappe.listview_settings["Pick List"] = {
	add_fields: [
		"status",
	],
	filters: [["status", "=", "Draft"]],
	get_indicator: function (doc) {
		const status_colors = {
			Draft: "grey",
			Open: "orange",
			Completed: "green",
			Cancelled: "red",
		};
		return [__(doc.status), status_colors[doc.status], "status,=," + doc.status];
	},
};
