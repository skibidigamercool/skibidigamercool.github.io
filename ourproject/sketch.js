/*
EMPIRE WAR

Empire War is a two-player battle game inspired by the Ottoman and Safawi Empires. Players fight across a desert map using pistols, sniper rifles, and machine guns while avoiding enemy fire and collecting weapon drops from helicopters. The goal is to reduce your opponent's health to zero and win the battle.

The game can be played on MacBooks, Windows computers, Chromebooks, iPhones, iPads, and Android devices. Desktop players use keyboard controls, while mobile players use custom on-screen controls.

Contributions:
• Rahib — Core programming, weapons, menus, mobile support, reload system, and helicopter drops.
• Rowan Davé — Game design, UI improvements, hit effects, environment design, balancing, and testing.
• Dylan — Helicopter assets and movement.
• Aaron — Desert scenery and background objects.
• Lukas — Original player graphics.

Made by Rowan Davé, Rahib, Dylan, Aaron, and Lukas.
*/ 


// Source - https://stackoverflow.com/a/62979491
// Posted by GuyC, modified by community. See post 'Timeline' for change history
// Retrieved 2026-06-11, License - CC BY-SA 4.0

const isIPad = !!(navigator.userAgent.match(/(iPad)/)
          || (navigator.platform === "MacIntel" && typeof navigator.standalone !== "undefined")); // code snippet that i got off of slackoverflow - rahib

// gun sound effect:
// https://pixabay.com/sound-effects/film-special-effects-space-gun-101680/ - rahib
let sand;
let ottomanBase; // base image - rahib
let safawiBase; // base image - rahib
let helicopterImg;

let hitFlash = 0; // hit flash effect - rowan
let bullets = [ ];
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
    // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgent - rahib
    isMobile = true;
    createCanvas(400, 600); // the extension is for like the control bar which will be at the bottom - rahib
  } 
  else if (isIPad) {
    isMobile = true;
    createCanvas(400, 600); // the extension is for like the control bar which will be at the bottom - rahib
    // basically does the same thing but for iPad (iOS 13+) users - rahib
  }
    
  else {
    createCanvas(400, 400);
  }
  angleMode(DEGREES);

  resetGame(); // the game is automatically reset on startup  - rahib
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
    weapon: "pistol",
    ammo: 8,
    maxAmmo: 8,
    isReloading: false,
    reloadEndTime: 0
  }; // changed default weapon to p1weapon and p2weapon and basically it changes when you input into the text thingy - rahib

  player2 = {
    x: 300,
    y: 295,
    alive: true,
    health: 100,
    weapon: "pistol",
    ammo: 8,
    maxAmmo: 8,
    isReloading: false,
    reloadEndTime: 0
    // you now have an ammo system, with reloading - rahib
  }; // two players - rahib
  // health system - rahib
  // weapon system (WIP) - rahib
  // idk how we will assign weapons thats a later problem ig
  // i madea. system this can change later ofc
}

function cactus(x,y){ //Aaron, for background
  fill("#46914b");
  rect(x,y,25,100);
  arc(x+12.5,y,25,25,180,0);
  rect(x-10,y+50,10,15);
  arc(x-10,y+50,30,30,90,180);
  rect(x-25,y+30,15,20);
  arc(x-17,y+30,15,15,180,0);
  rect(x+25,y+50,10,15);
  arc(x+35,y+50,30,30,0,90);
  rect(x+35,y+30,15,20);
  arc(x+43,y+30,15,15,180,0);
}

function rock(x,y){ //Aaron, for background
  fill("#b5a588");
  arc(x,y,30,30,180,0);
}

class Bullet { // class for bullets - rahib
  constructor(x, y, speed, target, weapon) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.target = target;
    this.weapon = weapon;
    this.visible = true;

    // different guns with different speeds, colors, damage and size - rahib
    // well tbh js for the bullets we havent found a way to design proper guns yet but i think like this works to distinguish em
    if (this.weapon == "pistol") {
      this.radius = 6;
      this.damage = 10;
      this.color = "black"; //rowan
      this.speed *= 1.2;
    }

    if (this.weapon == "sniper") {
      this.radius = 4;
      this.damage = 40;
      this.color = "red";
      this.speed *= 2.8;
    }

    if (this.weapon == "machinegun") {
      this.radius = 4;
      this.damage = 12;
      this.color = "yellow";
      this.speed *= 1.8;
    }
  }

  draw() {
    if (this.visible) {
      fill(this.color);
      ellipse(this.x, this.y, this.radius * 2);
    }   //rowan
  }

  update() {
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
  }
}

function draw() {
  if (Bullet.mode === "Game") {
    if (player1.isReloading && millis() > player1.reloadEndTime) {
      player1.ammo = player1.maxAmmo;
      player1.isReloading = false;
    }
    if (player2.isReloading && millis() > player2.reloadEndTime) {
      player2.ammo = player2.maxAmmo;
      player2.isReloading = false;  // sets weapons to their max ammo when loading - rahib
      // also makes sure that the player isnt reloading for obvious reasons - rahib
    }
  }

  // hit flash effect - rowan
  if (player1 && player1.health < oldHealth1) {
    fill(255,0,0,80);
    rect(0,0,width,height);
  }

  oldHealth1 = player1 ? player1.health : 100;

  if (Bullet.mode === "Game") {
    // combine background code and p5 game code into one sketch - rahib
    
    if (!isMobile) {
      if (keyIsDown(68) || keyIsDown(100)) {  // basically using function keyIsDown (found on p5 docs) to like make smooth movements - rahib
        // https://p5js.org/reference/p5/keyIsDown/
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
    fill(245,221,42,80);
    circle(0,0,110);
    fill(245, 221, 42);
    circle(0,0,100);
    fill("#f5cd71");
    image(sand,0,300,width,100);
    //rect(0,300,width,100)
    cactus(100,250);
    rock(20,350);
    pop();
    
    push();
    textFont("SF Pro Display"); // change the font for SF Pro, we can always change this later - rahib

    // desert background - rowan
    fill(194, 178, 128);
    rect(0,300,width,100); // sand floor

    fill(210,180,90);
    ellipse(100,320,300,150); // sand hill
    ellipse(350,340,250,120);

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
//
     if (activeHelicopter) {
      image(helicopterImg, activeHelicopter.x, activeHelicopter.y, 100, 60);
      activeHelicopter.x += activeHelicopter.xSpeed;//  code for making the helicopter move (taken from his original) - dylan
      
      
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

    // basically like updates the drops with a for loop -- rahib
    for (let i = weaponDrops.length - 1; i >= 0; i--) {
      let drop = weaponDrops[i];
      if (drop.y < 280) {
        drop.y += 2; 
      }
      
      // basically the design of the drop
      // red = sniper
      // yellow = 
      fill("#8B5A2B");
      stroke("#5C3A21");
      rect(drop.x, drop.y, drop.size, drop.size, 3);
      fill(drop.type === "sniper" ? "red" : "yellow");
      textAlign(CENTER, CENTER);
      textSize(10);
      text("W", drop.x + drop.size/2, drop.y + drop.size/2);

      // basically what does this is if the player is with the drop hits the player
      // they pick it up and it splices when it hits the plauyer
      // they also get a notification with our notification system - rahib
      // updated the drop system to include the ammo amounts - rahib
      if (player1.alive && collideRectRect(player1.x, player1.y, 50, 50, drop.x, drop.y, drop.size, drop.size)) {
        player1.weapon = drop.type;
        player1.isReloading = false;
        if (drop.type === "sniper") { player1.ammo = 5; player1.maxAmmo = 5; } // 5 bullets for our sniper
        // the ammo is less but it does more damage
        if (drop.type === "machinegun") { player1.ammo = 20; player1.maxAmmo = 20; } // 20 bullets for our machinegun
        activeNotifications.push({ text: "P1 picked up " + drop.type.toUpperCase() + "!", time: millis() });
        weaponDrops.splice(i, 1);
        continue;
      }
      if (player2.alive && collideRectRect(player2.x, player2.y, 50, 50, drop.x, drop.y, drop.size, drop.size)) {
        player2.weapon = drop.type;
        player2.isReloading = false;
        if (drop.type === "sniper") { player2.ammo = 5; player2.maxAmmo = 5; }
        if (drop.type === "machinegun") { player2.ammo = 20; player2.maxAmmo = 20; }
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
        text(activeNotifications[i].text, width / 2, 60 + (i * 25));
      }
    }

    // bullets - rahib
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].draw();
      bullets[i].update();

      if (!bullets[i].visible) {
        bullets.splice(i,1);
      }
    }

    fill(255);

    if (player1.alive) { 
      // assign colors to the players - rahib
      // we didnt get our other safawi asset so this will be a placeholder until we get that 
      fill("#C72424");
      rect(player1.x, player1.y, 50, 50,10); // may asw make the players rounded - rahib
    }

    if (player2.alive) {
      fill("#F5F533");
      rect(player2.x, player2.y, 50, 50,10);
    } // - two players - rahib

    // basically makes it so that if the bullets shoot each other they disappear - rahib
    // oh yeah btw this kinda doesnt work if the weapons are different, but i think ill js make this an intended feature, not a bug bc it adds benefit to higher weapon tiers 
    for (let i = 0; i < bullets.length; i++) {
      for (let j = i + 1; j < bullets.length; j++) {
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
    image(ottomanBase,50,180,110,110);
    image(safawiBase,270,180,110,110);

    push();
    noStroke();
    // new health bars with ammo, and weapons combined - rahib
    fill(20, 24, 33, 220);
    // this is background 
    rect(12, 12, 135, 68, 12);
    
    fill(40, 45, 58);
    // the
        rect(20, 22, 85, 10, 5);

    if (player1.health > 50) { // basically depending on like the player's health, the color changes. - rahib
      fill(46, 204, 113);
    } else if (player1.health > 25) {
      fill(241, 196, 15);
    } else {
      fill(231, 76, 60);
    }
    
    let p1Width = player1.health * 0.85; 
    if (p1Width < 0) p1Width = 0; 
    if (p1Width > 85) p1Width = 85;
    rect(20, 22, p1Width, 10, 5);
    
    fill(255, 235);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text(int(player1.health) + "%", 138, 26); // the percentage for the health

    if (player1.weapon === "sniper") { // the weapon type basically like changes the color of your status thingy
      fill(231, 76, 60);
    } else if (player1.weapon === "machinegun") {
      fill(241, 196, 15);
    } else {
      fill(149, 165, 166);
    }
    rect(20, 39, 5, 12, 2);
    
    fill(255);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(player1.weapon.toUpperCase(), 30, 45); // the weapon text is displayed

    if (player1.isReloading) {
      fill(231, 76, 60);
      textSize(10);
      textAlign(LEFT, CENTER);
      text("RELOADING...", 20, 64); // reloading text is displayed when player is reloading otherwise js ammo amounts - rahib
    } else {
      let maxPips1 = player1.maxAmmo;
      let pipWidth1 = 85 / maxPips1 - 2; // basically our logic behind showing the ammo - rahib
      if (pipWidth1 > 4) pipWidth1 = 4;
      
      for(let a = 0; a < maxPips1; a++) {
        if (a < player1.ammo) {
          fill(52, 152, 219);
        } else {
          fill(60, 65, 80);
        }
        rect(20 + (a * (pipWidth1 + 2)), 61, pipWidth1, 7, 1);
      }
    }
    pop();

    // updated UI to be round + text to be like aligned to left  - rahib
    // displays the weapon being loaded by using simple dot notation - rahib
    // two teams - rahib

    push();
    noStroke();
    fill(20, 24, 33, 220);
    rect(width - 147, 12, 135, 68, 12);
    
    fill(40, 45, 58);
    rect(width - 138, 22, 85, 10, 5);
    
    if (player2.health > 50) {
      fill(46, 204, 113);
    } else if (player2.health > 25) {
      fill(241, 196, 15);
    } else {
      fill(231, 76, 60);
    }
    
    let p2Width = player2.health * 0.85;
    if (p2Width < 0) p2Width = 0;
    if (p2Width > 85) p2Width = 85;
    rect(width - 138, 22, p2Width, 10, 5);
    // same stuff for player 2 as player 1
    fill(255, 235);
    textSize(10);
    textAlign(LEFT, CENTER);
    text(int(player2.health) + "%", width - 46, 26);

    if (player2.weapon === "sniper") {
      fill(231, 76, 60);
    } else if (player2.weapon === "machinegun") {
      fill(241, 196, 15);
    } else {
      fill(149, 165, 166);
    }
    rect(width - 138, 39, 5, 12, 2);
    
    fill(255);
    textSize(11);
    textAlign(LEFT, CENTER);
    text(player2.weapon.toUpperCase(), width - 128, 45);

    if (player2.isReloading) {
      fill(231, 76, 60);
      textSize(10);
      textAlign(LEFT, CENTER);
      text("RELOADING...", width - 138, 64);// reloading text is displayed when player is reloading otherwise js ammo amounts - rahib
    } else {
      let maxPips2 = player2.maxAmmo;
      let pipWidth2 = 85 / maxPips2 - 2;
      if (pipWidth2 > 4) pipWidth2 = 4;
      
      for(let a = 0; a < maxPips2; a++) {
        if (a < player2.ammo) {
          fill(52, 152, 219);
        } else {
          fill(60, 65, 80);
        }
        rect(width - 138 + (a * (pipWidth2 + 2)), 61, pipWidth2, 7, 1);
      }
    }
    pop();

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
  } 
  else if (Bullet.mode === "HowTo") {
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
      text("• P2 Shoot: Right Shift key", 60, 210);
    } else {
      text("• P1 Controls: Left/Right arrows & Red FIRE", 60, 110);
      text("• P2 Controls: Left/Right arrows & Yellow FIRE", 60, 150);
    }
    
    text("• Weapons: Collect crates dropping from the sky!", 60, 250);
    textSize(12);
    fill(140);
    text("(Pistol: 8 Shots | Sniper: 5 Shots | MG: 20 Shots)", 60, 270);
// update how to play so it lists the amount of ammo - rahib
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
    // weapon selection commented as weappons drops have been added
  } // using else if to like make it separate iykwm - rahib
  else if (Bullet.mode === "P1Weapon" || Bullet.mode === "P2Weapon") {
  }
  else if (Bullet.mode === "GameOver") { // game over screen - rahib
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
  }
  else { // updated menu - rahib
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
      if (collidePointRect(t.x, t.y, 45, 460, 50, 40) && player1.alive && !player1.isReloading && player1.ammo > 0) {
        player1.ammo--;
        bullets.push(new Bullet(
          player1.x + 50,
          player1.y + 25,
          4,
          "player2",
          player1.weapon // weapon is loaded from like the dot notation thingy - rahib
        ));
        mySound.play();
        if (player1.ammo === 0) {
          player1.isReloading = true;
          let rTime = 1500;
          if (player1.weapon === "sniper") rTime = 2500;
          if (player1.weapon === "machinegun") rTime = 2000;
          player1.reloadEndTime = millis() + rTime;
        }
      }
      if (collidePointRect(t.x, t.y, 305, 460, 50, 40) && player2.alive && !player2.isReloading && player2.ammo > 0) {
        player2.ammo--;
        bullets.push(new Bullet(
          player2.x,
          player2.y + 25,
          -4,
          "player1",
          player2.weapon // weapon is loaded from like the dot notation thingy - rahib
        ));
        mySound.play();
        if (player2.ammo === 0) {
          player2.isReloading = true;
          let rTime = 1500;
          if (player2.weapon === "sniper") rTime = 2500;
          if (player2.weapon === "machinegun") rTime = 2000;
          player2.reloadEndTime = millis() + rTime;
        }
      }
    }
  }
  mousePressed();
  return false;
}

function mousePressed() { // - menu screen of sorts - rahib
  if(Bullet.mode != "Game") { // this also does the same for the game thing bc idk ig we might need it for the lvls or smth? - rahib
    if (Bullet.mode === "Menu") {
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 10, 180, 40, 10)) {
        resetGame();
        Bullet.mode = "Game";
      }
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 65, 180, 40, 10)) {
        Bullet.mode = "HowTo";
      }
    } 
    else if (Bullet.mode === "HowTo") {
      if (collidePointRect(mouseX, mouseY, width / 2 - 90, height / 2 + 110, 180, 40, 10)) {
        Bullet.mode = "Menu";
      }
    }
    else if (Bullet.mode === "P1Weapon") {
    }
    else if (Bullet.mode === "P2Weapon") {
    }
    else if (Bullet.mode === "GameOver") {
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
    if ((key == "f" || key == "F") && player1.alive && !player1.isReloading && player1.ammo > 0) { // detects if the player isnt  reloading and if the ammo is greater than 0 which allows shooting
      player1.ammo--;
      bullets.push(new Bullet(
        player1.x + 50,
        player1.y + 25,
        4,
        "player2",
        player1.weapon // weapon is loaded from like the dot notation thingy - rahib
      ));
      mySound.play();
      if (player1.ammo === 0) {
        player1.isReloading = true;
        let rTime = 1500;
        if (player1.weapon === "sniper") rTime = 2500;
        if (player1.weapon === "machinegun") rTime = 2000; 
        player1.reloadEndTime = millis() + rTime;
      }
    }

    // bullets for player 2 - rahib
    
    // updated to increase compatibility for old browsers - rahib
    var e = event || window.event; // https://developer.mozilla.org/en-US/docs/Web/API/Window/event
    // mdn about window.event
    // it is deprecated but it is compatible as well
    var isShift = (keyCode === 16); // checks for the keyCode 16 - rahib
    var isRightShift = false; // right shift is false by default 

    if (isShift) {
      if (e.code === 'ShiftRight') {
        isRightShift = true; // first it checks for modern browsers which already natively support the ShiftRight thingy 

// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code - MDN
        // not all browsers support it though
      } else if (e.location === 3 || e.keyLocation === 3) { // then after that if the above isnt supported it falls back to this
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/location#:~:text=function%20keyEvent%28event - MDN
        
        isRightShift = true;
      } else if (typeof e.code === 'undefined' && typeof e.location === 'undefined') {
        isRightShift = true; // then if nothing is returned (undefined here), it js defaults to true and if they press both shift keys itll shoot (not ideal, but preferable in comparison to it like not working at all)
      }
    }

    if (isRightShift) { // we use the rightshift true thingy to then shoot 
      if (player2.alive && !player2.isReloading && player2.ammo > 0) { // detects if the player isnt  reloading and if the ammo is greater than 0 which allows shooting
        player2.ammo--;
        bullets.push(new Bullet(
          player2.x,
          player2.y + 25,
          -4, 
          "player1",
          player2.weapon /// weapon is loaded from like the dot notation thingy - rahib
        ));
        mySound.play();

        if (player2.ammo === 0) {
          player2.isReloading = true; 
          let rTime = 1500;
          if (player2.weapon === "sniper") rTime = 2500;
          if (player2.weapon === "machinegun") rTime = 2000;
          player2.reloadEndTime = millis() + rTime;  //  basically reload time for reloading weapons - rahib
        }
      }
    }
  }
}
