// Variables for Serial Port Connection

let serial;
let portName = '/dev/tty.usbserial-110';
let outMessage = 'N';
let latestData;

// Variables for Facemesh Code
let faceapi;
let detections = [];

let video, canvas;

let happyIndicator = 0;
let happyCount = 0;
let happyKeeping = 0;

let pictureTaken = false;
let timeCounter = 0;

let sound, shutter, shutter_delay;
let soundA, soundB, soundC;
let sounds = [];

// Variables for program logic
let angryMode,
  happyMode = [false, false];

let angryButton, happyButton;

function preload() {
  soundFormats('wav');
  soundA = loadSound('./sounds/laugh_1.wav');
  soundB = loadSound('./sounds/laugh_2.wav');
  soundC = loadSound('./sounds/laugh_4.wav');
  sounds = [soundA, soundB, soundC];
  shutter = loadSound('./sounds/shutter.wav');
}

function setup() {
  console.log(sounds);
}

function draw() {}
