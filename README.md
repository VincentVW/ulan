# Prerequisites

- node
- npm

# To run the node server for osc
- `npm install`
- `npm run start`

# To run the visualization

open index.html

# OSC configuration

turn the `useOsc` boolean on in osc.js and configure ports there. 

then in `population.js`, change `var dir = createVector(mouseX, mouseY).sub(this.pos);` to `var dir = createVector(oscInputX, oscInputY).sub(this.pos);`

# MIDI configuration

See midi.js

# To show the controls

Press `p`
