/*
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-08 23:24:10
 */
import Vue from 'vue'
import VePie from 'v-charts/lib/pie.common'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'
import router from "./router.js"



//请求拦截器，将需要附带令牌的带上令牌

axios.interceptors.request.use((config) => {
	if (['/auth', '/auth/register'].indexOf(config.url) === -1) {
		const token = localStorage.getItem('token');
		if (token) {
			config.headers.Authorization = token;
		}
	}
	return config;
});
// 响应拦截器，令牌无效时需重新登录
axios.interceptors.response.use(
	response => {
	//拦截响应，做统一处理 
	if (response.data.msg === 'Token has expired') {
		router.replace({
			name: 'login',
		});
	}
		return response;
	},
	//接口错误状态处理，也就是说无响应时的处理
	error => {
		if (error.response.status == 401) {
			router.replace({
				name: 'login',
			});
		}
});


axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
// axios.defaults.baseURL = 'http://10.112.79.202:5828';
// axios.defaults.baseURL = 'http://10.112.79.202:5001';
axios.defaults.baseURL = 'http://10.112.181.126:5828';
Vue.prototype.$http = axios;
Vue.config.productionTip = false

Vue.component(VePie.name, VePie)

new Vue({
	router,
	render: h => h(App),
}).$mount('#app')
