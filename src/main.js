/*
 * @Description: 
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-02-23 19:58:31
 */
import Vue from 'vue'
import App from './App.vue'
import './plugins/element.js'
import axios from 'axios'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
axios.defaults.baseURL = 'https://10.112.79.202:8010';
// axios.defaults.baseURL = 'http://10.112.79.202:5001';
Vue.prototype.$http = axios;
Vue.config.productionTip = false


new Vue({
	render: h => h(App),
}).$mount('#app')
