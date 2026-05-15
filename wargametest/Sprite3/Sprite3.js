/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Sprite3 extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Sprite3/costumes/costume1.png", {
        x: 10,
        y: 26,
      }),
      new Costume("costume2", "./Sprite3/costumes/costume2.png", {
        x: 14,
        y: 21,
      }),
    ];

    this.sounds = [new Sound("meow", "./Sprite3/sounds/meow.wav")];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
    ];

    this.vars.x = 0;
    this.vars.y = 360;
  }

  *whenGreenFlagClicked() {
    this.visible = false;
    this.costume = "costume1";
    this.vars.x = 480 * 0;
    this.vars.y = 360 * 0;
    this.createClone();
    this.costume = "costume1";
    this.vars.x = 480 * 1;
    this.vars.y = 360 * 0;
    this.createClone();
    this.costume = "costume1";
    this.vars.x = 480 * 1;
    this.vars.y = 360 * 1;
    this.createClone();
    this.costume = "costume1";
    this.vars.x = 480 * 0;
    this.vars.y = 360 * 1;
    this.createClone();
  }

  *startAsClone() {
    this.visible = true;
    while (true) {
      this.goto(
        this.toNumber(this.vars.x) + this.toNumber(this.stage.vars.scrollx),
        this.toNumber(this.vars.y) + this.toNumber(this.stage.vars.scrolly)
      );
      if (this.touching(this.sprites["Sprite1"].andClones())) {
        this.costume = "costume2";
      }
      yield;
    }
  }
}
