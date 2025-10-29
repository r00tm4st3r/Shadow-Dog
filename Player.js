// -=> player.js

import { Sitting, Running, Jumping, Falling, Rolling, Diving , Hit } from "./playerStates.js";
import { collisionAnimation } from "./collisionAnimation.js";
import { FloatingMessage } from "./floatingMessages.js";

export class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    this.x = 0;
    this.x = 0;
    this.y = this.game.height - this.height - this.game.groundMargin;
    this.image = playerImage;
    this.speed = 0;
    this.maxSpeed = 10;
    this.vy = 0;
    this.weight = 1;
    this.frameX = 0;
    this.frameY = 0;
    this.maxFrame;
    // player states declarations
    this.states = [
      new Sitting(this.game),
      new Running(this.game),
      new Jumping(this.game),
      new Falling(this.game),
      new Rolling(this.game),
      new Diving(this.game),
      new Hit(this.game)
    ];
    // fps declarations
    this.fps = 60;
    this.fpsTimer = 0;
    this.fpsInterval = 1000 / this.fps;
    this.currentState = null
  }

  // player update method -pu
  update(input, detlaTime) {
    // check for collision
    this.checkCollision();
    // input state handeling.
    this.currentState.HandleInput(input);
    // controlling horizental mouvment based on the keyboard inputs.
    this.x += this.speed;
    if (input.includes("d") && this.currentState !== this.states[6]) this.speed = this.maxSpeed;
    else if (input.includes("a") && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
    else if (input.includes(" "));
    else this.speed = 0;
    // horizental boundaries
    if (this.x < 0) this.x = 0;
    else if (this.x > this.game.width - this.width)
      this.x = this.game.width - this.width;
    // controlling vertical mouvement based on the kyboard inputs.
    this.y += this.vy;
    if (!this.isOnGround()) {
      this.vy += this.weight;
    } else {
      this.vy = 0; // Reset vy to zero when the player is on the ground
    }
    // vertical boundaries
    if (this.y > this.game.height - this.height - this.game.groundMargin) this.y = this.game.height - this.height - this.game.groundMargin;
    // spritesheet animation.
    this.AnimatingSprite(detlaTime);
  }

  AnimatingSprite(detlaTime) {
    if (this.fpsTimer >= this.fpsInterval) {
      if (this.frameX < this.maxFrame) {
        this.frameX++;
      } else {
        this.frameX = 0;
      }
      this.fpsTimer = 0;
    } else {
      this.fpsTimer += detlaTime;
    }
  }

  // check if the player standing on ground.
  isOnGround() {
    return this.y >= this.game.height - this.height - this.game.groundMargin;
  }

  // player draw method -pd
  draw(context) {
    context.save();
    context.strokeStyle = "red";
    if (this.game.debug)
      context.strokeRect(this.x, this.y, this.width, this.height);
    context.drawImage(
      this.image,
      this.frameX * this.width,
      this.frameY * this.height,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    );
    context.restore();
  }

  // method that sets the appropreate player state.
  setState(state, speed) {
    this.currentState = this.states[state];
    this.game.speed = this.game.maxSpeed * speed;

    this.currentState.enter();
  }

  // -col
  checkCollision() {
    this.game.enemies.forEach((enemy) => {
      if (
        enemy.x < this.x + this.width &&
        enemy.x + enemy.width > this.x &&
        enemy.y < this.y + this.height &&
        enemy.y + enemy.height > this.y
      ) {
        // collision detected
        enemy.markedForDeletion = true;
        this.game.collisions.push(new collisionAnimation(this.game , enemy.x + enemy.width / 2 , enemy.y + enemy.height / 2))
        if(this.currentState === this.states[4] || this.currentState === this.states[5]) {
          this.game.score++;
          this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x + enemy.width / 2, enemy.y + enemy.height/ 2, 100, 40));
        }
        else {
          this.setState(6 , 0)
          this.game.lives--
          if (this.game.lives <= 0 ) this.game.gameOver = true;
        }
      }
    });
  }
}
