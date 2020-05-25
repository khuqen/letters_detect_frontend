<!--
 * @Description: 
 * @Autor: khuqen
 * @Date: 2020-02-23 20:11:54
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-08 23:43:33
 -->

<template>
    <div>
        <el-row v-if="!exams" type="flex" justify="center">
            <span class="empty">当前没有任何考试!</span>
        </el-row>
        <el-row type="flex" justify="center" v-for="exam in exams" :key="exam.id" style="margin:10px;">
            <el-col :span="10">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span class="exam-name">{{ exam.name }}</span>
                        <el-button style="float: right; padding: 3px 2px; font-size:16px;" type="text" @click="enter(exam.id)">进入</el-button>
                        <el-button style="float: right; padding: 3px 2px; font-size:16px;" type="text" @click="openModifyDialog(exam.id)">修改</el-button>
                        <el-button style="float: right; padding: 3px 2px; font-size:16px;" type="text" @click="openDeitailDialog(exam.id)">查看</el-button>
                        <el-button style="float: right; padding: 3px 2px; font-size:16px;" type="text" @click="openStatisticsDialog(exam.id)">统计</el-button>
                        <el-button style="float: right; padding: 3px 2px; font-size:16px;color: red" type="text" @click="confirmDelete(exam.id)">删除</el-button>
                    </div>
                    <div class="text item">{{ exam.description }}</div>
                </el-card>
            </el-col>
        </el-row>
        <div class="operater">
            <el-row type="flex" justify="center">
                <el-col :span="2">
                    <el-button type="primary" @click="newDialogFormVisible = true">创建</el-button>
                </el-col>
                <el-col :span="2">
                    <el-button @click="plusDialogVisible = true">加入</el-button>
                </el-col>
            </el-row>
        </div>

        <!-- 删除确认 -->
        <el-dialog title="提示" :visible.sync="deleteDialogVisible" width="30%">
            <span>确定删除该考试吗?</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="deleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteExam">确 定</el-button>
            </span>
        </el-dialog>


        <!-- 加入考试对话框 -->
        <el-dialog title="加入考试" :visible.sync="plusDialogVisible" width="30%">
            <el-form :model="plusForm">
                <el-form-item label="考试ID" label-width="120px">
                    <el-input v-model="plusForm.id" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="plusDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="plusExam">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 新建考试对话框 -->
        <el-dialog title="新建考试" :visible.sync="newDialogFormVisible">
            <el-form :model="newForm">
                <el-form-item label="考试名称" label-width="120px">
                    <el-input v-model="newForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试描述" label-width="120px">
                    <el-input v-model="newForm.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标准答案" label-width="120px">
                    <el-input v-model="newForm.std_answer" autocomplete="off" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="createExam">确 定</el-button>
            </div>
        </el-dialog>

        <!-- 修改考试对话框 -->
        <el-dialog title="考试信息" :visible.sync="modifyDialogFormVisible">
            <el-form :model="modifyForm">
                <el-form-item label="考试ID" label-width="120px">
                    <el-input disabled v-model="modifyForm.id" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试名称" label-width="120px">
                    <el-input v-model="modifyForm.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="考试描述" label-width="120px">
                    <el-input v-model="modifyForm.description" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="标准答案" label-width="120px">
                    <el-input v-model="modifyForm.std_answer" autocomplete="off" type="textarea" autosize></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="modifyDialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="modifyExam">修 改</el-button>
            </div>
        </el-dialog>


        <!-- 查看考试对话框 -->
        <el-dialog title="查看答案信息" :visible.sync="detailDialogVisible">
            <el-input v-model="detailBook" placeholder="请输入卷号" style="width:40%"></el-input>
            <el-table :data="tableData" max-height="300" style="width: 100%">
                <el-table-column
                    prop="paper"
                    width="50"
                    fixed
                    label=" ">
                </el-table-column>
                <el-table-column 
                    v-for="item in ansIndex"
                    :key="item"
                    :prop="item"
                    :label="item"
                ></el-table-column>
            </el-table>
        </el-dialog>

        <!-- 统计考试对话框 -->
        <el-dialog title="查看统计信息" :visible.sync="statisticsDialogVisible">
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input v-model="problem_no" placeholder="请输入题号"></el-input>
                </el-col>
                <el-col :span="4">
                    <el-button size="mini" @click="getChartData">查看</el-button>
                </el-col>
            </el-row>
            <el-row type="flex" justify="center">
                <el-col>
                    <ve-pie :data="chartData"></ve-pie>
                </el-col>
            </el-row>
        </el-dialog>
    </div>
</template>

<script>
function debounce(fn, wait) {     
    var timeout = null;    
    return function() {        
        if(timeout !== null)   clearTimeout(timeout);        
        timeout = setTimeout(fn, wait);    
    }
}
export default {
    name: 'Home',
    data() {
        return {
            newDialogFormVisible: false,
            addDialogFormVisible: false,
            modifyDialogFormVisible: false,
            deleteDialogVisible: false,
            plusDialogVisible: false,
            detailDialogVisible: false,
            statisticsDialogVisible: false,
            newForm: {
                name: '',
                description: '',
                std_answer: ''
            },
            plusForm: {
                id: ''
            },
            modifyForm: {
                id: '',
                name: '',
                description: '',
                std_answer: ''
            },
            oldExamForm: {
                name: '',
                description: '',
                std_answer: ''
            },
            modifiedID: '',
            detailID: '',
            exams: null,
            deleteExamID: '',
            statisticsID: '',

            activeName: '',
            tableData: [],
            ansIndex: [],
            detailBook: '',
            problem_no: '',

            chartData: {
                columns: ['选项', '数量'],
                rows: [
                    {'选项': 'A', '数量': 0},
                    {'选项': 'B', '数量': 0},
                    {'选项': 'C', '数量': 0},
                    {'选项': 'D', '数量': 0},
                ]
            }
            
        }
    },
    beforeCreate() {
        /* 若未登录，重定向登录界面 */
        let token = localStorage.getItem('token');
        if(!token) {
            this.$router.push({name: "login"});
        }
    },
    created() {
        /* 创建时，请求所有的用户考试 */
        this.getAllExams();
        this.getTableDataDe = debounce(this.getTableData, 500);
    },
    methods: {
        /* 进入某个考试 */
        enter(id) {
            this.$router.push({
                name: 'camera',
                query: {
                    examID: id
                }
            });
        },
        /* 获取属于该用户的所有考试信息 */
        getAllExams() {
            this.$http.get('exam/get-user-exam').then(res => {
                this.exams = res.data.exam_info;
            });
        },
        /* 创建一个考试 */
        createExam() {
            let data = this.newForm;
            let std_ans = [];
            this.newForm.std_answer.split(',').forEach(item => {std_ans.push(item)});
            data.std_answer = std_ans;
            this.$http.post('/exam/create', data).then(res => {
                if (res.data.result == 'Succeeded') {
                    this.newDialogFormVisible = false;
                    this.getAllExams();
                } else {
                    this.$message.error('考试名称已存在!');
                }
            });
        },
        /* 打开考试答案信息 */
        openDeitailDialog(id) {
            this.detailID = id;
            this.detailDialogVisible = true;
            this.detailBook = ''; 
        },
        openStatisticsDialog(id) {
            this.statisticsID = id;
            this.statisticsDialogVisible = true;
        },
        /* 获取考试信息，并打开修改考试对话框 */
        openModifyDialog(id) {
            this.modifiedID = id;
            let data = {id: id};
            // window.console.log(data);
            this.$http.post('exam/get-exam-info', data).then(res => {
                this.modifyForm = res.data;
                this.modifyForm.std_answer = res.data.std_answer.toString();
                Object.assign(this.oldExamForm, this.modifyForm);
                this.modifyDialogFormVisible = true;
            });
        },
        /* 与之前的考试信息对比，找到修改部分，进行修改 */
        modifyExam() {
            let data = {};
            data.id = this.modifiedID;
            if (this.modifyForm.name != this.oldExamForm.name)
                data.name = this.modifyForm.name;
            if (this.modifyForm.description != this.oldExamForm.description)
                data.description = this.modifyForm.description;
            data.std_answer = [];
            let std_ans = this.modifyForm.std_answer.split(',');
            let old_std_ans = this.oldExamForm.std_answer.split(',');
            for (let i = 0; i < std_ans.length; ++i) {
                if (std_ans[i] != old_std_ans) {
                    let obj = {
                        problem_no: i + 1,
                        problem_score: parseInt(std_ans[i][1]),
                        content: std_ans[i][0]
                    };
                    data.std_answer.push(obj);
                }
            }
            this.$http.post('/exam/modify', data).then(res => {
                if (res.data.result == 'Succeeded') {
                    this.modifyDialogFormVisible = false;
                    this.$message.info('修改成功!');
                    this.getAllExams();
                }
            });
        },
        /* 打开删除确认对话框，并将正在删除的考试id保存 */
        confirmDelete(id) {
            this.deleteDialogVisible = true;
            this.deleteExamID = id;
        },
        /* 删除一个考试 */
        deleteExam(id) {
            let data = {
                examID: this.deleteExamID
            };
            this.$http.post('exam/delete', data).then(res => {
                this.$message('删除成功!');
                this.deleteDialogVisible = false;
                this.getAllExams();
            })
        },
        /* 加入到一场考试中 */
        plusExam() {
            let data = {
                id: parseInt(this.plusForm.id)
            };
            this.$http.post('exam/get-exam-info', data).then(res => {
                if (res.result === 'Failed') {
                    this.$message.error('考试不存在!'); 
                } else {
                    this.$message('加入成功!');
                }
                this.plusDialogVisible = false;
            })        
        },
        getTableData() {
            let data = {
                    examID: parseInt(this.detailID),
                    book: parseInt(this.detailBook)
                };
                let isFirst = true;
                this.$http.post('exam/get-book-answer', data).then(res => {
                    this.tableData = []; 
                    this.ansIndex = [];
                    for (let key in res.data) {
                        let tmp = {};
                        tmp.paper = key;
                        if (isFirst) {
                            for (let i = 0; i < res.data[key].length; ++i) {
                                this.ansIndex.push((i + 1) + '');
                            }
                            isFirst = false;
                        }
                        for (let i = 0; i < res.data[key].length; ++i) {
                            tmp[i + 1] = res.data[key][i];
                        }
                        this.tableData.push(tmp);
                    }
            });
        },
        getChartData() {
            let data = {
                examID: parseInt(this.statisticsID)
            };
            this.$http.post('exam/get-total-answer', data).then(res => {
                let tmpData = {
                    'A': 0,
                    'B': 0,
                    'C': 0,
                    'D': 0
                };
                Object.assign(tmpData, res.data[this.problem_no]);
                this.chartData ={
                    columns: ['选项', '数量'],
                    rows: [
                        {'选项': 'A', '数量': tmpData['A']},
                        {'选项': 'B', '数量': tmpData['B']},
                        {'选项': 'C', '数量': tmpData['C']},
                        {'选项': 'D', '数量': tmpData['D']},
                    ]
                };
            })
        }
    },
    watch: {
        detailBook(val) {
            this.getTableDataDe();
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
.exam-name {
    font-size: 26px;
    font-weight: bolder;
}
.empty {
    font-size: 2rem;
    margin: 20px 20px;
    color: grey;
}
.operater {
    padding: 0;
    margin: 0;
    width: 100%;
    position: fixed;
    bottom: 20px;
}
</style>