/*
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-25 18:38:59
 */
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'
import router from "./router.js"


axios.interceptors.request.use((config) => {
	if (['/auth', '/auth/register'].indexOf(config.url) === -1) {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = token;
		}
	}
	return config;
});


axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
axios.defaults.baseURL = 'http://10.112.79.202:5828';
// axios.defaults.baseURL = 'http://10.112.79.202:5001';	
Vue.prototype.$http = axios;
Vue.config.productionTip = false


new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
