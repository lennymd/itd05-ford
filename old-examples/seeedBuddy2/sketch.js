// VARIABLES FOR SerialPort Connection

let serial;
let portName = '/dev/tty.usbserial-130';
let outMessage = '1';
let latestData;

// VARIABLES FOR HAPPY MODE
let faceapi;
let detections = [];

let video, canvas;

// let happyIndicator = 0;
let happyCount = 0;
let happyKeeping = 0;

let pictureTaken = false;
let timeCounter = 0;

let sound, shutter, shutter_delay;
let sounds = [];

let angryMode = false;
let happyMode = false;

let angryButton, happyButton;

function preload() {
  let a = loadSound('sounds/laugh_1.wav');
  let b = loadSound('sounds/laugh_2.wav');
  let c = loadSound('sounds/laugh_4.wav');
  sounds = [a, b, c];
  shutter = loadSound('sounds/shutter.wav');
}

function setup() {
  canvas = createCanvas(480, 360);
  canvas.id('canvas');

  // SET UP SERIAL CONNECTION
  serial = new p5.SerialPort();
  serial.list();
  serial.open(portName);

  // some extra functions to help us out.
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

  // SETUP facemesh things
  video = createCapture(VIDEO); // Create the video
  video.id('video');
  video.size(width, height);

  // const faceOptions = {
  //   withLandmarks: false,
  //   withExpressions: false,
  //   withDescriptors: false,
  //   minConfidence: 0.5,
  // };

  // //Initialize the model
  // faceapi = ml5.faceApi(video, faceOptions, faceReady);

  // create buttons for toggling modes
  // angryButton = createButton('Toggle Angry Mode');
  // angryButton.mousePressed(toggleAngryMode);

  // happyButton = createButton('Toggle Happy Mode');
  // happyButton.mousePressed(toggleHappyMode);
}

function draw() {
  if (frameCount % 60 == 0) {
    console.log(`Angry: ${angryMode}; Happy: ${happyMode}`);
  }

  if (happyMode == true && angryMode == false) {
    outMessage = '3';
    // if (pictureTaken) {
    //   // picture has been taken. Reset things in time.
    //   if (frameCount % 60 == 0) {
    //     timeCounter++;
    //     console.log(timeCounter);
    //     if (timeCounter == 2) {
    //       // turn off led
    //       outMessage = '1';
    //       serial.write(outMessage);
    //     }
    //     if (timeCounter == 20) {
    //       console.log('You can take another picture now!');
    //       pictureTaken = false;
    //       timeCounter = 0;
    //     }
    //   }
    // } else {
    //   // picture hasn't been taken. Take the goddamn picture

    //   outMessage = '3';
    //   sound = random(sounds);
    //   shutter.play();
    //   sound.play();
    //   takeSnap();
    //   save(snapshot, 'myCanvas', 'jpg');
    //   pictureTaken = true;
    // }
  }

  if (angryMode == true && happyMode == false) {
    // angry
    outMessage = '2';
  }

  if (angryMode == false && happyMode == false) {
    // not angry and not happy
    outMessage = '1';
  }
  serial.write(outMessage);
  console.log(outMessage);
}

// Aux functions
function toggleAngryMode() {
  if (angryMode == true) {
    angryMode = false;
  } else {
    angryMode = true;
    happyMode = false;
  }
}
function toggleHappyMode() {
  if (happyMode == true) {
    happyMode = false;
  } else {
    happyMode = true;
    angryMode = false;
  }
}

// TODO automate this
function keyPressed() {
  // if (key === 'h' || (key === 'n') | (key === 'a')) {
  if (key === 'h' || (key === 'n') | (key === 'a')) {
    // if the user presses Happy, Neutral, or Angry
    console.log(key);
    serial.write(key); // send it out the serial port

    // set the mode properly based on key input:
    if (key === 'h') {
      angryMode = false;
      happyMode = true;
    }
    if (key === 'n') {
      angryMode = false;
      happyMode = false;
    }
    if (key === 'a') {
      angryMode = true;
      happyMode = false;
    }
  }

  if (key === 'p') {
    sound = random(sounds);
    shutter.play();
    sound.play();
    takeSnap();
    save(snapshot, 'myCanvas', 'jpg');
  }

  // if (keyCode === LEFT_ARROW) {
  //   angryMode = true;
  // } else if (keyCode === RIGHT_ARROW) {
  //   angryMode = false;
  // } else if (keyCode === UP_ARROW) {
  //   happyMode = true;
  // } else if (keyCode === DOWN_ARROW) {
  //   happyMode = false;
  // }
}
function takeSnap() {
  snapshot = video.get();
  print(snapshot);
}

function faceReady() {
  faceapi.detect(gotFaces); // Start detecting faces: 顔認識開始
}

// Got faces: 顔を検知
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections: 全ての検知されたデータがこのdetectionの中に
  // console.log(detections);

  clear(); //Draw transparent background;: 透明の背景を描く
  // drawDetectionBox(detections); //Draw detection box: 顔の周りの四角の描画
  // drawLandmarks(detections); //// Draw all the face points: 全ての顔のポイントの描画
  // drawExpressions(detections, 20, 250, 14); //Draw face expression: 表情の描画

  faceapi.detect(gotFaces); // Call the function again at here: 認識実行の関数をここでまた呼び出す
}

function drawDetectionBox(detections) {
  if (detections.length > 0) {
    //If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    for (f = 0; f < detections.length; f++) {
      let {_x, _y, _width, _height} = detections[f].alignedRect._box;
      stroke(44, 169, 225);
      strokeWeight(1);
      noFill();
      rect(_x, _y, _width, _height);
    }
  }
}

function drawLandmarks(detections) {
  if (detections.length > 0) {
    //If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    for (f = 0; f < detections.length; f++) {
      let points = detections[f].landmarks.positions;
      for (let i = 0; i < points.length; i++) {
        stroke(44, 169, 225);
        strokeWeight(3);
        point(points[i]._x, points[i]._y);
      }
    }
  }
}

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    //If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;
    textFont('Helvetica Neue');
    textSize(14);
    noStroke();
    fill(44, 169, 225);

    if (nf(happy) > 0.6) {
      happyCount++;
      if (happyCount > 20 && happyKeeping == 0) {
        happyCount = 0;
        happyKeeping = 1;
        // happyIndicator = 1;
      } else {
        // happyIndicator = 0;
        happyKeeping = 0;
      }
    } else {
      happyCount = 0;
      // happyIndicator = 0;
      happyKeeping = 0;
    }

    text('neutral:       ' + nf(neutral * 100, 2, 2) + '%', x, y);
    text('happiness: ' + nf(happy * 100, 2, 2) + '%', x, y + textYSpace);
    text('anger:        ' + nf(angry * 100, 2, 2) + '%', x, y + textYSpace * 2);
    text('sad:            ' + nf(sad * 100, 2, 2) + '%', x, y + textYSpace * 3);
    text(
      'disgusted: ' + nf(disgusted * 100, 2, 2) + '%',
      x,
      y + textYSpace * 4
    );
    text(
      'surprised:  ' + nf(surprised * 100, 2, 2) + '%',
      x,
      y + textYSpace * 5
    );
    text(
      'fear:           ' + nf(fearful * 100, 2, 2) + '%',
      x,
      y + textYSpace * 6
    );
  } else {
    //If no faces is detected: 顔が1つも検知されていなかったら
    text('neutral: ', x, y);
    text('happiness: ', x, y + textYSpace);
    text('anger: ', x, y + textYSpace * 2);
    text('sad: ', x, y + textYSpace * 3);
    text('disgusted: ', x, y + textYSpace * 4);
    text('surprised: ', x, y + textYSpace * 5);
    text('fear: ', x, y + textYSpace * 6);
  }
}

// SERIALPORT FUNCTIONS
function serverConnected() {
  print('Connected to Server');
}

function gotList(thelist) {
  print('List of Serial Ports:');

  for (let i = 0; i < thelist.length; i++) {
    print(i + ' ' + thelist[i]);
  }
}

function gotOpen() {
  print('Serial Port is Open');
}

function gotClose() {
  print('Serial Port is Closed');
  latestData = 'Serial Port is Closed';
}

function gotError(theerror) {
  print(theerror);
}

function gotData() {
  let currentString = serial.readLine();
  trim(currentString);
  if (!currentString) return;
  console.log(currentString);
  latestData = currentString;
}
