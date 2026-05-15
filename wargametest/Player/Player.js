/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Player extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Smiley", "./Player/costumes/Smiley.png", { x: 12, y: 19 }),
    ];

    this.sounds = [];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked2),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked3),
    ];
  }

  *whenGreenFlagClicked() {
    this.stage.vars.scrollx = 0;
    this.stage.vars.scrolly = 0;
    this.visible = true;
    this.moveAhead();
    this.goto(-1, -14);
    while (true) {
      if (this.keyPressed("a")) {
        this.direction = -90;
        this.stage.vars.scrollx += this.toNumber(this.stage.vars.scrollspeed);
      }
      if (this.keyPressed("w")) {
        this.stage.vars.scrolly +=
          0 - this.toNumber(this.stage.vars.scrollspeed);
      }
      if (this.keyPressed("s")) {
        this.stage.vars.scrolly += this.toNumber(this.stage.vars.scrollspeed);
      }
      if (this.keyPressed("d")) {
        this.direction = 90;
        this.stage.vars.scrollx +=
          0 - this.toNumber(this.stage.vars.scrollspeed);
      }
      yield* this.wait(0.01);
      yield;
    }
  }

  *whenGreenFlagClicked2() {
    while (true) {
      this.direction = this.radToScratch(
        Math.atan2(this.mouse.y - this.y, this.mouse.x - this.x)
      );
      yield;
    }
  }

  *whenGreenFlagClicked3() {
    while (true) {
      if (this.touching(this.sprites["Terrain"].andClones())) {
        null;
      }
      yield;
    }
  }
}
