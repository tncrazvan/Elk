let ws = null;
const CONNECTED = 0, DISCONNECTED = 1;
self.onmessage=function(e){
  if(e.data.connect){
    ws = new WebSocket(e.data.connect);
    ws.onopen=function(e){
      postMessage({status: CONNECTED});
      console.log("Connected to VoiceGroup");
    };
    ws.onmessage=function(e){
      //console.log("Received from server",e.data);
      postMessage(e.data);
    };
    ws.onclose=function(e){
      postMessage({status: DISCONNECTED});
      console.log("Disconnected from VoiceGroup");
    };

  }else if(e.data.disconnect){
    ws.close();
  }else {
    ws.send(e.data);
  }
};
