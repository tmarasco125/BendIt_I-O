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

       
        class Bendit  {
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
                        //convert arguments to actual array
                        let args = [...arguments];
                        //add the Bendit-class socket 
                        args.push(this.socket);
                        newDevice = new BenditDevice(args[0],args[1],args[2], args[3], args[4]);
                        break;
                    case 'object':
                        newDevice = new BenditDevice(options.switches, options.pots, options.motors, options.deviceNumber, this.socket);
                        //adding socket property if object passed in
                        //newDevice.socket = this.socket;
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
                this.socket = options.socket;

               // arguments.push(this.socket)
                

                switch(typeof arguments[0]){
                    case 'number':
                        this.deviceNumber = arguments[3];
                        this.socket = arguments[4];
                        this.buildSwitchArray(arguments[0]);
                        this.buildPotArray(arguments[1]);
                        this.buildMotorArray(arguments[2]);
                        
                        break;
                    case 'object':
                         this.deviceNumber = options.deviceNumber;
                         this.buildSwitchArray(options.switches);
                         this.buildPotArray(options.pots);
                         this.buildMotorArray(options.motors);
                        
                        break;

                }
                
               
                this.addToDeviceArray();
                

                }

                buildSwitchArray(totalSwitches) {
                    console.log("built the switch array!");

                    for (let i = 0; i < totalSwitches; i++) {
                        this.switches[i] = new Switch(i, this.socket, this.deviceNumber);
                    }
                }

                buildPotArray(totalPots) {
                    console.log("built the pot array!");
                    for (let i = 0; i < totalPots; i++) {
                        this.pots[i] = new Pot(i, this.socket, this.deviceNumber);
                    }
                }

                buildMotorArray(totalMotors) {
                    for (let i = 0; i < totalMotors; i++) {
                        this.motors[i] = new Motor(i, this.socket, this.deviceNumber);
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
        // class Bendit_core {
        //     constructor(socket) {
        //         this.socket = socket;
        //     }
        // }

        class Switch  {
            constructor(swNum, socket, deviceNum) {
                this.number = swNum;
                this.state = false;
                this.socket = socket;
                this.deviceNumber = deviceNum;
            }

            setSwitch(v) {
                if(v == "open" || v == 0){
                    this.state = false;
                } else if (v == "closed" || v == 1){
                    this.state = true;
                } else {
                    console.log("Invalid state: can only take 'open'/0 or 'closed'/1 ")
                }
                
                this.socket.emit('switchEvent', {
                    switch_number: this.number,
                    state: this.state,
                    device: this.deviceNumber
                 });

                 console.log(`Device ${this.deviceNumber} was told to set switch ${this.number} ${v} on ${this.socket.id} `);
            }

            flipSwitch() {
                this.state = this.state ? false : true;


                //check state, change to opposite and STAY
                //look oup ternary for opposite

                this.socket.emit(`toggle${this.number + 1}`, {
                    state: this.state,
                    device: this.deviceNumber
                });

                console.log(`Device ${this.deviceNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);
                
        
            }

            toggleSwitch(){
                //check what state it is, flip to the opposite and automatically after
                //set amount of time, flip back
                this.state = !this.state;
                
                this.socket.emit(`toggle${this.number + 1}`, {
                    state: this.state,
                    device: this.deviceNumber
                });
                console.log(`Device ${this.deviceNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);


                setTimeout(() => {
                    this.state = !this.state;
                    this.socket.emit(`toggle${this.number + 1}`, {
                        state: this.state,
                        device: this.deviceNumber
                    });
                    console.log(`Device ${this.deviceNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);

                }, 450);
            }
        }

        class Pot {
            constructor(potNum, socket, deviceNum) {
                this.number = potNum;
                this.position = 0;
                this.socket = socket;
                this.deviceNumber = deviceNum;

                console.log("I am a pot channel!");
            }

            setPot(v) {
                this.position = v;

                this.socket.emit('potTurning', {
                    position: this.position,
                    device: this.deviceNumber
                });


                console.log(`Device ${this.deviceNumber} was told to set pot ${this.number} to position ${this.position} on ${this.socket.id} `);
            }
        }

        class Motor {
            constructor(motNum, socket, deviceNum) {
                this.number = motNum;
                this.speed = 1;
                this.direction = 0;
                console.log("I'm a new motor!")
            }

            start(speed, direction){
                this.speed = speed;
                this.socket.emit('runMotor', {
                    speed: this.speed,
                    direction: this.direction,
                    device: this.deviceNumber
                });

            }

            stop(){


            }

            flipDirection(){

            }

            throw(){

            }

            return(){

            }

            throwReturn(){

            }

            
        }

        module.exports = {
            Device: BenditDevice,
            Hub: new Bendit(),
            //Module: Bendit_module,
            Switch: Switch,
            Pot: Pot,
            Motor: Motor
        };

     }, {}]
     }, {}, []);