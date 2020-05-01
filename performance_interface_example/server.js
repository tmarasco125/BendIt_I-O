/*
Bendit_I/O: Networked Circuit Bending

Example Server code with Bendit_I/O module


Anthony T. Marasco - 2020
*/


let bendit = require('../lib/benditHub');


//MUST be called before .initServer if you want to add additional channels!
//bendit.setAdditionalChannels = ()=> {\\put new socket.on/channel events here}
bendit.initServer(); //this will be set up once everything is moved to benditHub.js
bendit.postStats("server");

   