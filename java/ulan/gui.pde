import controlP5.*;


import java.util.HashMap;
import java.util.Map;
import javax.sound.midi.Receiver;
import javax.sound.midi.MidiMessage;

Map<String, String> midimapper = new HashMap<String, String>();
ControlP5 cp5;

void setupGUI(){
  cp5 = new ControlP5(this);


  // add a vertical slider
  cp5.addSlider("minAlpha")
     .setPosition(20,1010)
     .setSize(400,20)
     .setRange(1,255)
     .setValue(100)
     ;
  
  cp5.addSlider("speed")
     .setPosition(20,1035)
     .setSize(400,20)
     .setRange(0.00,1.00)
     .setValue(0.05)
     ;
  
  cp5.addSlider("dnaSpeed")
     .setPosition(20,1060)
     .setSize(400,20)
     .setRange(0.00,1.00)
     .setValue(0.00)
     ;
     
  cp5.addSlider("lineWeight")
     .setPosition(20,1090)
     .setSize(400,20)
     .setRange(0.00,5.00)
     .setValue(1.00)
     ;
     
  cp5.addToggle("drawLines")
     .setPosition(20,1120)
     .setSize(50,20)
     .setMode(ControlP5.SWITCH)
     ;

  final String device = "Device [hw:2,0,0]";

  midimapper.put( ref( device, 14 ), "minAlpha" );
  midimapper.put( ref( device, 15 ), "speed" );
  midimapper.put( ref( device, 16 ), "dnaSpeed" );
  midimapper.put( ref( device, 17 ), "lineWeight" );

  boolean DEBUG = false;

  if (DEBUG) {
    new MidiSimple( device );
  }
  else {
    new MidiSimple( device , new Receiver() {

      @Override public void send( MidiMessage msg, long timeStamp ) {

        byte[] b = msg.getMessage();

        if ( b[ 0 ] != -48 ) {

          Object index = ( midimapper.get( ref( device , b[ 1 ] ) ) );

          if ( index != null ) {

            Controller c = cp5.getController(index.toString());
            if (c instanceof Slider ) {
              float min = c.getMin();
              float max = c.getMax();
              c.setValue(map(b[ 2 ], 0, 127, min, max) );
            }  else if ( c instanceof Button ) {
              if ( b[ 2 ] > 64 ) {
                c.setValue( c.getValue( ) );
                c.setColorBackground( 0xff08a2cf );
              } else {
                c.setColorBackground( 0xff003652 );
              }
            } else if ( c instanceof Bang ) {
             
              if ( b[ 2 ] > 64 ) {
                c.setValue( c.getValue( ) );
                c.setColorForeground( 0xff08a2cf );
              } else {
                c.setColorForeground( 0xff00698c );
              }
            } else if ( c instanceof Toggle ) {
              if ( b[ 2 ] > 64 ) {
                ( ( Toggle ) c ).toggle( );
              }
            }
          }
        }
      }

      @Override public void close( ) {
      }
    }
    );
  }
}


String ref(String theDevice, int theIndex) {
  return theDevice+"-"+theIndex;
}

void drawGui(){
  strokeWeight(0);
  fill(40);
  rect(0,1000,width,200);

  textSize(11);
  fill(255);
}
