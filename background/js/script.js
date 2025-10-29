const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gamespeed = 4;
//let gameFrame= 0;

const backgroundlayer1 = new Image();
backgroundlayer1.src = '../images/layer-1.png';
const backgroundlayer2 = new Image();
backgroundlayer2.src = '../images/layer-2.png';
const backgroundlayer3 = new Image();
backgroundlayer3.src = '../images/layer-3.png';
const backgroundlayer4 = new Image();
backgroundlayer4.src = '../images/layer-4.png';
const backgroundlayer5 = new Image();
backgroundlayer5.src = '../images/layer-5.png';

window.addEventListener('load', function(){
    const slider = document.getElementById('slider');
    const showGameSpeed = document.getElementById('showGameSpeed');
    if (slider) {
        slider.value = gamespeed;
        slider.addEventListener('input', function (e){
            gamespeed = Number(e.target.value);
            if (showGameSpeed) showGameSpeed.innerHTML = gamespeed;
        });
    }
    if (showGameSpeed) showGameSpeed.innerHTML = gamespeed;

});

class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gamespeed * this.speedModifier;
    }
    update() {
        this.speed = gamespeed * this.speedModifier;
        if (this.x <= -this.width){
            this.x = 0;
        }
        this.x = this.x - this.speed;
        //this.x = gameFrame * this.speed % this.width;
    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}

const layer1 = new Layer(backgroundlayer1, 0.2);
const layer2 = new Layer(backgroundlayer2, 0.4);
const layer3 = new Layer(backgroundlayer3, 0.6);
const layer4 = new Layer(backgroundlayer4, 0.8);
const layer5 = new Layer(backgroundlayer5, 1);

const gameObjects = [layer1, layer2, layer3, layer4, layer5];

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    gameObjects.forEach(object => {
        object.update();
        object.draw();
    });
    //gameFrame--;
    requestAnimationFrame(animate);
};
animate();
