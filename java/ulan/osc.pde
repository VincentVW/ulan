import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

String remoteIP = "127.0.0.1";
int port = 7400;

float oscInputX = 0;
float oscInputY = 0;

void setupOSC(){
 oscP5 = new OscP5(this, port);
  myRemoteLocation = new NetAddress(remoteIP, port); 
}

//void mousePressed() {
//  /* in the following different ways of creating osc messages are shown by example */
//  OscMessage myMessage = new OscMessage("/test");
  
//  float x = mouseX;
//  float y = mouseY;
  
//  myMessage.add(x);
//  myMessage.add(y);
//  /* send the message */
//  oscP5.send(myMessage, myRemoteLocation); 
//}

void oscEvent(OscMessage theOscMessage) {
  
  oscInputX = theOscMessage.get(0).floatValue();
  oscInputY = theOscMessage.get(1).floatValue();
  
  //System.out.println(oscInputX);
  //System.out.println(oscInputY);
}
