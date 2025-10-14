const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
const explosion = [];
let canvasPosition = canvas.getBoundingClientRect();

class Explosion{
    constructor(x, y){
    this.spritewidth = 200;
    this.spriteheight = 179;
    this.width = this.spritewidth*0.7;
    this.height = this.spriteheight*0.7;
    this.x = x - this.width/2;
    this.y = y - this.height/2;
    this.image = new Image();
    this.image.src = 'boom.png';
    this.frame = 0;
    this.timer = 0;
}
    update(){
        this.timer++;
        if (this.timer % 10 === 0){
            this.frame++;
        }
    }
    draw(){
        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        ctx.drawImage(this.image, this.spritewidth * this.frame, 0,
        this.spritewidth, this.spriteheight, this.x, this.y, this.width, this.height); 
        ctx.restore();
    }
}
window.addEventListener('click', function(e){
    createAnimation(e);
});
function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosion.push(new Explosion(positionX, positionY));
}
function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height);
    for (let i = 0; i < explosion.length; i++){
        explosion[i].update();
        explosion[i].draw();}
        requestAnimationFrame(animate);
        if (explosion[i].frame > 5){
            explosion.splice(i, 1);
         i--;
        }
};

animate();