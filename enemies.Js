// => enemies.js

// parent clas
class Enemy {
    constructor() {
        this.frameX = 0;
        this.frameY = 0;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.markedForDeletion = false;
    }

    // -enu
    update(deltaTime) {
        // mouvement
        this.x -= this.speedX + this.game.speed;
        this.y += this.speedY;
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0
        } else {
            this.frameTimer += deltaTime
        }

        // check if off-screen;
        if(this.x + this.width < 0) this.markedForDeletion = true;

    }
    // -end
    draw(context) {
        context.save()
        context.strokeStyle = 'red'
        if(this.game.debug) context.strokeRect(this.x , this.y , this.width ,this.height)
        context.drawImage(this.image , this.frameX * this.width , 0 , this.width , this.height ,this.x ,this.y , this.width , this.height)
        context.restore()
    }
}


export class FlyingEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game;
        this.width = 60;
        this.height = 44;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * .5;
        this.speedX = Math.random() * 4 + 2;
        this.maxFrame = 5;
        this.image = enemy_fly
        this.speedY = 0
        this.angle = 0;
        this.va = Math.random() * .1 + .1;
    } 

    update(deltaTime) {
        super.update(deltaTime)
        this.angle += this.va;
        this.y += Math.sin(this.angle)
    }
}

export class GroundEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game;
        this.width = 60;
        this.height = 87;
        this.x = this.game.width;
        this.y = this.game.height - this.height - this.game.groundMargin
        this.image = document.getElementById('enemy_plant') 
        this.speedX = 0
        this.speedY = 0
        this.maxFrame = 1
    }
}

export class ClimbingEnemy extends Enemy {
    constructor(game) {
        super()
        this.game = game;
        this.width = 120;
        this.height = 144;
        this.x = this.game.width;
        this.y = Math.random() * this.game.height * .5
        this.image = document.getElementById('enemy_spider_big')
        this.speedX = 0;
        this.speedY = Math.random() > .5 ? 1 : -1; 
        this.maxFrame = 5 
    }

    update(deltaTime) {
        super.update(deltaTime)
        if(this.y > this.game.height - this.height - this.game.groundMargin) this.speedY *= -1
        if(this.y < -this.height) this.markedForDeletion = true;
    }

    draw(context) {
        super.draw(context)
        context.save()
        context.beginPath()
        context.moveTo(this.x + this.width / 2 , 0)
        context.lineTo(this.x + this.width / 2 ,this.y + this.height / 3)
        context.stroke()
    }
}