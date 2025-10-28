// -=> playerStates.js
import { Dust , Fire , Splash } from "./Particles.js";

// Identificatie van staten in de vorm van enums.
const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

// Parent State klasse die een algemene spelerstaat representeert
class State {
  // Initialiseer de staat met een naam en referentie naar het spel
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

//  Sitting subklasse - zit
export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }

  // Stel de animatie en frames van de speler in bij het betreden van de zittende staat
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }

  // Verwerk invoer van de speler terwijl hij zit
  HandleInput(input) {
    if (input.includes("q") || input.includes("d")) {
      this.game.player.setState(states.RUNNING, 1); // Overgang naar de Ren-staat
    } else if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1); // Overgang naar Springen
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Overgang naar Rollen
    }
  }
}

//  Running subklasse - ren
export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  // Stel de animatie en frames van de speler in bij het betreden van de rennende staat
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }

  // Verwerk invoer van de speler tijdens het rennen en voeg stofdeeltjes toe
  HandleInput(input) {
    // Voeg stofdeeltjes toe tijdens het rennen
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height - 5
      )
    );

    // Verwerk inputovergangen
    if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1); // Overgang naar Springen
    } else if (
      input.includes("s") &&
      !(input.includes("q") || input.includes("d"))
    ) {
      this.game.player.setState(states.SITTING, 0); // Overgang naar Zitten
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Overgang naar Rollen
    }
  }
}

// Jumping subklasse - sprong
export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }

  // Stel animatie, frames en initiële verticale snelheid in bij springen
  enter() {
    if (this.game.player.isOnGround()) {
      this.game.player.vy = -25; // Spring van de grond
    }
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
  }

  // Verwerk invoer van de speler tijdens het springen
  HandleInput(input) {
    if (this.game.player.vy >= 0) {
      this.game.player.setState(states.FALLING, 1); // Overgang naar Vallen bij dalen
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Overgang naar Rollen in de lucht
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0); // Overgang naar Duiken
    }
  }
}

//  Falling subklasse - val
export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  // Stel animatie en frames in voor de vallende staat
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  // Verwerk invoer van de speler tijdens het vallen
  HandleInput(input) {
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Overgang naar Rennen bij landing
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2); // Overgang naar Rollen in de lucht
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0); // Overgang naar Duiken
    }
  }
}

//  Rolling subklasse - rol
export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  // Stel animatie en frames in voor de rollende staat
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }

  // Verwerk invoer van de speler tijdens het rollen en voeg vuurdeeltjes toe
  HandleInput(input) {
    // Voeg vuurdeeltjes toe voor rollende effect
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );

    // Verwerk overgang op basis van invoer en grondstatus
    if (!input.includes(" ") && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (!input.includes(" ") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      input.includes(" ") &&
      input.includes("z") &&
      this.game.player.isOnGround()
    ) {
      this.game.player.vy -= 25; // Hogere sprong tijdens rollen
    } else if (input.includes("s") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.DIVING, 0); // Duik vanuit de lucht
    }
  }
}

//  Diving staat - duik
export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  // Stel animatie, frames en neerwaartse snelheid in voor duiken
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 20; // Val naar beneden
  }

  // Verwerk invoer tijdens duiken en voeg vuur/splashdeeltjes toe
  HandleInput(input) {
    // Voeg vuurdeeltjes toe voor duikeffect
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );

    // Overgang na landing of doorgaan met rollen in de lucht
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
      // Voeg splashdeeltjes toe bij landing
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
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

//  Hit staat - geraakt
export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }

  // Stel animatie, frames en verticale terugslag in bij geraakt worden
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 4;
    this.game.player.maxFrame = 10;
    this.game.player.vy = -10; // Terugslag effect
  }

  // Verwerk invoer na geraakt worden om overgang te bepalen wanneer animatie eindigt
  HandleInput(input) {
    if (this.game.player.frameX >= 10 && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Overgang naar Rennen
    } else if (this.game.player.frameX >= 10 && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1); // Overgang naar Vallen
    }
  }
}