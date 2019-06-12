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
  let inputBuffer;
  let up_traffic = 0;
  let down_traffic = 0;
  let d = new Date();
  let listeningTime = null;
  let workerConnected = false;


  let audioType = 'audio/mpeg; codecs=opus';


  let metadata = "data:"+audioType+";base64,";
  let sound = new Audio();
  
  let playingData = false;
  navigator.getUserMedia = navigator.getUserMedia ||
                           navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia;
  let localAudio;
  if (navigator.mediaDevices) {
    console.log('getUserMedia supported.');
    let constraints = { audio: true };
    let BUFF_SIZE = mtu || 4096;
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
        if(localAudio){
          post.send(localAudio.slice());
        }
        setTimeout(poll,20);
      })();

      processor.onaudioprocess = function(e){
        output = e.outputBuffer.getChannelData(0);
        input = e.inputBuffer.getChannelData(0);
        if(inputBuffer){
          playingData = true;
          inputBuffer.slice().forEach(function(item,i){
            output[i] = (i===0?0:item);
          });
          playingData = false;
        }else{
          for(let i=0; i < output.length; i++){
            output[i] = 0;
          }
        }

        if(recording && workerConnected) localAudio=input;
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
    post.close();
    get.close();
  };

  let post = null;
  let get = null;

  this.connect=function(postUri,getUri){
    if(postUri !== null){
      connectPost(postUri,function(){
        if(getUri !== null){
          connectGet(getUri,function(){
            workerConnected = true;
          });
        }else{
          workerConnected = true;
        }
      });
    }else if(getUri !== null){
      connectGet(getUri,function(){
        workerConnected = true;
      });
    }
  };

  let readerInput = new FileReader();
  function connectGet(uri,f=()=>{}){
    get = new WebSocket(uri);
    get.onopen=function(e){
      console.log("Connected to VoiceGet");
      get.onmessage=function(e){
        if(listening && workerConnected && !playingData){
          down_traffic += e.data.size;
          readerInput.readAsArrayBuffer(e.data);
          readerInput.onloadend = function(){
            inputBuffer = new Float32Array(readerInput.result);
          };
        }
      };
      get.onclose=function(e){
        workerConnected = false;
        (onDisconnect)(uri);
        console.log("Disconnected from VoiceGet");
      };
      (f)();
    };
  }

  function connectPost(uri,f=()=>{}){
    post = new WebSocket(uri);
    post.onopen=function(e){
      console.log("Connected to VoicePost");
      post.onclose=function(e){
        workerConnected = false;
        (onDisconnect)(uri);
        console.log("Disconnected from VoicePost");
      };
      (f)();
    };
  }

  this.reconnect=function(){
    $this.connect($this.getUri().getUri,$this.getUri().postUri);
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
