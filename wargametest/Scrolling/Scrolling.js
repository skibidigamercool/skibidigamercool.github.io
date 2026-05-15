/* eslint-disable require-yield, eqeqeq */

import {
  Sprite,
  Trigger,
  Watcher,
  Costume,
  Color,
  Sound,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

export default class Scrolling extends Sprite {
  constructor(...args) {
    super(...args);

    this.costumes = [
      new Costume("Background", "./Scrolling/costumes/Background.png", {
        x: 480,
        y: 360,
      }),
      new Costume("Border", "./Scrolling/costumes/Border.png", {
        x: 480,
        y: 360,
      }),
    ];

    this.sounds = [];

    this.triggers = [
      new Trigger(Trigger.CLONE_START, this.startAsClone),
      new Trigger(Trigger.CLONE_START, this.startAsClone2),
      new Trigger(Trigger.GREEN_FLAG, this.whenGreenFlagClicked),
    ];

    this.vars.cloneid = 4;
  }

  *startAsClone() {
    this.moveBehind(1000);
    this.visible = true;
    while (true) {
      this.goto(
        this.toNumber(this.stage.vars.scrollx) +
          480 *
            this.toNumber(
              this.itemOf(this.stage.vars.scrollerxy, this.vars.cloneid - 1)
            ),
        this.toNumber(this.stage.vars.scrolly) -
          360 *
            this.toNumber(
              this.itemOf(
                this.stage.vars.scrollerxy,
                this.toNumber(this.vars.cloneid) + 3
              )
            )
      );
      yield;
    }
  }

  *startAsClone2() {
    while (!(this.toNumber(this.sprites["Scrolling"].vars.cloneid) === 4)) {
      yield;
    }
    while (true) {
      if (this.compare(this.x, 460) > 0) {
        this.stage.vars.scrollerxy.splice(
          this.vars.cloneid - 1,
          1,
          this.toNumber(
            this.itemOf(this.stage.vars.scrollerxy, this.vars.cloneid - 1)
          ) - 2
        );
      }
      if (this.compare(this.x, -460) < 0) {
        this.stage.vars.scrollerxy.splice(
          this.vars.cloneid - 1,
          1,
          this.toNumber(
            this.itemOf(this.stage.vars.scrollerxy, this.vars.cloneid - 1)
          ) + 2
        );
      }
      if (this.compare(this.y, 340) > 0) {
        this.stage.vars.scrollerxy.splice(
          this.toNumber(this.vars.cloneid) + 3,
          1,
          this.toNumber(
            this.itemOf(
              this.stage.vars.scrollerxy,
              this.toNumber(this.vars.cloneid) + 3
            )
          ) + 2
        );
      }
      if (this.compare(this.y, -340) < 0) {
        this.stage.vars.scrollerxy.splice(
          this.toNumber(this.vars.cloneid) + 3,
          1,
          this.toNumber(
            this.itemOf(
              this.stage.vars.scrollerxy,
              this.toNumber(this.vars.cloneid) + 3
            )
          ) - 2
        );
      }
      yield;
    }
  }

  *whenGreenFlagClicked() {
    this.costume = "Background";
    this.goto(0, 0);
    this.vars.cloneid = 0;
    for (let i = 0; i < 4; i++) {
      this.vars.cloneid++;
      this.createClone();
      yield;
    }
    this.costume = "Border";
    while (true) {
      this.moveAhead();
      yield;
    }
  }
}
