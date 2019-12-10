let p5;
let capture;


let getImgData;
let hasAns = false;
let letters = [];
let trueAns = [];


let score;
let hasScore = false;
let isAdding = false;

let firstPressed = true;

/* config  */
let scale = 1.0;
let canvasWidth = 800;
let canvasHeight = 920;
let resolutionWidth = 2592;
let resolutionHeight = 1944;
let scaleCnt = 4;


let addMinX = 0;
let addMinY = 0;
let addMaxX = 0;
let addMaxY = 0;

export function main(_p5) {
    p5 = _p5;
    p5.setup = () => {      
        let canvas = p5.createCanvas(canvasWidth, canvasHeight);
        canvas.parent("MainCanvas");
        p5.background(180);
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
        /* 输出分数 */
        if (hasScore) {
            p5.fill(0, 0, 255);
            p5.textSize(35);
            p5.textStyle(p5.BOLD);
            p5.text(score.toString(), canvasWidth * 0.9, canvasHeight * 0.1);
        }

        if (isAdding) {
            p5.noFill();
            p5.strokeWeight(3);
            p5.stroke(255, 255, 255);
            p5.rect(addMinX, addMinY, addMaxX - addMinX, addMaxY - addMinY);
        }
    }

    p5.mousePressed = () => {
        if (p5.mouseX > canvasWidth || p5.mouseY > canvasHeight)
            return false;
        if (firstPressed) {
            addMinX = p5.mouseX;
            addMinY = p5.mouseY;
            firstPressed = false;
        }
        return false;
    }

    p5.mouseDragged = () => {
        if (p5.mouseX > canvasWidth || p5.mouseY > canvasHeight)
            return false;
        addMaxX = p5.mouseX;
        addMaxY = p5.mouseY;
    }

    p5.mouseReleased = () => {
        if (p5.mouseX > canvasWidth || p5.mouseY > canvasHeight)
            return false;
        firstPressed = true;
    }
}


export function incScale() {
    scale -= 0.1;
    scaleCnt = scaleCnt + 1;
}

export function changeAddingState() {
    isAdding = !isAdding;
}

export function decScale() {
    if (scaleCnt > 0) {
        scale += 0.1;
        scaleCnt = scaleCnt - 1;
    }
}

export function setGetImgData(_getImgData) {
    getImgData = _getImgData;
}


export function saveImg() {
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
}

export function setTrueAns(_trueAns) {
    trueAns = _trueAns;
}

export function drawScore(_score) {
    hasScore = true;
    score = _score;
}

export function getBox() {
   return [addMinX, addMinY, addMaxX, addMaxY]; 
}