// TODO take a picture and save it to the folder
let faceapi;
let detections = [];

let video;
let canvas;

// TODO simplify to only use Indicator
// happy_indicator lets the program know that you're happy for long enough
let happy_count = 0;
let happy_keeping = 0;
let happy_keeping_2 = 0;

let pictureTaken = false;
let timecount = 0;

// Program is in one of three emotions:
// 0 === neutral, 1 === happy, 2 === angry;
// we can send numbers to arduino and have it do things that way.

let emotion_mode = 0;

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
  // canvas = createCanvas(200, 60);
  canvas.id('canvas');
  //canvas.hide();

  //Buddy facial expression videos
  mirror_vid_neutral = createVideo('video/NeutralAnimation.mov');
  mirror_vid_neutral.loop();

  mirror_vid_angry = createVideo('video/AngrySustained.mov');
  mirror_vid_angry.loop();
  //mirror_vid.id("buddy");

  //video = createVideo('video/bg.mov');// Creat the video: ビデオオブジェクトを作る
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

function takesnap() {
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
  //drawBoxes(detections);//Draw detection box
  //drawLandmarks(detections);
  drawExpressions(detections, 20, 250, 14); //Draw face expression

  faceapi.detect(gotFaces); // Call the function again at here
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

// function drawLandmarks(detections){
//   if (detections.length > 0) {//If at least 1 face is detected
//     for (f=0; f < detections.length; f++){
//       let points = detections[f].landmarks.positions;
//       for (let i = 0; i < points.length; i++) {
//         stroke(44, 169, 225);
//         strokeWeight(3);
//         point(points[i]._x, points[i]._y);
//       }
//     }
//   }
// }

function drawExpressions(detections, x, y, textYSpace) {
  if (detections.length > 0) {
    //If at least 1 face is detected
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;
    // textFont('Helvetica Neue');
    // textSize(14);
    // noStroke();
    // fill(44, 169, 225);

    // TODO only do counting here, no other math/calculation/action/etc.
    // only increade happy_count if person is smiling continuously
    if (nf(happy) > 0.6) {
      happy_count++;
    } else {
      happy_count = 0;
    }
    // console.log('happiness', nf(happy * 100, 2, 2) + '%');
  } else {
    //If no faces is detected
    // text('neutral: ', x, y);
    // text('happiness: ', x, y + textYSpace);
    // text('anger: ', x, y + textYSpace * 2);
    // text('sad: ', x, y + textYSpace * 3);
    // text('disgusted: ', x, y + textYSpace * 4);
    // text('surprised: ', x, y + textYSpace * 5);
    // text('fear: ', x, y + textYSpace * 6);
  }
}

function keyPressed() {
  if (keyCode === 78) {
    emotion_mode = 0;
  } else if (keyCode === 72) {
    emotion_mode = 1;
  } else if (keyCode === 65) {
    emotion_mode = 2;
  }
}

function draw() {
  mirror_buddy = image(mirror_vid_neutral, 0, 0, 120, 60);
  if (happy == true) {
    mirror_buddy = image(img_happy, 0, 0, 120, 60);
  }
  if (emotion_mode == 1) {
    //HAPPY CODE
    // Check if person has been smiling for long enough
    if (happy_count > 10) {
      // Make the buddy smile
      // Take a picture if you can
    }
    // Check if person has stopped smiling
    if (happy_count == 0) {
    // Set a timer to transition to neutral face in happy mode.

    // Check if you've been happy for 5 seconds
    // Take a picture if you've been happy for 30 seconds or so
    if (pictureTaken) {
      // if (frameCount % 60 == 0) {
      //   timecount++;
      //   happy_keeping_2 = happy_keeping_2 - 1;
      //   //console.log(timecount);
      //   console.log(happy_keeping_2);
      //   if (timecount >= 5 && happy_keeping_2 < 5) {
      //     pictureTaken = false;
      //     timecount = 0;
      //     console.log("I'm neutral now");
      //     happy = false;
      //   }
      // }
      if (happy_count > 15) {
        //   happy_count = 0;
        //   happy_keeping = 1;
        //   happy_keeping_2 = 10;
        //   happy_Indicator = 1;
        // } else {
        //   happy_Indicator = 0;
        //   happy_keeping = 0;
      }
    } else {
      // Picture has not been taken. If the person is happy enough, take a picture and then start the maintain happy timer.
      if (happy_count > 15) {
        console.log("I'm happy now");
        happy = true;
        pictureTaken = true;
        happy_keeping_2 = 10;
      }
    }
  } else if (emotion_mode == 2) {
    //ANGRY CODE
    mirror_buddy = image(mirror_vid_angry, 0, 0, 120, 60);
  } else if (emotion_mode == 0) {
    //NEUTRAL CODE
    mirror_buddy = image(mirror_vid_neutral, 0, 0, 120, 60);
  }
}
