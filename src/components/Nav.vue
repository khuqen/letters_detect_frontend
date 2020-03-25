<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-03-12 17:26:07
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-25 22:02:40
 -->

<template>
    <el-menu mode="horizontal" router>
        <el-menu-item index="home">
            <span class="title">XXAI选择题阅卷系统</span>
        </el-menu-item>
        
        <el-row type="flex" justify="end" v-if="loginLabel === '登录' ">            
            <el-col :span="2">
                <el-menu-item index="login">
                    <span> 登录 </span>
                </el-menu-item>
            </el-col>
            <el-col :span="2">
                <el-menu-item index="register">
                    <span>注册</span>
                </el-menu-item>
            </el-col>
        </el-row>
        <el-row type="flex" justify="end" v-else>
            <el-col :span="2">
                <el-menu-item @click="logout">
                    <span> 注销 </span>
                </el-menu-item>
            </el-col>
        </el-row>
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