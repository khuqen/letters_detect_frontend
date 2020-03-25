<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-02-23 20:11:54
 * @LastEditors: khuqen
 * @LastEditTime: 2020-03-25 20:26:20
 -->

<template>
    <div>
        <el-row type="flex" justify="center" v-for="item in [1, 2, 3]" :key="item" style="margin:10px;">
            <el-col :span="10">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>考试名称</span>
                        <el-button style="float: right; padding: 3px 0" type="text" @click="enter">进入</el-button>
                    </div>
                    <div v-for="o in 2" :key="o" class="text item">
                        {{'列表内容 ' + o }}
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row type="flex" justify="center">
            <el-col :span="2">
                <el-button type="primary" @click="newDialogFormVisible = true">新建</el-button>
            </el-col>
            <el-col :span="2">
                <el-button>添加</el-button>
            </el-col>
            <el-col :span="2">
                <el-button @click="hekki">测试</el-button>
            </el-col>
        </el-row>
        
        <el-dialog title="新建" :visible.sync="newDialogFormVisible">
            <el-form :model="newForm">
                <el-form-item label="活动名称" label-width="120px">
                <el-input v-model="newForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动区域" label-width="120px">
                <el-select v-model="newForm.region" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

export default {
    name: 'Home',
    data() {
        return {
            newDialogFormVisible: false,
            addDialogFormVisible: false,
            newForm: {
                name: '',
                region: ''
            }
        }
    },
    beforeCreate() {
        let token = localStorage.getItem('token');
        if(!token) {
            this.$$router.push({name: "login"});
        }
    },
    methods: {
        enter() {
            this.$router.push({name: 'camera'});
        },
        hekki() {
            this.$http.get('protected').then(res => {
                this.$message(res.data);
            })
        }
    }
}
</script>

<style>
.text {
font-size: 14px;
}

.item {
margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
display: table;
content: "";
}
.clearfix:after {
clear: both
}

.box-card {
width: 480px;
}
</style>