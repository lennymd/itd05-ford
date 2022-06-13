// The serviceUuid must match the serviceUuid of the device you would like to connect
const serviceUuid = '19b10010-e8f2-537e-4f6c-d104768a1214';
let myBLE;
let isConnected = false;

const characteristicsUUID = {
  led: '19b10011-e8f2-537e-4f6c-d104768a1214',
  button: '19b10012-e8f2-537e-4f6c-d104768a1214',
};
let buttonCharacteristic;
let ledCharacteristic;

let buttonValue = 0;

function setup() {
  const toggleButton = createButton('Toggle');
  toggleButton.mousePressed(toggleLED);

  // Create a p5ble class
  myBLE = new p5ble();

  createCanvas(200, 200);
  textSize(20);
  textAlign(CENTER, CENTER);

  // Create a 'Connect' button
  const connectButton = createButton('Connect');
  connectButton.mousePressed(connectToBle);

  // Create a 'Disconnect' button
  const disconnectButton = createButton('Disconnect');
  disconnectButton.mousePressed(disconnectToBle);
}

function connectToBle() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function disconnectToBle() {
  // Disonnect to the device
  myBLE.disconnect();
  // Check if myBLE is connected
  isConnected = myBLE.isConnected();
}

function onDisconnected() {
  console.log('Device got disconnected.');
  isConnected = false;
}

// A function that will be called once got characteristics
function gotCharacteristics(error, characteristics) {
  if (error) console.log('error: ', error);
  console.log(characteristics[1].uuid);
  for (let i = 0; i < characteristics.length; i++) {
    if (characteristics[i].uuid == characteristicsUUID.button) {
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);
    } else if (characteristics[i].uuid == characteristicsUUID.led) {
      ledCharacteristic = characteristics[i];
    } else {
      console.log('nothing');
    }
  }
  // Start notifications on the first characteristic by passing the characteristic
  // And a callback function to handle notifications
}

// A function that will be called once got characteristics
function handleButton(data) {
  console.log('Button: ', data);
  buttonValue = Number(data);
}

// A function that toggles the LED
function toggleLED() {
  myBLE.write(ledCharacteristic, 6);
}

function handleLED(error, data) {
  if (error) console.log('error: ', error);
  console.log('LED: ', data);
  myBLE.write(ledCharacteristic, !data);
}

function draw() {
  if (isConnected) {
    background(0, 255, 0);
    text('Connected!', 100, 100);
  } else {
    background(255, 0, 0);
    text('Disconnected :/', 100, 100);
  }

  text(buttonValue, 100, 160);
}
