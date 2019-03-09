var xPos = 10;
var yPos = 30;
var xShift = 10;
var yShift = 20;

var displayedText = [];
var newHeight = 40;
var codeHeight;
var submittedUser = 0;
var socket;
var justTheText;
function setup() {

    createCanvas(windowWidth, windowHeight);
    socket = new WebSocket('ws://127.0.0.1:3000');

    socket.onopen = function (event) {
        console.log('The WebSocket is Open!');
        setTimeout(function () {
            socket.send('I am the p5 client and I\'m listening!');
        }, 500);
    };

    socket.onclose = function (event) {
        console.log('The p5 client disconnected. Womp wommmp.');
    };

    background("#141414");
    textFont('Source Code Pro');
    // textStyle("italic")
    textSize(20);
    // frameRate(10);
    codeHeight = windowHeight - 20;


    socket.onmessage = function (event) {
        console.log('Client received a message', event.data);
        submittedUser = event.data[0] - 1;
        console.log("Submitted User: " + submittedUser);
        background("#141414");
        justTheText =event.data.split("&");
        var code = new CodeText(justTheText[1], windowHeight - 20, submittedUser);


        displayedText.push(code);

        for (var i = 0; i < displayedText.length; i++) {
            if (displayedText[i].user == 0) {
                displayedText[i].displayCodeLeft();

            } else {
                displayedText[i].displayCodeRight();
            }
            displayedText[i].y -= 70;

        }


        console.log(displayedText.length);

    };
}

function draw() {

}




/* function keyPressed(){
 /*  string = "namespace('synth'"+random(250)+"').seq;" */
/* if(keyCode ==RETURN){
  submittedUser =1;
} else if (keyCode ==UP_ARROW){
  submittedUser =0;
}
 
 
 
 
 
 
 
 
 
 
} */



/* function drawText() {
  if(keyCode == ESCAPE) {
     textAlign(RIGHT);
    var sWidth1 = textWidth(string);
    yPos = 30;
    xPos = windowWidth-sWidth1;
    background(20);
  } else if(keyCode == RETURN) {
    yPos = yPos + yShift;
    xPos = 10
  } else {
   // textStyle("italic")
    
    background(20);
    fill(8, 180, 255);
    textAlign(LEFT);
    text(string,xPos,yPos-=13);
    
  }
  
} */


function CodeText(data, textY, userNumber) {
    this.text = data;

    this.y = textY;
    this.user = userNumber;

    this.displayCodeLeft = function () {
        textStyle("normal");
        fill("#40B0A6");
        textAlign(LEFT);
        text(this.text, 30, this.y);
    }

    this.displayCodeRight = function () {
      //  var codeWidth = textWidth(this.text);
        textStyle("normal");
        fill("#E1BE6A");
        textAlign(RIGHT);
        text(this.text, windowWidth - 20, this.y);
    }

    this.displayCommentLeft = function () {
        textStyle("italic");
        fill(200);
        textAlign(LEFT);
        text(this.text, 10, this.y);
    }

    this.displayCommentRight = function () {
        var comWidth = textWidth(this.text);
        textStyle("italic");
        stroke(200);
        textAlign(RIGHT);
        text(this.text, windowWidth - comWidth, this.y);
    }


}