import oscP5.*;
import netP5.*;

OscP5 oscP5;
NetAddress myRemoteLocation;

String remoteIP = "127.0.0.1";
int port = 7400;

int oscInputX = 0;
int oscInputY = 0;

void setupOSC(){
 oscP5 = new OscP5(this, port);
  myRemoteLocation = new NetAddress(remoteIP, port); 
}

void oscEvent(OscMessage theOscMessage) {
  oscInputX = theOscMessage.get(1).intValue();
  oscInputY = theOscMessage.get(2).intValue();
}
