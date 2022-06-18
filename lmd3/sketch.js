// TODO add in code to change the video feed based on the emotion states

// -------------------
// VARIABLES -- System control
// -------------------

// we'll control the buddy's emotional state using numbers. They're easy to share back and forth with the arduino. 1 is neutral, 2 is happy, 3 is angry.
let emotional_state = 1;

// -------------------
// VARIABLES -- Facemesh
// -------------------

// These variables are used to control the face mesh and I'm not changing any of them. Just declared them more compactly compared to how we have used the code before.
let faceapi, video, canvas;
let detections = [];

// -------------------
// VARIABLES -- Happiness
// -------------------

// happy_count is used to count how many frames the person is happy. This is always counting, but we only care about the count when we're in happy mode.
let happy_count = 0;

// TODO figure out how to explain this variable
// While in happy mode for the exhibition, if the person stops smiling for too long, the buddy's face will go back to neutral once this gets below 5.
let happy_maintained_counter = 10;

// We'll use a boolean to check if a picture has been taken recently. We don't want to take too many pictures.
let picture_taken = false;

// a timer for how long since a picture has been taken. Once we have a picture, we'll start this timer. After it reaches 0, we'll be able to take another picture.
let picture_timer = 10;

// -------------------
// VARIABLES -- serialport
// -------------------
// TODO add serialport to communicate with arduino

// We'll use out_message as a holder for the code we'll send to the arduino.
let out_message = 1;

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

function draw() {
  // console.log(emotional_state);
  // console.log(happy_count);

  // Save whatever the most recent arduino message is. previous_message should be whatever the last out_message was. out_message then gets updated with whatever the most recent emotional_state is.
  let previous_message = out_message;
  out_message = emotional_state;

  // Check if the outgoing message has changed. If it has, send it to the arduino.
  if (previous_message != out_message) {
    // TODO send out_message to Arduino
    console.log(
      `Outgoing message has changed from ${previous_message} to ${out_message}.`
    );
  }

  // Check the emotional state. Run code based on the state
  // ? If we use a function to set the video when we're doing the face, it could be less code here in every frame.
  if (emotional_state == 1) {
    // neutral
    // TODO switch the buddy's face to neutral
  } else if (emotional_state == 2) {
    // happy
    // TODO switch the buddy's face to happy
    // make a picture of the person if the conditions are right.
    if (happy_count > 10) {
      // The person is sufficently happy. Check if a picture has been taken. If not, take a picture and start the corresponding timer.
      // NB: !picture_taken is a boolean that is true if a picture has not been taken. It returns the opposite of whatever !picture_taken is.
      if (!picture_taken) {
        // Picture has not been taken. Take the picture and prep for what happens after!

        // Take a snapshot from the video and save it.
        let snapshot = video.get();
        print(snapshot);
        save(snapshot, 'happy_moment', 'jpg');

        // Next time around, we won't go in this loop.
        picture_taken = true;
      } else {
        // Picture has been taken. Check if the timer has finished. If it has, prepare for more pictures.

        // Every 60 frames, which we're treating as a second, we'll reset the timer, do some math.
        if (frameCount % 60 == 0) {
          picture_timer--;
          happy_maintained_counter = happy_maintained_counter - 2;
        }

        // Once we hit 0, we can take another picture
        if (picture_timer == 0) {
          picture_taken = false;
        }

        // ? I'm not too sure about this part of the code. How do we refresh/keep the happy_maintained_counter higher?
        // if the timer is still running, but the stops smiling for too long, we'll reset the timer and make the face neutral. This way, the person can smile again and start the counter again.
        if (picture_timer >= 5 && happy_maintained_counter < 5) {
          picture_taken = false;
          picture_timer = 0;
          console.log("I'm neutral now");
          // TODO switch the buddy's face to neutral
        }
      }
    }
  } else if (emotional_state == 3) {
    // angry
    // TODO switch the buddy's face to angry
  }
}

// Let's use keyboard to switch between the states.
// TODO I wonder if we can add the video changes to the keyPressed code... so it's not so looped.
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

function setBuddyVideo(_emotional_state) {
  // TODO change the video feed based on the _emotional_state given.
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

// I modified the drawExpressions to just be about recognizing Happiness.
function recognizeHappiness(detections) {
  if (detections.length > 0) {
    //If at least 1 face is detected
    let {neutral, happy, angry, sad, disgusted, surprised, fearful} =
      detections[0].expressions;

    if (nf(happy) > 0.6) {
      happy_count++;
      // ? Maybe we should increase the happy_maintained_counter here. But not by a full number, maybe a half number? Or a flat reset like we had could work. Let's discuss on monday.
    } else {
      happy_count = 0;
    }
  } else {
    //If no faces is detected
    happy_count = 0;
  }
}
