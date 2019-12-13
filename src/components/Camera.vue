<!--
 * @Description: Camera组件，在该组件下进行主要的识别工作
 * @Autor: khuqen
 * @Date: 2019-10-31 11:10:56
 * @LastEditors: khuqen
 * @LastEditTime: 2019-12-13 18:02:41
 -->

<template>
  <div>
    <ElRow>
      <ElCol :span="12">
        <div id="MainCanvas"></div>
      </ElCol>
      <ElCol :span="12">
        <ElRow>
          <ElCol :span="24">
            <el-table
              :data="lessScoreAns"
              height="600"
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
                  <ElRow :gutter="10">
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'A')">A</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'B')">B</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'C')">C</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'D')">D</ElButton>
                    </ElCol>
                    <ElCol :span="4">
                      <ElButton @click="modify(scope.row, 'X')">X</ElButton>
                    </ElCol>                    
                  </ElRow>
                </template>
              </el-table-column>
            </el-table>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="2">
            <ElButton type="primary" @click="incScale">放大</ElButton>
          </ElCol>
          <ElCol :span="2">
            <ElButton type="primary" @click="decScale">缩小</ElButton>
          </ElCol>
          <ElCol :span="2" :offset="6">
            <ElButton type="primary" @click="detection">检测</ElButton>
          </ElCol>
          <ElCol :span="2">
            <ElButton type="primary" @click="next">继续</ElButton>
          </ElCol>
        </ElRow>
        <ElRow>
          <ElCol :span="2">
            <ElButton type="primary" @click="setAddClass('A')">+A</ElButton>
          </ElCol>
          <ElCol :span="2">
            <ElButton type="primary" @click="setAddClass('B')">+B</ElButton>
          </ElCol>
          <ElCol :span="2">
            <ElButton type="primary" @click="setAddClass('C')">+C</ElButton>
          </ElCol>
          <ElCol :span="2">
            <ElButton type="primary" @click="setAddClass('D')">+D</ElButton>
          </ElCol>
          <ElCol :span="2" :offset="2">
            <ElButton type="primary" @click="addConfirm()">确定</ElButton>
          </ElCol>
          <ElCol :span="2">
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
      trueAns: [  //真实答案
        'A', 'A', 'A', 'A', 'A',
        'A', 'A', 'A', 'A', 'A',
        'B', 'B', 'B', 'B', 'B',
        'B', 'B', 'B', 'B', 'B',
        'C', 'C', 'C', 'C', 'C',
        'C', 'C', 'C', 'C', 'C',
        'D', 'D', 'D', 'D', 'D',
        'D', 'D', 'D', 'D', 'D'
      ],
      addClass: ''  //当前正在增加的识别框内字母的类别
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
        if (letter.score < 80) {
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
    sketch.setGetImgData(this.getImgData); // 将本地的getImgData传到sketch中
    sketch.setTrueAns(this.trueAns);  // 传递真实答案
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
          /* 识别数量不够或者超出，警告用户 */
          if (res.data.valid == false) {
            alert('识别不完整！！！');
          }
      })
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
      sketch.clear();
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
      let len = this.ans.length;
      let score = 0;
      for (let i = 0; i < len; i++) {
        if(this.ans[i].class == this.trueAns[i]) {
          score++;
        }
      }
      sketch.drawScore(score * 2);
    },
    /**
     * @description: 进入增加识别框过程并设置当前增加字母的类别
     * @param {cls} 当前正在增加字母的类别
     * @return: 
     * @author: khuqen
     */
    setAddClass(cls) {
      sketch.changeAddingState();
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
      this.addAns(box);
      sketch.changeAddingState();
    },
    /**
     * @description: 取消当前增加的识别框
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    addCancel() {
      sketch.changeAddingState();
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
      let i = 0;
      let j = 0;
      while (i < tAns.length) {
        while ((j < tAns.length) && ((tAns[j].box[1] - tAns[i].box[1]) <= (tAns[i].box[3] - tAns[i].box[1]))) {
          j++;
        }
        let tmp = tAns.slice(i, j);
        window.console.log('tmp', tmp);
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
  margin-bottom: 20px;
}
.el-button {
  font-size: 25px;
}
.el-table {
  font-size: 1.5em;
}

</style>