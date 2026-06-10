// gun sound effect:
// https://pixabay.com - 
// rahib
let sand;
let ottomanBase; // base image - rahib
let safawiBase; // base image - rahib
let helicopterImg;
let hitFlash = 0; // hit flash effect - rowan
let bullets = [];
let player1;
let player2;
let oldHealth1 = 100;
let isMobile = false;
// weapon drops - rahib
let weaponDrops = [];
let lastDropTime = 0;
let activeNotifications = [];
let activeHelicopter = null; // the helicopter starts at null - rahib
// null = nothing

function preload() {
  sand = loadImage("sand.jpeg");
  // base images - rahib
  ottomanBase = loadImage("ottomanBase.png");
  safawiBase = loadImage("safawiBase.png");
  mySound = loadSound('freesound_community-space-gun-101680.mp3');

  helicopterImg = loadImage("helicopter.png") // helicopter img - dylan
}

function setup() {
  let ua = navigator.userAgent || navigator.vendor || window.opera;
  if (/android|iphone|ipad|ipod/i.test(ua)) { // basically like user agent detection
    // if android iphone or ipad or ipod is found it equals to mobile mode kinda self explanatory ngl
    // you can like find an example on mozdocs
    // https://mozilla.org - rahib
    isMobile = true;
    createCanvas(400, 600); // the extension is for like the control bar which will be at the bottom - rahib
  } else {
    createCanvas(400, 400);
  }
  angleMode(DEGREES);
  resetGame(); // the game is automatically reset on startup - rahib
  Bullet.mode = "Menu"; // set it to the menu as soon as game is loaded - rahib
}

function resetGame() { //the function we use to reset the game - rahib
  bullets = [];
  weaponDrops = [];
  activeNotifications = [];
  lastDropTime = millis();
  activeHelicopter = null; // as you can see literally everything is reset

  player1 = {
    x: 50,
    y: 295,
    alive: true,
    health: 100,
    weapon: "pistol"
  }; // changed default weapon to p1weapon and p2weapon and basically it changes when you input into the text thingy - rahib

  player2 = {
    x: 300,
    y: 295,
    alive: true,
    health: 100,
    weapon: "pistol"
  }; // two players - rahib
  // health system - rahib
  // weapon system (WIP) - rahib
  // idk how we will assign weapons thats a later problem ig
  // i madea. system this can change later ofc
}

function cactus(x, y) { //Aaron, for background
  fill("#46914b");
  rect(x, y, 25, 100);
  arc(x + 12.5, y, 25, 25, 180, 0);
  rect(x - 10, y + 50, 10, 15);
  arc(x - 10, y + 50, 30, 30, 90, 180);
  rect(x - 25, y + 30, 15, 20);
  arc(x - 17, y + 30, 15, 15, 180, 0);
  rect(x + 25, y + 50, 10, 15);
  arc(x + 35, y + 50, 30, 30, 0, 90);
  rect(x + 35, y + 30, 15, 20);
  arc(x + 43, y + 30, 15, 15, 180, 0);
}

function rock(x, y) { //Aaron, for background
  fill("#b5a588");
  arc(x, y, 30, 30, 180, 0);
}

// === ES5 COMPLIANT BULLET CONSTRUCTOR REWRITTEN FOR FIREFOX 44 ===
function Bullet(x, y, speed, target, weapon) { // class for bullets - rahib
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.target = target;
  this.weapon = weapon;
  this.visible = true;
  // different guns with different speeds, colors, damage and size - rahib
  // well tbh js for the bullets we havent found a way to design proper guns yet but i think like this works to distinguish em
  if (this.weapon == "pistol") {
    this.radius = 8;
    this.damage = 5;
    this.color = "black"; //rowan
    this.speed *= 0.7;
  }
  if (this.weapon == "sniper") {
    this.radius = 5;
    this.damage = 45;
    this.color = "red";
    this.speed *= 2.5;
  }
  if (this.weapon == "machinegun") {
    this.radius = 4;
    this.damage = 17;
    this.color = "yellow";
    this.speed *= 1.8;
  }
}

Bullet.prototype.draw = function() {
  if (this.visible) {
    fill(this.color);
    ellipse(this.x, this.y, this.radius * 2);
  } //rowan
};

Bullet.prototype.update = function() {
  this.x += this.speed;
  if (this.x < 0 || this.x > width) {
    this.visible = false;
  }
  if (
    this.target == "player1" &&
    player1.alive &&
    this.x > player1.x &&
    this.x < player1.x + 50 &&
    this.y > player1.y &&
    this.y < player1.y + 50
  ) {
    player1.health -= this.damage; // takes off 20 hp pts per bullet - rahib
    if (player1.health <= 0) {
      player1.health = 0;
      player1.alive = false;
      Bullet.mode = "GameOver";
    }
    hitFlash = 80;
    this.visible = false;
  }
  if (
    this.target == "player2" &&
    player2.alive &&
    this.x > player2.x &&
    this.x < player2.x + 50 &&
    this.y > player2.y &&
    this.y < player2.y + 50 // rowan
  ) {
    player2.health -= this.damage; // takes off 20 hp pts per bullet - rahib
    // changed it from taking off 20 hp to the new weapon system
    if (player2.health <= 0) {
      player2.health = 0;
      player2.alive = false;
      Bullet.mode = "GameOver";
    }
    hitFlash = 80;
    this.visible = false;
  }
};
// ====================================================================

function draw() {
  // hit flash effect - rowan
  if (player1 && player1.health < oldHealth1) {
    fill(255, 0, 0, 80);
    rect(0, 0, width, height);
  }
  oldHealth1 = player1 ? player1.health : 100;

  if (Bullet.mode === "Game") {
    // combine background code and p5 game code into one sketch - rahib

    if (!isMobile) {
      if (keyIsDown(68) || keyIsDown(100)) { // basically using function keyIsDown (found on p5 docs) to like make smooth movements - rahib
        // https://p5js.org
        player1.x += 2.5;
      } else if (keyIsDown(65) || keyIsDown(97)) {
        player1.x -= 2.5;
      }
      // same for this - rahib
      if (keyIsDown(39)) {
        player2.x += 2.5;
      } else if (keyIsDown(37)) {
        player2.x -= 2.5;
      }
      // going up and down - rahib
      if (keyIsDown(87)) {
        player1.y -= 2.5;
      } else if (keyIsDown(83)) {
        player1.y += 2.5;
      }

      if (keyIsDown(38)) {
        player2.y -= 2.5;
      } else if (keyIsDown(40)) {
        player2.y += 2.5;
      }
    } else { // using touches in conjuction with a for loop with collidepointrect to allow mobile movement - rahib
      // it seems kinda complex but its really js an array for like where the device is being touched, so its not really its own thing but it kinda is
      // you can also enable a psuedo mobile mode by opening dev tools and using like that devices button
      for (let i = 0; i < touches.length; i++) {
        let t = touches[i];
        if (collidePointRect(t.x, t.y, 10, 460, 40, 40)) player1.x -= 2.5;
        if (collidePointRect(t.x, t.y, 90, 460, 40, 40)) player1.x += 2.5;
        if (collidePointRect(t.x, t.y, 50, 415, 40, 40)) player1.y -= 2.5;
        if (collidePointRect(t.x, t.y, 50, 505, 40, 40)) player1.y += 2.5;
        if (collidePointRect(t.x, t.y, 270, 460, 40, 40)) player2.x -= 2.5;
        if (collidePointRect(t.x, t.y, 350, 460, 40, 40)) player2.x += 2.5;
        if (collidePointRect(t.x, t.y, 310, 415, 40, 40)) player2.y -= 2.5;
        if (collidePointRect(t.x, t.y, 310, 505, 40, 40)) player2.y += 2.5;
      }
    }

    push();
    noStroke();
    background("#3093f0");
    fill(245, 221, 42, 80);
    circle(0, 0, 110);
    fill(245, 221, 42);
    circle(0, 0, 100);
    fill("#f5cd71");
    image(sand, 0, 300, width, 100);
    //rect(0,300,width,100)
    cactus(100, 250);
    rock(20, 350);
    pop();

    push();
    textFont("SF Pro Display"); // change the font for SF Pro, we can always change this later - rahib
    // desert background - rowan
    fill(194, 178, 128);
    rect(0, 300, width, 100); // sand floor
    fill(210, 180, 90);
    ellipse(100, 320, 300, 150); // sand hill
    ellipse(350, 340, 250, 120);

    // basically counts milliseconds until weapons dropped, then pushes a drop - rahib
    if (millis() - lastDropTime > 30000) { // every 30000 ms new drop aka 30 seconds
      let targetX = random(40, width - 60);
      let types = ["machinegun", "sniper"];

      activeHelicopter = {
        x: -100, // made dylan's original helicopter code more advanced - rahib
        y: 30,
        xSpeed: 4,
        dropTargetX: targetX,
        crateType: random(types),
        hasDropped: false
      };

      lastDropTime = millis();
    }

    if (activeHelicopter) {
      image(helicopterImg, activeHelicopter.x, activeHelicopter.y, 100, 60);
      activeHelicopter.x += activeHelicopter.xSpeed; // code for making the helicopter move (taken from his original) - dylan

      if (!activeHelicopter.hasDropped && activeHelicopter.x >= activeHelicopter.dropTargetX - 50) { // basically this code makes it so the helciopter is in sync with our drops - rahib
        weaponDrops.push({
          x: activeHelicopter.dropTargetX,
          y: activeHelicopter.y + 40,
          type: activeHelicopter.crateType, // the helicopter gets pushed out when our crate/drops are about to be pushed - rahib
          size: 20
        });
        activeHelicopter.hasDropped = true;
      }

      if (activeHelicopter.x > width) {
        activeHelicopter = null; // if the helicopter's x position goes beyond our canvas, then itll kinda js reset back to null - rahib
      }
    }

    // basically like updates the drops with a for loop - rahib
    for (let i = weaponDrops.length - 1; i >= 0; i--) {
      let drop = weaponDrops[i];
      if (drop.y < 280) {
        drop.y += 2;
      }

      // basically the design of the drop
      // red = sniper, yellow = machinegun
      fill("#8B5A2B");
      stroke("#5C3A21");
      rect(drop.x, drop.y, drop.size, drop.size, 3);
      fill(drop.type === "sniper" ? "red" : "yellow");
      textAlign(CENTER, CENTER);
      textSize(10);
      text("W", drop.x + drop.size / 2, drop.y + drop.size / 2);

      // basically what does this is if the player is with the drop hits the player
      // they pick it up and it splices when it hits the plauyer
      // they also get a notification with our notification system - rahib
      if (player1.alive && collideRectRect(player1.x, player1.y, 50, 50, drop.x, drop.y, drop.size, drop.size)) {
        player1.weapon = drop.type;
        activeNotifications.push({ text: "P1 picked up " + drop.type.toUpperCase() + "!", time: millis() });
        weaponDrops.splice(i, 1);
        continue;
      }
      if (player2.alive && collideRectRect(player2.x, player2.y, 50, 50, drop.x, drop.y, drop.size, drop.size)) {
        player2.weapon = drop.type;
        activeNotifications.push({ text: "P2 picked up " + drop.type.toUpperCase() + "!", time: millis() });
        weaponDrops.splice(i, 1);
        continue;
      }
    }

    // uses the for loop with miliseconds to display an announcement for every single drop basically - rahib
    for (let i = activeNotifications.length - 1; i >= 0; i--) {
      if (millis() - activeNotifications[i].time > 2000) {
        activeNotifications.splice(i, 1);
      } else {
        fill(255, 255, 255, 200);
        rect(width / 2 - 80, 50 + (i * 25), 160, 20, 5);
        fill(0);
        textSize(10);
        textAlign(CENTER, CENTER);
        // FIXED: Changed activeNotifications(i) to activeNotifications[i]
        text(activeNotifications[i].text, width / 2, 60 + (i * 25)); 
      }
    }

    // bullets - rahib
    for (let i = bullets.length - 1; i >= 0; i--) {
      // FIXED: Changed bullets(i) to bullets[i]
      bullets[i].draw();
      bullets[i].update();
      if (!bullets[i].visible) {
        bullets.splice(i, 1);
      }
    }

    fill(255);
    if (player1.alive) {
      // assign colors to the players - rahib
      // we didnt get our other safawi asset so this will be a placeholder until we get that
      fill("#C72424");
      rect(player1.x, player1.y, 50, 50, 10); // may asw make the players rounded - rahib
    }
    if (player2.alive) {
      fill("#F5F533");
      rect(player2.x, player2.y, 50, 50, 10);
    } // - two players - rahib

    // basically makes it so that if the bullets shoot each other they disappear - rahib
    // oh yeah btw this kinda doesnt work if the weapons are different, but i think ill js make this an intended feature, not a bug bc it adds benefit to higher weapon tiers
    for (let i = 0; i < bullets.length; i++) {
      for (let j = i + 1; j < bullets.length; j++) {
        // FIXED: Changed bullets(i) to bullets[i]
        let b1 = bullets[i];
        let b2 = bullets[j];
        if (b1.visible && b2.visible) {
          let d = dist(b1.x, b1.y, b2.x, b2.y);
          if (d < b1.radius + b2.radius) {
            b1.visible = false;
            b2.visible = false;
          }
        }
      }
    }

    // base images - rahib
    image(ottomanBase, 50, 180, 110, 110);
    image(safawiBase, 270, 180, 110, 110);
    // two bases - rahib

    fill("red");
    rect(20, 20, 100, 20, 5); // make health bars rounded - rahib
    fill("green");
    rect(20, 20, constrain(player1.health, 0, 100), 20, 5);
    fill(0); // health bars - rahib

    fill("red");
    rect(280, 20, 100, 20, 5);
    fill("green");
    rect(280, 20, constrain(player2.health, 0, 100), 20, 5);
    fill(0);

    fill(30, 30, 30, 180);
    rect(15, 50, 120, 30, 8);
    fill(255);
    textSize(12);
    textAlign(LEFT, CENTER);
    text("P1: " + player1.weapon.toUpperCase(), 25, 65);

    fill(30, 30, 30, 180);
    rect(265, 50, 120, 30, 8);
    fill(255);
    textAlign(LEFT, CENTER);
    text("P2: " + player2.weapon.toUpperCase(), 275, 65);
    // updated UI to be round + text to be like aligned to left - rahib
    // displays the weapon being loaded by using simple dot notation - rahib
    // two teams - rahib

    if (isMobile) {
      // mobile UI at the bottom, basically like gives them buttons which like control the game and stuff - rahib
      fill(25, 28, 38);
      rect(0, 400, 400, 200);
      textSize(12);
      textAlign(CENTER, CENTER);

      // red for ottomans fire button - rahib
      fill(50, 55, 75);
      rect(10, 460, 40, 40, 5);
      rect(90, 460, 40, 40, 5);
      rect(50, 415, 40, 40, 5);
      rect(50, 505, 40, 40, 5);
      fill(199, 36, 36);
      rect(45, 460, 50, 40, 5);
      fill(255);
      text("<", 30, 480);
      text(">", 110, 480);
      text("^", 70, 435);
      text("v", 70, 525);
      text("FIRE", 70, 480);

      // yellow for safawis fire button - rahib
      fill(50, 55, 75);
      rect(270, 460, 40, 40, 5);
      rect(350, 460, 40, 40, 5);
      rect(310, 415, 40, 40, 5);
      rect(310, 505, 40, 40, 5);
      fill(245, 245, 51);
      rect(305, 460, 50, 40, 5); // implemented up down left right for mobile - rahib
      fill(0);
      text("FIRE", 330, 480);
      fill(255);
      text("<", 290, 480);
      text(">", 370, 480);
      text("^", 330, 435);
      text("v", 330, 525);
    }
    fill(255);
    pop();
  } else if (Bullet.mode === "HowTo") {
    push();
    background(15, 18, 25);
    textFont("SF Pro Display");
    textAlign(CENTER, CENTER);
    textSize(32);
    fill(255);
    text("HOW TO PLAY", width / 2, 50);
    textSize(14);
    fill(200);
    textAlign(LEFT, CENTER);

    // basically the same as the menu screen - rahib
    if (!isMobile) {
      text("• P1 Move: A / D keys", 60, 110);
      text("• P1 Shoot: F key", 60, 140);
      text("• P2 Move: Left / Right Arrows", 60, 180);
      text("• P2 Shoot: . key", 60, 210);
    } else {
      text("• P1 Controls: Left/Right arrows & Red FIRE", 60, 110);
      text("• P2 Controls: Left/Right arrows & Yellow FIRE", 60, 150);
    }
    text("• Weapons: Collect crates dropping from the sky!", 60, 250);
    textSize(12);
    fill(140);
    text("(Pistol: Balanced | Sniper: Heavy | MG: Rapid)", 60, 270);

    textAlign(CENTER, CENTER);
    fill("#00BA00");
    if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 110, 180, 40, 10)) { // hover thingy - rahib
      fill("#00A100");
    }
    rect(width / 2 - 90, height / 2 + 110, 180, 40, 10);
    fill(255);
    textSize(14);
    text("BACK", width / 2, height / 2 + 130);
    pop();
  } else if (Bullet.mode === "P1Weapon" || Bullet.mode === "P2Weapon") {
    /* Remnants of weapon screen commented out */
  } else if (Bullet.mode === "GameOver") { // game over screen - rahib
    push();
    background(15, 18, 25);
    textFont("SF Pro Display");
    textAlign(CENTER, CENTER);
    textSize(42);
    if (!player1.alive) { // different colors depending on which team wins
      fill("#FFFF24");
      text("VICTORY!", width / 2, height / 2 - 60);
    }
    if (!player2.alive) {
      fill("#FF2424");
      text("VICTORY!", width / 2, height / 2 - 60);
    }
    textSize(20);
    fill(255);
    if (!player1.alive) {
      text("Player 2 (Safawi) Wins!", width / 2, height / 2 - 10);
    } else {
      text("Player 1 (Ottoman) Wins!", width / 2, height / 2 - 10);
    }
    fill("#00BA00");
    if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 40, 180, 40, 10)) {
      fill("#00A100");
    }
    rect(width / 2 - 90, height / 2 + 40, 180, 40, 10);
    fill(255);
    textSize(16);
    text("PLAY AGAIN", width / 2, height / 2 + 60);

    fill(50, 55, 75);
    if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 95, 180, 40, 10)) {
      fill(35, 40, 55);
    }
    rect(width / 2 - 90, height / 2 + 95, 180, 40, 10);
    fill(255);
    textSize(14);
    text("MAIN MENU", width / 2, height / 2 + 115);
    pop();
  } else { // updated menu - rahib
    push();
    background(15, 18, 25);
    textFont("SF Pro Display");
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(40);
    fill(255);
    textSize(42);
    text("EMPIRE WAR", width / 2, height / 2 - 80);
    fill(180);
    textSize(13);
    text("Ottoman vs Safawi Duel Arena", width / 2, height / 2 - 50); // change text from "A game about war between the Ottomans and Safawis" to "Ottoman vs Safawi Duel Arena" - rahib

    fill("#00BA00");
    if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 10, 180, 40, 10)) { // hover thingy - rahib
      fill("#00A100");
    }
    rect(width / 2 - 90, height / 2 + 10, 180, 40, 10);
    fill(255);
    text("PLAY", width / 2, height / 2 + 30);

    fill("#00BA00");
    if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 65, 180, 40, 10)) { // hover thingy - rahib
      fill("#00A100");
    }
    rect(width / 2 - 90, height / 2 + 65, 180, 40, 10);
    // how to play - rahib
    fill(255);
    text("HOW TO PLAY", width / 2, height / 2 + 85);
    pop();
  }
}

function touchStarted() {
  if (Bullet.mode === "Game" && isMobile) {
    for (let i = 0; i < touches.length; i++) {
      let t = touches[i];
      if (collidePointRect(t.x, t.y, 45, 460, 50, 40) && player1.alive) {
        bullets.push(new Bullet(player1.x + 50, player1.y + 25, 4, "player2", player1.weapon)); // weapon is loaded from like the dot notation thingy - rahib
        mySound.play();
      }
      if (collidePointRect(t.x, t.y, 305, 460, 50, 40) && player2.alive) {
        bullets.push(new Bullet(player2.x, player2.y + 25, -4, "player1", player2.weapon)); // weapon is loaded from like the dot notation thingy - rahib
        mySound.play();
      }
    }
  }
  mousePressed();
  return false;
}

function mousePressed() { // - menu screen of sorts - rahib
  if (Bullet.mode != "Game") { // this also does the same for the game thing bc idk ig we might need it for the lvls or smth? - rahib
    if (Bullet.mode === "Menu") {
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 10, 180, 40, 10)) {
        resetGame();
        Bullet.mode = "Game";
      }
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 65, 180, 40, 10)) {
        Bullet.mode = "HowTo";
      }
    } else if (Bullet.mode === "HowTo") {
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 110, 180, 40, 10)) {
        Bullet.mode = "Menu";
      }
    } else if (Bullet.mode === "GameOver") {
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 40, 180, 40, 10)) {
        resetGame();
        Bullet.mode = "Game";
      }
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 95, 180, 40, 10)) {
        Bullet.mode = "Menu";
      }
    }
  }
}

function keyPressed() {
  if (Bullet.mode === "Game") {
    // bullets for player one - rahib
    if ((key == "f" || key == "F") && player1.alive) {
      bullets.push(new Bullet(player1.x + 50, player1.y + 25, 4, "player2", player1.weapon)); // weapon is loaded from like the dot notation thingy - rahib
      mySound.play();
    }
    // bullets for player 2 - rahib
    if (key == "." && player2.alive) { // changed slash key shooting to period key shooting
      bullets.push(new Bullet(player2.x, player2.y + 25, -4, "player1", player2.weapon)); // weapon is loaded from like the dot notation thingy - rahib
      mySound.play();
    }
  }
}
