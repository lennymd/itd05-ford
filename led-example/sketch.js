let pixelRow = [];
let numberPixels = 10;
let pixelColor = [249, 66, 58];
let mainPixel = 0;

let width = 500;
let side = width / numberPixels;
function setup() {
  createCanvas(500, side);
  background(200);

  // put setup code here
  for (i = 0; i < numberPixels; i++) {
    pixelRow.push([0, 0, 0]);
  }

  console.log(pixelRow);

  // draw squares
  for (i = 0; i < numberPixels; i++) {
    let x0 = 0 + 50 * i;
    fill(pixelRow[i]);
    rect(x0, 0, side, side);
  }
}

function draw() {
  // put drawing code here
  if (frameCount % 60 == 0) {
    // every second, update the animation
    for (i = 0; i < numberPixels; i++) {
      if (i == mainPixel) {
        fill(pixelColor);
      } else {
        fill(pixelRow[i]);
      }
      let x0 = 0 + 50 * i;
      rect(x0, 0, side, side);
    }
    mainPixel += 1;
    if (mainPixel > numberPixels - 1) {
      mainPixel = 0;
    }
  }
}

function createPixels() {
  for (i = 0; i < numberPixels; i++) {
    let x0 = 0 + 50 * i;
    fill(pixelRow[i]);
    rect(x0, 0, side, side);
  }
}
