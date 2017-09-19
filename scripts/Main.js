/*Project.workspace='/my_root';
function Project(){}
var workspace = Project.workspace;
window.workspace = Project.workspace;*/
function getJobLocation(){
    var currentLocation = "", i = 0;
    var exp = window.location.pathname.split("/");
    var temp = Project.workspace.split("/");
    foreach(exp,function(item){
        if(i===temp.length){
            currentLocation +=item;
        }else if(i>temp.length){
            currentLocation += "/"+item;
        }
        i++;
    });
    return currentLocation;
}

function getProtocol(){
  return window.location.href.split("://")[0];
}

function isset(object){
    if(object!==undefined){
        return true;
    }else{
        return false;
    }
}

function isnull(object){
    if(object === null) {
        return true;
    } else {
        return false;
    }
}

function isempty(object){
    if(object===""){
        return true;
    }else{
        return false;
    }
}

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function create(tag,content){
    var element = document.createElement(tag);
    if(isset(content)){
      element.innerHTML = content;
    }
    return element;
}

function Box(tag, $function) {
    this.e = document.createElement(tag);
    this.add = function (other) {
        if (other instanceof Box) {
            this.e.appendChild(other.e);
        } else {
            this.e.appendChild(other);
        }
    };
    this.find=function(){
        return this.e;
    };
    if(isset($function)){
        ($function)(this.e);
    }
}




function PostHttpEvent(uri,success,data,other){
  return new HttpEvent(uri,success,other,"POST",data);
}

function HttpEvent(uri,success, other, type, data) {
    $this = this;
    this.other = other; //other stuff such as listeners, ecc (check ajax progress listener below for that regard)
    this.success = (success ? success : function () {});

    var url = Project.workspace+uri;
    var type = isset(type)?type:'GET'; //default transmission method
    var dataType = 'text/plain';
    var contentType = 'application/json';


    this.setUrl = function (value) {
        url = value;
    };


    this.setDataType = function (value) {
        dataType = value;
    };

    this.setContentType = function (value) {
        contentType = value;
    };

    this.getUrl = function () {
        return url;
    };

    this.getType = function () {
        return type;
    }, this.getMethod = this.getType;

    this.getDataType = function () {
        return dataType;
    };

    this.getContentType = function () {
        return contentType;
    };
    this.run = function () {

        var formdata = new FormData();  //new storage for properly formatted json array/object to flush
        for (var key in data) {
            formdata.append(key, data[key].btoa());
        }

        var ajax = new XMLHttpRequest();
        //set events here


        if ($this.other) {
            for (var key in $this.other) {

            	switch(key){
            	/**************DOWNLOAD******************/
                    case "downloadProgress":
                        ajax.addEventListener('progress', function (event) {
                            (other[key])(event);
                        }, false);
                    break;
                    case "downloadComplete":
                        ajax.addEventListener('load', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "downloadError":
                        ajax.addEventListener('error', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "downloadAbort":
                        ajax.addEventListener('abort', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
            	/*****************UPLOAD***********************/
                    case "uploadProgress":
                        ajax.upload.addEventListener('progress', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadComplete":
                        ajax.upload.addEventListener('load', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadError":
                        ajax.upload.addEventListener('error', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadAbort":
                        ajax.upload.addEventListener('abort', function (event) {
                            (other[key])(event);
                        }, false);
                        break;

            	}

            }
        }
        ajax.onreadystatechange = function () { //whenever state changes
            if (this.readyState === 4 && this.status === 200){ //onready state run
                (success)(ajax.responseText);
            }
        };

        ajax.open(this.getMethod(), this.getUrl(),true);
        ajax.send(formdata); //run
    };
}

var Job = HttpEvent;

function applyHtml(target,data){
    //pushing data to the target
    //NOTE: just pushing html text into an element won't execute
    //the scripting inside the data, it will just print it as plain
    //text and ignore it. The parsing is being done below inside the foreach cycle.

    //target.innerHTML = data;

    //temporary parent element
    //I'm using this to throw in the result data
    //and parse it as child nodes.


    target.innerHTML = data;

    foreach(target.childNodes,function(item){ //iterating through each tag
        //find <script>
        if(item.nodeName === "SCRIPT"){
            //parse <script> contents as javascript code
            eval(item.innerHTML);
        }else if(item.nodeName[0] !=="#"){
          //if this current element has an "id" attribute set to something...
          if(item.hasAttribute("id")){
              //...save element on the window object
              //I'm not directly saving "item" into window because the node
              //doesn't exist inside the dom at this point,
              //I need to find the element after it's been created.
              //"R.id()" will do this for me.
              window[item.getAttribute("id")] = item;
          }
          if(item.hasAttribute("@")){
            tmp = item.getAttribute("@").split("/");
            if(tmp.length === 1){
              tmp[1] = tmp[0];
              tmp[0] = "*";
            }
            if(tmp.length > 0){
              try{
                item.innerHTML = vocabulary.page[tmp[0]].phrase[tmp[1]].lang[localStorage.getItem("language")];
              }catch(error){
                console.error(error)
                console.error(tmp);
              }
            }
          }else{
            children = item.childNodes;
            foreachChild(children,function(child){
              if(child.hasAttribute("@")){
                tmp = child.getAttribute("@").split("/");
                if(tmp.length === 1){
                  tmp[1] = tmp[0];
                  tmp[0] = "*";
                }
                if(tmp.length > 0){
                  try{
                    child.innerHTML = vocabulary.page[tmp[0]].phrase[tmp[1]].lang[localStorage.getItem("language")];
                  }catch(error){
                    console.error(error)
                    console.error(tmp);
                  }

                }
              }
            });
          }
        }
    });
}

function foreachChild(children,f){
  foreach(children,function(child){
    if(child.childNodes.length > 0){
      foreachChild(child.childNodes,f);
    }else if(child.nodeName !== "#text" && child.nodeName !== "#comment"){
      (f)(child);
    }
  });
}

fx.i = 0;
fx.delay = 0;
fx.before = function () {};
fx.after = function () {};
fx.target = document.getElementById("main-content");
function fx(focus, onready, target) {
    var $this=this;
    if (!isset(target)) {
        this.target = fx.target;
    }else{
	     this.target = target;
    }
    (fx.before)(this.target);

    var j = new HttpEvent("/@"+focus,function(r){
    	setTimeout(function(){
            applyHtml($this.target,r);
            (fx.after)($this.target);
        },fx.delay);

    });

    j.run();
}

function go(link, onready, target) {
	//modifying client url,
    //this is absolutelly not required, it just refreshes the client's
    //url in order to let them know their location or be able to copy it
    history.pushState(null, document.title, Project.workspace + '/' + link);
	//writes new content (with some flashy animation)
    fx(link, onready, target);
	//saves new location
    window.JobLocation=link;
}

//basically does the same thing as go(ling, onready, target), but it's more straight forward
function setContent(uri,target,changeState){
  new HttpEvent("/@"+uri,function(result){
    if(isset(changeState))
      if(changeState){
        history.pushState(null, document.title, Project.workspace + '/' + uri);
        window.JobLocation=uri;
      }

    target.applyHtml(result);
  }).run();
}

function forevery(array, $function, counter, from, to) {
    var i;
    var isLast = false;
    for (i = (from ? from : 0); i < (to ? to : array.length); i += counter) {
        isLast=!(i+1 < (to ? to : array.length));
        $function(array[i],i,isLast);
    }
}

function foreach(array, $function, from, to) {
    forevery(array, $function, 1, from, to);
}

function foreachr(array, $function) {
    var i;
    for (i = array.length - 1; i >= 0; i--) {
        var element = array[i];
        $function(element);
    }
}

function notify(message) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(message);
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(message);
            }
        });
    }
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
}

window.onpopstate = function () {
    JobLocation = getJobLocation();
    fx(JobLocation);
};
Mouse.leftButtonDown = false;
Mouse.rightButtonDown = false;
Mouse.leftButtonDownX = null;
Mouse.leftButtonDownZ = null;
document.body.onmousedown = function (event) {
    e = event || window.event;
    switch (e.which) {
        case 1:
            Mouse.leftButtonDown = true;
            Mouse.leftButtonDownX = Mouse.position.x;
            Mouse.leftButtonDownY = Mouse.position.y;
            break;
        case 2:

            break;
        case 3:
            Mouse.rightButtonDown = true;
            break;
        default:

            break;
    }
};

document.body.onmouseup = function (event) {
    e = event || window.event;
    switch (e.which) {
        case 1:
            Mouse.leftButtonDown = false;
            Mouse.leftButtonDownX = null;
            Mouse.leftButtonDownY = null;
            break;
        case 2:

            break;
        case 3:
            Mouse.rightButtonDown = false;
            break;
        default:

            break;
    }
};

Mouse.position = {x: null, y: null};
(function () {   //updating mouse position every 10ms
    document.onmousemove = handleMouseMove;
    (function poll() {
        setTimeout(function () {
            getMousePosition();
            poll();
        }, 10);
    })();

    function handleMouseMove(event) {
        var dot, eventDoc, doc, body, pageX, pageY;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
                    (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                    (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
                    (doc && doc.scrollTop || body && body.scrollTop || 0) -
                    (doc && doc.clientTop || body && body.clientTop || 0);
        }

        Mouse.position = {
            x: event.pageX,
            y: event.pageY
        };
    }
    function getMousePosition() {
        pos = Mouse.position;
        if (!pos) {
            // We haven't seen any movement yet
        } else {
            // Use pos.x and pos.y
            return pos;
        }
    }
})();
function Mouse() {}

Keyboard={
    q: false, w: false, e: false, r: false, t: false, y: false, u: false, i: false, o: false, p: false,
    a: false, s: false, d: false, f: false, g: false, h: false, j: false, k: false, l: false,
    z: false, x: false, c: false, v: false, b: false, n: false, m: false,
    ctrl: false, alt: false, shift: false, space: false, tab: false,
    1: false, 2: false, 3: false, 4: false, 5: false, 6: false, 7: false, 8: false, 9: false, 0: false,
    questionMark: false, equal: false, exclamation: false, quotes: false, quote: false, pound: false, dolar:false, euro: false,
    percent: false, ampersand: false, fSlash: false, bSlash: false, leftParenthesis: false, rightParenthesis: false,
    leftBracket: false, rightBracket: false, circumflex: false, leftBrace: false, rightBrace: false,
    at: false, dot: false, comma: false, semicolon: false, hyphen: false, underscore: false, colon: false,
    esc: false, minus: false, plus: false, star:false, enter: false, del: false, ins: false, end: false,
    home: false, pageUp: false, pageDown: false, backspace: false, arrowLeft: false, arrowRight: false,
    arrowUp: false, arrowDown: false, super: false, meta: false,
    f1: false, f2: false, f3: false, f4: false, f5: false, f6: false, f7: false, f8: false,
    f9: false, f10: false, f11: false, f12: false
};

function Keyboard() {};

function wait(bool,f){
    (function poll(){
        setTimeout(function(){
            if(bool){
                (f)();
            }else{
                poll();
            }
        },1);
    })();
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

var getElementOffset = function(element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        x: left,
        y: top
    };
};


function Thread(f,t){
  this.run=function(){
    setTimeout(f,t);
  };
}


function getInputCursorPos(input) {
  if ("selectionStart" in input && document.activeElement == input) {
    return {
      start: input.selectionStart,
      end: input.selectionEnd
    };
  }
  else if (input.createTextRange) {
    var sel = document.selection.createRange();
    if (sel.parentElement() === input) {
      var rng = input.createTextRange();
      rng.moveToBookmark(sel.getBookmark());
      for (var len = 0;
      rng.compareEndPoints("EndToStart", rng) > 0;
      rng.moveEnd("character", -1)) {
        len++;
      }
      rng.setEndPoint("StartToStart", input.createTextRange());
      for (var pos = { start: 0, end: len };
      rng.compareEndPoints("EndToStart", rng) > 0;
      rng.moveEnd("character", -1)) {
        pos.start++;
        pos.end++;
      }
      return pos;
    }
  }
  return -1;
}


function getEditableCursorPos(editableDiv) {
  var caretPos = 0,
    sel, range;
  if (window.getSelection) {
    sel = window.getSelection();
    if (sel.rangeCount) {
      range = sel.getRangeAt(0);
      if (range.commonAncestorContainer.parentNode == editableDiv) {
        caretPos = range.endOffset;
      }
    }
  } else if (document.selection && document.selection.createRange) {
    range = document.selection.createRange();
    if (range.parentElement() == editableDiv) {
      var tempEl = document.createElement("span");
      editableDiv.insertBefore(tempEl, editableDiv.firstChild);
      var tempRange = range.duplicate();
      tempRange.moveToElementText(tempEl);
      tempRange.setEndPoint("EndToEnd", range);
      caretPos = tempRange.text.length;
    }
  }
  return caretPos;
}


String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};


function selectText(container) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(container);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(container);
        window.getSelection().addRange(range);
    }
}

Element.prototype.clear=function(){
  this.innerHTML = "";
};

Element.prototype.remove=function(){
    this.oldParent = this.parentElement;
    this.parentElement.removeChild(this);
};
Element.prototype.restore=function(){
    this.oldParent.appendChild(this);
};
Element.prototype.hide=function(){
  if(this.style.display.trim() !== "none"){
    if(this.style.display.trim() !== ""){
        this.originalDisplay=this.style.display;
    }else{
        this.originalDisplay="block";
    }
    this.style.display="none";
  }
};
Element.prototype.show=function(){
    this.style.display=this.originalDisplay;
};

Element.prototype.toggleDisplay=function(){
    if(this.style.display.trim() !== "none" ){
      this.show();
    }else{
      this.hide();
    }
};
Element.prototype.applyHtml=function(data){
  applyHtml(this,data);
};

Number.prototype.truncate=function(places){
    return Math.trunc(this * Math.pow(10, places)) / Math.pow(10, places);
};

function base64ToVideoBlob(string){
    var byteCharacters = atob(string);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: 'video/webm'});
}

Array.prototype.btoa = function() {
    return btoa(unescape(encodeURIComponent(this+"")));
};
Array.prototype.atob = function() {
    return decodeURIComponent(escape(atob(this+"")));
};

Number.prototype.btoa = function() {
    return btoa(unescape(encodeURIComponent(this+"")));
};
Number.prototype.atob = function() {
    return decodeURIComponent(escape(atob(this+"")));
};

String.prototype.btoa = function() {
    return btoa(unescape(encodeURIComponent(this)));
};
String.prototype.atob = function() {
    return decodeURIComponent(escape(atob(this)));
};
String.prototype.capitalize = function() {
    return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

String.prototype.parseInt=function(){
  return parseInt(this);
};

translate=function(element,string){
  tmp = string.split("/");
  element.innerHTML = vocabulary.page[tmp[0]].phrase[tmp[1]].lang[localStorage.getItem("language")];
};

function sendFile(file, info, ws, progress, done) {
    if(!isset(info)) return;
    if(!isset(ws)) return;
    if(!isset(progress)) progress = function(){};

    var lastResponse;
    var counter = 0;
    var confirmed = false;
    var fileSize   = file.size;
    var chunkSize  = Project.MTU; // bytes
    var offset     = 0;
    var self       = this; // we need a reference to the current object
    var chunkReaderBlock = null;
    var r;
    var blob;
    ws.onmessage=function(e){
      lastResponse = e;
      confirmed = true;
    };
    ws.onclose=function(){
      (done)(lastResponse.data);
    };
    var readEventHandler = function(evt) {
        if (evt.target.error == null) {
            counter++;
            confirmed = false;
            offset += chunkSize;
            if(offset > fileSize) offset = fileSize;
            /*console.log("###################### "+(offset*100/fileSize).truncate(0)+"%");
            console.log("length:"+chunkSize+" (sum:"+offset+", file-size:"+fileSize+")");*/
            (progress)((offset*100/fileSize));
            ws.send(evt.target.result.split("base64,")[1]);
            evt.target.result = null;
            evt = null;
            r = null;
            blob = null;
        } else {
            console.err("Read error: " + evt.target.error);
            return;
        }


          (function poll(){
            if(confirmed){
              if(offset < fileSize){
                chunkReaderBlock(offset, chunkSize, file);
              }else{
                ws.send(";");
              }
            }else{
              setTimeout(function(){poll();},10);
            }
          })();

    }

    chunkReaderBlock = function(_offset, length, _file) {
        r = new FileReader();
        r.onload = readEventHandler;
        blob = _file.slice(_offset, length + _offset);

        r.readAsDataURL(blob);
    }

    //send file information (name,size,ecc)
    var head = JSON.stringify(info).btoa();
    ws.send(head);
    confirmed = false;
    //busy waiting...
    (function poll1(){
      if(confirmed){
        // now separating the header from the body of the file
        ws.send(":");
        confirmed = false;
        //busy waiting again...
        (function poll2(){
          if(confirmed){
            // now let's start the read with the first block
            chunkReaderBlock(offset, chunkSize, file);
          }else{
            setTimeout(function(){poll2();},10);
          }
        })();
      }else{
        setTimeout(function(){poll1();},10);
      }
    })();

}
