// -=> playerStates.js
import { Dust , Fire , Splash } from "./Particles.js";
// Identifying states in form of -enums.
const states = {
  SITTING: 0,
  RUNNING: 1,
  JUMPING: 2,
  FALLING: 3,
  ROLLING: 4,
  DIVING: 5,
  HIT: 6,
};

// Parent State class
class State {
  constructor(state, game) {
    this.state = state;
    this.game = game;
  }
}

//  sitting sub class -sit
export class Sitting extends State {
  constructor(game) {
    super("SITTING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 5;
    this.game.player.maxFrame = 4;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    if (input.includes("q") || input.includes("d")) {
      this.game.player.setState(states.RUNNING, 1); // Moving to the Running state after hitting right of left.
    } else if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

//  Running sub class -run
export class Running extends State {
  constructor(game) {
    super("RUNNING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 3;
    this.game.player.maxFrame = 8;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    // adding particles of running.
    this.game.particles.unshift(
      new Dust(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height - 5
      )
    );

    // handinginput.
    if (input.includes("z")) {
      this.game.player.setState(states.JUMPING, 1); // Moving to jumping state.
    } else if (
      input.includes("s") &&
      !(input.includes("q") || input.includes("d"))
    ) {
      this.game.player.setState(states.SITTING, 0);
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

// Jumping sub class -jum
export class Jumping extends State {
  constructor(game) {
    super("JUMPING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    if (this.game.player.isOnGround()) {
      this.game.player.vy = -25; // Set initial velocity when jumping from the ground
    }
    this.game.player.frameX = 0;
    this.game.player.frameY = 1;
    this.game.player.maxFrame = 6;
  }

  // handling limited number of inputs while we're in this state.
  HandleInput(input) {
    if (this.game.player.vy >= 0) {
      this.game.player.setState(states.FALLING, 1); // Moving to the Falling state when the game.player starts descending
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

//  Falling sub class -fal
export class Falling extends State {
  constructor(game) {
    super("FALLING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 2;
    this.game.player.maxFrame = 6;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1); // Moving to the Runing state.
    } else if (input.includes(" ")) {
      this.game.player.setState(states.ROLLING, 2);
    } else if (input.includes("s")) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

//  Rolling sub class -rol
export class Rolling extends State {
  constructor(game) {
    super("ROLLING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    // adding particles of Rolling.
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );
    // handing input.
    if (!input.includes(" ") && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (!input.includes(" ") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1);
    } else if (
      input.includes(" ") &&
      input.includes("z") &&
      this.game.player.isOnGround()
    ) {
      this.game.player.vy -= 25;
    } else if (input.includes("s") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.DIVING, 0);
    }
  }
}

//  Diving state  -div
export class Diving extends State {
  constructor(game) {
    super("DIVING", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 6;
    this.game.player.maxFrame = 6;
    this.game.player.vy = 20;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    // adding particles of dIVING.
    this.game.particles.unshift(
      new Fire(
        this.game,
        this.game.player.x + this.game.player.width / 2,
        this.game.player.y + this.game.player.height / 2
      )
    );
    // handing input.
    if (this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
      for(let i = 0 ; i < 30 ; i++) {
          this.game.particles.unshift(new Splash(this.game , this.game.player.x + this.game.player.width * .7, this.game.player.y + this.game.player.height))
      }
    } else if (input.includes(" ") && !this.game.player.isOnGround()) {
      this.game.player.setState(states.ROLLING, 2);
    }
  }
}

//  Hit state  -hit
export class Hit extends State {
  constructor(game) {
    super("HIT", game);
  }

  // perform specific actions when we enter this state
  enter() {
    this.game.player.frameX = 0;
    this.game.player.frameY = 4;
    this.game.player.maxFrame = 10;
    this.game.player.vy = -10;
  }

  // handeling limited number of inputs while we're in this state.
  HandleInput(input) {
    // handing input.
    if ( this.game.player.frameX >= 10 && this.game.player.isOnGround()) {
      this.game.player.setState(states.RUNNING, 1);
    } else if (this.game.player.frameX >= 10 && !this.game.player.isOnGround()) {
      this.game.player.setState(states.FALLING, 1);
    }
  }
}

