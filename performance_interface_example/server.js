/*
Bendit_I/O: Networked Circuit Bending

Example Server code with Bendit_I/O module


Anthony T. Marasco - 2020
*/

// let express = require('express');
// let app = express();
// let http = require('http').Server(app);
// let io = require('socket.io')(http);
//require
let bendit = require('../lib/benditHub');





var sw1toggle = {
    state: false
};
var sw2toggle = {
    state: false
};
var sw3toggle = {
    state: false
};
var sw4toggle = {
    state: false
};
var sw5toggle = {
    state: false
};
var sw6toggle = {
    state: false
};

let switches = [sw1toggle, sw2toggle, sw3toggle, sw4toggle, sw5toggle, sw6toggle];
let users = []; //array holding all connected client IDs
let userColors = ["yellow", "orange", "green", "pink", "purple"]; //example of RGB array to send: "[55,132,12]"
let deviceNumber = 0;

//host performance interface assets on server
// app.use(express.static('public'));


//Open websocket connection when clients connect
// io.on('connection', function (socket) {
//console.log("a user connected");

//MUST be called before .initServer if you want to add additional channels!
//bendit.setAdditionalChannels = ()=> {\\put new socket.on/channel events here}
bendit.initServer(); //this will be set up once everything is moved to benditHub.js
bendit.postStats("server");

    // for (var i = 0; i < switches.length; i++) {
    //     socket.emit('toggleSwitch' + (i + 1), switches[i].state);
    // }

    // socket.on('message', function(data){
    //     socket.broadcast.emit('message', data);
    // });

    // socket.on('espMessage', function(data){
    //     socket.broadcast.emit('espMessage', data);
    // });

    // socket.on('playPauseMessage', function(data){
    //     socket.broadcast.emit('playPauseMessage', data);
    // })
    // socket.on('disconnect', function () {
    //     console.log('User disconnected: ' + socket.id);
    // });


    // //Callbacks
    // socket.on('toggle1', function (data) { //'toggle1' received from web client

    //     console.log("Switch 1 toggled!" + " " + "Device: " + data.device);
    //     sw1toggle.state = data.state; //boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 1: ' + sw1toggle.state);
    //     //'toggleSwitch1' is sent to whichever device is chosen by the web client
    //     socket.to(`${data.device}`).emit('toggleSwitch1', sw1toggle.state);

    // });
    // socket.on('toggle2', function (data) { //data ='toggle2' received from web client along with device number to control
    //     console.log("Switch 2 toggled!")
    //     sw2toggle.state = data.state; //boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 2: ' + sw2toggle.state);
    //     //reminder!: use BACKTICKS, not quotes around ${data.device}
    //     socket.to(`${data.device}`).emit('toggleSwitch2', sw2toggle.state);
    // });
    // socket.on('toggle3', function (data) { //'toggle3' received from web client
    //     console.log("Switch 3 toggled!")
    //     sw3toggle.state = data.state; //boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 3: ' + sw3toggle.state);
    //     socket.to(`${data.device}`).emit('toggleSwitch3', sw3toggle.state);
    // });
    // socket.on('toggle4', function (data) { //'toggle4' received from web client
    //     console.log("Switch 4 toggled!")
    //     sw4toggle.state = data.state; //boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 4: ' + sw4toggle.state);
    //     socket.to(`${data.device}`).emit('toggleSwitch4', sw4toggle.state); //'toggleSwitch4' is sent to WCB
    // });
    // socket.on('toggle5', function (data) { //'toggle3' received from web client
    //     console.log("Switch 5 toggled!")
    //     sw5toggle.state = data.state;
    //     //sw5toggle.state = !sw5toggle.state;//boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 5: ' + sw5toggle.state);
    //     socket.to(`${data.device}`).emit('toggleSwitch5', sw5toggle.state); //'toggleSwitch5' is sent to WCB
    // });
    // socket.on('toggle6', function (data) { //'toggle3' received from web client
    //     console.log("Switch 6 toggled!")
    //     sw6toggle.state = data.state; //boolen to change state of switch
    //     console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 6: ' + sw6toggle.state);
    //     socket.to(`${data.device}`).emit('toggleSwitch6', sw6toggle.state); //'toggleSwitch6' is sent to WCB
    // });
    // socket.on('potTurning', function (data) {
    //     socket.to(`${data.device}`).emit('potTurn', data.position);
    //     console.log(data.device + " pot turned! position = " + data.position);
    // });

    // socket.on('metroSw1Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch1', data.time);
    //     console.log("Device: " + data.device + " switch 1 on metro: " + data.time);
    // });

    // socket.on('metroSw1Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch1Stop');
    //     console.log("Device: " + data.device + " switch 1 metro stopped");

    // });

    // socket.on('metroSw2Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch2', data.time);
    //     console.log("Device: " + data.device + " switch 2 on metro: " + data.time);
    // });

    // socket.on('metroSw2Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch2Stop');
    //     console.log("Device: " + data.device + " switch 2 metro stopped");

    // });

    // socket.on('metroSw3Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch3', data.time);
    //     console.log("Device: " + data.device + " switch 3 on metro: " + data.time);
    // });

    // socket.on('metroSw3Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch3Stop');
    //     console.log("Device: " + data.device + " switch 3 metro stopped");

    // });

    // socket.on('metroSw4Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch4', data.time);
    //     console.log("Device: " + data.device + " switch 4 on metro: " + data.time);
    // });

    // socket.on('metroSw4Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch4Stop');
    //     console.log("Device: " + data.device + " switch 4 metro stopped");

    // });

    // socket.on('metroSw5Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch5', data.time);
    //     console.log("Device: " + data.device + " switch 5 on metro: " + data.time);
    // });

    // socket.on('metroSw5Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch5Stop');
    //     console.log("Device: " + data.device + " switch 5 metro stopped");

    // });

    // socket.on('metroSw6Start', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch6', data.time);
    //     console.log("Device: " + data.device + " switch 6 on metro: " + data.time);
    // });

    // socket.on('metroSw6Stop', function (data) {
    //     socket.to(`${data.device}`).emit('metroSwitch6Stop');
    //     console.log("Device: " + data.device + " switch 6 metro stopped");

    // });

    // //'handshake' is specific to BendIt boards
    // socket.on('handshake', function (data) {
    //     console.log(data.nickname);
    //     console.log('BendIt Board connected: ' + socket.id);
        
    //     users.push(socket.id);
    //     socket.name = socket.id;

    //     deviceNumber++;
    //     //the server now knows that the deviceNumber is tied to a socket.id
    //     socket.deviceNumber = deviceNumber;

    //     socket.join(`${deviceNumber}`);
    //     console.log("BendIt Boards Connected: " + deviceNumber);

    //     setTimeout(function () {

    //         let userColorPick = userColors[Math.floor(Math.random() * userColors.length)];
    //         //let userData = {
    //         //     color: userColorPick,
    //         //    number: deviceNumber
    //         // }
    //         let userNumberAssignment = deviceNumber;

    //         io.to(`${socket.id}`).emit("setDeviceColor", userColorPick);
    //         io.to(`${socket.id}`).emit("setDeviceNumber", userNumberAssignment);

    //         console.log("Assigned Color: " + userColorPick);
    //         console.log("Assigned Device Number: " + userNumberAssignment);
    //     }, 750);
    // //} 
    // });

// });





// http.listen(3000, function () {
//     console.log('Bendit_I/O Server is Running!\n Listening on *:3000');
// });