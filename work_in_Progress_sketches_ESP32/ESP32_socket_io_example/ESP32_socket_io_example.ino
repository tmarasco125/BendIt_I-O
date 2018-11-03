#include <SocketIoClient.h>

//RoboJay modified version




/* Connect ESP-32 Feather board to server with Socket.io*/

#include <WiFi.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <WiFiServer.h>

bool clicked = false;
int LedPin = 13;
SocketIoClient webSocket;


const char* ssid = "NETGEAR481"; //theSSID of WiFi to connect to
const char* password ="fearlesssocks430"; //the network password

/*
const char* ssid = "MonAndToneGlow";
const char* password = "UncagedNY2013";
*/
char host[] = "192.168.1.119";
//char host[] = "192.168.1.6";
int port = 3000;

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
    digitalWrite(LedPin, HIGH);
  }
  else {
    Serial.println("[light] off");
    digitalWrite(LedPin, LOW);
  }
}

void setup() {
  pinMode(LedPin, OUTPUT);

  digitalWrite(LedPin, LOW);
  Serial.begin(115200); //Start serial communication to speak to our computer
  delay(100); //wait before logging any initial serial messages
  Serial.println('\n'); //print a new line command

  WiFi.begin(ssid, password); //function call to connect to network
  Serial.print("Connecting to "); //string, needs double quotes
  Serial.print(ssid);Serial.println(" ...");

  
  /*
   now we create a while loop to start checking
   to see if we have a successful connection.
   If we DON'T get a connection, we want to stay 
   in the loop and keep trying. Once we connect,
   we can break the loop and continue below.
   */
int i =0; //our loop counter variable
while(WiFi.status() != WL_CONNECTED){//wait for the WiFi to connect
  delay(1000);//wait a second
  Serial.print(++i);Serial.print('.');  
}

//once WiFi is connected..

Serial.println('\n'); //print a new line command
Serial.println("Connection established!");  
Serial.print("ESP Device IP address:\t");
Serial.println(WiFi.localIP());         // Send the IP address of the ESP32 to the computer

//Try to connect to server

  webSocket.on("connect", printConnect);
  webSocket.on("disconnected", printDisconnect);
  
  webSocket.on("light", light);
  //webSocket.on("potTurn", potTurn);
  webSocket.begin(host, port);
}

void click(){
  clicked =true;
}


void loop() {
  // put your main code here, to run repeatedly:
webSocket.loop();
}
