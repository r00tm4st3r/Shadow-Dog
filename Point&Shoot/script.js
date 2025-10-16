window.addEventListener('load', function () {
    const canvas = document.getElementById('canvs1');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let ravens = [];

    class Raven {
        constructor() {
            this.width = 100;
            this.height = 50;
            this.x = canvas.width;
            this.y = Math.random() * (canvas.height - this.height);
            this.directionX = Math.random() * 5 + 3;
            this.directionY = Math.random() * 5 - 2.5;
        }
        update() {
            this.x -= this.directionX;
            this.y += this.directionY;
        }
        draw() {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    // add at least one raven (or spawn them over time)
    ravens.push(new Raven());

    function animate(timestamp) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // update & draw each raven
        for (let i = ravens.length - 1; i >= 0; i--) {
            const r = ravens[i];
            r.update();
            r.draw();
            // remove when off-screen (optional)
            if (r.x + r.width < 0) ravens.splice(i, 1);
        }

        requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
})