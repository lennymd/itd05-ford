// use Servo library
#include <Servo.h>

// create servo variables
Servo servo_left;
Servo servo_center;
Servo servo_right;

char incomingByte; 



void setup() {
  Serial.begin(9600);
  
  // set up Servo to work 
  servo_left.attach(2);
  servo_center.attach(3);
  servo_right.attach(4)
  

  // 2 is calibrated as neutral servo state. This is happy state.
  buddyServo.write(2);


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
      // happy state. Set LED to 255,0,0. Rotate to position angry (180)
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
