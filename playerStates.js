// -=> playerStates.js
import { Dust , Fire , Splash } from "./Particles.js";

// Dit zijn de verschillende toestanden van de speler
const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

// Basis State klasse, alle andere staten gebruiken dit als basis
class State {
  // Stel de naam en het spel in
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

// Zittende staat
export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }

  // Zet de juiste plaatjes en animatie voor zitten
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }

  // Kijk naar toetsen en verander naar een andere staat als nodig
  HandleInput(input) {
    if (input.includes("q") || input.includes("d")) {
      this.game.player.setState(states.RUNNING, 1); // Begin met rennen
    } else if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1); // Spring omhoog
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Rol vooruit
    }
  }
}

// Rennende staat
export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  // Zet de juiste plaatjes en animatie voor rennen
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }

  // Kijk naar toetsen terwijl speler rent en maak stofdeeltjes
  HandleInput(input) {
    // Maak stof als speler rent
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height - 5
      )
    );

    // Verander naar andere staten op basis van toetsen
    if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1); // Spring omhoog
    } else if (
      input.includes("s") &&
      !(input.includes("q") || input.includes("d"))
    ) {
      this.game.player.setState(states.SITTING, 0); // Ga zitten
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Rol vooruit
    }
  }
}

// Springen
export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }

  // Zet animatie en geef een duw omhoog als speler op de grond is
  enter() {
    if (this.game.player.isOnGround()) {
      this.game.player.vy = -25; // Ga omhoog
    }
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
  }

  // Kijk naar toetsen terwijl in de lucht
  HandleInput(input) {
    if (this.game.player.vy >= 0) {
      this.game.player.setState(states.FALLING, 1); // Begin met vallen
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Rol in de lucht
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0); // Duik omlaag
    }
  }
}

// Vallen
export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  // Zet animatie voor vallen
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  // Kijk naar toetsen terwijl speler valt
  HandleInput(input) {
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Land en ren
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Rol in de lucht
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0); // Duik omlaag
    }
  }
}

// Rollen
export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  // Zet animatie voor rollen
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }

  // Kijk naar toetsen tijdens rollen en maak vuurdeeltjes
  HandleInput(input) {
    // Maak vuur bij rollen
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );

    // Verander naar andere staten afhankelijk van input en grond
    if (!input.includes(" ") && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Ren verder
    } else if (!input.includes(" ") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1); // Begin met vallen
    } else if (
      input.includes(" ") &&
      input.includes("z") &&
      this.game.player.isOnGround()
    ) {
      this.game.player.vy -= 25; // Spring hoger terwijl rollen
    } else if (input.includes("s") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.DIVING, 0); // Duik vanuit de lucht
    }
  }
}

// Duiken
export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  // Zet animatie en snelheid omlaag voor duiken
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 20; // Snelle val
  }

  // Kijk naar toetsen tijdens duiken en maak vuur/splashdeeltjes
  HandleInput(input) {
    // Maak vuur bij duiken
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );

    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Land en ren
      // Voeg veel water splash toe bij landing
      for (let i = 0; i < 30; i++) {
        this.game.particles.unshift(
          new Splash(
            this.game,
            this.game.player.x + this.game.player.width * 0.7,
            this.game.player.y + this.game.player.height
          )
        );
      }
    } else if (input.includes(" ") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.ROLLING, 2); // Rol in de lucht
    }
  }
}

// Geraakt worden
export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }

  // Zet animatie en een duw omhoog als speler geraakt wordt
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 4;
    this.game.player.maxFrame = 10;
    this.game.player.vy = -10; // Klein sprongeffect door hit
  }

  // Kijk naar animatie om te beslissen wanneer speler weer kan rennen of vallen
  HandleInput(input) {
    if (this.game.player.frameX >= 10 && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Ren verder
    } else if (this.game.player.frameX >= 10 && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1); // Begin met vallen
    }
  }
}