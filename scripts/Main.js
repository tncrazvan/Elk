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
    var tmp = location.href.split(currentLocation+"?");
    if(tmp.length > 1){
      if(tmp[1] !== ""){
        currentLocation += "?"+tmp[1];
      }
    }
    return currentLocation;
}

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

window.COOKIE={};
function Cookie(key, value, path, domain, expire){
    var $this = this;
    var controllerSet = "/@Set/cookie";
    var controllerUnset = "/@Unset/cookie";
    var controllerGet = "/@Get/cookie";
    var controllerIsset = "/@Isset/cookie";
    key =isset(key)?key:"?";
    path =isset(path)?path:"/";
    value =isset(value)?value:"";
    domain =isset(domain)?domain:document.location.hostname;
    expire =isset(expire)?expire:new String((Date.now()/1000).truncate(0)+60*60*24*7); //1 week of cookie is default

    /*
    IMPORTANT: reading cookies and unsetting cookies is done using the GET method of HTTP,
    however, in order to set the value of a (new or old) cookie the POST method is used instead.
    Using the POST method the cookie's length is not limied and it is not sent in clear, eg:
    setting a password for an account should not be visible anywhere on your browser, but that is not the case with GET requests,
    as browsers often display the URL of every GET request in some way (on the javascript console or on the address bar).
    */
    this.set=function(f){
      var e = new PostHttpEvent(controllerSet,result=>{

          delete window.COOKIE[path+key];
          window.COOKIE[path+key]=JSON.parse(result);
          if(isset(f)) (f)();
      },
      {
        "name":key,
        "path":path,
        "domain":domain,
        "expire":expire,
        "value":value
      });
      e.run();
    };
    this.unset=function(f){
      var e = new PostHttpEvent(controllerUnset,result=>{
          delete window.COOKIE[path+key];
          if(isset(f)) (f)();
      },
      {
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };
    this.get=function(f){
      var e = new PostHttpEvent(controllerGet,e=>{
          window.COOKIE[path+key]=JSON.parse(e);
          if(isset(f))
              (f)(JSON.parse(e));
      },
      {
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };

    this.isset=function(f){
      var e = new PostHttpEvent(controllerIsset,e=>{
          if(isset(f)) (f)(Number(JSON.parse(e))>=0);
      },{
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };
}


function R(){}
R.cls=function(cls){
  if(isset(cls) && cls !== "")
    return document.getElementsByClassName(cls);
  else
    return null;
};
R.id=function(id){
  if(isset(id) && id !== "")
    return document.getElementById(id);
  else
    return null;
};
R.new=function(object){
  return document.createElement(object);
};


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

function create(tag,content,allowVariables){
    var element = document.createElement(tag);
    if(isset(content)){
      element.applyHtml(content,allowVariables);
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
    success = (isset(success) ? success : function () {});

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

    var requestHeaders = {};
    this.setRequestHeader=function(headers){
      requestHeaders = headers;
    };
    this.run = function () {

        var formdata = new FormData();  //new storage for properly formatted json array/object to flush
        for (var key in data) {
            try{
              formdata.append(key, data[key].btoa());
            }catch(e){
              console.log("Attempting btoa() on: "+data[key]);
            }
        }

        var xhr = new XMLHttpRequest();
        //set events here


        if ($this.other) {
            for (var key in $this.other) {

            	switch(key){
            	/**************DOWNLOAD******************/
                    case "downloadProgress":
                        xhr.addEventListener('progress', function (event) {
                            (other[key])(event);
                        }, false);
                    break;
                    case "downloadComplete":
                        xhr.addEventListener('load', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "downloadError":
                        xhr.addEventListener('error', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "downloadAbort":
                        xhr.addEventListener('abort', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
            	/*****************UPLOAD***********************/
                    case "uploadProgress":
                        xhr.upload.addEventListener('progress', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadComplete":
                        xhr.upload.addEventListener('load', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadError":
                        xhr.upload.addEventListener('error', function (event) {
                            (other[key])(event);
                        }, false);
                        break;
                    case "uploadAbort":
                        xhr.upload.addEventListener('abort', function (event) {
                            (other[key])(event);
                        }, false);
                        break;

            	}

            }
        }
        xhr.onreadystatechange = function () { //whenever state changes
            if (this.readyState === 4){ //onready state run
                (success)(xhr.responseText,this.status);
            }
        };


        xhr.open(this.getMethod(), this.getUrl(),true);
        for (var key in requestHeaders) {
           if (requestHeaders.hasOwnProperty(key)) {
              xhr.setRequestHeader(key,requestHeaders[key]);
           }
        }
        xhr.send(formdata); //run
    };
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

//this function will try and find one leaf within
//the window variables tree (given the "string" path) and return it
function TMP55341(strings){
  var tmp,counter=0;
  for(var key in strings){
    if (strings.hasOwnProperty(key)){
      if(counter===0){
        tmp = window[strings[key]];
      }else{
        tmp = tmp[strings[key]];
      }
    }
    counter++;
  }
  return tmp;
}

//this function will parse for inline html variables inside the given #text nodes
PARSEVAR55TH72.tmpText;
PARSEVAR55TH72.tmpArray = new Array();
function PARSEVAR55TH72(item){
  if((PARSEVAR55TH72.tmpText = item.data.trim()) !== ""){
    PARSEVAR55TH72.tmpArray = PARSEVAR55TH72.tmpText.match(/\$[A-z0-9\-\.]+/g); //search for variables
    for (var key in PARSEVAR55TH72.tmpArray) {
      if (PARSEVAR55TH72.tmpArray.hasOwnProperty(key)) {
        if(key !== "index" && key !== "input"){

            //console.log("ELEMENT NODENAME:"+window[PARSEVAR55TH72.tmpArray[key].substring(1)]);
            var entity = TMP55341(PARSEVAR55TH72.tmpArray[0].substring(1).split(/\./g));
            if(typeof entity === "object"){
              if(isset(entity.nodeName)){
                //console.log("This is a node.");
                item.data = "";
                if(isset(item.previousSibling) && !isnull(item.previousSibling))
                  insertAfter(entity,item.previousSibling);
                else
                  item.parentNode.insertBefore(entity,item.parentNode.firstChild);
              }else{
                //console.log("This is not a node, but it is an object.");
                item.data = JSON.stringify(entity);
                //console.log(PARSEVAR55TH72.tmpArray[key].substring(1));
              }
            }else{
              //console.log("This is not an object nor a node, maybe a string or a number?");
              item.data = entity;
            }
         }
       }
    }
  }
}

//This function will parse the dom item and replace
//its contents with the relative solution in the vocabulary
function PARSEVOCABULARY3100JJYT6(item){
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
}

//This function will parse the contents of the given children of the dom and
//replace its contents with the relative solution in the vocabulary
function PARSEVOCABULARYCHILDREN347HHH7J(children, allowVariables){
  foreach(children,function(child){
    if(child.nodeName[0] !== "#"){
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
      }else{
        PARSEVOCABULARYCHILDREN347HHH7J(child.childNodes,allowVariables);
      }
    }else if(child.nodeName === "#text" && allowVariables){
      PARSEVAR55TH72(child);
    }
  });
}

//iterating through every child node of the provided target
function RECURSIVE76349AAD(target,allowVariables){

  foreach(target.childNodes,function(item){ //iterating through each tag
      //find <script>
      if(item.nodeName === "SCRIPT"){
          //parse <script> contents as javascript code
          eval(item.innerHTML);
      }else if(item.nodeName === "#text" && allowVariables){
        PARSEVAR55TH72(item);
      }else if(item.nodeName[0] !== "#"){ //if it's not some type of string or comment...
        //if this current element has an "id" attribute set to something...
        if(item.hasAttribute("id")){
            //...save element on the window object
            //I'm not directly saving "item" into window because the node
            //doesn't exist inside the dom at this point,
            //I need to find the element after it's been created.
            //"R.id()" will do this for me.
            window[item.getAttribute("id")] = item;
        }
        //check if this item has an attribute named "@"
        if(item.hasAttribute("@")){
          PARSEVOCABULARY3100JJYT6(item);
        }else{ //if it doesn't...
          //keep going and try to parse its children
          PARSEVOCABULARYCHILDREN347HHH7J(item.childNodes,allowVariables);
        }
      }
  });
}


var Job = HttpEvent;

function applyHtml(target,data,allowVariables){
    //pushing data to the target
    //NOTE: just pushing html text into an element won't execute
    //the scripting inside the data, it will just print it as plain
    //text and ignore it. The parsing is being done below inside the foreach cycle.

    //target.innerHTML = data;

    //temporary parent element
    //I'm using this to throw in the result data
    //and parse it as child nodes.

    allowVariables = (isset(allowVariables)?allowVariables:false);
    target.innerHTML = data;
    RECURSIVE76349AAD(target,allowVariables);
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
    if(!isset(onready)) onready = function(){};
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
function setContent(uri,target,changeState,allowVariables){
  uri = uri.trim();
  let uri_prepend = "";
  if(uri.substr(0,Project.URI_FILE_DELIMITER.length) === Project.URI_FILE_DELIMITER){
    uri_prepend = "";
    uri = uri.substr(Project.URI_FILE_DELIMITER.length);
  }else{
    uri_prepend = "/@";
  }
  new HttpEvent(uri_prepend+uri,function(result){
    if(isset(changeState))
      if(changeState){
        history.pushState(null, document.title, Project.workspace + '/' + uri);
        window.JobLocation=uri;
      }

    target.applyHtml(result,allowVariables);
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
function hide(element){
  if(element.style.display.trim() !== "none"){
    if(element.style.display.trim() !== ""){
        element.originalDisplay=element.style.display;
    }else{
        element.originalDisplay="block";
    }
  }
  element.style.display="none";
}

function show(element){
  if(!isset(element.originalDisplay)) element.originalDisplay = "block";
  element.style.display=element.originalDisplay;
}

Element.prototype.showElement=function(){
  if(isset(this.style.display) && this.style.display !== ""){
      this.oldDisplay=this.style.display;
  }else{
      this.oldDisplay="block";
  }

  this.style.display="none";
};

Element.prototype.hideElement=function(){
  if(!isset(this.oldDisplay)) this.oldDisplay = "block";
  this.style.display=this.oldDisplay;
};

Element.prototype.toggleDisplay=function(){
    if(this.style.display!=="none"){
        if(isset(this.style.display) && this.style.display !== ""){
            this.oldDisplay=this.style.display;
        }else{
            this.oldDisplay="block";
        }

        this.style.display="none";
    }else{
        this.style.display=this.oldDisplay;
    }
};

Element.prototype.applyHtml=function(data,allowVariables){
  applyHtml(this,data,allowVariables);
};

Number.prototype.truncate=function(places){
  if(!isset(Math.trunc)) return this;
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

Boolean.prototype.btoa = function() {
    return btoa(unescape(encodeURIComponent(this+"")));
};
Boolean.prototype.atob = function() {
    return decodeURIComponent(escape(atob(this+"")));
};

prependToArray=function(value,array){
  var newArray = array.slice();
  newArray.unshift(value);
  return newArray;
};

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

function Url(string){
    return "url(\""+string+"\")";
}

function Percent(value){
    return value+"%";
}

function Pixel(value){
    return value+"px";
}

function Rgb(red,green,blue){
    return new String("rgb("+red+","+green+","+blue+")");
}

function Rgba(red,green,blue,alfa){
    return new String("rgba("+red+","+green+","+blue+","+alfa+")");
}

function Popup(url,title,i) {

    if(isset(i.toolbar)){
    	if(i.toolbar) i.toolbar = 'yes';
    	if(!i.toolbar) i.toolbar = 'no';
    }else i.toolbar = 'no';

    if(isset(i.location)){
    	if(i.location) i.location = 'yes';
    	if(!i.location) i.location = 'no';
    }else i.location = 'no';

    if(isset(i.directories)){
    	if(i.directories) i.directories = 'yes';
    	if(!i.directories) i.directories = 'no';
    }else i.directories = 'no';

    if(isset(i.status)){
    	if(i.status) i.status = 'yes';
    	if(!i.status) i.status = 'no';
    }else i.status = 'no';

    if(isset(i.menubar)){
    	if(i.menubar) i.menubar = 'yes';
    	if(!i.menubar) i.menubar = 'no';
    }else i.menubar = 'no';

    if(isset(i.scrollbars)){
    	if(i.scrollbars) i.scrollbars = 'yes';
    	if(!i.scrollbars) i.scrollbars = 'no';
    }else i.scrollbars = 'no';

    if(isset(i.resizable)){
    	if(i.resizable) i.resizable = 'yes';
    	if(!i.resizable) i.resizable = 'no';
    }else i.resizable = 'no';

    if(isset(i.copyhistory)){
    	if(i.copyhistory) i.copyhistory = 'yes';
    	if(!i.copyhistory) i.copyhistory = 'no';
    }else i.copyhistory = 'no';

    if(!isset(i.width)) i.width = 800;
    if(!isset(i.height)) i.height = 500;


    i.left = (screen.width/2)-(i.width/2);
    i.top = (screen.height/2)-(i.height/2);

    return window.open(url, title,
    		'toolbar='+i.toolbar+', '+
    		'location='+i.location+', '+
    		'directories='+i.directories+', '+
    		'status='+i.status+', '+
    		'menubar='+i.menubar+', '+
    		'scrollbars='+i.scrollbars+', '+
    		'resizable='+i.resizable+', '+
    		'copyhistory='+i.copyhistory+', '+
    		'width='+i.width+', '+
    		'height='+i.height+', '+
    		'top='+i.top+', '+
    		'left='+i.left+'');
}
