/*
Bendit_I/O: Wireless Circuit Bending

Bendit Board code

***Work in Progress***

Anthony T. Marasco - 2019
*/

#include <SocketIoClient.h>
#include <stdlib.h>
#include <SPI.h>
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
#include <Ticker.h>
int i=0;
//instance of WiFiMulti library to hold multiple network ssid/password pairs
WiFiMulti wifiMultiScan;
int deviceNumber =0;
const char assignedDeviceNumber = 0;
String deviceColor ="none";
    //server IP
    char host[] = "192.168.1.149";
//server port
int port = 3000;
//Switch and Motor pins
int switchPins[6] = {15, 32, 14, 22, 23, 21};
// LED pins
int ledPins[3] = {13, 12, 27};
int redPin = ledPins[0];   // Red LED,   connected to digital pin 9
int grnPin = ledPins[1];  // Green LED, connected to digital pin 10
int bluPin = ledPins[2];  // Blue LED,  connected to digital pin 11

// Color arrays for fade
char black[3]  = { 0, 0, 0 };
char white[3]  = { 100, 100, 100 };
char pink[3]    = { 199, 21, 133};
char orange[3] = {255, 165, 0};
char green[3]  = { 0, 100, 0 };
char blue[3]   = { 0, 0, 100 };
char yellow[3] = { 40, 95, 0 };
char dimWhite[3] = { 30, 30, 30 };

//RGB color arrays for status
/*
int aquaRGB[3] = {0, 255, 255};
int purpleRGB[3] = {80, 0, 80};
int yellowRGB[3] = {255, 255, 0};
int orangeRGB[3] = {255, 165, 0};
int greenRGB[3] = {0, 255, 0};
int pinkRGB[3] = {255, 182, 193};
*/


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

int chipSelect = 33;

int sw1State = 0;
int sw2State = 0;
int sw3State = 0;
int sw4State = 0;
int sw5State = 0;
int sw6State = 0;

//Socket instance
SocketIoClient webSocket;
//Ticker instances
Ticker switch1, switch2, switch3, switch4, switch5, switch6;
String myString ="00:00:00:00:00:00";
String deviceNumberString = "0";
//************************************ Device Functions*****************************
//digtialPotTurning function
void writeDigitalPot(int address, int value) {
  digitalWrite(chipSelect, LOW);
  SPI.transfer(address);
  SPI.transfer(value);
  delay(10);
  digitalWrite(chipSelect, HIGH);
}


void setSwitch1() {
  sw1State = 1 - sw1State; // toggle!
  digitalWrite(switchPins[0], sw1State);
}

void setSwitch1(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[0], state);
    sw1State = state;
  }
  else
  {
    sw1State = 1 - sw1State; // toggle!
    digitalWrite(switchPins[0], sw1State);
  }
}

void setSwitch2() {
  sw2State = 1 - sw2State; // toggle!
  digitalWrite(switchPins[1], sw2State);
}

void setSwitch2(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[1], state);
    sw2State = state;
  }
  else
  {
    sw2State = 1 - sw2State; // toggle!
    digitalWrite(switchPins[1], sw2State);
  }
}


void setSwitch3() {
  sw3State = 1 - sw3State; // toggle!
  digitalWrite(switchPins[2], sw3State);
}

void setSwitch3(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[2], state);
    sw3State = state;
  }
  else
  {
    sw3State = 1 - sw3State; // toggle!
    digitalWrite(switchPins[2], sw3State);
  }
}

void setSwitch4() {
  sw4State = 1 - sw4State; // toggle!
  digitalWrite(switchPins[3], sw4State);
}


void setSwitch4(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[3], state);
    sw4State = state;
  }
  else
  {
    sw4State = 1 - sw4State; // toggle!
    digitalWrite(switchPins[3], sw4State);
  }
}

void setSwitch5() {
  sw5State = 1 - sw5State; // toggle!
  digitalWrite(switchPins[4], sw5State);
}

void setSwitch5(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[4], state);
    sw5State = state;
  }
  else
  {
    sw5State = 1 - sw5State; // toggle!
    digitalWrite(switchPins[4], sw5State);
  }
}

void setSwitch6()
{
  sw6State = 1 - sw6State; // toggle!
  digitalWrite(switchPins[5], sw6State);
}

void setSwitch6(int state)
{
  if (state > -1)
  {
    digitalWrite(switchPins[5], state);
    sw6State = state;
  }
  else
  {
    sw6State = 1 - sw6State; // toggle!
    digitalWrite(switchPins[5], sw6State);
  }
}

//wrappers to run metros on Switches

void runMetroSw1(int speed) {
  switch1.attach_ms(speed, setSwitch1);
}

void runMetroSw2(int speed) {
  switch2.attach_ms(speed, setSwitch2);
}
//************************************ Socket Callbacks*****************************
//Digital Pots
void potTurn(const char * payload, size_t length) {
  Serial.printf("pot position: %s\n ",  payload);
  int i = atoi(payload);
  if (i < 0) {
    i = 0;
  } else if (i > 255) {
    i = 255;
  }
  writeDigitalPot(0, i);
}


//Serial Monitor
void event(const char * payload, size_t length) {
  Serial.printf("got message: %s\n", payload);
}
void printDisconnect(const char * payload, size_t length) {
  Serial.println("We're disconnected!");
}

void printConnect(const char * payload, size_t length) {
  Serial.println("Sweet! I'm connected.");
  
}

//Switches

//toggle functions
void toggleSwitch1(const char * payload, size_t length) {
  Serial.printf("[switch]: %s\n ",  payload);
  //Serial.printf("[switchPins[0]: %d\n ",  switchPins[0]);
  if (!strcmp(payload, "true")) { //{\"state\":true}"
    Serial.println("[Switch 1] ON");
    //digitalWrite(ledPins[0], HIGH);
    digitalWrite(switchPins[0], HIGH);
  }
  else {
    Serial.println("[Switch 1] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[0], LOW);

  }
}

void toggleSwitch2(const char * payload, size_t length) {
  Serial.printf("[switch]: %s\n ",  payload);
  //Serial.printf("[switchPins[1]: %s\n ",  switchPins[1]); //this line causes Core Panic crash Why???
  if (!strcmp(payload, "true")) { //{\"state\":true}"
    Serial.println("[Switch 2] ON");
    //digitalWrite(ledPins[0], HIGH);
    digitalWrite(switchPins[1], HIGH);
  }
  else {
    Serial.println("[Switch 2] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[1], LOW);

  }
}

void toggleSwitch3(const char *payload, size_t length)
{
  Serial.printf("[switch]: %s\n ", payload);
  
  if (!strcmp(payload, "true"))
  { //{\"state\":true}"
    Serial.println("[Switch 3] ON");
    
    digitalWrite(switchPins[2], HIGH);
  }
  else
  {
    Serial.println("[Switch 3] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[2], LOW);
  }
}

void toggleSwitch4(const char *payload, size_t length)
{
  Serial.printf("[switch]: %s\n ", payload);
  //Serial.printf("[switchPins[1]: %s\n ",  switchPins[1]); //this line causes Core Panic crash Why???
  if (!strcmp(payload, "true"))
  { //{\"state\":true}"
    Serial.println("[Switch 4] ON");
    //digitalWrite(ledPins[0], HIGH);
    digitalWrite(switchPins[3], HIGH);
  }
  else
  {
    Serial.println("[Switch 4] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[3], LOW);
  }
}

void toggleSwitch5(const char *payload, size_t length)
{
  Serial.printf("[switch]: %s\n ", payload);
  //Serial.printf("[switchPins[1]: %s\n ",  switchPins[1]); //this line causes Core Panic crash Why???
  if (!strcmp(payload, "true"))
  { //{\"state\":true}"
    Serial.println("[Switch 5] ON");
    //digitalWrite(ledPins[0], HIGH);
    digitalWrite(switchPins[4], HIGH);
  }
  else
  {
    Serial.println("[Switch 5] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[4], LOW);
  }
}

void toggleSwitch6(const char *payload, size_t length)
{
  Serial.printf("[switch]: %s\n ", payload);
  //Serial.printf("[switchPins[1]: %s\n ",  switchPins[1]); //this line causes Core Panic crash Why???
  if (!strcmp(payload, "true"))
  { //{\"state\":true}"
    Serial.println("[Switch 6] ON");
    //digitalWrite(ledPins[0], HIGH);
    digitalWrite(switchPins[5], HIGH);
  }
  else
  {
    Serial.println("[Switch 6] off");
    //digitalWrite(ledPins[0], LOW);
    digitalWrite(switchPins[5], LOW);
  }
}

//metro functions
void metroSwitch1(const char *payload, size_t length)
{
  switch1.detach();
  int sw1Speed = atoi(payload);
  
  switch1.attach_ms(sw1Speed, setSwitch1);
}

void metroSwitch1Stop(const char *payload, size_t length) {
  switch1.detach();
}

void metroSwitch2(const char *payload, size_t length)
{
  switch2.detach();
  int sw2Speed = atoi(payload);
  
  switch2.attach_ms(sw2Speed, setSwitch2);
}

void metroSwitch2Stop(const char *payload, size_t length)
{
  switch2.detach();
}


void metroSwitch3(const char *payload, size_t length)
{
  switch3.detach();
  int sw3Speed = atoi(payload);
  
  switch3.attach_ms(sw3Speed, setSwitch3);
}

void metroSwitch3Stop(const char *payload, size_t length) {
  switch3.detach();
}
  void metroSwitch4(const char *payload, size_t length)
  {
  switch4.detach();
  int sw4Speed = atoi(payload);
  
  switch4.attach_ms(sw4Speed, setSwitch4);
  }
void metroSwitch4Stop(const char *payload, size_t length) {
  switch4.detach();
}
  void metroSwitch5(const char *payload, size_t length)
  {
  switch5.detach();
  int sw5Speed = atoi(payload);
  
  switch5.attach_ms(sw5Speed, setSwitch5);
  }
void metroSwitch5Stop(const char *payload, size_t length) {
  switch5.detach();
}
  void metroSwitch6(const char *payload, size_t length)
  {
  switch6.detach();
  int sw6Speed = atoi(payload);
  
  switch6.attach_ms(sw6Speed, setSwitch6);
  }

  void metroSwitch6Stop(const char *payload, size_t length) {
  switch6.detach();
}

void setDeviceColor(const char *payload, size_t length)
{
  //deviceColor.copy(payload, length, 0);
  char bob[] = "bob";
  deviceColor = String(strncpy(bob, payload, length));
  Serial.println('\n');


  Serial.println(payload);

  if (!strcmp(payload, "green")) {
    setColor(0,255,0);
  } else if (!strcmp(payload, "yellow")) {
    setColor(255, 255, 0);
  } else if (!strcmp(payload, "orange")) {
    setColor(219, 98, 0);
  } else if (!strcmp(payload, "pink")) {
    setColor(231, 84, 128);
  }
  else if (!strcmp(payload, "purple"))
  {
   setColor(80, 0, 80);
  }
  else if(!strcmp(payload, "[")){

  }

}

void setDeviceNumber(const char *payload, size_t length)
{
  //deviceNumber = atoi(payload);
  //deviceNumberString.copy(payload, length, 0);
  char dnArray[] = "bob";
deviceNumberString = String(strncpy(dnArray, payload, length));
 //deviceNumberString = String(payload);
  Serial.println("Device Number: ");
  Serial.print(deviceNumberString);
}
//******************************************************************Main Code**************************************************
void setup()
{
int str_length = myString.length()+1;
int deviceStr_length = deviceNumberString.length()+1;
char deviceMACCharArray[str_length];
char deviceNumberCharArray[deviceStr_length];
    // Set up the Switch outputs

    for (int i = 0; i < 6; i++)
{
  pinMode(switchPins[i], OUTPUT);
  digitalWrite(switchPins[i], LOW);
  }
  // Set up the LED outputs
  pinMode(ledPins[0], OUTPUT); // sets the pins as output
  pinMode(ledPins[1], OUTPUT);
  pinMode(ledPins[2], OUTPUT);
  // Set up the SPI CS output
  pinMode(chipSelect, OUTPUT);

  SPI.begin();
  // ...set up the serial ouput
  Serial.begin(115200);
  delay(100);

  Serial.println("Connecting to WiFi "); //string, needs double quotes
  Serial.println(" ...");

  if (WiFi.status() != WL_CONNECTED){
    Serial.print('.');
      Serial.print(++i);

      crossFade(green);
      crossFade(pink);
      crossFade(yellow);
      crossFade(orange);
      crossFade(pink);
      
  }
 
  wifiMultiScan.addAP("NETGEAR481", "fearlesssocks430");
      wifiMultiScan.addAP("MonAndToneGlow", "UncagedNY2013");
  // while (wifiMultiScan.run() != WL_CONNECTED)
  // { //wait for the WiFi to connect
  //   //delay(50);
    
  //   Serial.print('.');
  //   Serial.print(++i);

  //   crossFade(green);
  //   crossFade(pink);
  //   crossFade(yellow);
  //   crossFade(orange);
  //   crossFade(pink);
  // }

  //Search for WiFi

 


  WiFi.mode(WIFI_MODE_STA);
  myString = WiFi.macAddress();
  myString.toCharArray(deviceMACCharArray, str_length);

  Serial.print("MAC Address: ");Serial.println(deviceMACCharArray);

  //char deviceMAC = WiFi.macAddress();

  if (wifiMultiScan.run() == WL_CONNECTED)
  {
    setColor(0, 255, 255); // aqua
    Serial.println('\n');  //print a new line command
    Serial.println("WiFi Connection established to ");
    Serial.println(WiFi.SSID());
  }
   

    //try to connect to server
    webSocket.on("connect", printConnect);
    webSocket.on("disconnected", printDisconnect);

    //Set up Client Callbacks to listen for

    webSocket.on("toggleSwitch1", toggleSwitch1);
    webSocket.on("toggleSwitch2", toggleSwitch2);
    webSocket.on("toggleSwitch3", toggleSwitch3);
    webSocket.on("toggleSwitch4", toggleSwitch4);
    webSocket.on("toggleSwitch5", toggleSwitch5);
    webSocket.on("toggleSwitch6", toggleSwitch6);

    webSocket.on("metroSwitch1", metroSwitch1);
    webSocket.on("metroSwitch1Stop", metroSwitch1Stop);
    webSocket.on("metroSwitch2", metroSwitch2);
    webSocket.on("metroSwitch2Stop", metroSwitch2Stop);
    webSocket.on("metroSwitch3", metroSwitch3);
    webSocket.on("metroSwitch3Stop", metroSwitch3Stop);
    webSocket.on("metroSwitch4", metroSwitch4);
    webSocket.on("metroSwitch4Stop", metroSwitch4Stop);
    webSocket.on("metroSwitch5", metroSwitch5);
    webSocket.on("metroSwitch5Stop", metroSwitch5Stop);
    webSocket.on("metroSwitch6", metroSwitch6);
    webSocket.on("metroSwitch6Stop", metroSwitch6Stop);

    webSocket.on("potTurn", potTurn);

    // switch/1/toggle
    // switch/1/toggle 1
    // switch/1/metro 500
    // pots/2/value 0.25
    // pots/2/value 0.25 5000
    // pots/2/metro 0.25 0.75 500
    // motor

    //Open the port
    webSocket.begin(host, port);
    //Set up client callbacks to send to server.
    // webSocket.emit("register", "\"device2\"");
    
    webSocket.emit("handshake", ("{\"MAC\": \"" +String(deviceMACCharArray)+"\", \"color\": \"" + String(deviceColor)+"\", \"nickname\": \"CDplayer\", \"section\": \"none\", \"deviceNumber\": \"" + String(deviceNumberString)+"\"}").c_str());
    webSocket.on("setDeviceColor", setDeviceColor);
    webSocket.on("setDeviceNumber", setDeviceNumber);
}





//Color Changing Stuff - April 2007, Clay Shirky <clay.shirky@nyu.edu>

/*
  Code for cross-fading 3 LEDs, red, green and blue (RGB)
  To create fades, you need to do two things:
   1. Describe the colors you want to be displayed
   2. List the order you want them to fade in

  DESCRIBING A COLOR:
  A color is just an array of three percentages, 0-100,
   controlling the red, green and blue LEDs

  Red is the red LED at full, blue and green off
    int red = { 100, 0, 0 }
  Dim white is all three LEDs at 30%
    int dimWhite = {30, 30, 30}
  etc.

  Some common colors are provided below, or make your own

  LISTING THE ORDER:
  In the main part of the program, you need to list the order
   you want to colors to appear in, e.g.
   crossFade(red);
   crossFade(green);
   crossFade(blue);

  Those colors will appear in that order, fading out of
     one color and into the next

  In addition, there are 5 optional settings you can adjust:
  1. The initial color is set to black (so the first color fades in), but
     you can set the initial color to be any other color
  2. The internal loop runs for 1020 interations; the 'wait' variable
     sets the approximate duration of a single crossfade. In theory,
     a 'wait' of 10 ms should make a crossFade of ~10 seconds. In
     practice, the other functions the code is performing slow this
     down to ~11 seconds on my board. YMMV.
  3. If 'repeat' is set to 0, the program will loop indefinitely.
     if it is set to a number, it will loop that number of times,
     then stop on the last color in the sequence. (Set 'return' to 1,
     and make the last color black if you want it to fade out at the end.)
  4. There is an optional 'hold' variable, which pasues the
     program for 'hold' milliseconds when a color is complete,
     but before the next color starts.
  5. Set the DEBUG flag to 1 if you want debugging output to be
     sent to the serial monitor.

     The internals of the program aren't complicated, but they
     are a little fussy -- the inner workings are explained
     below the main loop.

  April 2007, Clay Shirky <clay.shirky@nyu.edu>
*/
void setColor(int red, int green, int blue) {
#ifdef COMMON_ANODE
  red = 255 - red;
  green = 255 - green;
  blue = 255 - blue;
#endif
  analogWrite(ledPins[0], red);
  analogWrite(ledPins[1], green);
  analogWrite(ledPins[2], blue);
}


// Main program loop
void loop() {
  if (WiFi.status() != WL_CONNECTED)
  { //wait for the WiFi to connect
    //delay(50);
    Serial.println("Connecting to WiFi "); //string, needs double quotes
    Serial.println(" ...");
    Serial.print('.');
    Serial.print(++i);

    crossFade(green);
    crossFade(pink);
    crossFade(yellow);
    crossFade(orange);
    crossFade(pink);
  }

  webSocket.loop();
}



/* BELOW THIS LINE IS THE MATH -- YOU SHOULDN'T NEED TO CHANGE THIS FOR THE BASICS

  The program works like this:
  Imagine a crossfade that moves the red LED from 0-10,
    the green from 0-5, and the blue from 10 to 7, in
    ten steps.
    We'd want to count the 10 steps and increase or
    decrease color values in evenly stepped increments.
    Imagine a + indicates raising a value by 1, and a -
    equals lowering it. Our 10 step fade would look like:

    1 2 3 4 5 6 7 8 9 10
  R + + + + + + + + + +
  G   +   +   +   +   +
  B     -     -     -

  The red rises from 0 to 10 in ten steps, the green from
  0-5 in 5 steps, and the blue falls from 10 to 7 in three steps.

  In the real program, the color percentages are converted to
  0-255 values, and there are 1020 steps (255*4).

  To figure out how big a step there should be between one up- or
  down-tick of one of the LED values, we call calculateStep(),
  which calculates the absolute gap between the start and end values,
  and then divides that gap by 1020 to determine the size of the step
  between adjustments in the value.
*/

int calculateStep(int prevValue, int endValue) {
  int step = endValue - prevValue; // What's the overall gap?
  if (step) {                      // If its non-zero,
    step = 1020 / step;            //   divide by 1020
  }
  return step;
}

/* The next function is calculateVal. When the loop value, i,
   reaches the step size appropriate for one of the
   colors, it increases or decreases the value of that color by 1.
   (R, G, and B are each calculated separately.)
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
   0-255 range, then loops 1020 times, checking to see if
   the value needs to be updated each time, then writing
   the color values to the correct pins.
*/

void crossFade(char color[3]) {
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

    analogWrite(ledPins[0], redVal);   // Write current values to LED pins
    analogWrite(ledPins[1], grnVal);
    analogWrite(ledPins[2], bluVal);

    delay(wait); // Pause for 'wait' milliseconds before resuming the loop


  }
  // Update current values for next loop
  prevR = redVal;
  prevG = grnVal;
  prevB = bluVal;
  delay(hold); // Pause for optional 'wait' milliseconds before resuming the loop
}
