// => collisionAnimation.js

export class collisionAnimation {
    constructor(game , x , y) {
        this.game = game;
        this.image = document.getElementById('collisionAnimation')
        this.spriteWidth = 100;
        this.spriteHeight = 90
        this.sizeModifier = Math.random() + .5;
        this.width = this.spriteWidth * this.sizeModifier
        this.height = this.spriteHeight * this.sizeModifier;
        this.x = x - this.width * .5
        this.y = y - this.height * .5
        this.frameX = 0;
        this.maxFrame = 4;
        this.markedForDeletion = false;
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000/this.fps
        
    }

    draw(context) {
        context.drawImage(this.image , this.frameX * this.spriteWidth , 0 , this.spriteWidth , this.spriteHeight , this.x , this.y , this.width , this.height)
    }

    update(detlaTime) {
        this.x -= this.game.speed;

        if(this.frameTimer > this.frameInterval) {
            this.frameX++
            this.frameTimer = 0;
        } else {
            this.frameTimer += detlaTime
        }
        if (this.frameX > this.maxFrame) this.markedForDeletion = true
    }
}