#include <ChainableLED.h>
#include <ArduinoBLE.h>

int vibration = 5;
int closeButton = 6;
int button = 4;
int slide = A0; // select the input pin for the potentiometer
int led = 2; // select the pin for the LED
int slideVal;   // variable to store the value coming from the sensor
int dta = 255;
bool on;

#define NUMLed 1

ChainableLED leds(2, 3, NUMLed);

BLEService controlService("19B10010-E8F2-537E-4F6C-D104768A1214"); // create service

// create switch characteristic and allow remote device to read and write
BLEByteCharacteristic remoteButtonCharacteristic("19B10011-E8F2-537E-4F6C-D104768A1214", BLERead | BLEWrite);
BLEByteCharacteristic remoteSliderCharacteristic("19B10011-E8F2-537E-4F6C-D104768A1215", BLERead | BLEWrite);

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Ready");

  on = false;
  pinMode(led, OUTPUT); // set ledPin to OUTPUT
  pinMode(button, INPUT);  // initialize the pushbutton pin as an input
  pinMode(slide, INPUT);


  // begin initialization
  if (!BLE.begin()) {
    Serial.println("starting BLE failed!");
    while (1);
  }

  // set the local name peripheral advertises
  BLE.setLocalName("ARDUINO Controler");
  // set the UUID for the service this peripheral advertises:
  BLE.setAdvertisedService(controlService);

  // add the characteristics to the service
  controlService.addCharacteristic(remoteButtonCharacteristic);
  controlService.addCharacteristic(remoteSliderCharacteristic);

  // add the service
  BLE.addService(controlService);

  // start advertising
  BLE.advertise();

  remoteSliderCharacteristic.writeValue(255);

  Serial.println("Bluetooth device active, waiting for connections...");
}

void ledLight(int slideVal)    {

  dta = remoteSliderCharacteristic.value();

  int colorR = 255 - dta;
  int colorG = 0;
  int colorB = dta;

  leds.setColorRGB(0, colorR, colorG, colorB);
}

void loop() {

  BLE.poll();

  if (remoteButtonCharacteristic.value() == 1 && !on) {
    remoteButtonCharacteristic.writeValue(0);
    on = true;
    digitalWrite(vibration, HIGH);
    delay(300);
    digitalWrite(vibration, LOW);
    leds.setColorRGB(0, 0, 0, 255);
  } else if (remoteButtonCharacteristic.value() == 1 && on){
    remoteButtonCharacteristic.writeValue(0);
    on = false;
    leds.setColorRGB(0, 0, 0, 0);
  }

  if (on == true) {
    slideVal = analogRead(slide); // read the value from the slider
    Serial.println(slideVal);
    ledLight(slideVal);
  }

  if ( dta < 10 && digitalRead(closeButton) == HIGH) {
    on = false;
    digitalWrite(vibration, HIGH);
    delay(1000);
    digitalWrite(vibration, LOW);
    leds.setColorRGB(0, 0, 0, 0);
  }

}