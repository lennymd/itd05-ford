// -------------------
// VARIABLES -- System control
// -------------------

// we'll control the buddy's emotional state using numbers. They're easy to share back and forth with the arduino. 1 is neutral, 2 is happy, 3 is angry.
let emotional_state = 0;

// -------------------
// VARIABLES -- Facemesh
// -------------------

// These variables are used to control the face mesh and I'm not changing any of them. Just declared them more compactly compared to how we have used the code before.
let faceapi, video, canvas;
let detections = [];

// -------------------
// VARIABLES -- Happiness
// -------------------

// we want to make sure we don't switch the happy face too often. Let's use this buddy_is_happy variable to keep track of when we switch the face.
let buddy_is_happy = false;
// happy_count is used to count how many frames the person is happy. This is always counting, but we only care about the count when we're in happy mode.
let happy_count = 0;

// While in happy mode for the exhibition, if the person stops smiling for too long, the buddy's face will go back to neutral once this gets below 5.
let happy_maintained_counter = 10;

// We'll use a boolean to check if a picture has been taken recently. We don't want to take too many pictures.
let picture_taken = false;

// a timer for how long since a picture has been taken. Once we have a picture, we'll start this timer. After it reaches 0, we'll be able to take another picture.
let picture_timer = 10;

// -------------------
// VARIABLES -- serialport
// -------------------
// We use the serial variable for the library.
let serial;

// This changes based on when we connect to the arduino. Keep an eye and update it when you start the P5 app.
let port_name = '/dev/tty.usbmodem1201';

// We'll use out_message to store the number we'll send to the arduino.
let out_message = 0;

// We'll use in_message to store the incoming message from the arduino.
let in_message = 0;

// We'll use setup() to do all the basic loading of things
function setup() {
  // put setup code here

  // Set up serial connection
  serial = new p5.SerialPort();
  serial.list();
  serial.open(port_name);

  // some extra functions to help us out.
  serial.on('connected', serverConnected);
  serial.on('list', gotList);
  serial.on('data', gotData);
  serial.on('error', gotError);
  serial.on('open', gotOpen);
  serial.on('close', gotClose);

  // set up the facemesh code
  canvas = createCanvas(200, 60);
  canvas.id('canvas');

  video = createCapture(VIDEO);
  video.hide();
  // video.id('video');
  // video.size(1600, 1200);
  // video.play();

  const faceOptions = {
    withLandmarks: true,
    withExpressions: true,
    withDescriptors: false,
    minConfidence: 0.5,
  };

  // Facemesh
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
    // send out_message to Arduino
    // Uncomment this section when we test with arduino
    console.log(
      `Outgoing message has changed from ${previous_message} to ${out_message}.`
    );
    serial.write(out_message.toString());
  }

  // Check the emotional state. Run more code if state is happy
  if (emotional_state == 2) {
    // happy

    // make a picture of the person if the conditions are right.
    if (happy_count > 10 && !picture_taken) {
      if (buddy_is_happy) {
        // do nothing
      } else {
        setBuddyFace(2);
        buddy_is_happy = true;
      }

      // The person is sufficently happy. Check if a picture has been taken. If not, take a picture and start the corresponding timer.
      // NB: !picture_taken is a boolean that is true if a picture has not been taken. It returns the opposite of whatever !picture_taken is.
      if (!picture_taken) {
        // Picture has not been taken. Take the picture and prep for what happens after!

        // Take a snapshot from the video and save it.
        let snapshot = video.get();
        // print(snapshot);
        save(snapshot, 'happy_moment', 'jpg');

        // Next time around, we won't go in this loop.
        picture_taken = true;
        picture_timer = 10;
        happy_count = 0;
        happy_maintained_counter = 10;
      }
    }
    if (picture_taken) {
      // Picture has been taken. Check if the timer has finished. If it has, prepare for more pictures.

      // Every 60 frames, which we're treating as a second, we'll reset the timer, do some math.
      if (frameCount % 60 == 0) {
        picture_timer--;
        happy_maintained_counter = happy_maintained_counter - 2;
      }

      // Once we hit 0, we can take another picture
      if (picture_timer == 0) {
        picture_taken = false;
        picture_timer = 10;
      }
      if (picture_timer > 0 && happy_maintained_counter <= 5) {
        // if the timer is still running, but the stops smiling for too long, we'll reset the timer and make the face neutral. This way, the person can smile again and start the counter again.

        picture_taken = false;
        picture_timer = 10;
        console.log("I'm neutral now");
        // switch the buddy's face to neutral
        setBuddyFace(1);
      }
    }
  }
}

// Let's use keyboard to switch between the states.
function keyPressed() {
  if (keyCode === 78) {
    //neutral, pressed key 'n'
    emotional_state = 1;
    setBuddyFace(emotional_state);
  } else if (keyCode === 72) {
    //happy, pressed key 'h'
    emotional_state = 2;
    // we set the face to neutral because it will only be happy if happy_count hits a certain point!
    setBuddyFace(1);
  } else if (keyCode === 65) {
    //angry, pressed key 'a'
    emotional_state = 3;
    setBuddyFace(emotional_state);
  }
}

function setBuddyFace(_emotional_state) {
  // Change the video feed based on the _emotional_state given.
  const faces = ['neutral', 'happy', 'angry'];
  const _path = './assets/image/';
  const path = _path + faces[_emotional_state - 1] + '.gif';
  // console.log(path);
  let buddy_video = document.getElementById('buddy_face');
  buddy_video.setAttribute('src', path);
  // buddy_video.play();
  // console.log(buddy_video);
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

    // TODO review this with zijian.
    if (nf(happy) > 0.6) {
      happy_count++;
      happy_maintained_counter = 10;
    } else {
      happy_count--;
    }

    if (happy_count < 0) {
      happy_count = 0;
    }
  } else {
    //If no faces is detected
    happy_count = 0;
  }
}

// -------------------
// Serialport Functions
// -------------------
// This section of code is about the serialport. The functions came from the serialport library.
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
  in_message = currentString;
}
