(()=>{frappe.provide("frappe.ui");var e=null;frappe.ui.CustomScanner=class{constructor(i){debugger;this.dialog=null,this.handler=null,this.options=i,this.is_alive=!1,"multiple"in this.options||(this.options.multiple=!1),i.container&&(this.$scan_area=$(i.container),this.scan_area_id=frappe.dom.set_unique_id(this.$scan_area)),i.dialog&&(this.dialog=this.make_dialog(),this.dialog.show())}scan(){document.getElementById("showScanner").addEventListener("click",async()=>{e&&(await e).show()})}start_scan(){this.handler||(this.handler=new Html5Qrcode(this.scan_area_id)),this.handler.start({facingMode:"environment"},{fps:10,qrbox:250},(i,a)=>{if(this.options.on_scan)try{this.options.on_scan(a)}catch(s){console.error(s)}},i=>{}).catch(i=>{this.is_alive=!1,this.hide_dialog(),console.error(i)}),this.is_alive=!0}stop_scan(){this.handler&&this.is_alive&&this.handler.stop().then(()=>{this.is_alive=!1,this.$scan_area.empty(),this.hide_dialog()})}make_dialog(){let i=new frappe.ui.Dialog({title:__("Scan QRCode"),fields:[{fieldtype:"HTML",fieldname:"scan_area"}],on_page_show:()=>{this.$scan_area=i.get_field("scan_area").$wrapper,this.$scan_area.append(`

			<div id="UIElement" class="UIElement" style="height:400px;">
				<span id='lib-load' style='font-size:x-large' hidden>Loading Library...</span><br />
			</div>
			<div style="display:none">
				<span style="float:left;margin-top:20px;">All Results:</span><br />
				<div id="results"></div>
			</div>

			<script src="https://cdn.jsdelivr.net/npm/dynamsoft-javascript-barcode@9.3.1/dist/dbr.js"><\/script>
			<script>
                frappe.call({
                    method: "e_dispatch.e_dispatch.doctype.e_dispatch_automation_settings.e_dispatch_automation_settings.get_dynamsoft_license_key",
                    callback: function(response) {
                        var licenseKey = response.message;
                        if (licenseKey) {
                            setTimeout(function() {
                                Dynamsoft.DBR.BarcodeReader.license = licenseKey;
                            }, 2000);
                        } else {
                            console.error("License key not found.");
                        }
                    },
                    error: function(error) {
                        console.error("Failed to fetch license key:", error);
                    }
                })

            <\/script>
			<button id="scan_qrcode" class="btn btn-primary">Start Scanner</button>
			<button class="btn btn-primary" style="display:none" id="showScanner" >Show Scanner</button>
			<p style="padding-top:15px"><label>Total Box Scanned : </label> <b id="scanned_box"></b></p>
		`),this.scan_area_id=frappe.dom.set_unique_id(this.$scan_area),this.scan()},on_hide:()=>{this.stop_scan()}});return i}hide_dialog(){this.dialog&&this.dialog.hide()}load_lib(){return frappe.require("/assets/frappe/node_modules/html5-qrcode/html5-qrcode.min.js")}};})();
//# sourceMappingURL=edispatch.bundle.WX4IFYY4.js.map
