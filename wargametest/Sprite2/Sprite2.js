/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Sprite2 extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Sprite2/costumes/costume1.png", {
        x: 85,
        y: 21,
      }),
      new Costume("costume2", "./Sprite2/costumes/costume2.png", {
        x: 85,
        y: 21,
      }),
      new Costume("costume3", "./Sprite2/costumes/costume3.png", {
        x: 85,
        y: 21,
      }),
      new Costume("costume4", "./Sprite2/costumes/costume4.png", {
        x: 85,
        y: 21,
      }),
    ];

    this.sounds = [new Sound("meow", "./Sprite2/sounds/meow.wav")];

    this.triggers = [];
  }
}
