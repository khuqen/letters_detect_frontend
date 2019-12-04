<template>
  <div>
    <ElRow>
      <ElCol :span="8">
        <div id="SecCanvas"></div>
      </ElCol>
      <ElCol :span="8">
        <div id="MainCanvas"></div>
      </ElCol>
      <ElCol :span="8">
        <el-table
          :data="lessScoreAns"
          height="500"
          style="width: 100%">
          <el-table-column
            prop="no"
            label="题号"
            width="80">
          </el-table-column>
          <el-table-column
            prop="class"
            label="识别结果"
            width="120">
          </el-table-column>
          <el-table-column
            prop="score"
            label="置信率"
            width="120">
          </el-table-column>
          <el-table-column
            label="确认"
            width="120">
            <template slot-scope="scope">
              <el-button @click="confirm(scope.row)" size="small">确定</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="修改"
            width="320">
            <template slot-scope="scope">
              <ElRow :gutter="20">
                <ElCol :span="12">
                  <el-input width="100" v-model="inputAns" placeholder="请输入正确结果"></el-input>
                </ElCol>
                <ElCol :span="4">
                  <el-button @click="modify(scope.row, inputAns)" size="small">修改</el-button>
                </ElCol>
              </ElRow>
            </template>
          </el-table-column>
        </el-table>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="1" :offset="8">
        <ElButton type="primary" @click="incScale">放大</ElButton>
      </ElCol>
      <ElCol :span="1">
        <ElButton type="primary" @click="decScale">缩小</ElButton>
      </ElCol>
      <ElCol :span="1" :offset="2">
        <ElButton type="primary" @click="detection">检测</ElButton>
      </ElCol>
      <ElCol :span="1">
        <ElButton type="primary" @click="next">继续</ElButton>
      </ElCol>
    </ElRow>
    <el-divider></el-divider>
  </div>
</template>

<script>
let sketch;
export default {
  name: 'Camera',
  data() {
    return {
      ans: [],
      trueAns: [
        'A', 'B', 'C', 'D', 'B',
        'B', 'C', 'C', 'A', 'C',
        'B', 'C', 'C', 'B', 'D',
        'A', 'D', 'B', 'C', 'A',
        'B', 'D', 'B', 'C', 'D',
        'D', 'B', 'C', 'C', 'A',
        'D', 'B', 'C', 'D', 'A',
        'B', 'C', 'B', 'D', 'B'
      ],
      inputAns: ''
    }
  },
  created() {
  },
  computed: {
    lessScoreAns() {
      let items = [];
      for (let letter of this.ans) {
        if (letter.score < 85) {
          items.push(letter);
        }
      }
      return items;
    }
  },
  mounted() {
    sketch = require('../js/sketch.js')
    const P5 = require('p5')
    new P5(sketch.main)
    sketch.setGetImgData(this.getImgData);
    sketch.setTrueAns(this.trueAns);
    new P5(sketch.second)
  },
  methods: {
    incScale() {
      sketch.incScale();
    },
    decScale() {
      sketch.decScale();
    },
    getImgData(imgData) {
      let data = {
        "imageData": imgData
      };
      this.$http.post('/upload/img', data)
        .then( res => {
          // window.console.log('res=>', res);
          this.ans = [];
          for (let letter of res.data.letters) {
            this.ans.push(letter);
          }
          this.drawAns(this.ans);
          if (this.lessScoreAns.length == 0) {
            this.drawScore();
          }
          if (res.data.valid == false) {
            alert('识别不完整！！！');
          }
      })
    },
    detection() {
      sketch.clear();
      sketch.saveImg();
    },
    drawAns(letters) {
        sketch.drawAns(letters);
    },
    next() {
      sketch.clear();
      this.inputAns = '';
    },
    confirm(row) {
      let idx = row.no;
      this.ans[idx - 1].score = 99;
      sketch.updateSecP5();
      if (this.lessScoreAns.length == 0) {
        this.drawScore();
      }
    },
    modify(row, correctAns) {
      let idx = row.no;
      this.ans[idx - 1].score = 99;
      this.ans[idx - 1].class = correctAns;
      this.inputAns = '';
      sketch.updateSecP5();
      if (this.lessScoreAns.length == 0) {
        this.drawScore();
      }
    },
    drawScore() {
      let len = this.ans.length;
      let score = 0;
      for (let i = 0; i < len; i++) {
        if(this.ans[i].class == this.trueAns[i]) {
          score++;
        }
      }
      sketch.drawScore(score);
    }
  }
}
</script>

<style>

</style>