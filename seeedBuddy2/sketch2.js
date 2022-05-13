// TODO arrange Happy Mode to be changed by smiling presence.
// Variables for Serial Port Connection

let serial;
let portName = '/dev/tty.usbserial-110';
let outMessage = 1;
let prevOutMessage;
let latestData;

// Variables for Facemesh Code
let faceapi;
let detections = [];

let video, canvas;

let happyCount = 0;
let passengerHappy = false;

let pictureTaken = false;
let pictureResetCounter = 0;

let sound, shutter, shutter_delay;
let soundA, soundB, soundC;
let sounds = [];

// Variables for program logic
let angryMode = false;
let happyMode = false;
let myFrameRate = 60;
let angryButton, happyButton;

// preload sounds
function preload() {
  soundFormats('wav');
  soundA = loadSound('./sounds/laugh_1.wav');
  soundB = loadSound('./sounds/laugh_2.wav');
  soundC = loadSound('./sounds/laugh_4.wav');
  shutter = loadSound('./sounds/shutter.wav');
}

function setup() {
  // put together all sounds
  sounds = [soundA, soundB, soundC];
  canvas = createCanvas(480, 360);
  canvas.id('canvas');

  // SET UP SERIAL CONNECTION
  // serial = new p5.SerialPort();
  // serial.list();
  // serial.open(portName);

  // some extra functions to help us out.
  // serial.on('connected', serverConnected);
  // serial.on('list', gotList);
  // serial.on('data', gotData);
  // serial.on('error', gotError);
  // serial.on('open', gotOpen);
  // serial.on('close', gotClose);

  // SETUP facemesh things
  video = createCapture(VIDEO); // Create the video
  video.id('video');
  video.size(width, height);

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };

  //Initialize the model
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function draw() {
  prevOutMessage = outMessage;
  // every 60 frames (1 second), let us know what the current message to the arduino is and the status of the angry and happy modes.
  if (frameCount % 60 == 0) {
    console.log(`outMessage: ${outMessage}`);
    console.log(`Angry: ${angryMode}; Happy: ${happyMode}`);
  }

  //check modes to see how the Buddy should act.
  if (happyMode == true && angryMode == false) {
    // Buddy is acting in happy mode.
    if (happyCount > 30) {
      // user has been happy for an arbitrary period.

      if (pictureTaken == false) {
        // take a picture. Add one of the random sounds and the shutter sound
        outMessage = 3;
        sound = random(sounds);
        shutter.play();
        sound.play();
        takeSnap();
        save(snapshot, 'dashBuddy_imgHappy', 'jpg');
        pictureTaken = true;
        happyCount = 0;
      } else {
        // picture has been taken. create a timer to reset when the user can use the camera again.
        // every 60 frames, increase the reset counter.
        if (frameCount % myFrameRate == 0) {
          pictureResetCounter++;
        }

        // two seconds (120 frames) after taking the picture, send the buddy back to neutral mode.
        if (pictureResetCounter == 2) {
          outMessage = 1;
        }

        // after 20 seconds, you can take a picture again
        if (pictureResetCounter == 20) {
          pictureTaken = false;
          pictureResetCounter = 0;
        }
      }
    }
  }
  if (happyMode == false && angryMode == true) {
    // Buddy is acting in angry mode
    // send message to arduino to do angry actions
    outMessage = 2;
  }

  if (angryMode == false && happyMode == false) {
    // Buddy is neutral
    // send message to arduino to be in neutral state.
    outMessage = 1;
  }

  // TODO check if outMessage has changed from last frame. If no change, don't send it to the arduino.

  // serial.write(outMessage.toString());
}

// TODO automate this
function keyPressed() {
  // if (key === 'h' || (key === 'n') | (key === 'a')) {
  if (key === 'h' || (key === 'n') | (key === 'a')) {
    // if the user presses Happy, Neutral, or Angry
    console.log(key);

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
    // sound = random(sounds);
    // shutter.play();
    // sound.play();
    // takeSnap();
    // save(snapshot, 'dashBuddy-img', 'jpg');
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

  detections = result; //Now all the data in this detections
  // console.log(detections);

  clear(); //Draw transparent background
  drawDetectionBox(detections); //Draw detection box
  drawLandmarks(detections); // Draw all the face points
  drawExpressions(detections, 20, 250, 14); //Draw face expression

  faceapi.detect(gotFaces); // Call the function again here
}

function drawDetectionBox(detections) {
  if (detections.length > 0) {
    //If at least 1 face is detected
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
    //If at least 1 face is detected
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;
    textFont('monospace');
    textSize(14);
    noStroke();
    fill(44, 169, 225);

    if (nf(happy) > 0.6) {
      happyCount++;
    } else {
      happyCount = 0;
    }

    text('neutral: ' + nf(neutral * 100, 2, 2) + '%', x, y);
    text('happiness: ' + nf(happy * 100, 2, 2) + '%', x, y + textYSpace);
    text('anger: ' + nf(angry * 100, 2, 2) + '%', x, y + textYSpace * 2);
    text('sad: ' + nf(sad * 100, 2, 2) + '%', x, y + textYSpace * 3);
    text(
      'disgusted: ' + nf(disgusted * 100, 2, 2) + '%',
      x,
      y + textYSpace * 4
    );
    text(
      'surprised: ' + nf(surprised * 100, 2, 2) + '%',
      x,
      y + textYSpace * 5
    );
    text('fear: ' + nf(fearful * 100, 2, 2) + '%', x, y + textYSpace * 6);
  } else {
    //If no faces is detected:
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
