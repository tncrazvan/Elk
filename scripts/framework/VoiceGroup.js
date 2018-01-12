/*
ON JAVA SIDE:

  public class VoiceGroup implements WebSocketInterface{
    private static boolean sending = false;
    @Override
    public void onOpen(WebSocketEvent e, ArrayList<String> get_data) {
        System.out.println("Test connected.");
    }

    @Override
    public void onMessage(WebSocketEvent e, byte[] data, ArrayList<String> get_data) {
        if(!sending){
            sending = true;
            e.broadcast(data, this);
            sending = false;
        }
    }

    @Override
    public void onClose(WebSocketEvent e, ArrayList<String> get_data) {
        System.out.println("Test disconnected.");
    }

  }

*/
VoiceGroup.location = requestMaker.currentJavaScriptRequest;
function VoiceGroup(uri,recordInit,listenInit,mtu){
  var onDisconnect = function(){};
  var recording = recordInit || false;
  var listening = listenInit || false;
  let inputBuffer = new Array();
  let inputPreBuffer = new Array();

  let audioType = 'audio/mpeg; codecs=opus';
  let workerLocation = "";
  foreach(VoiceGroup.location.split("/"),function(node,i,isLast){
    if(isLast){
      workerLocation +="/VoiceGroupWorker.js";
    }else{
      workerLocation +="/"+node
    }
  });
  let w = new Worker(workerLocation);
  w.postMessage({
    connect:uri
  });
  let metadata = "data:"+audioType+";base64,";
  let sound = new Audio();
  var d = new Date();
  var readerInput = new FileReader();

  w.onmessage=function(e){
    if(e.data.disconnect){
      (onDisconnect)();
    }else{
      if(listening){
        inputBuffer.push(e.data);
      }
    }
  };


  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;

  if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');

    var constraints = { audio: true };
    var chunks = [];
    var BUFF_SIZE = mtu || 1024;
    var audioContext = new AudioContext();
    console.log("BUFFER_SIZE:",BUFF_SIZE);
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {

      var source = audioContext.createMediaStreamSource(stream);
      var node = source.context.createGain(BUFF_SIZE, 1, 1);
      var processor = source.context.createScriptProcessor(BUFF_SIZE,1,1);
      let output,input;
      processor.onaudioprocess = function(e){
        output = e.outputBuffer.getChannelData(0);
        input = e.inputBuffer.getChannelData(0);

        if(inputBuffer.length > 0){

          readerInput.readAsArrayBuffer(inputBuffer[0]);
          readerInput.onloadend = function() {
            foreach(new Float32Array(readerInput.result),function(item,i){
              if(i === 0){
                output[i] = 0;
              }else{
                output[i] = item;
              }
            });
            inputBuffer.splice(0,1);
          };
        }
        if(recording) {
          w.postMessage(input);
        }
      }
      source.connect(processor);
      processor.connect(node);
      node.connect(audioContext.destination);


      (function provide(){
        if(chunks.length > 0){
          w.postMessage(chunks[0]);

          chunks = chunks.splice(1,chunks.length);
        }
        setTimeout(function(){provide();},0);
      })();



    })
    .catch(function(err) {
     console.error('The following error occurred: ' + err);
   });
  }

  this.startRecording=function(){
    recording = true;
  };

  this.stopRecording=function(){
    recording = false;
  };

  this.startListening=function(){
    listening = true;
  };

  this.stopListening=function(){
    listening = false;
  };

  this.disconnect=function(){
    w.postMessage({
      disconnect:true
    });
  };

  this.connect=function(uri){
    w.postMessage({
      connect:uri
    });
  };

  this.setOnDisconnect = function(f){
    onDisconnect = f;
  };
}
