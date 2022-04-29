/*
  ble_happyInteraction

  This code creates a BLE peripheral with a service that controls a ChainableLED.
*/
#include <ChainableLED.h>
#include <ArduinoBLE.h>

#define NUM_LEDS 1

ChainableLED leds(7,8,NUM_LEDS);

// create a service that will work for the happy interactions.
BLEService dashBuddyService("cee3e619-9134-407e-8110-9b3b17babab8");

// create a characteristic that will read and get notified when the LED needs to be turned on. 
BLEByteCharacteristic ledCharacteristic("cee3e619-9134-407e-8110-9b3b17babab8", BLEWrite | BLERead | BLENotify);

void setup() {
  Serial.begin(9600);
  // set LED to 0.
  leds.setColorRGB(0,0,0,0);
  pinMode(7, OUTPUT); // use the LED as an output

  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting Bluetooth® Low Energy module failed!");
    while (1);
  }

  // set the local name peripheral advertises
  BLE.setLocalName("Dash Buddy");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(dashBuddyService);

  // add the characteristics to the service
  dashBuddyService.addCharacteristic(ledCharacteristic);

  // add the service
  BLE.addService(dashBuddyService);
  ledCharacteristic.writeValue(1);

  // start advertising
  BLE.advertise();

  Serial.println("Bluetooth® device active, waiting for connections...");
}

void loop() {
  // poll for Bluetooth® Low Energy events
  BLE.poll();

  if (ledCharacteristic.written()) {
    // update LED, either central has written to characteristic or button state has changed
    if (ledCharacteristic.value() == 1) {
      leds.setColorRGB(0,0,255,0);
      Serial.println("LED on");
    } else {
      leds.setColorRGB(0,0,0,0);
      Serial.println("LED off");
    }
  }
}
