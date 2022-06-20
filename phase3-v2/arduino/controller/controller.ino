// use Servo library
#include <Servo.h>

// create servo variables

Servo servoL;
Servo servoC;
Servo servoR;

// we'll read the out_message from p5 into this incomingByte using the serial connection
char incoming_byte = '1';

//posL is for the left servo
int posL = 0;
int posC = 0;
int posR = 0;

void setup() {
  Serial.begin(9600);

  // set up Servo to work. they should be plugged into D2,D3,D4 from Left (steering wheel) to right (empty vacuum).
  servoL.attach(2);
  servoC.attach(3);
  servoR.attach(4);

  // For these servos, 90 should be straight ahead, 0 is left, 180 is right
  servoL.write(0);
  servoC.write(0);
  servoR.write(0);



  //  neutral idea
  servoL.write(0);
  servoC.write(0);
  servoR.write(0);
  delay(1000);

  sweepServo(servoL, 0, 130, 5, 60);
  delay(1000);
  sweepServo(servoC, 0, 130, 5, 60);
  delay(1000);
  sweepServo(servoR, 0, 130, 5, 60);
  delay(1000);

}

void loop() {
  //  neutral idea


  if (Serial.available() > 0) {
    // if there is a serial port available that we can communicate with, do stuff.

    // read the oldest byte in the buffer.
    incoming_byte = Serial.read();
    Serial.println(incoming_byte);
  }
  // check what incoming_byte is and then do the right rotations.
  if (incoming_byte == '1') {
    // neutral state
    //    digitalWrite(LED_BUILTIN, HIGH);
    //    delay(1000);
    //    digitalWrite(LED_BUILTIN, LOW);
    //    delay(1000);
  }

  if (incoming_byte == '2') {
    // happy state
    //    digitalWrite(LED_BUILTIN, HIGH);
    //            delay(1000);
    //            digitalWrite(LED_BUILTIN, LOW);
    //            delay(1000);
  }

  if (incoming_byte == '3') {
    // angry state
    //    digitalWrite(LED_BUILTIN, LOW);
    //    delay(500);
    //    digitalWrite(LED_BUILTIN, HIGH);
    //    delay(500);
    //    digitalWrite(LED_BUILTIN, LOW);
    //    delay(500);
    //    digitalWrite(LED_BUILTIN, HIGH);
    //    delay(500);
    //    digitalWrite(LED_BUILTIN, LOW);
    //    delay(500);
    //    digitalWrite(LED_BUILTIN, HIGH);
    //    delay(500);
  }
}



void turnServo(Servo ser, int startPos, int endPos, int sStep, int sDelay) {
  int _pos = 0;

  if (startPos < endPos) {
    for (_pos = startPos; _pos <= endPos; _pos += sStep) {
      ser.write(_pos);
      delay(sDelay);
    }
  } else if (startPos > endPos) {
    for (_pos = endPos; _pos >= startPos; _pos -= sStep) {
      ser.write(_pos);
      delay(sDelay);
    }
  }
}

void sweepServo(Servo ser, int startPos, int endPos, int sStep, int sDelay) {
  int pos = startPos;
  for (pos = startPos; pos <= endPos; pos += sStep) { // goes from 0 degrees to 180 degrees
    // in steps of 1 degree
    ser.write(pos);              // tell servo to go to position in variable 'pos'
    delay(sDelay);                       // waits 15 ms for the servo to reach the position
  }
  for (pos = endPos; pos >= startPos; pos -= 1) { // goes from 180 degrees to 0 degrees
    ser.write(pos);              // tell servo to go to position in variable 'pos'
    delay(sDelay);                       // waits 15 ms for the servo to reach the position
  }
}
