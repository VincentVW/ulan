var midi;
var data, cmd, channel, type, note, velocity;

// request MIDI access
if (navigator.requestMIDIAccess) {
  navigator
    .requestMIDIAccess({
      sysex: false
    })
    .then(onMIDISuccess, onMIDIFailure);
} else {
  alert("No MIDI support in your browser.");
}

// this maps the MIDI key value (60 - 64) to our samples
var sampleMap = {
  key60: 1,
  key61: 2,
  key62: 3,
  key63: 4,
  key64: 5
};

// midi functions
function onMIDISuccess(midiAccess) {
  midi = midiAccess;
  var inputs = midi.inputs.values();
  // loop through all inputs
  for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
    // listen for midi messages
    input.value.onmidimessage = onMIDIMessage;
    // this just lists our inputs in the console
    listInputs(input);
  }
  // listen for connect/disconnect message
  midi.onstatechange = onStateChange;
}

function onMIDIMessage(event) {
  console.log(event);
  (data = event.data),
    (cmd = data[0] >> 4),
    (channel = data[0] & 0xf),
    (type = data[0] & 0xf0), // channel agnostic message type. Thanks, Phil Burk.
    (note = data[1]),
    (velocity = data[2]);
  // with pressure and tilt off
  // note off: 128, cmd: 8
  // note on: 144, cmd: 9
  // pressure / tilt on
  // pressure: 176, cmd 11:
  // bend: 224, cmd: 14

  handleNoteChange(note, velocity);
  // console.log('data', data, 'cmd', cmd, 'channel', channel);
  // logger('key data', data);
}

const scale = function(num, in_min, in_max, out_min, out_max){
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

const midiSliderRange = [0, 127];
// CHANGE MIDI MAPPING HERE
function handleNoteChange(note, value) {
  switch (note) {
    case 5:
      alphaController.setValue(
        Math.round(
          scale(value, midiSliderRange[0], midiSliderRange[1], 80, 255)
        )
      );
      break;
    case 6:
      speedController.setValue(
        scale(value, midiSliderRange[0], midiSliderRange[1], 0, 1.0)
      );
      break;
    case 7:
        dnaSpeedController.setValue(
            scale(value, midiSliderRange[0], midiSliderRange[1], 0, 1.0)
        );
        break;
    default:
      break;
  }
}

function onStateChange(event) {
  var port = event.port,
    state = port.state,
    name = port.name,
    type = port.type;
  if (type == "input") console.log("name", name, "port", port, "state", state);
}

function listInputs(inputs) {
  var input = inputs.value;
  console.log(
    "Input port : [ type:'" +
      input.type +
      "' id: '" +
      input.id +
      "' manufacturer: '" +
      input.manufacturer +
      "' name: '" +
      input.name +
      "' version: '" +
      input.version +
      "']"
  );
}

function onMIDIFailure(e) {
  console.log(
    "No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " +
      e
  );
}

// utility functions

function logger(label, data) {
  messages =
    label +
    " [channel: " +
    (data[0] & 0xf) +
    ", cmd: " +
    (data[0] >> 4) +
    ", type: " +
    (data[0] & 0xf0) +
    " , note: " +
    data[1] +
    " , velocity: " +
    data[2] +
    "]";
  console.log(messages);
}
