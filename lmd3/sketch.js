// TODO add in code to change the video feed based on the emotion states
// TODO add serialport to communicate with arduino

// -------------------
// VARIABLES -- System control
// -------------------

// we'll control the buddy's emotional state using numbers. They're easy to share back and forth with the arduino. 1 is neutral, 2 is happy, 3 is angry.
let emotional_state = 1;

// -------------------
// VARIABLES -- Facemesh
// -------------------

let faceapi, video, canvas;
let detections = [];

// happy_count is used to count how many frames the person is happy. This is always counting, but we only care about the count when we're in happy mode.
let happy_count = 0;

// -------------------
// VARIABLES -- serialport
// -------------------
// To be written later @@@

// We'll use setup() to do all the basic loading of things
function setup() {
  // put setup code here

  // set up the facemesh code
  canvas = createCanvas(200, 60);
  canvas.id('canvas');

  video = createCapture(VIDEO);
  video.hide();
  video.id('video');
  video.size(1600, 1200);
  video.play();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5,
  };

  //Serial
  faceapi = ml5.faceApi(video, faceOptions, faceReady);
}

// We'll use draw() to control the switched and checks and other things every frame.
function draw() {
  // console.log(emotional_state);
  // console.log(happy_count);

  // Check the emotional state. Run code based on the state
  if (emotional_state == 1) {
    // neutral
    // TODO switch the buddy's face to neutral
    // TODO set the message to arduino to neutral
  } else if (emotional_state == 2) {
    // happy
    // TODO switch the buddy's face to happy
    // TODO set the message to arduino to happy
    // TODO make a picture of the person if the conditions are right.

    console.log(happy_count);
  } else if (emotional_state == 3) {
    // angry
    // TODO switch the buddy's face to angry
    // TODO set the message to arduino to angry
  }
}

// Let's use keyboard to switch between the states.
function keyPressed() {
  if (keyCode === 78) {
    //neutral, pressed key 'n'
    emotional_state = 1;
  } else if (keyCode === 72) {
    //happy, pressed key 'h'
    emotional_state = 2;
  } else if (keyCode === 65) {
    //angry, pressed key 'a'
    emotional_state = 3;
  }
}

// -------------------
// Facemesh Functions
// -------------------
// This section of code is about the facemesh
// We'll use the facemesh library to detect faces in the video feed.

function faceReady() {
  faceapi.detect(getFaces); // Start detecting faces
}

// Get faces
function getFaces(error, result) {
  if (error) {
    console.log(error);
    return;
  }

  detections = result; //Now all the data in this detections

  clear(); //Draw transparent background;
  recognizeHappiness(detections); //Draw face expression

  faceapi.detect(getFaces); // Call the function again at here:
}

function recognizeHappiness(detections) {
  if (detections.length > 0) {
    //If at least 1 face is detected
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;

    if (nf(happy) > 0.6) {
      happy_count++;
    } else {
      happy_count = 0;
    }
  } else {
    //If no faces is detected
    happy_count = 0;
  }
}
