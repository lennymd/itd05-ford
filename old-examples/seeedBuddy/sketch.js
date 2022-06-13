let serial;
let portName = '/dev/cu.usbserial-1130';
let incomingData;

// Variables for working with facemesh & detection
let faceapi;
let detections = [];

let video, canvas;

let happyIndicator = 0;
let happyCount = 0;
let happyKeeping = 0;

let pictureTaken = false;
let timeCounter = 0;

let shutter;
let shutterDelay;
let sounds = [];
let ledStatus = 0;

function preload() {
  let a = loadSound('sounds/laugh_1.mpeg');
  let b = loadSound('sounds/laugh_2.mpeg');
  let c = loadSound('sounds/laugh_4.wav');
  sounds = [a, b, c];
  shutter = loadSound('sounds/shutter.mpeg');
}

function setup() {
  // frameRate(30);
  canvas = createCanvas(480, 360);
  canvas.id('canvas');

  // create video capture
  video = createCapture(VIDEO);
  video.id('video');
  video.size(width, height);

  const faceOptions = {
    withLandmarks: false,
    withExpressions: false,
    withDescriptors: false,
    minConfidence: 0.5,
  };

  // //Initialize the model: モデルの初期化
  // faceapi = ml5.faceApi(video, faceOptions, faceReady);

  // // Instantiate SerialPort object
  // serial = new p5.SerialPort();

  // // see available ports
  // let portList = serial.list();

  // let options = {baudrate: 9600};
  // serial.open(portName, options);

  // // Register some callbacks

  // // When we connect to the underlying server
  // serial.on('connected', serverConnected);

  // // When we get a list of serial ports that are available
  // serial.on('list', gotList);

  // // When we some data from the serial port
  // serial.on('data', gotData);

  // // When or if we get an error
  // serial.on('error', gotError);

  // // When our serial port is opened and ready for read/write
  // serial.on('open', gotOpen);
}

// functions for facemesh part
function takeSnap() {
  snapshot = video.get();
  print(snapshot);
}
function faceReady() {
  faceapi.detect(gotFaces); // Start detecting faces: 顔認識開始
}
function gotFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections: 全ての検知されたデータがこのdetectionの中に
  // console.log(detections);

  clear(); //Draw transparent background;: 透明の背景を描く
  drawBoxs(detections); //Draw detection box: 顔の周りの四角の描画
  drawLandmarks(detections); //// Draw all the face points: 全ての顔のポイントの描画
  drawExpressions(detections, 20, 250, 14); //Draw face expression: 表情の描画

  faceapi.detect(gotFaces); // Call the function again at here: 認識実行の関数をここでまた呼び出す
}
function drawBoxs(detections) {
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
        happyIndicator = 1;
      } else {
        happyIndicator = 0;
        happyKeeping = 0;
      }
    } else {
      happyCount = 0;
      happyIndicator = 0;
      happyKeeping = 0;
    }
    // console.log(happyIndicator);

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

function setup() {}

// We are connected and ready to go
function serverConnected() {
  print('We are connected!');
}

// Got the list of ports
function gotList(thelist) {
  // theList is an array of their names
  for (let i = 0; i < thelist.length; i++) {
    // Display in the console
    print(i + ' ' + thelist[i]);
  }
}

// Connected to our serial device
function gotOpen() {
  print('Serial Port is open!');
}

// Ut oh, here is an error, let's log it
function gotError(the_error) {
  print(the_error);
}

// There is data available to work with from the serial port
function gotData() {
  let currentString = serial.readStringUntil('\r\n');
  console.log(currentString);
}

function serialEvent() {
  incomingData = Number(serial.read());
}

function draw() {
  // Polling method
  /*
  if (serial.available() > 0) {
    let data = serial.read();
    ellipse(50,50,data,data);
  }
*/

  if (pictureTaken) {
    if (frameCount % 60 == 0) {
      // timeCounter works by counting seconds based on frame rate.
      timeCounter++;

      if ((timeCounter = 2)) {
        // turn off led
      }
      if (timeCounter == 20) {
        console.log('You can take another picture now!');
        pictureTaken = false;
        timeCounter = 0;
      }
    }
  } else {
    if (happyIndicator) {
      // turn on led
      sound = random(sounds);
      shutter.play();
      sound.play();
      takeSnap();
      save(snapshot, 'myCanvas', 'jpg');
      pictureTaken = true;
    }
  }
}
