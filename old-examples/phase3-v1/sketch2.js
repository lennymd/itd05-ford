// TODO take a picture and save it to the folder
let faceapi;
let detections = [];

let video, canvas;

// TODO simplify to only use Indicator
// happy_indicator lets the program know that you're happy for long enough
let happy_count = 0;
let happy_level_reached = 0;
let happy_timer = 10;

let picture_taken = false;
let picture_timer = 0;

// Program is in one of three emotions:
// 1 === neutral, 2 === happy, 3 === angry;
// we can send numbers to arduino and have it do things that way.

let emotion_mode = 1;

// ? Why is happy special?
let happy = false;

let img_neutral, img_happy;
let mirror_vid_neutral, mirror_vid_angry;

// ? do we need this
function preload() {
  // img_bg = loadImage('image/bg.jpg');
  img_neutral = loadImage('image/Neutral.png');
  img_happy = loadImage('image/Happy.png');
}

function setup() {
  // TODO fix this shit
  // canvas = createCanvas(200, 60);
  canvas.id('canvas');
  //canvas.hide();

  //Buddy facial expression videos
  mirror_vid_neutral = createVideo('video/NeutralAnimation.mov');
  mirror_vid_neutral.loop();

  mirror_vid_angry = createVideo('video/AngrySustained.mov');
  mirror_vid_angry.loop();
  //mirror_vid.id("buddy");

  //video = createVideo('video/bg.mov');// Create the video:
  video = createCapture(VIDEO);
  video.hide();
  video.id('video');
  video.size(1920, 1080);
  video.play();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: true,
    minConfidence: 0.5,
  };

  //Initialize the model: モデルの初期化
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

function keyPressed() {
  if (keyCode === 78) {
    emotion_mode = 1;
  } else if (keyCode === 72) {
    emotion_mode = 2;
  } else if (keyCode === 65) {
    emotion_mode = 3;
  }
}

function draw() {
  // Check emotion_mode to see what state we're in
  if (emotion_mode === 1) {
    // neutral
    console.log(happy_count, happy_count > 15);
  } else if (emotion_mode === 2) {
    // happy
  } else if (emotion_mode === 3) {
    // angry
  } else {
    // error
    alert(`Error: emotion_mode is ${emotion_mode}`);
  }
}

function takesnap() {
  snapshot = video.get();
  print(snapshot);
}

function faceReady() {
  faceapi.detect(getFaces); // Start detecting faces
}

function getFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections
  // console.log(detections);

  clear(); //Draw transparent background
  processExpressions(detections, 20, 250, 14);

  faceapi.detect(getFaces); // Call the function again at here
}

function drawBoxes(detections) {
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

function processExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    //If at least 1 face is detected
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;

    // only increade happy_count if person is smiling continuously
    if (nf(happy) > 0.6) {
      happy_count++;
    } else {
      happy_count = 0;
    }
    console.log('happiness', nf(happy * 100, 2, 2) + '%');
  } else {
    //If no faces is detected
    // console.log('no faces');
  }
}
