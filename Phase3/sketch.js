// TODO add picture in happy mode
// TODO exchange emotion_state to/from arduino
// TODO change to video
let faceapi;
let detections = [];

let video;
let canvas;

// happy_Indicator tells us we've reached a good amount of happy
let happy_Indicator = 0;
// happy_count counts how many frames the person has been smiling
let happy_count = 0;
// happy_keeping tells us we've reached good amount of happy. Does the same as happy_Indicator tbh
let happy_keeping = 0;

// happy_timer counts down from an arbitrary number to transition between happy and neutral faces while in happy mode.
let happy_timer = 0;

// picture_taken is a variable to keep track whether we took a picture of the person's happiness
let picture_taken = false;

// time_count is used to count down to when we can take a picture again.
let time_count = 0;

// this is our emotion state that we're working in. It's changed by the keyboard input. We have 3 emotionStates right now: 1 === neutral, 2 === happy, 3 === angry;
let emotion_state = 0;

// This lets us transition between the happy and neutral faces inside of happy ode
let happy = false;

function preload() {
  img_bg = loadImage('image/bg.jpg');
  img_neutral = loadImage('image/Neutral.png');
  img_happy = loadImage('image/Happy.png');
}

function setup() {
  // frameRate(30);
  canvas = createCanvas(200, 60);
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

  detections = result; //Now all the data in this detections: 全ての検知されたデータがこのdetectionの中に
  // console.log(detections);

  clear(); //Draw transparent background;: 透明の背景を描く
  //drawBoxs(detections);//Draw detection box: 顔の周りの四角の描画
  //drawLandmarks(detections);//// Draw all the face points: 全ての顔のポイントの描画
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

// function drawLandmarks(detections){
//   if (detections.length > 0) {//If at least 1 face is detected: もし1つ以上の顔が検知されていたら
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
    //If at least 1 face is detected: もし1つ以上の顔が検知されていたら
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;
    // textFont('Helvetica Neue');
    // textSize(14);
    // noStroke();
    // fill(44, 169, 225);

    if (nf(happy) > 0.6) {
      happy_count++;
      if (happy_count > 15 && happy_keeping == 0) {
        happy_count = 0;
        happy_keeping = 1;
        happy_timer = 10;
        happy_Indicator = 1;
      } else {
        happy_Indicator = 0;
        happy_keeping = 0;
      }
    } else {
      happy_count = 0;
      happy_Indicator = 0;
      happy_keeping = 0;
    }
    //console.log(happy_Indicator);

    // text("neutral:       " + nf(neutral*100, 2, 2)+"%", x, y);
    // text("happiness: " + nf(happy*100, 2, 2)+"%", x, y+textYSpace);
    // text("anger:        " + nf(angry*100, 2, 2)+"%", x, y+textYSpace*2);
    // text("sad:            "+ nf(sad*100, 2, 2)+"%", x, y+textYSpace*3);
    // text("disgusted: " + nf(disgusted*100, 2, 2)+"%", x, y+textYSpace*4);
    // text("surprised:  " + nf(surprised*100, 2, 2)+"%", x, y+textYSpace*5);
    // text("fear:           " + nf(fearful*100, 2, 2)+"%", x, y+textYSpace*6);
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

function keyPressed() {
  if (keyCode === 78) {
    emotion_state = 1;
    alert("Going Neutral");
  } else if (keyCode === 72) {
    emotion_state = 2;
    alert("Going Happy");
  } else if (keyCode === 65) {
    emotion_state = 3;
    alert("Going Angry");
  }
}

function draw() {
  mirror_buddy = image(mirror_vid_neutral, 0, 0, 120, 60);
  if (happy == true) {
    mirror_buddy = image(img_happy, 0, 0, 120, 60);
  }
  if (emotion_state == 2) {
    //HAPPY CODE
    if (picture_taken) {
      if (frameCount % 60 == 0) {
        time_count++;
        happy_timer = happy_timer - 1;
        //console.log(time_count);
        console.log(happy_timer);
        if (time_count >= 5 && happy_timer < 5) {
          picture_taken = false;
          time_count = 0;
          console.log("I'm neutral now");
          happy = false;
        }
      }
    } else {
      if (happy_Indicator) {
        console.log("I'm happy now");
        happy = true;
        picture_taken = true;
        happy_timer = 10;
      }
    }
  } else if (emotion_state == 3) {
    //ANGRY CODE
    mirror_buddy = image(mirror_vid_angry, 0, 0, 120, 60);
  } else if (emotion_state == 1) {
    //NEUTRAL CODE
    mirror_buddy = image(mirror_vid_neutral, 0, 0, 120, 60);
  }
}
