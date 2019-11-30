<template>
  <div>
    <ElRow>
      <ElCol :span="12">
        <div id="p5Canvas"></div>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="1">
        <ElButton type="primary" @click="incScale">放大</ElButton>
      </ElCol>
      <ElCol :span="8">
        <ElButton type="primary" @click="decScale">缩小</ElButton>
      </ElCol>
      <ElCol :span="1">
        <ElButton type="primary" @click="detection">检测</ElButton>
      </ElCol>
      <ElCol :span="1">
        <ElButton type="primary" @click="next">继续</ElButton>
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
      ans: null
    }
  },
  created() {
  },
  mounted() {
    sketch = require('../js/sketch.js')
    const P5 = require('p5')
    new P5(sketch.main)
    sketch.setGetImgData(this.getImgData);
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
      // window.console.log(data);
      this.$http.post('/upload', data)
        .then( res => {
          window.console.log('res=>', res);
          if (res.data.valid == false) {
            alert('无法识别');
            this.drawAns(res.data.letters);
          } else {
            this.drawAns(res.data.letters);
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
    }
  }
}
</script>

<style>

</style>