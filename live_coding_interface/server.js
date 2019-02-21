let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

var sw1toggle = { state: false };
var sw2toggle = { state: false };
var sw3toggle = { state: false };
var sw4toggle = { state: false };
var sw5toggle= { state: false };
var sw6toggle= { state: false };

let switches = [sw1toggle, sw2toggle, sw3toggle, sw4toggle, sw5toggle,sw6toggle];
let users =[];//array holding all connected client IDs
let userColors = ["yellow", "orange","green", "pink", "purple"];
let deviceNumber =0;

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

//Open websocket connection when client's connect
io.on('connection', function (socket) {
    
    
    //

    for (var i =0; i<switches.length;i++){
    socket.emit('toggleSwitch'+(i+1), switches[i].state);
    }
    
    //socket.emit('toggleSwitch2', sw2toggle.state);
    //socket.emit('toggleSwitch3', sw3toggle.state);
   // socket.emit('toggleSwitch4', sw4toggle.state);
    
    socket.on('disconnect', function () {
        console.log('User disconnected: ' + socket.id);
    });

    // socket.on('toggle', function (state) {
    //     console.log("Switch 1 toggled!")
    //     light.state =!light.state;
    //     console.log('id: '+socket.id+ 'light: '+light.state)
    //     io.sockets.emit('light', light.state);
    // });

    //Callbacks
    socket.on('toggle1', function (data) {//'toggle1' received from web client
       
        console.log("Switch 1 toggled!" + " " + "Device: "+ data.device);
        sw1toggle.state = !sw1toggle.state;//boolen to change state of switch
        console.log('ID & Device: ' + socket.id + ' : '+data.device + " "+'Switch 1: ' + sw1toggle.state);
        //'toggleSwitch1' is sent to whichever device is chosen by the web client
        socket.to(`${data.device}`).emit('toggleSwitch1', sw1toggle.state);
        //console.log("Server Sent It!" + " " + Date.now());
    });
    socket.on('toggle2', function (data) {//data ='toggle2' received from web client along with device number to control
        console.log("Switch 2 toggled!")
        sw2toggle.state = !sw2toggle.state;//boolen to change state of switch
        console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 2: ' + sw2toggle.state);
        //reminder!: use BACKTICKS, not quotes around ${data.device}
        socket.to(`${data.device}`).emit('toggleSwitch2', sw2toggle.state);
    });
    socket.on('toggle3', function (data) {//'toggle3' received from web client
        console.log("Switch 3 toggled!")
        sw3toggle.state = !sw3toggle.state;//boolen to change state of switch
        console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 3: ' + sw3toggle.state);
        socket.to(`${data.device}`).emit('toggleSwitch3', sw3toggle.state);
    });
    socket.on('toggle4', function (data) {//'toggle4' received from web client
        console.log("Switch 4 toggled!")
        sw4toggle.state = !sw4toggle.state;//boolen to change state of switch
        console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 4: ' + sw4toggle.state);
        socket.to(`${data.device}`).emit('toggleSwitch4', sw4toggle.state);//'toggleSwitch4' is sent to WCB
    });
    socket.on('toggle5', function (data) {//'toggle3' received from web client
        console.log("Switch 5 toggled!")
        sw5toggle.state = !sw5toggle.state;//boolen to change state of switch
        console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 5: ' + sw5toggle.state);        
        socket.to(`${data.device}`).emit('toggleSwitch5', sw5toggle.state);//'toggleSwitch5' is sent to WCB
    });
    socket.on('toggle6', function (data) {//'toggle3' received from web client
        console.log("Switch 6 toggled!")
        sw6toggle.state = !sw6toggle.state;//boolen to change state of switch
       console.log('ID & Device: ' + socket.id + ' : ' + data.device + " " + 'Switch 6: ' + sw6toggle.state);
        socket.to(`${data.device}`).emit('toggleSwitch6', sw6toggle.state);//'toggleSwitch6' is sent to WCB
    });
    socket.on('potTurning', function(data){
        socket.to(`${data.device}`).emit('potTurn', data.position);
        console.log("pot turned! position = "+ data.position);
    });

    socket.on('metroSw1Start', function(data){
        socket.to(`${data.device}`).emit('metroSwitch1', data.time);
        console.log("Device: " + data.device + "switch 1 on metro: "+data.time);
    });

    socket.on('metroSw1Stop', function(data){
        socket.to(`${data.device}`).emit('metroSwitch1Stop');
    });

    socket.on('metroSw2Start', function (data) {
        socket.to(`${data.device}`).emit('metroSwitch2', time2);
        console.log("Device: " + data.device + "switch 1 on metro: " + data.time);
    });

    socket.on('metroSw2Stop', function (data) {
        socket.to(`${data.device}`).emit('metroSwitch2Stop');
    });

    socket.on('handshake', function(){

        console.log('BendIt Board connected: ' + socket.id);
        
        users.push(socket.id);
        socket.name = socket.id;

        deviceNumber++;
        //the server now knows that the deviceNumber is tied to a socket.id
        socket.deviceNumber = deviceNumber;

        socket.join(`${deviceNumber}`);
        console.log("BendIt Boards Connected: " + deviceNumber);

        //socket.user = name;
        //console.log("User Name: " + socket.user);
        setTimeout(function () {

            let userColorPick = userColors[Math.floor(Math.random() * userColors.length)];
            //let userData = {
           //     color: userColorPick,
            //    number: deviceNumber
           // }
           let userNumberAssignment = deviceNumber;

            io.to(`${socket.id}`).emit("setDeviceColor", userColorPick);
            io.to(`${socket.id}`).emit("setDeviceNumber", userNumberAssignment);

            console.log("Assigned Color: " + userColorPick);
            console.log("Assigned Device Number: " + userNumberAssignment);
        }, 750);
    });


});





http.listen(3000, function () {
    console.log('listening on *:3000');
});
