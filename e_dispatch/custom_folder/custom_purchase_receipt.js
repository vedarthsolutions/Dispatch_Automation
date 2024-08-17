let pScanner = null;
frappe.ui.form.on("Purchase Receipt", {
	refresh(frm) {
		if (frm.doc.docstatus === 0) {
                                frm.trigger("_scan_qr_codes");
                                frm.trigger("set_no_of_boxes");
                }
	},

	_scan_qr_codes(frm) {
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
                                        Dynamsoft.DBR.BarcodeReader.license = 'DLS2eyJoYW5kc2hha2VDb2RlIjoiMTAxNTA3MDI4LTEwMTU4NjM1MiIsIm1haW5TZXJ2ZXJVUkwiOiJodHRwczovL21sdHMuZHluYW1zb2Z0LmNvbS8iLCJvcmdhbml6YXRpb25JRCI6IjEwMTUwNzAyOCIsInN0YW5kYnlTZXJ2ZXJVUkwiOiJodHRwczovL3NsdHMuZHluYW1zb2Z0LmNvbS8iLCJjaGVja0NvZGUiOjE5MjcyMTM4ODN9';
                                }, 2000)

                        </script>
                        <button id="scan_qrcode" class="btn btn-primary">Start Scanner</button>
                        <button class="btn btn-primary" style="display:none" id="showScanner" >Show Scanner</button>
                        <p style="padding-top:15px"><label>Total Box Scanned : </label> <b id="scanned_box"></b></p>
                `);

                document.getElementById('scan_qrcode').addEventListener('click', async() => {
                        document.getElementById('showScanner').style.display = '';
                        document.getElementById('scan_qrcode').style.display = 'none';

                        startBarcodeScanner((scanned_qrcode) => {
                                debugger
                                frm.set_value("scan_qr_code", scanned_qrcode);
                                frm.save();
                        });
                });

                document.getElementById('showScanner').addEventListener('click', async() => {
                        if (pScanner)(await pScanner).show();
                });
        },

	set_no_of_boxes(frm, count) {
                let total_boxes = 0;
                if (count && count > 0) {
                        total_boxes = count;
                } else {
                        frm.doc.items.forEach(d => {
                                if (d.received_qr_labels) {
                                        scanned_qr_labels = JSON.parse(d.received_qr_labels)
                                        total_boxes = Object.keys(scanned_qr_labels).length || 0.0
                                }
                        })
                }

                document.getElementById('scanned_box').innerHTML = flt(total_boxes);
        }

})


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
                         debugger
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
