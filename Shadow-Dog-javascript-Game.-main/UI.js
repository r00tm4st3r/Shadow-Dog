// => UI.js

export class UI {
  constructor(game) {
    this.game = game;
    this.fontSize = 30;
    this.fontFamily = "Creepster";
    this.livesImage = document.getElementById("lives");
  }

  // -uid
  draw(context) {
    context.save();
    context.font = this.fontSize + "px " + this.fontFamily;
    context.textAlign = "left";
    context.fillStyle = this.game.fontColor;
    // score
    context.fillText("Score: " + this.game.score, 20, 50);
    // timer
    context.font = this.fontSize * 0.8 + "px " + this.fontFamily;
    context.fillText("Time: " + (this.game.maxTime * 0.001).toFixed(0), 20, 80);
    //
    // lives
    for (let i = 0; i < this.game.lives; i++) {
      context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
    }
    if (this.game.gameOver) {
      context.textAlign = "center";
      context.save();
      context.globalAlpha = 0.3; // 50% transparency
      context.fillStyle = "white";
      context.fillRect(0, 0, this.game.width, this.game.height);
      context.restore();

      if (this.game.score > 5 && this.game.lives >= 1) {
        context.font = this.fontSize * 2 + "px " + this.fontFamily;
        context.fillText(
          "Well done!. (PRESS 'R' TO RESTART)",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );

        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "Play again!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      } else {
        context.font = this.fontSize * 2 + "px " + this.fontFamily;
        context.fillText(
          "Too bad!. (PRESS 'R' TO RESTART)",
          this.game.width * 0.5,
          this.game.height * 0.5 - 20
        );

        context.font = this.fontSize * 0.7 + "px " + this.fontFamily;
        context.fillText(
          "Play again!",
          this.game.width * 0.5,
          this.game.height * 0.5 + 20
        );
      }
    }
    context.restore();
  }
}
