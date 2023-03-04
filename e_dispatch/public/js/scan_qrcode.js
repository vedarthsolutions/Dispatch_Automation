import Vue from 'vue'
import App from './App.vue'
import RecorderDetail from "./RecorderDetail.vue";
import store from './store'
import Guide from "./components/Guide.vue";
import { Button, Icon, Popover, Checkbox, message, Modal } from 'ant-design-vue'
// import BarcodeScannerComponent from "./components/BarcodeScanner.vue"
import VueRouter from 'vue-router';

Vue.use(Button)
Vue.use(VueRouter);
Vue.use(Icon)
Vue.use(Popover)
Vue.use(Checkbox)
Vue.use(message)
Vue.prototype.$message = message;
Vue.use(Modal)
Vue.prototype.$warning = Modal.warning;
Vue.config.productionTip = false;

const routes = [
	{ path: '/', component: Guide},
]

frappe.provide('frappe.customscan_qrcode')

$.extend(frappe.customscan_qrcode, {
	make() {
		// let dialog = new frappe.ui.Dialog({
		// 	title: __("Scan QR Code"),
		// 	fields: [
		// 		{
		// 			fieldtype: "HTML",
		// 			fieldname: "scan_qrcode",
		// 		},
		// 	],
		// });


		// let scan_qrcode = dialog.fields_dict.scan_qrcode.$wrapper.find(".frappe-control");
		// dialog.show();

		const routes = [
			{
				name: "recorder-detail",
				path: '/detail',
				component: RecorderDetail,
			},
			{
				path: '/',
				redirect: {
					name: "recorder-detail"
				}
			}
		];

		const router = new VueRouter({
			mode: 'history',
			base: "/app/recorder/",
			routes: routes,
		});

		new Vue({
			render: h => h(App),
			router: router,
			store,
		}).$mount('#app')
	}
});