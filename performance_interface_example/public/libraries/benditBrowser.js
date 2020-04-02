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

       
        class Bendit {
            constructor(){
                
                //this.socket;
                this.devices = [];

                this.socket = io.connect(window.location.origin, {
                    transports: ['websocket']
                });
                console.log("nexusHub Server Initialized!");
                console.log("Connected to the Bendit_I/O Server ");

            //this.connect();
            }

            connect(url) {
                

            }

            addDevice(options){
                let newDevice;

                switch (typeof arguments[0]) {
                    case 'number':
                        newDevice = new BenditDevice(arguments[0],arguments[1],arguments[2], arguments[3]);
                        break;
                    case 'object':
                        newDevice = new BenditDevice(options.switches, options.pots, options.motors, options.deviceNumber);
                        break;

                }

                this.devices.push(newDevice);
                return newDevice;
            }

        }

        class BenditDevice {
            //class for a new Bendit Device
            constructor(options) {

                this.deviceNumber = 0;
                this.switches = []; //array of switches
                this.pots = []; //array of pot channels
                this.motors = []; //array of motor channels 
                this.deviceNickname = "string";
                this.deviceColor = "string";
                this.boardVersion = "0.0"; //revision of the hardware

                

                switch(typeof arguments[0]){
                    case 'number':
                        this.buildSwitchArray(arguments[0]);
                        this.buildPotArray(arguments[1]);
                        this.buildMotorArray(arguments[2]);
                        this.deviceNumber = arguments[3];
                        break;
                    case 'object':
                        this.buildSwitchArray(options.switches);
                        this.buildPotArray(options.pots);
                        this.buildMotorArray(options.motors);
                        this.deviceNumber = options.deviceNumber;
                        break;

                }
                
               
                this.addToDeviceArray();
                

                }
                buildSwitchArray(totalSwitches) {
                    console.log("built the switch array!");

                    for (let i = 0; i < totalSwitches; i++) {
                        this.switches[i] = new Switch(i);
                    }
                }

                buildPotArray(totalPots) {
                    console.log("built the pot array!");
                    for (let i = 0; i < totalPots; i++) {
                        this.pots[i] = new Pot(i);
                    }
                }

                buildMotorArray(totalMotors) {
                    for (let i = 0; i < totalMotors; i++) {
                        this.motors[i] = new Motor(i);
                    }
                    console.log("motor array, ready to rev!");
                }
                getDeviceProfile() {
                    /* socket.emit to server to ask device for
                       onboard profile data
                    */

                }

                writeDeviceProfile() {

                }

                addToDeviceArray(){
                    console.log("Added device to 'Connected Devices' array on the server")
                }


                //get device name
               


            }
           
            
        //base Bendit_module that Switch, Pot, and Motor are built from
        class Bendit_module {
            constructor(socket) {
                this.socket = socket;
            }
        }

        class Switch extends Bendit_module  {
            constructor(swNum) {
                super(socket);
                this.number = swNum;
                this.state = false;
                this.socket = socket;
            }

            setSwitch(v) {
                this.state = v;
                // Bendit.socket.emit('toggle1', {
                //    state: this.state,
                //    device: BenditDevice.deviceNumber
                // })
                
               
            }

            flipSwitch() {
                this.state = this.state ? false : true;
                //check state, change to opposite and STAY
                //look oup ternary for opposite
                console.log(this.state);
                
        
            }

            toggleSwitch(){
                //check what state it is, flip to the opposite and automatically after
                //set amount of time, flip back
                setTimeout(() => {
                    this.state = !state
                    console.log(state);
                }, 450);
            }
        }

        class Pot {
            constructor(potNum) {
                this.number = potNum;
                this.value = 0;
                console.log("I am a pot channel!");
            }

            setPot(potValue) {
                console.log("my value was just set to " + potValue);
            }
        }

        class Motor {
            constructor(motNum) {
                this.number = motNum;
                this.speed = 0;
                this.direction = 0;
                console.log("I'm a new motor!")
            }

            start(){

            }

            stop(){

            }

            flipDirection(){

            }

            
        }

        module.exports = {
            Device: BenditDevice,
            Hub: new Bendit(),
            Module: Bendit_module,
            Switch: Switch,
            Pot: Pot,
            Motor: Motor
        };

     }, {}]
     }, {}, []);