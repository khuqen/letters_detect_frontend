let p5;
let secP5;
let capture;


let getImgData;
let hasAns = false;
let letters = [];
let trueAns = [];

let score;
let hasScore = false;

/* config  */
let scale = 1.2;
let canvasWidth = 600;
let canvasHeight = 900;
let resolutionWidth = 2592;
let resolutionHeight = 1944;
let scaleCnt = 4;

export function main(_p5) {
    p5 = _p5;
    p5.setup = () => {      
        let canvas = p5.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("MainCanvas");
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
        capture.hide();
    }     

    p5.draw = () => {
        let width = canvasWidth * scale;
        let height = canvasHeight * scale;
        let minx = (resolutionWidth - width) / 2;
        let miny = (resolutionHeight - height) / 2;
        p5.image(capture, 0, 0, canvasWidth, canvasHeight, minx, miny, width, height);
        if (hasAns) {
            p5.noFill();
            secP5.noFill();
            for (let [index, letter] of new Map(letters.map(( item, i ) => [i, item]))) {
                p5.stroke(0, 255, 0);
                p5.strokeWeight(1);
                secP5.stroke(0, 255, 0);
                secP5.strokeWeight(1);

                /* 答案错误 */
                if (letter.class != trueAns[index]) {
                    p5.stroke(255, 0, 0);
                    secP5.stroke(255, 0, 0);
                    p5.strokeWeight(3);
                    secP5.strokeWeight(3);
                }
                
                /* 置信率低 */
                if (letter.score < 85) {
                    p5.stroke(255, 255, 0);
                    secP5.stroke(255, 255, 0);
                    p5.strokeWeight(3);
                    secP5.strokeWeight(3);
                }
                p5.rect(letter.box[0], letter.box[1], letter.box[2] - letter.box[0], letter.box[3] - letter.box[1])
                secP5.rect(letter.box[0], letter.box[1], letter.box[2] - letter.box[0], letter.box[3] - letter.box[1])
            }
        }
        /* 输出分数 */
        if (hasScore) {
            p5.fill(0, 0, 255);
            p5.textSize(35);
            p5.textStyle(p5.BOLD);
            p5.text(score.toString(), canvasWidth * 0.9, canvasHeight * 0.1);
            secP5.fill(0, 0, 255);
            secP5.textStyle(secP5.BOLD);
            secP5.textSize(35);
            secP5.text(score.toString(), canvasWidth * 0.9, canvasHeight * 0.1);
        }
    }
}

export function second(_p5) {
    secP5 = _p5;
    secP5.setup = () => {      
        let canvas = secP5.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("SecCanvas");
        secP5.noLoop();
    }

    secP5.draw = () => {      
        secP5.background(230);
    }
}

export function incScale() {
    scale -= 0.2;
    scaleCnt = scaleCnt + 1;
}

export function decScale() {
    if (scaleCnt > 0) {
        scale += 0.2;
        scaleCnt = scaleCnt - 1;
    }
}

export function setGetImgData(_getImgData) {
    getImgData = _getImgData;
}

export function saveImg() {
    let width = canvasWidth * scale;
    let height = canvasHeight * scale;
    let minx = (resolutionWidth - width) / 2;
    let miny = (resolutionHeight - height) / 2;
    secP5.image(capture, 0, 0, canvasWidth, canvasHeight, minx, miny, width, height);
    p5.saveFrames('out', 'jpg', 1, 1, data => {
       getImgData(data[0].imageData);
    });
}

export function drawAns(_letters) {
    letters = _letters;
    hasAns = true;
}

export function clear() {
    hasAns = false;
    hasScore = false;
    secP5.redraw();
    secP5.noLoop();
}

export function drawSec() {
}

export function setTrueAns(_trueAns) {
    trueAns = _trueAns;
}

export function drawScore(_score) {
    hasScore = true;
    score = _score;
}

export function updateSecP5() {
    secP5.redraw();
    secP5.noLoop();
    let width = canvasWidth * scale;
    let height = canvasHeight * scale;
    let minx = (resolutionWidth - width) / 2;
    let miny = (resolutionHeight - height) / 2;
    secP5.image(capture, 0, 0, canvasWidth, canvasHeight, minx, miny, width, height);
}


/* second canvas */