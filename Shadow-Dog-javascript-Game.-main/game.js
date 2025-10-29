// => game.js
import { Player } from "./Player.js";
import { InputHnadler } from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from "./enemies.Js";
import { UI } from "./UI.js";
import { collisionAnimation } from "./collisionAnimation.js";

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 900;
  canvas.height = 500;

  // Game calss -game
  class Game {
    constructor(width, height) {
      // porperties
      this.width = width;
      this.height = height;
      this.groundMargin = 80;
      this.speed = 0;
      this.maxSpeed = 3;
      this.maxParticles = 50;
      this.enemyTimer = 0;
      this.enemyInterval = 1000;
      this.debug = false;
      this.score = 0;
      this.fontColor = "black";
      this.gameOver = false;
      this.lives = 5;
      // instances
      this.background = new Background(this);
      this.player = new Player(this);
      this.input = new InputHnadler(this);
      this.UI = new UI(this);
      // game objects
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      // player states
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.timer = 0;
      this.maxTime = 45000;
    }
    // game update -gu
    update(detlaTime) {
      // updating game time.

      // If the timer exceeds the maximum time, end the game.
      if (this.maxTime <= 0) {
        this.gameOver = true;
      }
      this.maxTime -= detlaTime;
      // updating game objects.
      this.background.update();
      this.player.update(this.input.keys, detlaTime);
      // handel enemies
      if (this.enemyTimer > this.enemyInterval) {
        this.addEnemies();
        this.enemyTimer = 0;
      } else {
        this.enemyTimer += detlaTime;
      }

      this.enemies.forEach((enemy) => {
        enemy.update(detlaTime);
      });
      this.enemies = this.enemies.filter((enemy) => !enemy.markedForDeletion);
      //  handle floating score.
      this.floatingMessages.forEach((message) => {
        message.update();
      });

      this.floatingMessages = this.floatingMessages.filter(
        (message) => !message.markedForDeletion
      );

      // handle particles.
      this.particles.forEach((particle, index) => {
        particle.update();
      });
      this.particles = this.particles.filter(
        (particle) => !particle.markedForDeletion
      );
      if (this.particles.length > this.maxParticles)
        this.particles.slice(0, this.maxParticles);

      // handle collision animation.
      this.collisions.forEach((collision, index) => {
        collision.update(detlaTime);
      });

      this.collisions = this.collisions.filter(
        (collision) => !collision.markedForDeletion
      );
    }

    // game draw -gd
    draw(context) {
      // drawing objects to the game.
      this.background.draw(context);
      this.player.draw(context);
      this.enemies.forEach((enemy) => enemy.draw(context));
      this.particles.forEach((particle) => particle.draw(context));
      this.collisions.forEach((collision) => collision.draw(context));
      this.floatingMessages.forEach((message) => message.draw(context));
      // draw ui
      this.UI.draw(context);
    }

    addEnemies() {
      if (this.speed > 0 && Math.random() < 0.5)
        this.enemies.push(new GroundEnemy(this));
      else if (this.speed > 0 && Math.random() < 0.3)
        this.enemies.push(new ClimbingEnemy(this));
      this.enemies.push(new FlyingEnemy(this));
    }

    restartGame() {
      this.gameOver = false;
      this.enemies = [];
      this.particles = [];
      this.collisions = [];
      this.floatingMessages = [];
      this.player.currentState = this.player.states[0];
      this.player.currentState.enter();
      this.score = 0;
      this.maxTime = 45000;
      this.lives = 5;
      this.player.x = 0;
      this.speed = 0;
      this.player.y = this.height - this.player.height - this.groundMargin;

      requestAnimationFrame(animate);
      console.log("restart...", this.gameOver);
    }
  }

  // Instanciating Game calss.
  const game = new Game(canvas.width, canvas.height);

  // function that animates the game and refreshes the screen.
  let lastTime = 0;
  function animate(timeStamp) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // unfying fps across multiple machines.
    const detlaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    // Calling Game methods
    game.draw(ctx);
    game.update(detlaTime);

    if (game.gameOver === false) requestAnimationFrame(animate);
    else game.UI.draw(ctx);
  }
  animate(0);
});
