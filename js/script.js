const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;
let gamespeed = 5;

const backgroundlayer1 = new Image();
backgroundlayer1.src = 'layer-1.png';
const backgroundlayer2 = new Image();
backgroundlayer2.src = 'layer-2.png';
const backgroundlayer3 = new Image();
backgroundlayer3.src = 'layer-3.png';
const backgroundlayer4 = new Image();
backgroundlayer4.src = 'layer-4.png';
const backgroundlayer5 = new Image();
backgroundlayer5.src = 'layer-5.png';

function animate(){
    ctx.drawImage(backgroundlayer4, 0, 0);
    requestAnimationFrame(animate);
};
animate();

