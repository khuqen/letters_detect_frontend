<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-03-12 16:42:08
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-08 23:33:46
 -->
<template>
    <div>
        <el-row type="flex" justify="center" align="middle" style="margin-top:120px">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header">
                        <span>登录</span>
                    </div>
                    <el-form>
                        <el-form-item label="用户名">
                            <el-input v-model="loginForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="loginForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-row type="flex" justify="start">
                            <el-col :span="4">
                                <el-form-item>
                                    <el-button type="primary" @click="login">登录</el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" :offset="2">
                                <el-form-item>
                                    <el-button type="text" style="font-size:1rem" @click="goRegister">没有账号？注册！</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form> 
                    </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import bus from "../../bus.js"

export default {
    name: 'Login',
    data() {
        return {
            loginForm: {
                username: '',
                password: ''
            }
        }
    },
    created() {
        if (localStorage.getItem('username'))
            this.$router.replace({name: 'home'});
    },
    methods: {
        /* 登录 */
        login() {
            let data = {
                username: this.loginForm.username,
                password: this.loginForm.password
            };
            // window.console.log(data);
            this.$http.post('/auth/login', data).then(res => {
                this.$message('登录成功!');
                if (res.data.result == 'Succeeded') {
                    /* 登录成功，保存用户名和令牌到本地存储 */
                    let token = 'Bearer ' + res.data.access_token;
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', token);
                    bus.$emit('login');
                    this.$router.push({name: 'home'});
                } else {
                    this.$message.error('用户名或密码错误!');
                }
            }).catch(err => {
                this.$message.error('用户名或密码错误!');
            });
        },
        goRegister() {
            this.$router.push({name: "register"});
        }
    }
}
</script>

<style>
.register {
    font-size: 1rem;
}
</style>