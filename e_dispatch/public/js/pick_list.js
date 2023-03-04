frappe.ui.form.on("Pick List", {
	refresh(frm) {
		frm.clear_custom_buttons()
		frm.trigger('add_get_items_button');
		frm.events.hide_fields(frm);
	},

	hide_fields(frm) {
		if (in_list(frappe.user_roles, "Sales Manager")) {
			frm.add_custom_button(__("Update Locations"), () => {
				frm.trigger("set_picked_qty");
			});

			return;
		}

		if (in_list(["dispatch@fabchair.com", "Administrator"], frappe.session.user)) {
			return;
		}

		frm.set_df_property("picklist_items", "read_only", 1);

		let fields = ["section_break_6", "section_break_15",
			"print_settings_section", "custom_section_break", "pick_list_details"]

		fields.forEach(field => {
			frm.set_df_property(field, "hidden", true);
		});
	},

	validate(frm) {
		if (frm.doc.warehouse) {
			frm.doc.picklist_items.forEach(row => {
				if (row.warehouse != frm.doc.warehouse) {
					frappe.model.set_value(row.doctype, row.name, "warehouse", frm.doc.warehouse);
				}
			});
		}
	},

	warehouse(frm) {
		if (frm.doc.warehouse) {
			frm.doc.picklist_items.forEach(row => {
				frappe.model.set_value(row.doctype, row.name, "warehouse", frm.doc.warehouse);
			});
		}
	},

	purpose: (frm) => {
		frm.clear_table('locations');
		frm.trigger('add_get_items_button');
	},

	add_get_items_button(frm) {
		let purpose = frm.doc.purpose;
		frm.remove_custom_button("Get Items")

		if (purpose != 'Delivery' || frm.doc.docstatus !== 0) return;
		let get_query_filters = {
			docstatus: 1,
			per_delivered: ['<', 100],
			status: ['!=', ''],
			customer: frm.doc.customer
		};
		frm.get_items_btn = frm.add_custom_button(__('Fetch Items'), () => {
			erpnext.utils.map_current_doc({
				method: 'e_dispatch.custom_folder.custom_pick_list.create_pick_list',
				source_doctype: 'Sales Order',
				target: frm,
				setters: {
					company: frm.doc.company,
					customer: frm.doc.customer
				},
				date_field: 'transaction_date',
				get_query_filters: get_query_filters
			});
		});
	},

	parse_qrcode(frm, scanned_qrcode) {
		if (!frm.doc.warehouse) {
			frappe.throw(__("Please select Pick From Warehouse"));
		}

		if (scanned_qrcode) {
			frm.call({
				method: "custom_scan_qrcode",
				freeze: true,
				doc: frm.doc,
				args: {
					"scanned_qrcode": scanned_qrcode,
				},
				callback: function(r) {
					refresh_field("locations");
					refresh_field("custom_items");
					frm.events.set_no_of_boxes(frm);
				}
			})
		}
	},

	set_picked_qty(frm) {
		if (frm.doc.custom_items && frm.doc.custom_items.length > 0) {
			let item_locations = {}
			frm.doc.custom_items.forEach(row => {
				let key = JSON.stringify([row.item_code, row.warehouse, row.batch, row.sales_order, row.sales_order_item]);
				if (key in item_locations) {
					item_locations[key][0] += row.no_of_quantity
				} else {
					item_locations[key] = [row.no_of_quantity, row.qty, row.stock_qty]
				}
			});

			frm.doc.locations = []
			Object.keys(item_locations).forEach(key => {
				let [item_code, warehouse, batch, sales_order, sales_order_item] = JSON.parse(key);
				frm.add_child("locations", {
					"item_code": item_code,
					"warehouse": warehouse,
					"batch_no": batch,
					"qty": item_locations[key][1],
					"sales_order": sales_order,
					"sales_order_item": sales_order_item,
					"picked_qty": item_locations[key][0],
					"stock_qty": item_locations[key][2]
				});
			});
		}
	}
})


frappe.ui.form.on("Pick List", {
	refresh(frm) {
		frm.fields_dict.qrcode_scanner.$wrapper.empty();
		frm.fields_dict.qrcode_scanner.$wrapper.append(`

			<div id="UIElement" class="UIElement" style="height:400px;">
				<span id='lib-load' style='font-size:x-large' hidden>Loading Library...</span><br />
			</div>
			<div style="display:none">
				<span style="float:left;margin-top:20px;">All Results:</span><br />
				<div id="results"></div>
			</div>

			<script src="https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr.js"></script>
			<script>
				setTimeout(function() {
					Dynamsoft.DBR.BarcodeReader.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNTA3MDI4IiwiY2hlY2tDb2RlIjotOTE0NDIyMjIzfQ==';
				}, 2000)

			</script>
			<button id="scan_qrcode" class="btn btn-primary">Start Scanner</button>
			<button class="btn btn-primary" style="display:none" id="showScanner" >Show Scanner</button>
			<p style="padding-top:15px"><label>Total Box Scanned : </label> <b id="scanned_box"></b></p>
		`);

		document.getElementById('scan_qrcode').addEventListener('click', async() => {
			if (!frm.doc.warehouse) {
				frappe.throw(__("Please select Pick From Warehouse"));
			}

			document.getElementById('showScanner').style.display = '';
			document.getElementById('scan_qrcode').style.display = 'none';

			startBarcodeScanner((scanned_qrcode) => {
				frm.events.parse_qrcode(frm, scanned_qrcode);
			});
		});

		document.getElementById('showScanner').addEventListener('click', async() => {
			if (pScanner)(await pScanner).show();
		});

		frm.events.set_no_of_boxes(frm);
	},

	set_no_of_boxes(frm, count) {
		let total_boxes = 0;
		if (count && count > 0) {
			total_boxes = count;
		} else if (frm.doc.custom_items && frm.doc.custom_items.length > 0) {
			total_boxes = frm.doc.custom_items.length;
		}

		document.getElementById('scanned_box').innerHTML = total_boxes;
	}
});

let pScanner = null;

 async function startBarcodeScanner(callback) {
	 try {
		 let scanner = await (pScanner = pScanner || Dynamsoft.DBR.BarcodeScanner.createInstance());
		 document.getElementById('showScanner').hidden = false;
		 let scanSettings = await scanner.getScanSettings();
		 scanSettings.whenToPlaySoundforSuccessfulRead = "frame";
		 await scanner.updateScanSettings(scanSettings);

		 scanner.onFrameRead = (_results) => {
			 for (let result of _results) {
				 let newElements = [];
				 const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
				 newElements.push(createASpan(format + ": "));
				 newElements.push(createASpan(result.barcodeText, "resultText"));
				 newElements.push(document.createElement('br'));
				 if (result.barcodeText.indexOf("Attention(exceptionCode") != -1) {
					 newElements.push(createASpan(" Error: " + result.exception.message));
					 newElements.push(document.createElement('br'));
				 }
				 for (let span of newElements) {
					 document.getElementById('results').appendChild(span);
				 }
				 document.getElementById('results').scrollTop = document.getElementById('results').scrollHeight;
			 }
		 };
		 scanner.onUniqueRead = (txt, result) => {
			 const format = result.barcodeFormat ? result.barcodeFormatString : result.barcodeFormatString_2;
			 scanner.hide();
			 callback(txt);
		 };
		 document.getElementById('UIElement').appendChild(scanner.getUIElement());
		 document.getElementsByClassName("dce-video-container")[0].style.height = "380px";
		 await scanner.show();
		 document.getElementById('lib-load').hidden = true;
		 document.getElementById('results').style.visibility = "visible";
	 } catch (ex) {
		 let errMsg;
		 if (ex.message.includes("network connection error")) {
			 errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
		 } else {
			 errMsg = ex.message||ex;
		 }
		 console.error(errMsg);
		 alert(errMsg);
	 }
 }

 function createASpan(txt, className) {
	 let newSPAN = document.createElement("span");
	 newSPAN.textContent = txt;
	 if (className)
		 newSPAN.className = className;
	 return newSPAN;
 }
