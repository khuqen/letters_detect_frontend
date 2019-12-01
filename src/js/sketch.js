let p5;
let secP5;
let capture;

let scale = 1;
let getImgData;
let hasAns = false;
let letters = [];
export function main(_p5) {
    p5 = _p5;
    p5.setup = () => {      
        let canvas = p5.createCanvas(960, 540);
        canvas.parent("MainCanvas");
        let constraints = {
          video: {
            mandatory: {
              minWidth: 1920,
              minHeight: 1080
            },
            optional: [{ maxFrameRate: 25 }]
          },
          audio: false
        };
        capture = p5.createCapture(constraints);
        capture.hide();
    }     

    p5.draw = () => {      
        let c = capture.get(480 , 270, 480 + 960, 270 + 540);
        p5.image(c, 0, 0, 960 * scale, 540 * scale);
        if (hasAns) {
            p5.noFill();
            p5.stroke(0, 255, 0);
            p5.strokeWeight(3);
            secP5.noFill();
            secP5.stroke(0, 255, 0);
            secP5.strokeWeight(3);
            for (let letter of letters) {
                p5.rect(letter.box[0], letter.box[1], letter.box[2] - letter.box[0], letter.box[3] - letter.box[1])
                secP5.rect(letter.box[0], letter.box[1], letter.box[2] - letter.box[0], letter.box[3] - letter.box[1])
            }
        }
    }
}

export function second(_p5) {
    secP5 = _p5;
    secP5.setup = () => {      
        let canvas = secP5 .createCanvas(960, 540);
        canvas.parent("SecCanvas");
        secP5.noLoop();
    }

    secP5.draw = () => {      
        secP5.background(230);
    }
}

export function incScale() {
    scale += 0.1;
}

export function decScale() {
    if (scale > 1)
        scale -= 0.1;
}

export function setGetImgData(_getImgData) {
    getImgData = _getImgData;
}

export function saveImg() {
    let c = capture.get(480 , 270, 480 + 960, 270 + 540);
    secP5.image(c, 0, 0, 960 * scale, 540 * scale);
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
    secP5.redraw();
    secP5.noLoop();
}

export function drawSec() {
}







/* second canvas */