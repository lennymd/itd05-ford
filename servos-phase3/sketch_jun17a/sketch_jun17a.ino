#include <Servo.h>

Servo servo0;
Servo servo1;
Servo servo2;

void setup() {
  // put your setup code here, to run once:
  servo0.attach(2);
  servo1.attach(3);
  servo2.attach(4);

  servo0.write(0);
  servo1.write(0);
  servo2.write(0);
}

void loop() {
  // put your main code here, to run repeatedly:

}
