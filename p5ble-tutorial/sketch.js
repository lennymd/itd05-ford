const SERVICE_UUID = 'cee3e619-9134-407e-8110-9b3b17babab8';
// const CHARACTERISTICS_UUID = {
//   led: 'cee3e619-9134-407e-8110-9b3b17babab9',
//   button: 'cee3e619-9134-407e-8110-9b3b17babab8',
// };

let ledCharacteristic, happyButtonCharacteristic;
let happyIndicator = 0;
let myBLE;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

  console.log('Happy Indicator', happyIndicator);
  myBLE.write(happyButtonCharacteristic, happyIndicator);

  // Create a 'Connect' button
  const connectButton = createButton('Connect');
  connectButton.mousePressed(connectToBle);

  const lightButton = createButton('Light');
  lightButton.mousePressed(toggleLED);
}

function toggleLED() {
  if (happyIndicator == 0) {
    happyIndicator = 1;
  } else {
    happyIndicator = 0;
  }

  console.log(happyIndicator);
  myBLE.write(happyButtonCharacteristic, happyIndicator);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(SERVICE_UUID, getCharacteristics);
}

// A function that will be called once got characteristics
function getCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log('characteristics: ', characteristics);
  [ledCharacteristic, happyButtonCharacteristic] = characteristics;
  // Read the value of the first characteristic
  myBLE.read(happyButtonCharacteristic, gotValue);
}

// A function that will be called once got values
function gotValue(error, value) {
  if (error) console.log('error: ', error);
  console.log('value: ', value);
  happyIndicator = value;
  // After getting a value, call p5ble.read() again to get the value again
  myBLE.read(happyButtonCharacteristic, gotValue);
}

function draw() {
  // put drawing code here
}
