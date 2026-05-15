/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Sprite1 extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("costume1", "./Sprite1/costumes/costume1.png", {
        x: 9,
        y: 5,
      }),
    ];

    this.sounds = [
      new Sound(
        "Shells_falls-Marcel-829263474",
        "./Sprite1/sounds/Shells_falls-Marcel-829263474.wav"
      ),
      new Sound(
        "50_sniper_shot-Liam-2028603980",
        "./Sprite1/sounds/50_sniper_shot-Liam-2028603980.wav"
      ),
    ];

    this.triggers = [
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
      new Trigger(
        Trigger.KEY_PRESSED,
        { key: "space" },
        this.whenKeySpacePressed
      ),
      new Trigger(
        Trigger.KEY_PRESSED,
        { key: "space" },
        this.whenKeySpacePressed2
      ),
    ];
  }

  *whenGreenFlagClicked() {
    this.moveAhead();
    this.visible = false;
  }

  *whenKeySpacePressed() {
    this.goto(this.sprites["Player"].x, this.sprites["Player"].y);
    this.direction = this.sprites["Player"].direction;
    this.visible = true;
    for (let i = 0; i < 5; i++) {
      this.move(30);
      yield;
    }
    this.visible = false;
    this.goto(this.sprites["Sprite1"].x, this.sprites["Sprite1"].y);
  }

  *whenKeySpacePressed2() {
    yield* this.startSound("50_sniper_shot-Liam-2028603980");
    yield* this.wait(1);
    yield* this.startSound("Shells_falls-Marcel-829263474");
  }
}
