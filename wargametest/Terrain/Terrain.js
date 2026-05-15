/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Terrain extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("trees", "./Terrain/costumes/trees.png", { x: 478, y: 316 }),
      new Costume("terrain_1", "./Terrain/costumes/terrain_1.png", {
        x: 478,
        y: 354,
      }),
      new Costume("terrain_2", "./Terrain/costumes/terrain_2.png", {
        x: 426,
        y: 346,
      }),
      new Costume("terrain_3", "./Terrain/costumes/terrain_3.png", {
        x: 480,
        y: 354,
      }),
      new Costume("terrain_4", "./Terrain/costumes/terrain_4.png", {
        x: 468,
        y: 329,
      }),
      new Costume("costume1", "./Terrain/costumes/costume1.png", {
        x: 476,
        y: 360,
      }),
    ];

    this.sounds = [new Sound("pop", "./Terrain/sounds/pop.wav")];

    this.triggers = [
      new Trigger(
        Trigger.BROADCAST,
        { name: "scroll to apple" },
        this.whenIReceiveScrollToApple
      ),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.CLONE_START, this.startAsClone),
    ];

    this.vars.x = 0;
    this.vars.y = 360;
  }

  *whenIReceiveScrollToApple() {
    this.goto(
      this.toNumber(this.vars.x) + this.toNumber(this.stage.vars.scrollx),
      this.toNumber(this.vars.y) + this.toNumber(this.stage.vars.scrolly)
    );
  }

  *whenGreenFlagClicked() {
    this.visible = false;
    this.costume = "terrain_1";
    this.vars.x = 480 * 0;
    this.vars.y = 360 * 0;
    this.createClone();
    this.costume = "terrain_2";
    this.vars.x = 480 * 1;
    this.vars.y = 360 * 0;
    this.createClone();
    this.costume = "terrain_3";
    this.vars.x = 480 * 1;
    this.vars.y = 360 * 1;
    this.createClone();
    this.costume = "terrain_4";
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
      yield;
    }
  }
}
