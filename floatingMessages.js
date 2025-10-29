export class FloatingMessage {
    constructor(value, x, y, targetX, targetY) {
        this.value = value;
        this.x = x;
        this.y = y;
        this.targetX = targetX;
        this.targetY = targetY;
        this.markedForDeletion = false;
        this.timer = 0;
    }

    update() {
        this.x += (this.targetX - this.x) * 0.03;
        this.y += (this.targetY - this.y) * 0.03;
        if (this.timer >= 100) {
            this.markedForDeletion = true;
            this.timer = 0
        }
        else this.timer++;
    }

    draw(context) {
        context.font = '20px Creepster';
        context.fillStyle = 'black';
        context.fillText(this.value, this.x, this.y);
        context.fillStyle = 'blueviolet';
        context.fillText(this.value, this.x + 2, this.y + 2);
    }
}
