/*
  Button LED

  This example creates a Bluetooth® Low Energy peripheral with service that contains a
  characteristic to control an LED and another characteristic that
  represents the state of the button.

  The circuit:
  - Arduino MKR WiFi 1010, Arduino Uno WiFi Rev2 board, Arduino Nano 33 IoT,
    Arduino Nano 33 BLE, or Arduino Nano 33 BLE Sense board.
  - Button connected to pin 4

  You can use a generic Bluetooth® Low Energy central app, like LightBlue (iOS and Android) or
  nRF Connect (Android), to interact with the services and characteristics
  created in this sketch.

  This example code is in the public domain.
*/
#include <ChainableLED.h>
#include <ArduinoBLE.h>

const int ledPin = LED_BUILTIN; // set ledPin to on-board LED
const int buttonPin = 4; // set buttonPin to digital pin 4

#define NUM_LEDS 1
  
ChainableLED leds(7,8,NUM_LEDS);

BLEService ledService("cee3e619-9134-407e-8110-9b3b17babab8"); // create service

// create switch characteristic and allow remote device to read and write
//BLEByteCharacteristic ledCharacteristic("cee3e619-9134-407e-8110-9b3b17babab9", BLERead | BLEWrite);
// create button characteristic and allow remote device to get notifications
BLEByteCharacteristic happyButtonCharacteristic("cee3e619-9134-407e-8110-9b3b17babab8", BLERead | BLEWrite | BLENotify);

void setup() {
  Serial.begin(9600);
//  while (!Serial);
  leds.setColorRGB(1,0,0,0);
  pinMode(7, OUTPUT); // use the LED as an output
  pinMode(buttonPin, INPUT); // use button pin as an input

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");

    while (1);
  }

  // set the local name peripheral advertises
  BLE.setLocalName("Dash BUDDY");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(ledService);

  // add the characteristics to the service
//  ledService.addCharacteristic(ledCharacteristic);
  ledService.addCharacteristic(happyButtonCharacteristic);

  // add the service
  BLE.addService(ledService);

//  ledCharacteristic.writeValue(1);
//  happyButtonCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth® device active, waiting for connections...");
}

void loop() {
  // poll for Bluetooth® Low Energy events
  BLE.poll();

  // read the current button pin state
//  char buttonValue = digitalRead(buttonPin);
// has the value changed since the last read
//  bool buttonChanged = (happyButtonCharacteristic.value() != buttonValue);

//  if (buttonChanged) {
//    // button state changed, update characteristics
////    ledCharacteristic.writeValue(buttonValue);
//    happyButtonCharacteristic.writeValue(buttonValue);
//  }

//ledCharacteristic.written() || buttonChanged || 
  if (happyButtonCharacteristic.written()) {
    // update LED, either central has written to characteristic or button state has changed
    if (happyButtonCharacteristic.value() == 1) {
      leds.setColorRGB(0,0,255,0);
      Serial.println("LED on");
    } else {
      leds.setColorRGB(0,0,0,0);
      Serial.println("LED off");
    }
//    if (ledCharacteristic.value()) {
//      Serial.println("LED on");
//      digitalWrite(ledPin, HIGH);
//    } else {
//      Serial.println("LED off");
//      digitalWrite(ledPin, LOW);
//    }
  }
}
