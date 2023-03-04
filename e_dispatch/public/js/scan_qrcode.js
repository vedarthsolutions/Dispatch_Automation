// import Vue from 'vue'
// import App from './App.vue'
// import RecorderDetail from "./RecorderDetail.vue";
// import store from './store'
// import Guide from "./components/Guide.vue";
// import { Button, Icon, Popover, Checkbox, message, Modal } from 'ant-design-vue'
// import QRCode from "qrcodejs2";
// // import BarcodeScannerComponent from "./components/BarcodeScanner.vue"
// import VueRouter from 'vue-router';

// Vue.use(Button)
// Vue.use(VueRouter);
// Vue.use(Icon)
// Vue.use(Popover)
// Vue.use(Checkbox)
// Vue.use(message)
// Vue.prototype.$message = message;
// Vue.use(Modal)
// Vue.prototype.$warning = Modal.warning;
// Vue.config.productionTip = false;

// // const routes = [
// // 	{ path: '/', component: Guide},
// // 	{ path: '/common-oned.html', component: BarcodeScannerComponent },
// // 	{ path: '/common-twod.html', component: BarcodeScannerComponent },
// // 	{ path: '/common-oned-twod.html', component: BarcodeScannerComponent },
// // 	{ path: '/vin.html', component: BarcodeScannerComponent },
// // 	{ path: '/driver-license.html', component: BarcodeScannerComponent },
// // 	{ path: '/dpm.html', component: BarcodeScannerComponent }
// //   ]

// frappe.provide('frappe.customscan_qrcode')

// $.extend(frappe.customscan_qrcode, {
// 	make() {
// 		// let dialog = new frappe.ui.Dialog({
// 		// 	title: __("Scan QR Code"),
// 		// 	fields: [
// 		// 		{
// 		// 			fieldtype: "HTML",
// 		// 			fieldname: "scan_qrcode",
// 		// 		},
// 		// 	],
// 		// });


// 		// let scan_qrcode = diaplog.fields_dict.scan_qrcode.$wrapper.find(".frappe-control");
// 		// dialog.show();

// 		const routes = [
// 			{
// 				name: "recorder-detail",
// 				path: '/detail',
// 				component: RecorderDetail,
// 			},
// 			{
// 				path: '/',
// 				redirect: {
// 					name: "recorder-detail"
// 				}
// 			}
// 		];

// 		const router = new VueRouter({
// 			routes,
// 			base: "http://frappe-training:8000/",
// 			mode: "history",
// 		})

// 		new Vue({
// 			render: h => h(App),
// 			router: router,
// 			store,
// 		}).$mount('#app')
// 	}
// });


frappe.provide('frappe.customscan_qrcode')
