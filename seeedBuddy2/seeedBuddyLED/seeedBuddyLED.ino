#include <ChainableLED.h>
#include <Servo.h>

#define NUM_LEDS  2

Servo buddyServo;
ChainableLED leds(4,5, NUM_LEDS);
char incomingByte; 



void setup() {
  Serial.begin(9600);
  
  // set up Servo to work with Pin D4.  
  buddyServo.attach(2);

  // 2 is calibrated as neutral servo state. This is happy state.
  buddyServo.write(2);
  leds.setColorRGB(0,0,0,255);
  leds.setColorRGB(0,0,0,0);


}

void loop() {
  // put your main code here, to run repeatedly:
  
  if (Serial.available() > 0) {
    //Serial.println("test");
    // read the oldest byte in the serial buffer:
    incomingByte = Serial.read();
    //Serial.println(incomingByte);
    if (incomingByte == '1') {
      // neutral state. Set LED to 0. And Neutral position for servo
      buddyServo.write(2);
      leds.setColorRGB(0, 0,0,0);
    }

    if (incomingByte == '2'){
      // angry state. Set LED to 255,0,0. Rotate to position angry (180)
      buddyServo.write(180);
      leds.setColorRGB(0,255,0,0);      
    }

    if (incomingByte == '3'){
      // happy state. SET LEd to 0,255,0. Make sure position is happy (2)
      buddyServo.write(2);
      leds.setColorRGB(0,0,255,0);
    }
  }

}
