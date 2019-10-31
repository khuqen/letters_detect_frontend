<template>
  <div>
    <video autoplay width="600" height="400"></video>
    <el-button id="getUserMediaButton" @click="onGetUserMediaButtonClick()">get user media</el-button>
    <canvas id="grabFrameCanvas" width="600" height="400"></canvas>
    <el-button id="grabFrameButton" @click="onGrabFrameButtonClick()">grab frame</el-button>
  </div>
</template>

<script>
export default {
  name: 'Camera',
  data() {
    return {
      imageCapture: {}
    }
  },
  created() {
    // document.querySelector('video').addEventListener('play', function() {
    //   document.querySelector('#grabFrameButton').disabled = false;
    // });
  },
  methods: {
      onGetUserMediaButtonClick() {
        navigator.mediaDevices.getUserMedia({video: true}).then(mediaStream => {
          document.querySelector('video').srcObject = mediaStream;
          const track = mediaStream.getVideoTracks()[0];
          this.imageCapture = new ImageCapture(track);
          })
      },
      onGrabFrameButtonClick() {
        this.imageCapture.grabFrame()
        .then(imageBitmap => {
          const canvas = document.querySelector('#grabFrameCanvas');
          this.drawCanvas(canvas, imageBitmap);
        })
      },
      drawCanvas(canvas, img) {
        canvas.width = getComputedStyle(canvas).width.split('px')[0];
        canvas.height = getComputedStyle(canvas).height.split('px')[0];
        let ratio  = Math.min(canvas.width / img.width, canvas.height / img.height);
        let x = (canvas.width - img.width * ratio) / 2;
        let y = (canvas.height - img.height * ratio) / 2;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height,
            x, y, img.width * ratio, img.height * ratio);
      }
  }
}
</script>

<style>

</style>