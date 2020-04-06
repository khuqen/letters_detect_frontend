<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-03-12 17:26:07
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-06 10:26:32
 -->

<template>
    <el-menu mode="horizontal" router>
        <el-menu-item index="home">
            <span class="title">XXAI选择题阅卷系统</span>
        </el-menu-item>
        
        <el-menu-item index="login" v-if="loginLabel === '登录'" style="float:right">
            <span>登录</span>
        </el-menu-item>
        <el-menu-item index="register" v-if="loginLabel === '登录'" style="float:right">
            <span>注册</span>
        </el-menu-item>
        <el-submenu v-if="loginLabel !== '登录'" style="float:right">
            <template slot="title">{{ this.loginLabel }}</template>
            <el-menu-item index="home">主页</el-menu-item>
            <el-menu-item @click="logout">注销</el-menu-item>
        </el-submenu>
    </el-menu>
</template>
<script>
import bus from '../../bus.js'

export default {
    name: 'Nav',
    data() {
        return {
            loginLabel: '登录'
        }
    },
    created() {
        let token = localStorage.getItem('token');
        if (token) {
            this.loginLabel = localStorage.getItem('username');
        }
        bus.$on('login', () => this.loginLabel = localStorage.getItem('username'));
    },
    methods: {
        logout() {
            localStorage.removeItem('username');
            localStorage.removeItem('token');
            this.loginLabel = '登录';
            this.$router.push({name: "login"});
        }
    },
}
</script>

<style>
.title {
    font-size: 2rem;
    font-weight: bolder;
}
</style>