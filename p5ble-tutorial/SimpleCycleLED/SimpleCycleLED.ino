
/* 
 * Example of using the ChainableRGB library for controlling a Grove RGB.
 * This code puts a red dot (led) moving along a strip of blue dots.
 */

#include <ChainableLED.h>

#define NUM_LEDS  1

ChainableLED leds(7, 8, NUM_LEDS);

const int buttonPin = 2; // set buttonPin to digital pin 4
const int ledPin = 7;

void setup()
{
//  Serial.begin(9600);
  leds.setColorRGB(1,0,0,0);

  pinMode(ledPin, OUTPUT);
  pinMode(buttonPin, INPUT); // use button pin as an input
}


void loop()
{
  char buttonValue = digitalRead(buttonPin);
   if (buttonValue == HIGH) {
    // turn LED on:
    leds.setColorRGB(0,0,255,0);
  } else {
    // turn LED off:
    leds.setColorRGB(0,0,0,0);
  }
  
}
