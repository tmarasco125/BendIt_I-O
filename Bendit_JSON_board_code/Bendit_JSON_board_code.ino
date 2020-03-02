//Bendit Board Code: Configuring Board Profile with JSON from Server


#include <ArduinoJson.h>
#include <SPIFFS.h>
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

//Define a class to hold the board profile data that gets read from our stored file.
//Used to push this data into a temporary JSON doc for serialization

/* struct Profile {
    
} */

const char *filename = "/board_profile.txt";

void loadLocalProfile(){

}
void parseProfile(const char* jsonInput){
    StaticJsonDocument<500> doc;
    DeserializationError err = deserializeJson(doc, jsonInput);

    if(err) {
        Serial.print("Deserialize Error: ");
        Serial.println(err.c_str()):
        return;
    };

    JsonObject board_firmware_stats = doc["board_firmware_stats"];
    float board_firmware_stats_version = board_firmware_stats["version"];         // 1.1
    const char *board_firmware_stats_date = board_firmware_stats["date"];         // "2/20"
    int board_firmware_stats_json_version = board_firmware_stats["json_version"]; // 1

    JsonObject bendit_device = doc["bendit_device"];
    int bendit_device_board_version = bendit_device["board_version"];   // 1
    const char *bendit_device_MAC = bendit_device["MAC"];               // "00-00-00-00-00-00"
    int bendit_device_total_switches = bendit_device["total_switches"]; // 8
    int bendit_device_total_pots = bendit_device["total_pots"];         // 8
    const char *bendit_device_nickname = bendit_device["nickname"];     // "CD Player"
    int bendit_device_device_number = bendit_device["device_number"];   // 1
    const char *bendit_device_LED_color = bendit_device["LED_color"];   // "0xffffff"
}


void setup(){


}


void loop(){


}