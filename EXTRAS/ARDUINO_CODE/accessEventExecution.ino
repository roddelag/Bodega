#include <Servo.h>
Servo introGate; 
int motionAngle = 0;

void setup() {
  introGate.attach(12);
  Serial.begin(9600);
}

void loop() {
  delay(100);
  if(Serial.available()) {
      motionAngle = Serial.parseInt();
      Serial.println("ANGLE RECEIVED:  " + String(motionAngle));
      introGate.write(motionAngle);
      Serial.println("SERVO MOVED TO:  " + String(motionAngle));
      delay(8500);
    }
}
