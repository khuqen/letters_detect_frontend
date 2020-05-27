<!--
 * @Description: Camera组件，在该组件下进行主要的识别工作
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2020-04-06 11:17:06
 -->

<template>
  <div>
    <ElRow type="flex" justify="space-around">
      <ElCol :span="12">
        <div id="MainCanvas"></div>
      </ElCol>
      <ElCol :span="12">
        <ElRow type="flex" justify="start">
          <ElCol :span="12">
            <p class="text">第
              <el-input-number v-model="bookNo" :min="1"></el-input-number>
              本</p>
          </ElCol>
          <ElCol :span="12">
            <p class="text">第
              <el-input-number v-model="paperNo" :min="1"></el-input-number>
              张</p>
          </ElCol>
        </ElRow>
        <ElRow type="flex" justify="start">
          <ElCol :span="8">
            <p class="text">分数: 
              <span class="num">{{ this.score }}</span>
            </p>
          </ElCol>
          <ElCol :span="8">
            <p class="text">数量: 
              <span class="num">{{ this.ansNum }} / {{ this.trueAns.length }}</span>
            </p>
          </ElCol>
        </ElRow>
        <ElRow type="flex" justify="center">
          <ElCol>
            <el-table
              :data="lessScoreAns"
              height="400">
              <el-table-column
                prop="no"
                label="题号">
              </el-table-column>
              <el-table-column
                prop="class"
                label="结果">
              </el-table-column>
              <el-table-column
                prop="score"
                label="置信率"
                width="100">
              </el-table-column>
              <el-table-column
                label="确认">
                <template slot-scope="scope">
                  <el-button @click="confirm(scope.row)" size="small" type="text">确定</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="修改"
                width="320">
                <template slot-scope="scope">
                  <ElRow :gutter="10" type="flex" justify="start">
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'A')" type="text">A</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'B')" type="text">B</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'C')" type="text">C</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'D')" type="text">D</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'X')" type="text">X</ElButton>
                    </ElCol>                    
                  </ElRow>
                </template>
              </el-table-column>
            </el-table>
          </ElCol>
        </ElRow>
        <ElRow type="flex" justify="start">
          <ElCol :span="4">
            <ElButton type="primary" @click="incScale">放大</ElButton>
          </ElCol>
          <ElCol :span="4">
            <ElButton type="primary" @click="decScale">缩小</ElButton>
          </ElCol>
          <ElCol :span="4" :offset="4">
            <ElButton type="primary" @click="detection">检测</ElButton>
          </ElCol>
          <ElCol :span="4">
            <ElButton type="primary" @click="next">继续</ElButton>
          </ElCol>
        </ElRow>
        <ElRow type="flex" justify="start">
          <ElCol :span="3">
            <ElButton type="primary" @click="setAddClass('A')">+A</ElButton>
          </ElCol>
          <ElCol :span="3">
            <ElButton type="primary" @click="setAddClass('B')">+B</ElButton>
          </ElCol>
          <ElCol :span="3">
            <ElButton type="primary" @click="setAddClass('C')">+C</ElButton>
          </ElCol>
          <ElCol :span="3">
            <ElButton type="primary" @click="setAddClass('D')">+D</ElButton>
          </ElCol>
          <ElCol :span="3">
            <ElButton type="primary" @click="setAddClass('O')">+O</ElButton>
          </ElCol>
          <ElCol :span="4" :offset="2">
            <ElButton type="primary" @click="addConfirm()">确定</ElButton>
          </ElCol>
          <ElCol :span="4">
            <ElButton type="primary" @click="addCancel()">取消</ElButton>
          </ElCol>
        </ElRow>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
let sketch;
export default {
  name: 'Camera',
  data() {
    return {
      ans: [],  // 识别答案
      trueAns: [],  //真实答案]
      trueScore: [],
      addClass: '',  //当前正在增加的识别框内字母的类别
      bookNo: 1,
      paperNo: 1
    }
  },
  computed: {
    /**
     * @description: 计算属性，返回低置信率的字母集合
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    lessScoreAns() {
      let items = [];
      for (let letter of this.ans) {
        if (letter.score < 85) {
          items.push(letter);
        }
      }
      return items;
    },
    ansNum() {
      return this.ans.length;
    },
    score() {
      let _score = 0;
      for (let i = 0; i < this.ans.length; i++) {
        if(this.ans[i].class == this.trueAns[i]) {
          _score = _score + this.trueScore[i];
        }
      }
      return _score;
    }
  },
  
  created() {
    let _this = this;
    let data = {id: parseInt(this.$route.query.examID)};
    // window.console.log('data', data);
    this.$http.post('exam/get-exam-info', data).then(res => {
      this.trueAns = res.data.std_answer.map(item => item[0]);
      sketch.setTrueAns(this.trueAns);  // 传递真实答案
      this.trueScore = res.data.std_answer.map(item => parseInt(item[1]));
    });
    document.onkeydown = function(e) {
      let key = window.event.keyCode;
      if (key == 49) {  // 1
        _this.setAddClass('A');
      } else if (key == 50) { // 2
        _this.setAddClass('B');
      } else if (key == 51) { // 3
        _this.setAddClass('C');
      } else if (key == 52) { // 4
        _this.setAddClass('D');
      } else if (key == 53) { // 5
        _this.setAddClass('O'); // 空白
      } else if (key == 32) { // Space
        e.preventDefault();
        _this.addConfirm();
      } else if (key == 27) { // Esc
        _this.addCancel();
      } else if (key == 13) { // Enter
        _this.detection();
      } else if (key == 78) {  // n
        _this.next();
      } else if (key == 38) {  // Up
        _this.incScale();
      } else if (key == 40) { // Down
        _this.decScale();
      }
    };
  },
  mounted() {
    sketch = require('../js/sketch.js');
    const P5 = require('p5');
    new P5(sketch.main);
    sketch.setGetImgData(this.getImgData); // 将本地的getImgData传到sketch中

    this.bookNo = localStorage.getItem("bookNo");
    this.paperNo = localStorage.getItem("paperNo");
  },

  methods: {
    /**
     * @description: 放大
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    incScale() {
      sketch.incScale();
    },
    /**
     * @description: 缩小
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    decScale() {
      sketch.decScale();
    },
    /**
     * @description: 获得图片base64编码，发往后端，得到识别结果
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    getImgData(imgData) {
      let data = {
        "imageData": imgData,
        "bookNo": this.bookNo,
        "paperNo": this.paperNo,
        "letterNum": this.trueAns.length
      };
      this.$http.post('paper/upload/img', data)
        .then(res => {
          this.ans = [];
          for (let letter of res.data.letters) {
            this.ans.push(letter);
          }
          this.drawAns(this.ans);
          if (this.lessScoreAns.length == 0) {
            this.drawScore();
          }
          /* 识别数量不够或者超出，提醒用户 */
          if (this.ans.length !== this.trueAns.length) {
            // alert('识别不完整！！！');
            this.$message({
              message: '注意! 识别数量与预期不符合',
              type: 'warning',
              duration: 1500
            });
          }
      })
    },
    sendResult() {
      let writingAns = this.ans.map(letter => letter.class);
      let data = {
        "examID": parseInt(this.$route.query.examID),
        "book": this.bookNo,
        "page": this.paperNo,
        "answer": writingAns
      };
      this.$http.post('paper/upload/answer', data)
        .then(res => {
          window.console.log(res.data);
          localStorage.setItem("bookNo", this.bookNo);
          localStorage.setItem("paperNo", this.paperNo);
      });
      window.console.log(data);
    },
    /**
     * @description: 检测
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    detection() {
      sketch.clear();
      sketch.saveImg();
    },
    /**
     * @description: 绘制答案
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    drawAns(letters) {
        sketch.drawAns(letters);
    },
    /**
     * @description: 继续，清空画布上的颜色
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    next() {
      this.sendResult();
      sketch.clear();
      this.ans = [];
      this.paperNo ++;
    },
    /**
     * @description: 对低置信率的字母进行确认
     * @param {row} 表格中的一行信息的对象
     * @return: 
     * @author: khuqen
     */
    confirm(row) {
      let idx = row.no - 1;
      this.ans[idx].score = 99;
      if (this.lessScoreAns.length == 0) {
        this.drawScore();
      }
    },
    /**
     * @description: 对低置信率的识别结果改为其他的结果
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    modify(row, correctAns) {
      let idx = row.no - 1;
      if (correctAns == 'X') {
          for (let i = idx + 1; i < this.ans.length; i++) {
            this.ans[i].no -= 1;
          }
          this.ans.splice(idx, 1);
      } else {
        this.ans[idx].score = 99;
        this.ans[idx].class = correctAns;
      }
      if (this.lessScoreAns.length == 0) {
        this.drawScore();
      }
    },
    /**
     * @description: 计算分数并绘制
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    drawScore() {
      sketch.drawScore(this.score);
    },
    /**
     * @description: 进入增加识别框过程并设置当前增加字母的类别
     * @param {cls} 当前正在增加字母的类别
     * @return: 
     * @author: khuqen
     */
    setAddClass(cls) {
      sketch.setAddingState();
      this.addClass = cls;
    },
    /**
     * @description: 对增加的识别框确认
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    addConfirm() {
      let box = sketch.getBox();
      if (box[0] != 0) {
        this.addAns(box);
        sketch.cancelAddingState();
        this.drawScore();
      }
    },
    /**
     * @description: 取消当前增加的识别框
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    addCancel() {
      sketch.cancelAddingState();
    },
    /**
     * @description: 增加一个答案
     * @param {box} 识别框的4个坐标
     * @return: 
     * @author: khuqen
     */
    addAns(box) {
      let letter = {}
      letter.score = 99;
      letter.class = this.addClass;
      letter.box = box;
      letter.no = -1;
      this.ans.push(letter);
      let tAns = this.ans.slice();
      this.ans.splice(0, tAns.length);
      /* 按行排序 */
      tAns.sort(function(a, b) {
        let v1 = a.box[0] + a.box[1] * 2000;
        let v2 = b.box[0] + b.box[1] * 2000;
        return v1 - v2;
      });
      /* 按列排序，当行差不超过一个字母的高度时认为是同一行 */
      // window.console.log(tAns);
      let i = 0;
      let j = 0;
      while (i < tAns.length) {
        while ((j < tAns.length) && ((tAns[j].box[1] - tAns[i].box[1]) <= (tAns[i].box[3] - tAns[i].box[1]))) {
          j++;
        }
        let tmp = tAns.slice(i, j);
        tmp.sort(function(a, b) {
          return a.box[0] - b.box[0];
        });
        for (let l of tmp) {
          this.ans.push(l);
        }
        i = j;
      }
      /* 重新分配题号 */
      for (let k = 0 ; k < this.ans.length; k++) {
        this.ans[k].no = k + 1;
      }
    }
  }
}
</script>

<style>
.el-row {
  margin-bottom: 5px;
}
.el-button {
  font-size: 25px;
}
.el-table {
  font-size: 1.5em;
}
.text {
  font-size: 1.4em;
  color: #909399;
}
.num {
  font-size: 1.6em;
  color: #67C23A;
}
</style>