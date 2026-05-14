let train;
let uptown;

function setup() {
  createCanvas(400, 400);

  train = {
    x:300,
    y:350,
    xSpeed:0,
    ySpeed:1,
  }
  uptown = true;
}

function draw() {
  background(220);

  fill("orange")
  ellipse(train.x,train.y,50,50)

  fill("white")
  textSize(30)
  text("F", train.x - 9, train.y+10)
  train.y -= train.ySpeed
  train.x += train.xSpeed

  fill("black")
  textSize(15)
  text(mouseX + "," + mouseY, 20,20)

  if(train.x == 300 && train.y == 250 && uptown){
    train.ySpeed = 0;
    train.xSpeed = -2;
     }

  if(train.x == 100 && train.y == 250 && uptown){
    train.ySpeed = 1;
    train.xSpeed = 0;
  }

  if(train.x == 100 && train.y == 50 && uptown){
    train.ySpeed = 0;
    train.xSpeed = 1;
  }

  if(train.x >width && train.y == 50 && uptown){
    train.ySpeed *= -1;
    train.xSpeed *= -1;
    uptown = false;
  }

    if(train.x == 300 && train.y == 250 && uptown == false){
    train.ySpeed = -1;
    train.xSpeed = 0;
     }

  if(train.x == 100 && train.y == 250 && uptown == false){
    train.ySpeed = 0;
    train.xSpeed = 2;
  }

  if(train.x == 100 && train.y == 50 && uptown == false){
    train.ySpeed = -1;
    train.xSpeed = 0;
  }

  if(train.x == 300 && train.y > height && uptown == false){
    train.ySpeed = 1;
    train.xSpeed = 0;
    uptown = true;
  }

}
