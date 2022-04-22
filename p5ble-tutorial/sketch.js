const serviceUuid = '19b10010-e8f2-537e-4f6c-d104768a1221';
// const serviceUuid = 'cee3e619-9134-407e-8110-9b3b17babab8';
let myCharacteristic;
let myValue = 0;
let myBLE;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(200, 200);
  textSize(20);
  textAlign(CENTER, CENTER);

  // Create a 'Connect' button
  const connectButton = createButton('Connect');
  connectButton.mousePressed(connectToBle);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  myCharacteristic = characteristics[0];
  // Read the value of the first characteristic
  myBLE.read(myCharacteristic, gotValue);
}

// A function that will be called once got values
function gotValue(error, value) {
  if (error) console.log('error: ', error);
  // console.log('value: ', value);
  myValue = value;
  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(myCharacteristic, gotValue);
}

function draw() {
  // put drawing code here
  background(250);
  text(myValue, 100, 100);
}
