/**
* ElkPublic is a JavaScript library that makes it easier
* to manage the HTML of your application and
*  interact with the Java servlet ElkServer.
* More details at <https://github.com/tncrazvan/ElkServer/>.
* Copyright (C) 2016-2018  Tanase Razvan Catalin
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License as
* published by the Free Software Foundation, either version 3 of the
* License, or (at your option) any later version.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

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

function VoiceGroup(start_recording,start_listening,workerLocation = "js/Elk/VoiceGroupWorker.js",mtu){
  const CONNECTED = 0, DISCONNECTED = 1;
  let $this = this;
  let onDisconnect = function(){};
  let onConnect = function(){};
  let recording = start_recording || false;
  let listening = start_listening || false;
  let inputBuffer = new Array();
  let inputPreBuffer = new Array();
  let up_traffic = 0;
  let down_traffic = 0;
  let d = new Date();
  let listeningTime = null;
  let workerConnected = false;


  let audioType = 'audio/mpeg; codecs=opus';

  let w = new Worker(workerLocation);

  let metadata = "data:"+audioType+";base64,";
  let sound = new Audio();
  let readerInput = new FileReader();
  
  w.onmessage=function(e){
    if(e.data.status === DISCONNECTED){
      workerConnected = false;
      (onDisconnect)();
    }else if(e.data.status === CONNECTED){
      workerConnected = true;
      (onConnect);
    }else{
      if(listening && workerConnected){
        down_traffic += e.data.size;
        inputPreBuffer.push(e.data);
      }
    }
  };


  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;

  if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');

    let constraints = { audio: true };
    let BUFF_SIZE = mtu || 1024;
    let audioContext = new AudioContext();
    console.log("BUFFER_SIZE:",BUFF_SIZE);
    navigator.mediaDevices
    .getUserMedia(constraints)
    .then(function(stream) {

      let source = audioContext.createMediaStreamSource(stream);
      let node = source.context.createGain(BUFF_SIZE, 1, 1);
      let processor = source.context.createScriptProcessor(BUFF_SIZE,1,1);
      let output, input;
      
      (function poll(){
        if(inputPreBuffer.length > 0 && workerConnected && readerInput.readyState !== 1){
          readerInput.readAsArrayBuffer(inputPreBuffer[0]);
          readerInput.onloadend = function(){
            try{
              if(inputBuffer.length >= 2){
                inputBuffer[inputBuffer.length-1] = new Float32Array(readerInput.result);
              }else{
                inputBuffer.push(new Float32Array(readerInput.result));
              }
            }catch(exception){
              console.log("exception:"+exception);
            }
            inputPreBuffer.splice(0,1);
            //setTimeout(poll,0);
            poll();
          };
        }else{
          setTimeout(poll,0);
          //poll();
        }
      })();
      processor.onaudioprocess = function(e){
        output = e.outputBuffer.getChannelData(0);
        input = e.inputBuffer.getChannelData(0);

        

        if(inputBuffer.length > 0){
          inputBuffer[0].forEach(function(item,i){
            output[i] = (i===0?0:item);
          });
          
          inputBuffer.splice(0,1);
        }else{
          for(let i=0; i < output.length; i++){
            output[i] = 0;
          }
        }

        /*if(inputBuffer.length > 0 && workerConnected && readerInput.readyState !== 1){
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
        }*/
        if(recording && workerConnected) {
          up_traffic +=input.length;
          w.postMessage(input);
        }
        /*console.log("TRAFFIC:",{
          total: ((up_traffic+down_traffic)/1024/1024).truncate(1),
          upload: (up_traffic/1024/1024).truncate(1),
          download: (down_traffic/1024/1024).truncate(1)
        });*/
      }
      source.connect(processor);
      processor.connect(node);
      node.connect(audioContext.destination);
    })
    .catch(function(err) {
     console.error('The following error occurred: ' + err);
   });
  }else{
    console.log("media device not supported");
  }

  this.startRecording=function(){
    recording = true;
  };

  this.stopRecording=function(){
    recording = false;
  };

  this.startListening=function(){
    listening = true;
    listeningTime = d.getTime();
  };

  this.stopListening=function(){
    listening = false;
  };

  this.disconnect=function(){
    $this.stopListening();
    w.postMessage({disconnect:true});
  };

  this.connect=function(postUri,getUri){
    w.postMessage({connect:{
      postUri:postUri,
      getUri:getUri
    }});
  };

  this.reconnect=function(){
    $this.connect($this.getUri());
    return new Promise(function(resolve,reject){
      (function poll(){
        if(workerConnected){
          (resolve)(d.getTime());
        }else{
          setTimeout(function(){poll();},0);
        }
      })();
    });

  };

  this.setOnDisconnect = function(f){
    onDisconnect = f;
  };

  this.setOnConnect = function(f){
    onConnect = f;
  };

  this.getUri=function(){
    return {
      postUri:postUri,
      getUri:getUri
    };
  };
}
