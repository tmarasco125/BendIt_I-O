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
        /* 
        =============================================================================
            benditBrowser JS: A Client-Side JavaScript Library for Bendit_I/O
        =============================================================================
        */

        /** 
        Bendit Browser JS
          @name benditBrowser.js
          @overview A client - side JS library for {@link http://www.benditio.com|Bendit_I/O}
          @version 1.0
          @author Anthony T. Marasco
          @copyright &copy; 2020
          
          
          @license MIT
         */

        /*
=============================================================================
                        Initialization class
=============================================================================
*/

        /**
         *
         * To initialize a connection to the server, an instance of the Bendit class needs to be initialized first.
         * This class handles information about the client's connection to the server as well as information about all
         * client and Bendit board activity on the server.
         */

        class Bendit {
            /**
             * @property {string[]} users - An array of connected client websocket IDs
             * @property {Object[]} devices - An array of created BenditDevices that can assigned to connected Bendit boards 
             * @property {Object} socket - The socket.io socket for this Bendit-class instance
             * @property {Object[]} availableBenditBoards - An array of assigned board data for all connected Bendit Boards
             * 
             */
            constructor() {


                this.users = [];
                //this.socket;

                this.devices = [];

                this.availableBenditBoards = [];

                this.socket = io.connect(window.location.origin, {
                    transports: ['websocket']
                });
                //console.log("nexusHub Server Initialized!");
                console.log("Connected to the Bendit_I/O Server ");


                this.socket.on('log_user_list', (data) => {
                    console.log("IDs of connected web users: " + data);
                });

                this.socket.on('log_board_list', (data) => {
                    let currentBoardList = data;
                    this.availableBenditBoards = currentBoardList;
                    //console.log("Device Data of connected Bendit boards: " + JSON.stringify(incomingBoardList));
                    //return this.devices;
                });

                this.socket.emit('grab_board_list');


            }
            /**
                * Pings the server and returns an updated list of connected web client user IDs
                * 
                * @return {
                    string[]
                } - An array of connected web client user IDs
            */

            getConnectedUsers() {
                this.socket.emit('grab_user_list');
                return this.users;
            };

            /**
                * Pings the server and returns an updated list containing the assigned device data
                * of any connected Bendit boards.
                * 
                * @return {
                    Object[]
                } - An array of objects containing the assigned device data of each connected Bendit board
            */
            getConnectedBenditBoards() {
                this.socket.emit('grab_board_list');
                return this.availableBenditBoards;
            };


            /**
             * Creates an instance of the BenditDevice class and adds that object to the Bendit.devices array.
             * Can be called with individual arguments or with an object.
             * 
             * @param {number} switches - the total number of switches to assign to the device.
             * @param {number} pots - the total number of switches to assign to the device.
             * @param {number} motors - the total number of motors to assign to the device.
             * @param {number} boardNumber - the Bendit board number to assign to the device.
             * @return {Object} - An instance of the BenditDevice class.
             * @example 
             * //Create Bendit instance
             * let bendit = Bendit.Hub;
             * 
             * let speakNspell = bendit.addDevice(6,5,1,2);// possible switches, pots, and motors to control on board 2
             * 
             * or
             * 
             * let speakNspell = bendit.addDevice({
             *       "switches": 6,
             *       "pots": 5,
             *       "motors": 1,
             *       "boardNumber": 2     
             *       });
             */
            addDevice(options) {
                let newDevice;

                switch (typeof arguments[0]) {
                    case 'number':
                        //convert arguments to actual array
                        let args = [...arguments];
                        //add the Bendit-class socket 
                        args.push(this.socket);
                        newDevice = new BenditDevice(args[0], args[1], args[2], args[3], args[4]);
                        break;
                    case 'object':
                        newDevice = new BenditDevice(options.switches, options.pots, options.motors, options.boardNumber, this.socket);
                        //adding socket property if object passed in
                        //newDevice.socket = this.socket;
                        break;

                }



                this.devices.push(newDevice);
                return newDevice;
            }

        }

        /**
         * An object that represents a Bendit board/circuit-bent device pair. New devices are added to the Bendit.devices array on creation.
         * 
         *
         * 
         * @see {@link addDevice}
         * 
         */

        class BenditDevice {
            /** 
             * 
             * @prop {Object[]} switches - An array of Switch objects.
             * @prop {Object[]} pots - An array of Pot objects.
             * @prop {Object[]} motors - An array of Motor objects.
             * @prop {Object} socket - The socket.io socket inhereted from the global Bendit-class instance.
             * @prop {string} deviceNickname - A name to associate with this circuit-bent device/Bendit board pair (e.g. "Walkman" or "Casio keyboad")
             * @prop {string} deviceColor - Color assigned to the associated Bendit board's LED by the server.
             * @prop {string} boardVersion - Hardware version of the associated Bendit board.
             * @prop {number} boardNumer - The number of the Bendit board associated with this device.
             */

            constructor(options) {


                this.boardNumber = 0;
                this.switches = []; //array of switches
                this.pots = []; //array of pot channels
                this.motors = []; //array of motor channels 
                this.deviceNickname = "string";
                this.deviceColor = "string";
                this.boardVersion = "0.0"; //revision of the hardware
                this.socket = options.socket;

                // arguments.push(this.socket)


                switch (typeof arguments[0]) {
                    case 'number':
                        this.boardNumber = arguments[3];
                        this.socket = arguments[4];
                        this.buildSwitchArray(arguments[0]);
                        this.buildPotArray(arguments[1]);
                        this.buildMotorArray(arguments[2]);

                        break;
                    case 'object':
                        this.boardNumber = options.boardNumber;
                        this.buildSwitchArray(options.switches);
                        this.buildPotArray(options.pots);
                        this.buildMotorArray(options.motors);

                        break;

                }


                //this.addToDeviceArray();


            }
            /**
                * Builds an array of Switch objects and assigns them to a device's switch array. <i>Called by {@link addDevice}</i>.
                * 
                * 
                * @param {number} totalSwitches - The total number of Switch objects to build.
                * @return {
                    Object[]
                } - An array of Switch objects.
            */
            buildSwitchArray(totalSwitches) {
                console.log("built the switch array!");

                for (let i = 0; i < totalSwitches; i++) {
                    this.switches[i] = new Switch(i, this.socket, this.boardNumber);
                }
            }

            /**
                * Builds an array of Pot objects and assigns them to a device's pot array. <i>Called by {@link addDevice}</i>.
                * 
                * 
                * @param {number} totalPots - The total number of Switch objects to build.
                * @return {
                    Object[]
                } - An array of Pot objects.
            */
            buildPotArray(totalPots) {
                console.log("built the pot array!");
                for (let i = 0; i < totalPots; i++) {
                    this.pots[i] = new Pot(i, this.socket, this.boardNumber);
                }
            }


            /**
                * Builds an array of Motor objects and assigns them to a device's motor array. <i>Called by {@link addDevice}</i>.
                * 
                * 
                * @param {number} totalMotors - The total number of Motor objects to build.
                * @return {
                    Object[]
                } - An array of Motor objects.
            */
            buildMotorArray(totalMotors) {
                for (let i = 0; i < totalMotors; i++) {
                    this.motors[i] = new Motor(i, this.socket, this.boardNumber);
                }
                console.log("motor array, ready to rev!");
            }

            /**
                * Pings the server and retrieves the board data of the associated Bendit board.
                * 
                * 
                * 
                * @return {
                    Object[]
                } - The board data of the associated Bendit board.
            */
            getBoardProfile() {
                /* socket.emit to server to ask device for
                   onboard profile data
                */

            }
            /**
             * Instructs the server to rewrite the board data of the associated Bendit board.
             * @param {Object} options - The new data to write to the device's associated Bendit board.
             * 
             * 
             * 
             */
            writeBoardProfile(options) {

            }

            // addToDeviceArray() {
            //     console.log("Added device to 'Connected Devices' array on the server")
            // }


            //get device name



        }


        /**
         * An object that represents a switch output on a Device's associated Bendit board/circuit-bent device pair. 
         * An array of Switch objects are created when a new BenditDevice object is created.
         * @param {
             number
         }
         swNum - The
         switch channel(relay) of the Bendit board associated with this
         switch 's device. *
         @param {Object} socket - The socket.io socket inhereted from the global Bendit - class instance. < i > Do not change this. < /i> *
         @param {number} deviceNum - The number of the Device associated with this
         switch.Passed on
         to be associated with the Bendit board this
         switch 's device is assigned to.
         *
         * 
         * 
         * @property {number} number - The
         switch channel of this device's Bendit board.
          * @property {boolean} state - The state of the switch (e.g false == "open", true == "closed".)
          * @property {Object}  socket - The socket.io socket inhereted from the global Bendit-class instance. <i>Do not change this.</i>
          * @property {number} boardNumber - The number of the Bendit board that this device and this switch are associated with.
        
         * 
         * @see {@link BenditDevice}
         * 
         */

        class Switch {


            constructor(swNum, socket, deviceNum) {


                this.number = swNum;
                this.state = false;
                /** @private */
                this.socket = socket;
                this.boardNumber = deviceNum;
            }
            /**
             * Sets the state of the switch on this device's Bendit board.
             * Switches in the BenditDevice.switches array are zero indexed.
             * 
             * 
             * 
             * @param {string|number} v - The state of the switch. Accepts a string ("open"/"closed") or a number (0/1).
             * 
             * @example
             * 
             *
             * //Create device and attach it to Bendit board 4
             * let toy = bendit.addDevice(bendit.addDevice({
             * "switches": 4,
             * "pots": 8,
             * "motors": 0,
             * "boardNumber": 4 
             * }); 
             * //Set state of Switch 4 channel on this Bendit board to "closed"
             *  toy.switches[3].setSwitch("closed"); //Switch 4 closes
             *   
             *  //Set state of Switch 4 channel to "open"
             *  toy.switches[3].setSwitch("open"); //Switch 4 is now open
             * 
             * 
             */
            setSwitch(v) {
                if (v == "open" || v == 0) {
                    this.state = false;
                } else if (v == "closed" || v == 1) {
                    this.state = true;
                } else {
                    console.log("Invalid state: can only take 'open'/0 or 'closed'/1 ")
                }

                this.socket.emit('switchEvent', {
                    switch_number: this.number,
                    state: this.state,
                    device: this.boardNumber
                });

                console.log(`Device ${this.boardNumber} was told to set switch ${this.number} ${v} on ${this.socket.id} `);
            }

            /**
             * Checks the current state of the switch and "flips" it to be the opposite state. 
             * 
             * 
             * 
             * 
             * 
             * 
             * 
             * @example
             * 
             *
             * console.log(toy.switches[2].state); //--> prints "false", aka "open"
             * 
             * //Flip the state of Switch 4 channel on this Bendit board
             *  toy.switches[2].flipSwitch(); //Switch 4 is now "closed" aka "true"
             *   
             *  //Flip the state of Switch 4 channel back
             *  toy.switches[3].flipSwitch(); //Switch 4 is now "open" aka "false"
             * 
             * 
             */

            flipSwitch() {
                this.state = this.state ? false : true;


                //check state, change to opposite and STAY
                //look oup ternary for opposite

                // this.socket.emit(`toggle${this.number + 1}`, {
                //     state: this.state,
                //     device: this.boardNumber
                // });

                this.socket.emit('switchEvent', {
                    switch_number: this.number,
                    state: this.state,
                    device: this.boardNumber
                });

                console.log(`Device ${this.boardNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);


            }


            /**
             * Combines two "flips"; Checks the current state of the switch and toggles it to be the opposite state. Pauses for 450ms before toggling back to the starting state. 
             * Takes an optional argument to adjust the wait time of the toggle.
             * 
             * 
             * @param {number} waitTime - <i>[optional]</i> The time in milliseconds to wait between toggling state changes.
             * Defaults to 450ms if nothing passed in.
             * 
             * 
             * 
             * @example
             * 
             *
             * console.log(dvd.switches[1].state); //--> prints "false", aka "open"
             * 
             * //Toggle the state of Switch 4 channel on this Bendit board
             *  dvd.switches[1].toggleSwitch(); //Switch 4 is now latched "closed" for 450ms, then set "open".
             *   
             *  //Check state again after toggle
             * console.log(dvd.switches[1].state); //--> prints "false", aka "open"
             * 
             * 
             */
            toggleSwitch(waitTime = 450) {
                //check what state it is, flip to the opposite and automatically after
                //set amount of time, flip back
                this.state = !this.state;


                this.socket.emit('switchEvent', {
                    switch_number: this.number,
                    state: this.state,
                    device: this.boardNumber
                });
                console.log(`Device ${this.boardNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);


                setTimeout(() => {
                    this.state = !this.state;
                    // this.socket.emit(`toggle${this.number + 1}`, {
                    //     state: this.state,
                    //     device: this.boardNumber
                    // });
                    this.socket.emit('switchEvent', {
                        switch_number: this.number,
                        state: this.state,
                        device: this.boardNumber
                    });
                    console.log(`Device ${this.boardNumber} was told to set switch ${this.number} ${this.state} on ${this.socket.id} `);

                }, waitTime);
            }
        }
        /**
         * An object that represents a potentiometer output channel on a Device's associated Bendit board/circuit-bent device pair. 
         * An array of Pot objects are created when a new BenditDevice object is created.
         * @param {number} potNum - The
         *potentiometer channel of this device's Bendit board.
         *@param {Object} socket - The socket.io socket inhereted from the global Bendit - class instance. <i>Do not change this.</i>
         * @param {
             number
         }
        * deviceNum - The number of the device associated with this pot. Passed on
        * to be associated with the Bendit board this
        * pot's device is assigned to. 
         *
         *
         *
         *@property {number} number - The
         *potentiometer channel of this device 's Bendit board.
         *@property {number} position - The position of the pot. Range is 0 to 255 (0 ohms to 100k ohms).
         *@property {
             Object
         }socket - The socket.io socket inhereted from the global Bendit - class instance. <i>Do not change this.</i>
         * @property {number} boardNumber - The number of the Bendit board that this device and this pot are associated with.
         *
         * 
         * @see {@link BenditDevice}
         * 
         */
        class Pot {
            constructor(potNum, socket, deviceNum) {
                this.number = potNum;
                this.position = 0;
                this.socket = socket;
                this.boardNumber = deviceNum;

                console.log("I am a pot channel!");
            }

            /**
             * Sets the position of the pot on this device's Bendit board.
             * Pots in the BenditDevice.pots array are zero indexed.
             * 
             * 
             * 
             * @param {number} v - The position of the switch, corresponding to the generated resistance level. 
             * Range is 0 - 255, corresponding to a resistance range of 0 to 100k ohms.
             * 
             * 
             * @example
             * 
             * //Set position of Pot channel 3 on this Bendit board to 127 (midway)
             *  vhs.pots[2].setPot(127); //circa 50k ohms generated on Pot channel 3
             * 
             * 
             */

            setPot(v) {
                this.position = v;

                this.socket.emit('potEvent', {
                    pot_number: this.number,
                    position: this.position,
                    device: this.boardNumber
                });


                console.log(`Device ${this.boardNumber} was told to set pot ${this.number} to position ${this.position} on ${this.socket.id} `);
            }
        }

        /**
         * An object that represents a motor output channel on a Device's associated Bendit board/circuit-bent device pair. 
         * An array of Motor objects are created when a new BenditDevice object is created.
         * 
         * @param {
             number
         } motNum - The 
             motor channel of this device 's Bendit board. 
        * @param {
                 Object
             }socket - The socket.io socket inhereted from the global Bendit - class instance. <i>Do not change this.</i> 
        * @param {
                 number
             } deviceNum - The number of the device associated with this motor. Passed on
             to be associated with the Bendit board this
             motor's device is assigned to.

         * @property {number} number - The motor channel of this device's Bendit board.
          * @property {number} speed - The speed of the motor.
          * @property {number} direction - The running direction of DC motors/position of solenoids (1 == forward/thrown, -1 == backwards/retracted)
          * @property {Object} socket - The socket.io socket inhereted from the global Bendit-class instance. <i>Do not change this.</i>
          * @property {number} boardNumber - The number of the Bendit board that this device and this motor are associated with.
        
         * 
         * @see {@link BenditDevice}
         * 
         */
        class Motor {
            constructor(motNum, socket, deviceNum) {
                this.number = motNum;
                this.speed = 1;
                this.direction = 0;
                this.socket = socket;
                this.boardNumber = deviceNum;
                console.log("I'm a new motor!")
            }
            /**
             * For DC motors. Starts this channel's motor on this device's Bendit board.
             * Motors in the BenditDevice.motors array are zero indexed.
             * 
             * 
             * 
             * @param {number} speed - The speed of the motor. Range is 0 (stopped) to 255 (ful speed).
             * @param {number} direction - The direction of the motor. Options are 1 (forward) and -1 (backwards).
             * 
             * 
             * 
             * @example
             * 
             * //Set speed and direction of Motor channel 1 on this Bendit board to forward at 127 (half-speed)
             *  tapeDeck.motors[0].run(127, 1);
             * 
             * //Set speed and direction of Motor channel 1 on this Bendit board to backwards at 64 (quarter-speed)
             * tapeDeck.motors[0].run(64, -1);
             * 
             */

            run(speed, direction) {
                this.speed = speed;
                this.direction = direction;
                this.socket.emit('runMotor', {
                    speed: this.speed,
                    direction: this.direction,
                    device: this.boardNumber
                });

            }

            /**
             * For DC motors. Stops this channel's motor on this device's Bendit board.
             * Motors in the BenditDevice.motors array are zero indexed.
             * 
             * 
             * 
             * 
             * 
             * 
             * @example
             * 
             * //Stop a currently-running motor 
             *  tapeDeck.motors[0].stop();
             * 
             */

            stop() {
                this.speed = 0;
                this.direction = 0;
                this.socket.emit('runMotor', {
                    speed: this.speed,
                    direction: this.direction,
                    device: this.boardNumber
                });
            }

            /**
             * For DC motors. Reverses this channel's motor on this device's Bendit board. Speed is kept at most recently set value.
             * Motors in the BenditDevice.motors array are zero indexed.
             * 
             * 
             * 
             *  
             * @example
             * 
             * console.log(walkman.motors[1].direction); //--> prints 1, aka forward
             *
             * //Flip the direction of Motor channel 2 on this Bendit board
             *
             * walkman.motors[1].flipDirection(); //Motor 2 is now running backwards, aka -1
             *
             * //Flip the direction of Motor 2 channel back
             *
             * walkman.motors[1].flipDirection(); //Motor 2 is now running forwards, aka 1
             * 
             */

            flipDirection() {
                this.direction = this.direction === -1 ? 1 : -1;
                this.socket.emit('runMotor', {
                    speed: this.speed,
                    direction: this.direction,
                    device: this.boardNumber
                });
                console.log(this.direction);
            }

            throw () {

            }

            return () {

            }

            throwReturn() {

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