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

let post = null;
let get = null;
const CONNECTED = 0, DISCONNECTED = 1;
self.onmessage=function(e){
  if(e.data.connect){
    let connection = e.data.connect;
    if(connection.postUri !== null){
      connectPost(connection,function(){
        if(connection.getUri !== null){
          connectGet(connection,function(){
            postMessage({status: CONNECTED});
          });
        }else{
          postMessage({status: CONNECTED});
        }
      });
    }else if(connection.getUri !== null){
      connectGet(connection,function(){
        postMessage({status: CONNECTED});
      });
    }
  }else if(e.data.disconnect){
    post.close();
    get.close();
  }else{
    post.send(e.data);
  }
};

function connectGet(connection,f=()=>{}){
  get = new WebSocket(connection.getUri);
  get.onopen=function(e){
    console.log("Connected to VoiceGet");

    get.onmessage=function(e){
      //console.log("Received from server",e.data);
      postMessage(e.data);
    };
    get.onclose=function(e){
      postMessage({status: DISCONNECTED});
      console.log("Disconnected from VoiceGet");
    };
    (f)();
  };
}

function connectPost(connection,f=()=>{}){
  post = new WebSocket(connection.postUri);
  post.onopen=function(e){
    console.log("Connected to VoicePost");

    post.onclose=function(e){
      postMessage({status: DISCONNECTED});
      console.log("Disconnected from VoicePost");
    };
    (f)();
  };
}