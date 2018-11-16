#include <SPI.h>

#include <SocketIoClient.h>

#include <WiFi.h>
#include <WiFiAP.h>
#include <WiFiMulti.h>
#include <WiFiUdp.h>
#include <WiFiScan.h>
#include <ETH.h>
#include <WiFiClient.h>
#include <WiFiSTA.h>
#include <WiFiServer.h>
#include <WiFiType.h>
#include <WiFiGeneric.h>

#include <analogWrite.h>

/*
* Code for cross-fading 3 LEDs, red, green and blue (RGB) 
* To create fades, you need to do two things: 
*  1. Describe the colors you want to be displayed
*  2. List the order you want them to fade in
*
* DESCRIBING A COLOR:
* A color is just an array of three percentages, 0-100, 
*  controlling the red, green and blue LEDs
*
* Red is the red LED at full, blue and green off
*   int red = { 100, 0, 0 }
* Dim white is all three LEDs at 30%
*   int dimWhite = {30, 30, 30}
* etc.
*
* Some common colors are provided below, or make your own
* 
* LISTING THE ORDER:
* In the main part of the program, you need to list the order 
*  you want to colors to appear in, e.g.
*  crossFade(red);
*  crossFade(green);
*  crossFade(blue);
*
* Those colors will appear in that order, fading out of 
*    one color and into the next  
*
* In addition, there are 5 optional settings you can adjust:
* 1. The initial color is set to black (so the first color fades in), but 
*    you can set the initial color to be any other color
* 2. The internal loop runs for 1020 interations; the 'wait' variable
*    sets the approximate duration of a single crossfade. In theory, 
*    a 'wait' of 10 ms should make a crossFade of ~10 seconds. In 
*    practice, the other functions the code is performing slow this 
*    down to ~11 seconds on my board. YMMV.
* 3. If 'repeat' is set to 0, the program will loop indefinitely.
*    if it is set to a number, it will loop that number of times,
*    then stop on the last color in the sequence. (Set 'return' to 1, 
*    and make the last color black if you want it to fade out at the end.)
* 4. There is an optional 'hold' variable, which pasues the 
*    program for 'hold' milliseconds when a color is complete, 
*    but before the next color starts.
* 5. Set the DEBUG flag to 1 if you want debugging output to be
*    sent to the serial monitor.
*
*    The internals of the program aren't complicated, but they
*    are a little fussy -- the inner workings are explained 
*    below the main loop.
*
* April 2007, Clay Shirky <clay.shirky@nyu.edu> 
*/


const char* ssid = "NETGEAR481"; //theSSID of WiFi to connect to
const char* password ="fearlesssocks430"; //the network password

/*
const char* ssid = "MonAndToneGlow";
const char* password = "UncagedNY2013";
*/
char host[] = "192.168.1.109";
//char host[] = "192.168.1.6";
int port = 3000;

// Output
int redPin = 12;   // Red LED,   connected to digital pin 9
int grnPin = 15;  // Green LED, connected to digital pin 10
int bluPin = 27;  // Blue LED,  connected to digital pin 11

// Color arrays
int black[3]  = { 0, 0, 0 };
int white[3]  = { 100, 100, 100 };
int pink[3]    = { 199, 21, 133};
int orange[3] = {255, 165, 0};
int green[3]  = { 0, 100, 0 };
int blue[3]   = { 0, 0, 100 };
int yellow[3] = { 40, 95, 0 };
int dimWhite[3] = { 30, 30, 30 };
// etc.

// Set initial color
int redVal = black[0];
int grnVal = black[1]; 
int bluVal = black[2];

int wait = 1;      // 10ms internal crossFade delay; increase for slower fades
int hold = 0;       // Optional hold when a color is complete, before the next crossFade
int DEBUG = 1;      // DEBUG counter; if set to 1, will write values back via serial
int loopCount = 60; // How often should DEBUG report?
int repeat = 3;     // How many times should we loop before stopping? (0 for no stop)
int j = 0;          // Loop counter for repeat

// Initialize color variables
int prevR = redVal;
int prevG = grnVal;
int prevB = bluVal;

bool clicked = false;
int switchPin = 13;
int chipSelect =33;

SocketIoClient webSocket;

//digtialPotTurning function
void writeDigitalPot(int address, int value){
digitalWrite(chipSelect,LOW);
SPI.transfer(address);
SPI.transfer(value);
delay(10);
digitalWrite(chipSelect, HIGH);
}

//Socket Callback functions
void potTurn(const char * payload, size_t length){
   Serial.printf("pot position: %s\n ",  payload);
   int i =atoi(payload);
   if (i<0) {
      i = 0;
   } else if (i>255) {
      i = 255;
   }
   writeDigitalPot(2, i);
   }
   


void event(const char * payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
}
void printDisconnect(const char * payload, size_t length){
  Serial.println("We're disconnected!");
}

void printConnect(const char * payload, size_t length){
  Serial.println("Sweet! I'm connected.");
}

void light(const char * payload, size_t length) {
  Serial.printf("[light]: %s\n ",  payload);
  if (!strcmp(payload,"{\"state\":true}")) {
    Serial.println("[light] ON");
    digitalWrite(switchPin, HIGH);
  }
  else {
    Serial.println("[light] off");
    digitalWrite(switchPin, LOW);
  }
}


// Set up the LED outputs
void setup(){
  pinMode(switchPin, OUTPUT);
  pinMode(redPin, OUTPUT);   // sets the pins as output
  pinMode(grnPin, OUTPUT);   
  pinMode(bluPin, OUTPUT);
  pinMode(chipSelect, OUTPUT);
     
  digitalWrite(switchPin, LOW);

  SPI.begin();
    Serial.begin(115200);  // ...set up the serial ouput 
  delay(100);
  WiFi.begin(ssid, password); //function call to connect to network
  Serial.print("Connecting to "); //string, needs double quotes
  Serial.print(ssid);Serial.println(" ...");

  
int i =0; //our loop counter variable
while(WiFi.status() != WL_CONNECTED){//wait for the WiFi to connect
  delay(1000);//wait a second
  Serial.print(++i);Serial.print('.');
    //crossFade(green);
  crossFade(pink);
  
  crossFade(orange);
  crossFade(yellow);
}

setColor(0, 255, 255);  // aqua
Serial.println('\n'); //print a new line command
Serial.println("Connection established!"); 

//try to connect to server
 webSocket.on("connect", printConnect);
  webSocket.on("disconnected", printDisconnect);
  
  webSocket.on("light", light);
  webSocket.on("potTurn", potTurn);
  webSocket.begin(host, port);
}

void setColor(int red, int green, int blue){
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(grnPin, green);
  analogWrite(bluPin, blue);  
}
void click(){
  clicked =true;
}

// Main program loop
void loop(){
  webSocket.loop();
}



/* BELOW THIS LINE IS THE MATH -- YOU SHOULDN'T NEED TO CHANGE THIS FOR THE BASICS
* 
* The program works like this:
* Imagine a crossfade that moves the red LED from 0-10, 
*   the green from 0-5, and the blue from 10 to 7, in
*   ten steps.
*   We'd want to count the 10 steps and increase or 
*   decrease color values in evenly stepped increments.
*   Imagine a + indicates raising a value by 1, and a -
*   equals lowering it. Our 10 step fade would look like:
* 
*   1 2 3 4 5 6 7 8 9 10
* R + + + + + + + + + +
* G   +   +   +   +   +
* B     -     -     -
* 
* The red rises from 0 to 10 in ten steps, the green from 
* 0-5 in 5 steps, and the blue falls from 10 to 7 in three steps.
* 
* In the real program, the color percentages are converted to 
* 0-255 values, and there are 1020 steps (255*4).
* 
* To figure out how big a step there should be between one up- or
* down-tick of one of the LED values, we call calculateStep(), 
* which calculates the absolute gap between the start and end values, 
* and then divides that gap by 1020 to determine the size of the step  
* between adjustments in the value.
*/

int calculateStep(int prevValue, int endValue) {
  int step = endValue - prevValue; // What's the overall gap?
  if (step) {                      // If its non-zero, 
    step = 1020/step;              //   divide by 1020
  } 
  return step;
}

/* The next function is calculateVal. When the loop value, i,
*  reaches the step size appropriate for one of the
*  colors, it increases or decreases the value of that color by 1. 
*  (R, G, and B are each calculated separately.)
*/

int calculateVal(int step, int val, int i) {

  if ((step) && i % step == 0) { // If step is non-zero and its time to change a value,
    if (step > 0) {              //   increment the value if step is positive...
      val += 1;           
    } 
    else if (step < 0) {         //   ...or decrement it if step is negative
      val -= 1;
    } 
  }
  // Defensive driving: make sure val stays in the range 0-255
  if (val > 255) {
    val = 255;
  } 
  else if (val < 0) {
    val = 0;
  }
  return val;
}

/* crossFade() converts the percentage colors to a 
*  0-255 range, then loops 1020 times, checking to see if  
*  the value needs to be updated each time, then writing
*  the color values to the correct pins.
*/

void crossFade(int color[3]) {
  // Convert to 0-255
  int R = (color[0] * 255) / 100;
  int G = (color[1] * 255) / 100;
  int B = (color[2] * 255) / 100;

  int stepR = calculateStep(prevR, R);
  int stepG = calculateStep(prevG, G); 
  int stepB = calculateStep(prevB, B);

  for (int i = 0; i <= 1020; i++) {
    redVal = calculateVal(stepR, redVal, i);
    grnVal = calculateVal(stepG, grnVal, i);
    bluVal = calculateVal(stepB, bluVal, i);

    analogWrite(redPin, redVal);   // Write current values to LED pins
    analogWrite(grnPin, grnVal);      
    analogWrite(bluPin, bluVal); 

    delay(wait); // Pause for 'wait' milliseconds before resuming the loop

    
  }
  // Update current values for next loop
  prevR = redVal; 
  prevG = grnVal; 
  prevB = bluVal;
  delay(hold); // Pause for optional 'wait' milliseconds before resuming the loop
}
