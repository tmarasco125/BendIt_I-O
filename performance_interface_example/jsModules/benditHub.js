//The Bendit_I/O Server Hub

'use strict';

class BenditHub {
    constructor() {
        //list methods to bind first
        this.postStats = this.postStats.bind(this);
        this.setAdditionalChannels = this.setAdditionalChannels.bind(this);
        this.initServer = this.initServer.bind(this);
        //this.addToUserArray = this.addToUserArray.bind(this);
        this.collectAssignedBoardData = this.collectAssignedBoardData.bind(this);
        this.removeBoardOnDisconnect = this.removeBoardOnDisconnect.bind(this);

        this.version = 1.0;
        this.serverPort = 3000;
        this.connectedUsers = [];
        this.connectedBenditBoards = [];
        this.boardColors = ["yellow", "orange", "green", "pink", "purple"]; //example of RGB array to send: "[55,132,12]"


    }

    postStats(type) {
        let data;
        let inquiry = type;
        switch (inquiry) {
            case "server":
                data = {
                    "software_version": this.version,
                    "port": this.serverPort
                };
                console.log(JSON.stringify(data));
                break;
            case "boards":
                data = {
                    "total_Bendit_boards": this.connectedBenditBoards.length,
                };
                console.log(JSON.stringify(data));
        }

    }

    setAdditionalChannels() {
        //add your own additional channels here (not already called for boards)
    }

    collectAssignedBoardData(boardData) {

        this.connectedBenditBoards.push(boardData);
        console.log(this.connectedBenditBoards);

    }

    removeBoardOnDisconnect(id) {
        // this.connectedBenditBoards.splice(this.connectedBenditBoards.findIndex(this.connectedBenditBoards, function (item) {
        //     return item.value === id;
        // }), 1);
    };

    // myArray.splice(myArray.findIndex(myArray, function (item) {
    //     return item.value === 'money';
    // }), 1);

    initServer() {
        console.log('************* Welcome to Bendit_I/O! *************** \nThe Bendit Server is up and running\nServer software version: ' + this.version);
        const NexusHub = require('../jsModules/hub.js');
        // let express = require('express');
        // let app = express();
        let http = require('http');
        let io = require('socket.io')(http);

        let theHub = new NexusHub();

        theHub.init(io, 'public');




        console.log('************************ \\ o_o / ******************');

        // let sw1Toggle = {
        //     state: false
        // };
        // let sw2Toggle = {
        //     state: false
        // };
        // let sw3Toggle = {
        //     state: false
        // };
        // let sw4Toggle = {
        //     state: false
        // };
        // let sw5Toggle = {
        //     state: false
        // };
        // let sw6Toggle = {
        //     state: false
        // };

        let boardNumber = 0;


        io.on('connection', (socket) => {

            this.connectedUsers.push(socket.id);
            


            console.log("A user connected." + " " + socket.id);

            
            socket.on('grab_board_list', () => {
                let currentBenditBoardList = this.connectedBenditBoards;
                //console.log(`Connected User IDs: ${userList}`);
                
                socket.emit('log_board_list', currentBenditBoardList);
            });
            
            socket.on('grab_user_list', ()=>{
                let userList = Object.keys(io.engine.clients);
                //console.log(`Connected User IDs: ${userList}`);

                socket.emit('log_user_list', userList );
            });
            // for (let i = 0; i < switches.length; i++) {
            //     socket.emit('toggleSwitch' + (i + 1), switches[i].state);
            // }

            socket.on('message_to_users', function (data) {
                socket.broadcast.emit('message', data);
            });

            socket.on('board_to_board_message', function (data) {
                socket.broadcast.emit('espMessage', data);
            });

            socket.on('playPauseMessage', function (data) {
                socket.broadcast.emit('playPauseMessage', data);
            });

            socket.on('disconnect', ()=> {
                console.log('User disconnected: ' + socket.id);
                this.removeBoardOnDisconnect(socket.id);
                // console.log("Remaining users:" +this.connectedBenditBoards);
            });


            //Callbacks
            socket.on('switchEvent', function (data) { //'switchEvent' received from web client

                console.log(`Board ${data.device} was told to set switch ${data.switch_number+1} ${data.state} from ${socket.id}`);
                let payload = data.switch_number + "," + data.state;
                payload.toString();
                socket.to(`${data.device}`).emit('switch_event', payload);
                console.log('here is the message sent to the Bendit board: ' + payload);
            });

            socket.on('potEvent', (data)=>{
                console.log(`Board ${data.device} was told to set pot ${data.pot_number} to position ${data.position} from ${socket.id}`);
                let payload = data.pot_number + "," +data.position;
                payload.toString();
                socket.to(`${data.device}`).emit('pot_event', payload);
                console.log(`here is the message sent to the Bendit board: pot ${data.pot_number} : channel/position ${payload}`);
                
            });

            // socket.on('toggle1', function (data) { //'toggle1' received from web client

            //     console.log("Switch 1 toggled!" + " " + "Device: " + data.device);
            //     sw1Toggle.state = data.state; //boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 1: ' + sw1Toggle.state);
            //     //'toggleSwitch1' is sent to whichever device is chosen by the web client
            //     socket.to(`${data.device}`).emit('toggleSwitch1', sw1Toggle.state);

            // });
            // socket.on('toggle2', function (data) { //data ='toggle2' received from web client along with device number to control
            //     console.log("Switch 2 toggled!")
            //     sw2Toggle.state = data.state; //boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 2: ' + sw2Toggle.state);
            //     //reminder!: use BACKTICKS, not quotes around ${data.device}
            //     socket.to(`${data.device}`).emit('toggleSwitch2', sw2Toggle.state);
            // });
            // socket.on('toggle3', function (data) { //'toggle3' received from web client
            //     console.log("Switch 3 toggled!")
            //     sw3Toggle.state = data.state; //boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 3: ' + sw3Toggle.state);
            //     socket.to(`${data.device}`).emit('toggleSwitch3', sw3Toggle.state);
            // });
            // socket.on('toggle4', function (data) { //'toggle4' received from web client
            //     console.log("Switch 4 toggled!")
            //     sw4Toggle.state = data.state; //boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 4: ' + sw4Toggle.state);
            //     socket.to(`${data.device}`).emit('toggleSwitch4', sw4Toggle.state); //'toggleSwitch4' is sent to WCB
            // });
            // socket.on('toggle5', function (data) { //'toggle3' received from web client
            //     console.log("Switch 5 toggled!")
            //     sw5Toggle.state = data.state;
            //     //sw5Toggle.state = !sw5Toggle.state;//boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 5: ' + sw5Toggle.state);
            //     socket.to(`${data.device}`).emit('toggleSwitch5', sw5Toggle.state); //'toggleSwitch5' is sent to WCB
            // });
            // socket.on('toggle6', function (data) { //'toggle3' received from web client
            //     console.log("Switch 6 toggled!")
            //     sw6Toggle.state = data.state; //boolen to change state of switch
            //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 6: ' + sw6Toggle.state);
            //     socket.to(`${data.device}`).emit('toggleSwitch6', sw6Toggle.state); //'toggleSwitch6' is sent to WCB
            // });
            // socket.on('potTurning', function (data) {
            //     socket.to(`${data.device}`).emit('potTurn', data.position);
            //     console.log(data.device + " pot turned! position = " + data.position);
            // });

            socket.on('metroSw1Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch1', data.time);
                console.log("Board: " + data.device + " switch 1 on metro: " + data.time);
            });

            socket.on('metroSw1Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch1Stop');
                console.log("Board: " + data.device + " switch 1 metro stopped");

            });

            socket.on('metroSw2Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch2', data.time);
                console.log("Board: " + data.device + " switch 2 on metro: " + data.time);
            });

            socket.on('metroSw2Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch2Stop');
                console.log("Board: " + data.device + " switch 2 metro stopped");

            });

            socket.on('metroSw3Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch3', data.time);
                console.log("Board: " + data.device + " switch 3 on metro: " + data.time);
            });

            socket.on('metroSw3Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch3Stop');
                console.log("Board: " + data.device + " switch 3 metro stopped");

            });

            socket.on('metroSw4Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch4', data.time);
                console.log("Board: " + data.device + " switch 4 on metro: " + data.time);
            });

            socket.on('metroSw4Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch4Stop');
                console.log("Board: " + data.device + " switch 4 metro stopped");

            });

            socket.on('metroSw5Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch5', data.time);
                console.log("Board: " + data.device + " switch 5 on metro: " + data.time);
            });

            socket.on('metroSw5Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch5Stop');
                console.log("Board: " + data.device + " switch 5 metro stopped");

            });

            socket.on('metroSw6Start', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch6', data.time);
                console.log("Board: " + data.device + " switch 6 on metro: " + data.time);
            });

            socket.on('metroSw6Stop', function (data) {
                socket.to(`${data.device}`).emit('metroSwitch6Stop');
                console.log("Board: " + data.device + " switch 6 metro stopped");

            });

            //'handshake' is specific to Bendit boards
            socket.on('handshake', (data) => {


                console.log(this.connectedBenditBoards);
                


                //console.log(data.nickname);

                //addToUserArray(socket.id);

                //connectedBenditBoards.push(socket.id);
                socket.name = socket.id;

                boardNumber++;
                //the server now knows that the boardNumber is tied to a socket.id
                socket.boardNumber = boardNumber;

                socket.join(`${socket.boardNumber}`);
                //console.log("Total Bendit Boards Connected: " + this.connectedBenditBoards.length);
                let boardAssignedColor = this.boardColors[Math.floor(Math.random() * this.boardColors.length)];


                setTimeout(function () {
                    //do these two need to be io instead of socket?
                    io.to(`${socket.id}`).emit("setBoardColor", boardAssignedColor);
                    console.log(`here is the color message sent to the Bendit board: ${boardAssignedColor}`);
                    io.to(`${socket.id}`).emit("setBoardNumber", socket.boardNumber);
                    //console.log("Assigned Color: " + userColorPick);
                    //console.log("Assigned Device Number: " + userNumberAssignment);
                }, 850);

                socket.boardAssignedData = {
                    id: socket.id,
                    color: boardAssignedColor,
                    number: socket.boardNumber,
                    nickname: data.nickname
                };

                console.log("A Bendit board connected! Board data:\n");
                console.log(socket.boardAssignedData);
                // module.exports.collectAssignedDeviceData(socket.boardAssignedData);
                //return socket.boardAssignedData
                this.connectedBenditBoards.push(socket.boardAssignedData);
                console.log("this works!");
                console.log(this.connectedBenditBoards);

            });
            //call empty function that allows more event listeners (non board related)
            //to be added
            //this.connectedBenditBoards.push(socket.boardAssignedData);

            this.setAdditionalChannels();

        });



    }
}




module.exports = new BenditHub();