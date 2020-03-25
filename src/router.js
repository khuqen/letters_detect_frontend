/*
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-03-12 16:41:15
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-25 20:47:45
 */
import Vue from "vue";
import VueRouter from "vue-router";

// 引入组件
import Home from "./components/Home";
import Login from "./components/Login";
import Camera from "./components/Camera";
import Register from "./components/Register"

// 要告诉 vue 使用 vueRouter
Vue.use(VueRouter);

const routes = [
    {
        path: '/', 
        redirect: '/home' 
    },
    {
        path:"/home",
        component: Home,
        name: "home"
    },
    {
        path: "/login",
        component: Login,
        name: "login"
    },
    {
        path: "/register",
        component: Register,
        name: "register"
    },   
    {
        path: "/camera",
        component: Camera,
        name: "camera"
    }
]

var router =  new VueRouter({
    routes
})
export default router;