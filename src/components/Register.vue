<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-03-25 20:35:12
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-25 21:08:37
 -->

<template>
    <div>
        <el-row type="flex" justify="center" align="middle" style="margin-top:120px">
            <el-col :span="8">
                <el-card class="box-card">
                    <div slot="header">
                        <span>注册</span>
                    </div>
                    <el-form>
                        <el-form-item label="用户名">
                            <el-input v-model="regForm.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码">
                            <el-input v-model="regForm.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码">
                            <el-input v-model="regForm.confirm" type="password"></el-input>
                        </el-form-item>
                        <span class="confirmErr" v-show="regForm.confirm  && regForm.password != regForm.confirm"> 两次密码输入不一致！ </span>
                        <el-row type="flex" justify="start">
                            <el-col :span="4">
                                <el-form-item>
                                    <el-button type="primary" @click="register">注册</el-button>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4" :offset="2">
                                <el-form-item>
                                    <el-button type="text" style="font-size:1rem" @click="goLogin">已有账号？登录！</el-button>
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
export default {
    name: 'register',
    data() {
        return {
            regForm: {
                username: '',
                password: '',
                confirm: ''
            }
        }
    },
    methods: {
        register() {
            if (!(this.regForm.username && this.regForm.password && this.regForm.confirm)) {
                this.$message.error("输入不能为空！");
                return;
            }
            if (this.regForm.password !== this.regForm.confirm) {
                this.$message.error("两次密码输入不一致！");
                return;
            }
            let data = {
                username: this.regForm.username,
                password: this.regForm.password
            };
            this.$http.post('/auth/register', data).then(res => {
                if (res.data.result == "Succeeded") {
                    this.$message("注册成功！");
                    this.$router.push({name: "login"});
                } else {
                    this.$message.info("用户名已存在！");
                    this.regForm.username = '';
                    this.regForm.password = '';
                    this.regForm.confirm = '';
                }
            });
        }
    }
    
}
</script>

<style>
.confirmErr {
    display: block;
    color: red;
    margin: 10px 0;
    font-size: 0.8em;
}
</style>