//The Bendit_I/O Server Hub

'use strict';

class BenditHub {
    constructor() {
        //list methods first
        this.postStats = this.postStats.bind(this);
        this.version = 1.0;
        this.serverPort = 3000;
        this.connectedUsers = [];
        this.connectedDevices = [];
        this.deviceColors = ["yellow", "orange", "green", "pink", "purple"]; //example of RGB array to send: "[55,132,12]"
        this.deviceNumber = 0;
    }

    postStats(type) {
        let data;
        let inquiry = type;
        switch(inquiry){
            case "server":
                data = {
                    "software_version": this.version,
                    "port": this.serverPort
                };
                console.log(JSON.stringify(data));
                break;
            case "devices":
                data = {
                    "total_devices": this.connectedDevices.length,
                };
                console.log(JSON.stringify(data)); 
        }
        
    }

    setAdditionalChannels(){
        //add your own additional channels here (not already called for boards)
    }

    initServer() {
        console.log('************* Welcome to Bendit_I/O! *************** \nThe Bendit Server is up and running\nServer software version: ' + this.version);
        const NexusHub = require('../performance_interface_example/jsModules/hub.js');
        let express = require('express');
        let app = express();
        let http = require('http').Server(app);
        let io = require('socket.io')(http);

        let theHub = new NexusHub();

        theHub.init(io, 'public');
        console.log('************************ \\ o_o / ******************');
        
        let sw1Toggle = {
            state: false
        };
        let sw2Toggle = {
            state: false
        };
        let sw3Toggle = {
            state: false
        };
        let sw4Toggle = {
            state: false
        };
        let sw5Toggle = {
            state: false
        };
        let sw6Toggle = {
            state: false
        };
        let connectedBenditBoards = this.connectedDevices, boardDeviceNumber = this.deviceNumber, colorOptions = this.deviceColors;

        io.on('connection', (socket) => {
            console.log("A user connected.");
                let switches = [sw1Toggle, sw2Toggle, sw3Toggle, sw4Toggle, sw5Toggle, sw6Toggle];

                for (let i = 0; i < switches.length; i++) {
                    socket.emit('toggleSwitch' + (i + 1), switches[i].state);
                }

                socket.on('message', function (data) {
                    socket.broadcast.emit('message', data);
                });

                socket.on('espMessage', function (data) {
                    socket.broadcast.emit('espMessage', data);
                });

                socket.on('playPauseMessage', function (data) {
                    socket.broadcast.emit('playPauseMessage', data);
                })
                socket.on('disconnect', function () {
                    console.log('User disconnected: ' + socket.id);
                });


                //Callbacks
                socket.on('flip', function (data) { //'flip' received from web client
                    let switchAndState = [data.switch, data.state];
                    switches[data.switch].state = data.state; //boolen to change state of switch
                    socket.to(`${data.device}`).emit('flipSwitch', switchAndState);
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch ' + switchAndState[0] + " " + switchAndState[1]);
                });

                socket.on('toggle1', function (data) { //'toggle1' received from web client

                    console.log("Switch 1 toggled!" + " " + "Device: " + data.device);
                    sw1toggle.state = data.state; //boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 1: ' + sw1toggle.state);
                    //'toggleSwitch1' is sent to whichever device is chosen by the web client
                    socket.to(`${data.device}`).emit('toggleSwitch1', sw1toggle.state);

                });
                socket.on('toggle2', function (data) { //data ='toggle2' received from web client along with device number to control
                    console.log("Switch 2 toggled!")
                    sw2toggle.state = data.state; //boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 2: ' + sw2toggle.state);
                    //reminder!: use BACKTICKS, not quotes around ${data.device}
                    socket.to(`${data.device}`).emit('toggleSwitch2', sw2toggle.state);
                });
                socket.on('toggle3', function (data) { //'toggle3' received from web client
                    console.log("Switch 3 toggled!")
                    sw3toggle.state = data.state; //boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 3: ' + sw3toggle.state);
                    socket.to(`${data.device}`).emit('toggleSwitch3', sw3toggle.state);
                });
                socket.on('toggle4', function (data) { //'toggle4' received from web client
                    console.log("Switch 4 toggled!")
                    sw4toggle.state = data.state; //boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 4: ' + sw4toggle.state);
                    socket.to(`${data.device}`).emit('toggleSwitch4', sw4toggle.state); //'toggleSwitch4' is sent to WCB
                });
                socket.on('toggle5', function (data) { //'toggle3' received from web client
                    console.log("Switch 5 toggled!")
                    sw5toggle.state = data.state;
                    //sw5toggle.state = !sw5toggle.state;//boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 5: ' + sw5toggle.state);
                    socket.to(`${data.device}`).emit('toggleSwitch5', sw5toggle.state); //'toggleSwitch5' is sent to WCB
                });
                socket.on('toggle6', function (data) { //'toggle3' received from web client
                    console.log("Switch 6 toggled!")
                    sw6toggle.state = data.state; //boolen to change state of switch
                    console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 6: ' + sw6toggle.state);
                    socket.to(`${data.device}`).emit('toggleSwitch6', sw6toggle.state); //'toggleSwitch6' is sent to WCB
                });
                socket.on('potTurning', function (data) {
                    socket.to(`${data.device}`).emit('potTurn', data.position);
                    console.log(data.device + " pot turned! position = " + data.position);
                });

                socket.on('metroSw1Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch1', data.time);
                    console.log("Device: " + data.device + " switch 1 on metro: " + data.time);
                });

                socket.on('metroSw1Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch1Stop');
                    console.log("Device: " + data.device + " switch 1 metro stopped");

                });

                socket.on('metroSw2Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch2', data.time);
                    console.log("Device: " + data.device + " switch 2 on metro: " + data.time);
                });

                socket.on('metroSw2Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch2Stop');
                    console.log("Device: " + data.device + " switch 2 metro stopped");

                });

                socket.on('metroSw3Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch3', data.time);
                    console.log("Device: " + data.device + " switch 3 on metro: " + data.time);
                });

                socket.on('metroSw3Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch3Stop');
                    console.log("Device: " + data.device + " switch 3 metro stopped");

                });

                socket.on('metroSw4Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch4', data.time);
                    console.log("Device: " + data.device + " switch 4 on metro: " + data.time);
                });

                socket.on('metroSw4Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch4Stop');
                    console.log("Device: " + data.device + " switch 4 metro stopped");

                });

                socket.on('metroSw5Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch5', data.time);
                    console.log("Device: " + data.device + " switch 5 on metro: " + data.time);
                });

                socket.on('metroSw5Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch5Stop');
                    console.log("Device: " + data.device + " switch 5 metro stopped");

                });

                socket.on('metroSw6Start', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch6', data.time);
                    console.log("Device: " + data.device + " switch 6 on metro: " + data.time);
                });

                socket.on('metroSw6Stop', function (data) {
                    socket.to(`${data.device}`).emit('metroSwitch6Stop');
                    console.log("Device: " + data.device + " switch 6 metro stopped");

                });

                //'handshake' is specific to Bendit boards
                socket.on('handshake', function (data) {
                    console.log(data.nickname);
                    console.log('Connected Board\'s Socket ID: ' + socket.id);

                    this.connectedDevices.push(socket.id);
                    socket.name = socket.id;

                    boardDeviceNumber++;
                    //the server now knows that the deviceNumber is tied to a socket.id
                    socket.deviceNumber = boardDeviceNumber;

                    socket.join(`${socket.deviceNumber}`);
                    console.log("Total Bendit Boards Connected: " + connectedBenditBoards.length);

                    setTimeout(function () {

                        let userColorPick = colorOptions[Math.floor(Math.random() * colorOptions.length)];
                        //let userData = {
                        //     color: userColorPick,
                        //    number: deviceNumber
                        // }
                        let userNumberAssignment = socket.deviceNumber;

                        io.to(`${socket.id}`).emit("setDeviceColor", userColorPick);
                        io.to(`${socket.id}`).emit("setDeviceNumber", userNumberAssignment);

                        console.log("Assigned Color: " + userColorPick);
                        console.log("Assigned Device Number: " + userNumberAssignment);
                    }, 750);
                    //} 
                });
                //call empty function that allows more event listeners (non board related)
                //to be added
                this.setAdditionalChannels();
            });

            

        }
    }




    module.exports = new BenditHub();