//The Bendit_I/O Browser-side API

'use strict';

/*In a performance interface, we'll start by defining a new
  BenditDevice for each device attached to a Bendit board
*/

// let BenditSwitch = {
//     name: 'switch-1',
//     state: 0,
//     flip: () => {
//         this.state = 1
//     },
//     toggle: () => {
//         // toggley stuff
//     }
// }

// let BenditPot ={
//     name: 'pot-1',
//     value: 0,
//     set: () => {
//         this.value = 0
//     }
// }
// let BenditDevice = {
//     switches: [],
//     addNewSwitch: () => {
//         this.switches.push(BenditSwitch);
//     }
//     addNewPot: () => {
//         this.pots.push(BenditPot);
//     }
}

class BenditDevice {
    //class for a new Bendit Device
    constructor(numOfSwitches, numOfPots, numOfMotors) {
        this.switches = []; //array of switches
        this.pots = []; //array of pot channels
        this.motors = []; //array of motor channels 
        this.deviceNumber = 0;
        this.deviceNickname = "string";
        this.deviceColor = "string";
        this.boardVersion = 0.0; //revision of the hardware
        
        buildSwitchArray(){
            //for loop base don numSwitches
            // new Switch
        }
    }

    
    getDeviceProfile(){
        /* socket.emit to server to ask device for
           onboard profile data
        */
        
    }

    writeDeviceProfile(){

    }


}

class Switch {
    constructor(){


    }

flip(){
    //console log a message for now
}

toggle(){
    //console log a message for now
}
}

class Pot{
    constructor(){

    }
}
module.exports = new BenditDevice();