/* Example for ESP-32 Feather board*/

#include <WiFi.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <WiFiServer.h>



const char* ssid = "MonAndToneGlow"; //theSSID of WiFi to connect to
const char* password ="UncagedNY2013"; //the network password



void setup() {
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
Serial.println(WiFi.localIP());         // Send the IP address of the ESP8266 to the computer
}

void loop() {
  // put your main code here, to run repeatedly:

}
