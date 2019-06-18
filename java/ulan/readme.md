# Prerequisites

- Processing

# To run the visualization

Open `ulan.pde` in Processing.

# OSC configuration

Change `String remoteIP = "127.0.0.1";` and `int port = 7400;` in the osc file to your IP / port.

Please check if the input mapping in `oscEvent` is correct.

# MIDI configuration

The midi mapping is configuration in `gui.pde` Easiest steps:

- Turn debug mode on so you can see the connected device name and notes played: 

`boolean DEBUG = false;`

- Replace the device string with the device name you see in the outputted debug logs:

`final String device = "Device [hw:2,0,0]";`

- Replace note integer mapping with whatever you want to use for these sliders
```
midimapper.put( ref( device, 14 ), "minAlpha" );
midimapper.put( ref( device, 15 ), "speed" );
midimapper.put( ref( device, 16 ), "dnaSpeed" );
```

# To show the controls

Controls are not passed to the syphon output, will only be visible on laptop window. 
