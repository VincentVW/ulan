// CONFIGURATION

// if enabled, the node server should be running, this can be done through:
// `npm run osc-server`
// and it requires node and npm to be installed, and `npm install` to have been run once from the final folder.
let useOsc = false;

let oscInputPort = 7400;
let oscOutputPort = 3334;

// ARRANGE
let oscInputX,
  oscInputY = 0;

function initOsc() {
  setupOsc(oscInputPort, oscOutputPort);
}

function setupOsc(oscPortIn, oscPortOut) {
  if (!useOsc) {
    return;
  }
  var socket = io.connect("http://127.0.0.1:8081", {
    port: 8081,
    rememberTransport: false
  });
  socket.on("connect", function() {
    socket.emit("config", {
      server: { port: oscPortIn, host: "192.168.0.2" },
      client: { port: oscPortOut, host: "127.0.0.1" }
    });
  });
  socket.on("message", function(msg) {
    console.log(msg)
    receiveOsc(msg);
  });
}

function receiveOsc(msg) {
  
  if (msg.length > 2) {
    oscInputX = ((msg[1] + 1) / 2) * 1920;
    oscInputY = Math.abs((msg[2] - 1) / 2) * 1080;
  }
}
