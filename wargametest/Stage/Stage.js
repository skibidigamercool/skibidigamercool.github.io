/* eslint-disable require-yield, eqeqeq */

import {
  Stage as StageBase,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Stage extends StageBase {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("background1", "./Stage/costumes/background1.png", {
        x: 480,
        y: 360,
      }),
    ];

    this.sounds = [
      new Sound(
        "rainforest_ambience-GlorySunz-1938133500",
        "./Stage/sounds/rainforest_ambience-GlorySunz-1938133500.wav"
      ),
      new Sound(
        "Relaxing Instrumental Music - Peaceful Jungle [Original]",
        "./Stage/sounds/Relaxing Instrumental Music - Peaceful Jungle [Original].wav"
      ),
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked2),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked3),
    ];

    this.vars.scrollx = -332;
    this.vars.scrolly = -552;
    this.vars.scrollspeed = 4;
    this.vars.scrollerxy = [0, 1, 0, 1, -2, -2, -1, -1];
  }

  *whenGreenFlagClicked() {
    this.vars.scrollerxy = [];
    this.vars.scrollerxy.push(0);
    this.vars.scrollerxy.push(1);
    this.vars.scrollerxy.push(0);
    this.vars.scrollerxy.push(1);
    this.vars.scrollerxy.push(0);
    this.vars.scrollerxy.push(0);
    this.vars.scrollerxy.push(1);
    this.vars.scrollerxy.push(1);
  }

  *whenGreenFlagClicked2() {
    for (let i = 0; i < 100; i++) {
      yield* this.startSound("rainforest_ambience-GlorySunz-1938133500");
      yield;
    }
  }

  *whenGreenFlagClicked3() {
    for (let i = 0; i < 100; i++) {
      yield* this.startSound(
        "Relaxing Instrumental Music - Peaceful Jungle [Original]"
      );
      yield;
    }
  }
}
