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
  
    servoL.write(0);
    servoC.write(0);
    servoR.write(0);

}

void loop() {
  //  neutral idea
  //  turnServo(servoL, 0, 180, 5, 15);
  //  delay(1000);
  //  turnServo(servoC, 0, 180, 5, 15);
  //  delay(1000);
  //  turnServo(servoR, 0, 180, 5, 15);
  //  delay(2000);

  //  turnServo(servor, 180, 0, 5, 15);
  //  delay(1000);
  //  turnServo(servoC, 180, 0, 5, 15);
  //  delay(1000);
  //  turnServo(servoL, 180, 0, 5, 15);
  //  delay(1000);

  if (Serial.available() > 0) {
    // if there is a serial port available that we can communicate with, do stuff.

    // read the oldest byte in the buffer.
    incoming_byte = Serial.read();
    Serial.println(incoming_byte);
  }
  // check what incoming_byte is and then do the right rotations.
  if (incoming_byte == '1') {
    // neutral state
    digitalWrite(LED_BUILTIN, HIGH);
    delay(1000);
    digitalWrite(LED_BUILTIN, LOW);
    delay(1000);
  }

  if (incoming_byte == '2') {
    // happy state
    digitalWrite(LED_BUILTIN, HIGH);
    //            delay(1000);
    //            digitalWrite(LED_BUILTIN, LOW);
    //            delay(1000);
  }

  if (incoming_byte == '3') {
    // angry state
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
    digitalWrite(LED_BUILTIN, LOW);
    delay(500);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(500);
  }
}



void turnServo(Servo ser, int startPos, int endPos, int sStep, int sDelay) {
  int _pos = 0;
  for (_pos = startPos; _pos <= endPos; _pos += sStep) {
    ser.write(_pos);
    delay(sDelay);
  }

  //  for (_pos = endPos; _pos >= startPos; _pos += sStep) {
  //    ser.write(_pos);
  //    delay(sDelay);
  //  }
}
