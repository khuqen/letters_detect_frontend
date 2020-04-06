/*
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-06 12:20:10
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

axios.interceptors.response.use(
	response => {
	  //拦截响应，做统一处理 
	  if (response.data.code) {
		if (response.data.msg == 'Token has expired') {
			router.replace({
				name: 'login',
			});
		}
	  }
	  return response;
	},
	//接口错误状态处理，也就是说无响应时的处理
	error => {
	  return Promise.reject(error.response.status); // 返回接口返回的错误信息
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
