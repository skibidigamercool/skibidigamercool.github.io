import {
  Project,
  Sprite,
} from "https://unpkg.com/leopard@^1/dist/index.esm.js";

import Stage from "./Stage/Stage.js";
import Scrolling from "./Scrolling/Scrolling.js";
import Player from "./Player/Player.js";
import Sprite1 from "./Sprite1/Sprite1.js";
import Sprite2 from "./Sprite2/Sprite2.js";
import Terrain from "./Terrain/Terrain.js";
import Sprite3 from "./Sprite3/Sprite3.js";

const stage = new Stage({ costumeNumber: 1 });

const sprites = {
  Scrolling: new Scrolling({
    x: 0,
    y: 0,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.DONT_ROTATE,
    costumeNumber: 2,
    size: 100.00000002328306,
    visible: true,
    layerOrder: 6,
  }),
  Player: new Player({
    x: -1,
    y: -14,
    direction: -57.20423298593346,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100.00000002328306,
    visible: true,
    layerOrder: 5,
  }),
  Sprite1: new Sprite1({
    x: -59.52235512762106,
    y: 124.11275810118559,
    direction: -22.96377305985456,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 4,
  }),
  Sprite2: new Sprite2({
    x: -159,
    y: 134,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 4,
    size: 100,
    visible: true,
    layerOrder: 1,
  }),
  Terrain: new Terrain({
    x: -39,
    y: -243,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.DONT_ROTATE,
    costumeNumber: 5,
    size: 100,
    visible: false,
    layerOrder: 2,
  }),
  Sprite3: new Sprite3({
    x: -46,
    y: -11,
    direction: 90,
    rotationStyle: Sprite.RotationStyle.ALL_AROUND,
    costumeNumber: 1,
    size: 100,
    visible: false,
    layerOrder: 3,
  }),
};

const project = new Project(stage, sprites, {
  frameRate: 30, // Set to 60 to make your project run faster
});
export default project;
