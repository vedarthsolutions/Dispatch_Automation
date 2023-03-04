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
		frm.fields_dict.qrcode_scanner.$wrapper.append(`
			<h1 style="font-size: 1.5em;">Use the Default Built-in UI</h1>
			<input type="text" id="result" title="Double click to clear!" readonly="true" class="latest-result" placeholder="The Last Read Barcode">
				<div id="UIElement" class="UIElement">
					<span id='lib-load' style='font-size:x-large' hidden>Loading Library...</span><br />
					<button id="showScanner" hidden>Show The Scanner</button>
				</div>
			<div>
				<span style="float:left;margin-top:20px;">All Results:</span><br />
				<div id="results"></div>
			</div>

			<script src="https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr.js"></script>
			<script>
				setTimeout(function() {
					Dynamsoft.DBR.BarcodeReader.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LVRYbFhaV0pRY205cVgyUmljZyIsIm9yZ2FuaXphdGlvbklEIjoiMTAxNTA3MDI4IiwiY2hlY2tDb2RlIjotOTE0NDIyMjIzfQ==';
				}, 2000)

			</script>
		`);

		document.getElementById('showScanner').addEventListener('click', async() => {
			debugger
			if (pScanner)(await pScanner).show();
		});
	},

	scan_qrcode_button(frm, cdt, cdn) {
		startBarcodeScanner();
	}
});

let pScanner = null;

 async function startBarcodeScanner() {
	 try {
		 let scanner = await (pScanner = pScanner || Dynamsoft.DBR.BarcodeScanner.createInstance());
		 document.getElementById('showScanner').hidden = false;
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
			 document.getElementById('result').value = format + ": " + txt;
			 document.getElementById('result').focus();
			 setTimeout(() => {
				 document.getElementById('result').blur();
			 }, 2000);
		 };
		 document.getElementById('UIElement').appendChild(scanner.getUIElement());
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
