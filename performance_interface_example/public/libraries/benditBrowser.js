//The Bendit_I/O Browser-side API
require = (function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function (e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    "bendit": [function (require, module, exports) {

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

        class BenditDevice {
            //class for a new Bendit Device
            constructor(numOfSwitches, numOfPots, numOfMotors) {
                console.log("Bendit Device Built");
                this.switches = []; //array of switches
                this.pots = []; //array of pot channels
                this.motors = []; //array of motor channels 
                this.deviceNumber = 0;
                this.deviceNickname = "string";
                this.deviceColor = "string";
                this.boardVersion = int(0.0); //revision of the hardware


                //for loop based on numSwitches
                // new Switch
                console.log("built the switch array!");

                for (let i = 0; i < numOfSwitches; i++) {
                    this.switches[i] = new Switch();
                }

                for (let i = 0; i < numOfPots; i++) {
                    this.pots[i] = new Pot();
                }

                for (let i = 0; i < numOfMotors; i++) {
                    this.motors[i] = new Motor();
                }

            }


            getDeviceProfile() {
                /* socket.emit to server to ask device for
                   onboard profile data
                */

            }

            writeDeviceProfile() {

            }


        }

        class Switch {
            constructor() {
                console.log("I am a switch!");

            }

            flip() {
                console.log("Ya flipped my wig!");
            }

            toggle() {

            }
        }

        class Pot {
            constructor() {
                console.log("I am a pot channel!");
            }

            set(potValue) {
                console.log("my value was just set to " + potValue);
            }
        }

        class Motor {
            constructor() {
                console.log("I'm a new motor!")
            }
        }

        module.exports = BenditDevice;
    }, {}]
}, {}, []);