/*
 * @Description: 实现绘图
 * @Autor: khuqen
 * @Date: 2019-11-30 19:15:29
 * @LastEditors: khuqen
 * @LastEditTime: 2019-12-16 14:34:15
 */

let p5; // p5 实例
let capture;   // 摄像头捕获


let getImgData;   // 获得图片数据函数


let letters = [];   //识别出的字母
let trueAns = [];   //真实答案


let score;      // 分数

let hasScore = false;   // 是否绘制分数
let isAdding = false;   // 是否处于添加识别框的状态
let hasAns = false;     // 是否绘制答案
let firstPressed = true;    //鼠标是否第一次被按压

/* config  */
let scale = 1.0;           // 放大规模
let canvasWidth = 800;      // 画布宽度
let canvasHeight = 920;     // 画布高度
let resolutionWidth = 2592;    // 分辨率
let resolutionHeight = 1944;

let scaleCnt = 4;   // 允许缩小的次数


let addMinX = 0;    // 添加识别框的四个坐标
let addMinY = 0;
let addMaxX = 0;
let addMaxY = 0;

/**
 * @description: 配置p5实例
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function main(_p5) {
    p5 = _p5;   // 将传进来的_p5实例指向本地的p5实例
    /**
     * @description: 实现setup函数
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    p5.setup = () => {      
        let canvas = p5.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("MainCanvas"); // 指明画布的父节点
        p5.background(180);
        /* 摄像头参数 */
        let constraints = {
          video: {
            mandatory: {
              minWidth: resolutionWidth,
              minHeight: resolutionHeight
            },
            optional: [{ maxFrameRate: 60 }]
          },
          audio: false
        };
        capture = p5.createCapture(constraints);
        capture.hide(); // 将自动生成的video隐藏
    }     
    /**
     * @description: 实现绘图函数
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    p5.draw = () => {
        /* 截取捕捉图片的中间一部分并进行缩放，实现数码变焦 */
        let width = canvasWidth * scale;
        let height = canvasHeight * scale;
        let minx = (resolutionWidth - width) / 2;
        let miny = (resolutionHeight - height) / 2;
        p5.image(capture, 0, 0, canvasWidth, canvasHeight, minx, miny, width, height);
        
        /* 如果需要绘制答案 */
        if (hasAns) {
            p5.noFill();
            for (let [index, letter] of new Map(letters.map(( item, i ) => [i, item]))) {
                p5.stroke(0, 255, 0);
                p5.strokeWeight(3);

                /* 答案错误 */
                if (letter.class != trueAns[index]) {
                    p5.stroke(255, 0, 0);
                    p5.strokeWeight(3);
                }
                
                /* 置信率低 */
                if (letter.score < 80) {
                    p5.stroke(255, 255, 0);
                    p5.strokeWeight(3);
                }
                p5.rect(letter.box[0], letter.box[1], letter.box[2] - letter.box[0], letter.box[3] - letter.box[1])
            }
        }
        /* 如果需要输出分数 */
        if (hasScore) {
            p5.fill(0, 0, 255);
            p5.textSize(35);
            p5.textStyle(p5.BOLD);
            p5.text(score.toString(), canvasWidth * 0.9, canvasHeight * 0.1);
        }
        /* 如果正在画识别框，绘制矩形识别框 */
        if (isAdding) {
            p5.noFill();
            p5.strokeWeight(3);
            p5.stroke(255, 255, 255);
            p5.rect(addMinX, addMinY, addMaxX - addMinX, addMaxY - addMinY);
        }
    }
    /**
     * @description: 处理鼠标拖拽函数，此处实时更新识别框右下角值
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    p5.mouseDragged = () => {
        if (p5.mouseX > canvasWidth || p5.mouseY > canvasHeight)
            return false;
        /* 记录矩形框左上角的坐标 */
        if (firstPressed) {
            addMinX = p5.mouseX;
            addMinY = p5.mouseY;
            firstPressed = false;
        }
        /* 右下角的坐标 */
        addMaxX = p5.mouseX;
        addMaxY = p5.mouseY;
    }
    /**
     * @description: 鼠标释放处理函数，此处需要重置是否第一次按压
     * @param {type} 
     * @return: 
     * @author: khuqen
     */
    p5.mouseReleased = () => {
        if (p5.mouseX > canvasWidth || p5.mouseY > canvasHeight)
            return false;
        firstPressed = true;
    }
}

/**
 * @description: 放大
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function incScale() {
    scale -= 0.1;
    scaleCnt = scaleCnt + 1;
}
/**
 * @description: 改变是否绘制识别框的状态
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function changeAddingState() {
    isAdding = !isAdding;
}

/**
 * @description: 将绘制识别框的状态置为真
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function setAddingState() {
    isAdding = true;
}
/**
 * @description: 将绘制识别框的状态置为假, 并识别框位置重置
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function cancelAddingState() {
    isAdding = false;
    addMinX = 0;
    addMaxX = 0;
    addMinY = 0;
    addMaxX = 0;
}
/**
 * @description: 缩小
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function decScale() {
    if (scaleCnt > 0) {
        scale += 0.1;
        scaleCnt = scaleCnt - 1;
    }
}
/**
 * @description: 将外部组件的函数赋值给本地的变量，实现调用外部函数
 * @param {_getImgData} vue组件的getImgData函数
 * @return: 
 * @author: khuqen
 */
export function setGetImgData(_getImgData) {
    getImgData = _getImgData;
}

/**
 * @description: 调用p5接口，将图片的base64编码传给后调
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function saveImg() {
    p5.saveFrames('out', 'jpg', 1, 1, data => {
       getImgData(data[0].imageData);
    });
}
/**
 * @description: 开始绘制答案
 * @param {_letters} 传进来的字符对象数组 
 * @return: 
 * @author: khuqen
 */
export function drawAns(_letters) {
    letters = _letters;
    hasAns = true; // 表示需要绘制答案
} 
/**
 * @description: 情况所有的元素
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function clear() {
    hasAns = false;
    hasScore = false;
}
/**
 * @description: 传入真实答案，与识别答案对比
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function setTrueAns(_trueAns) {
    trueAns = _trueAns;
}
/**
 * @description: 开始绘制分数
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function drawScore(_score) {
    hasScore = true;
    score = _score;
}
/**
 * @description: 暴露识别框的坐标
 * @param {type} 
 * @return: 
 * @author: khuqen
 */
export function getBox() {
   return [addMinX, addMinY, addMaxX, addMaxY]; 
}