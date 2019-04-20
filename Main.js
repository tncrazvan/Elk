/**
* Elk is a JavaScript library that makes it easier
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

window.isFunction=function(functionToCheck){
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
window.isElement = function(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    }
    catch(e){
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj==="object") &&
        (obj.nodeType===1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument ==="object");
    }
};
window.create = function(tag,content,options,allowVariables){
    tag = tag.split(".");
    let element;
    for(let i = 0; i < tag.length; i++){
        if(i === 0){
            tmp = tag[i].split("#");
            if(tmp[0] === "") tmp[0] = "div";
            element = document.createElement(tmp[0]);
            if(tmp.length > 1){
                window[tmp[1]] = element;
            }
        }else{
            element.className +=tag[i];
            if(i < tag.length-1)
                element.className +=" ";
        }
    }
    if(content && content !== null){
        if(isElement(content)){
        element.innerHTML = "";
        element.appendChild(content);
        }else if(content.constructor.name === "Array"){
        if(content.length > 0){
            element.innerHTML = "";
            for(let i = 0; i<content.length; i++){
                const item = content[i];
                if(item.constructor.name == "String"){
                    element.innerHTML += item;
                }else{
                    element.appendChild(item);
                }
            }
        }
        }else{
        element.applyHtml(content,allowVariables);
        }
    }

    if(options)
        for(let key in options){
            element.setAttribute(key,options[key]);
        }
        

    return element;
};
//this function will parse for inline html variables inside the given #text nodes
window.PARSEVAR55TH72 = function(child){
    return new Promise(function(resolve,reject){
        let name = child.getAttribute("$");
        use.component(name).then(function(r){
            (resolve)();
        });
    });
};
window.parseElement = async function(item,allowVariables){
    //if this current element has an "id" attribute set to something...
    if(item.hasAttribute("id")){
        window[item.getAttribute("id")] = item;
    }
    if(item.hasAttribute("import")){
        const importName = item.getAttribute("import").split("=>");
        const componentName = importName[0].trim();
        if(importName[1].trim() === "*"){
            const req = await use.component(componentName,false);
            item.applyHtml(req,allowVariables);
        }else{
            const selectors = importName[1].trim().split(",");
            for(let i=0;i<selectors.length;i++){
                const selector = selectors[1];
                const req = await use.component(componentName);
                const selected = req[componentName].querySelector(selector);
                if(selected === null) continue;
                if(selected.tagName === "SCRIPT"){
                    eval(selected.innerText);
                }else{
                    item.appendChild(selected);
                    if(selected.onload){
                        await (selected.onload)();
                    }else if(window[selected.hasAttribute("onload")]){
                        await (window[selected.getAttribute("onload")])();
                    }
                }
            }
        }
    }else if(item.children.length > 0){
        await window.recursiveParser(item,allowVariables);
    }
    
    if(item.hasAttribute("export")){
        window[item.getAttribute("export").trim()].appendChild(item);
        if(item.onload){
            await (item.onload)();
        }else if(window[item.hasAttribute("onload")]){
            await (window[item.getAttribute("onload")])();
        }

    }
};
//iterating through every child node of the provided node
window.recursiveParser = async function(node,allowVariables){
    const tmp = new Array();
    node.children.forEach(function(child){
        tmp.push(child);
    });
    tmp.foreach(function(child){
        switch(child.tagName){
            case "SCRIPT":
                eval(child.innerText);
            break;
            case "STYLE":
                document.head.appendChild(child);
            break;
            default:
                if(child.hasAttribute("clickeffect")){
                    const options = child.getAttribute("clickeffect").split(",");
                    const red = options[0]?options[0]:255;
                    const green = options[1]?options[1]:255;
                    const blue = options[2]?options[2]:255;
                    addClickEffect(child,red,green,blue);
                }
                await node.parseElement(child,allowVariables);
            break;
        }
    });
};
window.addClickEffect = function(element,r=255,g=255,b=255){
    const playRippleEffect = function(x,y,maxRadius){
        element.style.transition = "background-color 100ms";
        element.style.backgroundColor = "rgba("+r+","+g+","+b+",0)";
        const canvas = create("canvas","",{
            width: element.offsetWidth,
            height: element.offsetHeight
        });
        canvas.style.cursor="pointer";
        element.appendChild(canvas);

        canvas.style.position="absolute";
        canvas.style.pointerEvents="none";
        canvas.style.background="none";

        let rect = element.getBoundingClientRect();
        canvas.style.left = Pixel(rect.x);
        canvas.style.top = Pixel(rect.y);
        
        canvas.style.margin= "0";
        const ctx = canvas.getContext("2d");
        let radius = 0;
        let opacity = 0.1;
        (function poll(){
            ctx.clearRect(0,0,canvas.width,canvas.height);
            radius += 1*maxRadius/100;
            opacity -= 0.0007;
            ctx.fillStyle = "rgba("+r+","+g+","+b+","+opacity+")";
            ctx.beginPath();
            ctx.arc(x,y,radius,0,2*Math.PI);
            ctx.fill();
            if(radius >= maxRadius && opacity <= 0.005){
                ctx.clearRect(0,0,canvas.width,canvas.height);
                if(canvas.parentElement){
                    canvas.parentElement.removeChild(canvas);
                }
                return;
            };
            rect = element.getBoundingClientRect();
            canvas.style.left = Pixel(rect.x);
            canvas.style.top = Pixel(rect.y);
            setTimeout(poll,1);
        })();
    };

    const playBackgroundEffect = function(){
        element.style.transition = "background-color 500ms";
        element.style.backgroundColor = "rgba("+r+","+g+","+b+",0.05)";
    };

    if(isMobile.any()){
        element.addEventListener("touchstart",function(e){
            playBackgroundEffect();
        });
        element.addEventListener("touchend",function(e){
            let pos = element.getBoundingClientRect();

            playRippleEffect(e.changedTouches[0].clientX-pos.x,e.changedTouches[0].clientY-pos.y,element.offsetWidth);
        });
        element.addEventListener("touchcancel",function(e){
            element.style.transition = "background-color 100ms";
            element.style.backgroundColor = "rgba("+r+","+g+","+b+",0)";
        });
    }else{
        element.addEventListener("mousedown",function(e){
            playBackgroundEffect();
        });
        element.addEventListener("mouseup",function(e){
            playRippleEffect(e.offsetX,e.offsetY,element.offsetWidth);
        });
        element.addEventListener("mouseout",function(e){
            element.style.transition = "background-color 100ms";
            element.style.backgroundColor = "rgba("+r+","+g+","+b+",0)";
        });
    }
};
window.isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};
window.applyHtml = async function(node,data,allowVariables){
    //pushing data to the node and parse it
    allowVariables = (allowVariables?allowVariables:false);
    node.innerHTML = data;
    await node.recursiveParser(node,allowVariables);
};
window.forevery = async function(array, $function, counter, from, to) {
    var i;
    var isLast = false;
    for (i = (from ? from : 0); i < (to ? to : array.length); i += counter) {
        isLast=!(i+1 < (to ? to : array.length));
        await $function(array[i],i,isLast);
    }
};
window.foreach = async function(array, $function, from, to) {
    await forevery(array, $function, 1, from, to);
};
window.foreachr = async function(array, $function) {
    var i;
    for (i = array.length - 1; i >= 0; i--) {
        var element = array[i];
        await $function(element);
    }
};
window.notify = function(message) {
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
};
window.getElementOffset = function(element) {
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
window.Thread = function(f){
    this.run=async function(t=0){
        if(t > 0) setTimeout(f,t);
        else (f)();
    };
};
window.getInputCursorPos = function(input) {
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
};
window.getEditableCursorPos = function(editableDiv) {
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
};
window.selectText = function(container) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(container);
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(container);
        window.getSelection().addRange(range);
    }
};
window.base64ToVideoBlob = function(string){
    var byteCharacters = atob(string);
    var byteNumbers = new Array(byteCharacters.length);
    for (var i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: 'video/webm'});
};
window.base64ToBlob = function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
};
window.prependToArray = function(value,array){
    var newArray = array.slice();
    newArray.unshift(value);
    return newArray;
};

window.Url = function(string){
    return "url(\""+string+"\")";
};

window.Percent = function(value){
    return value+"%";
};

window.Pixel = function(value){
    return value+"px";
};

window.Rgb = function(red,green,blue){
    return new String("rgb("+red+","+green+","+blue+")");
};

window.Rgba = function(red,green,blue,alfa){
    return new String("rgba("+red+","+green+","+blue+","+alfa+")");
};

window.Popup = function(url,title=null,i={}) {

    if(i.toolbar){
        if(i.toolbar) i.toolbar = 'yes';
        if(!i.toolbar) i.toolbar = 'no';
    }else i.toolbar = 'no';

    if(i.location){
        if(i.location) i.location = 'yes';
        if(!i.location) i.location = 'no';
    }else i.location = 'no';

    if(i.directories){
        if(i.directories) i.directories = 'yes';
        if(!i.directories) i.directories = 'no';
    }else i.directories = 'no';

    if(i.status){
        if(i.status) i.status = 'yes';
        if(!i.status) i.status = 'no';
    }else i.status = 'no';

    if(i.menubar){
        if(i.menubar) i.menubar = 'yes';
        if(!i.menubar) i.menubar = 'no';
    }else i.menubar = 'no';

    if(i.scrollbars){
        if(i.scrollbars) i.scrollbars = 'yes';
        if(!i.scrollbars) i.scrollbars = 'no';
    }else i.scrollbars = 'no';

    if(i.resizable){
        if(i.resizable) i.resizable = 'yes';
        if(!i.resizable) i.resizable = 'no';
    }else i.resizable = 'no';

    if(i.copyhistory){
        if(i.copyhistory) i.copyhistory = 'yes';
        if(!i.copyhistory) i.copyhistory = 'no';
    }else i.copyhistory = 'no';

    if(!i.width) i.width = 800;
    if(!i.height) i.height = 500;


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
};


/*
INCLUDER STARTS
*/
window.Project={
    workspace:'',
    ready:false
}
window.workspace = window.Project.workspace;

window.include = {};

        
window.components = new Array();
window.include.components = async function(dir,list,apply=true,version=0,f){
    if(typeof list =="string")
    list = [list];

    if(dir === "") dir = "/components/";
    if(dir[dir.length-1] !== "/"){
    dir +="/";
    }
    f = f || function(){};
    const currentList = new Array();
    let length = list.length;
    if(length>0){
        for(let i = 0; i<length; i++){
            let file = list[i];
            let req
            if(file.charAt(0)==="@"){
                req = await fetch(dir+file.substr(1)+"?v="+version);
            }else{
                req = await fetch(dir+file+".html?v="+version);
            }
            const text = await req.text();
            if(apply){
                const o = create("component",text);
                o.setAttribute("name",file);
                components[file] = o;
                currentList[file] = o;
                (f)(file,o);
            }else{
                return text;
            }
        }
        return currentList;
    }
    return null;
};
window.include.component = window.include.components;

window.include.css = function(dir,list,version=0,f){
    if(typeof list === "string")
        list = [list];

    if(dir === "") dir = "css/";
    if(dir[dir.length-1] !== "/"){
        dir +="/";
    }
    f = f || function(){};

    return new Promise(function(resolve,reject){
        let i = 0, length = list.length;
        if(length>0){
            (function poll(){
                i++;
                let file = list[i-1]; //without extension
                let style = document.createElement("link");
                style.setAttribute("rel","stylesheet");
                style.setAttribute("type","text/css");
                if(file.charAt(0)==="@"){
                    style.setAttribute("href",(file.replace("@","")));
                }else{
                    style.setAttribute("href",dir+file+".css?v="+version);
                }
                document.head.appendChild(style);
                style.onload=function(){
                    (f)(style.getAttribute("href"));
                    if(i<length){
                        poll();
                    }else{
                        (resolve)();
                    }
                };
            })();
        }
    });

};

window.include.js = function(dir,list,version=0,f){
    if(typeof list === "string")
        list = [list];

    if(dir === "") dir = "js/";
    if(dir[dir.length-1] !== "/"){
        dir +="/";
    }
    f = f || function(){};

    return new Promise(function(resolve,reject){
        let i = 0, length = list.length;
        if(list.constructor === Array && length>0){
            (function poll(){
                i++;

                let file = list[i-1]; //without extension
                let script = document.createElement("script");
                script.setAttribute("type","text/javascript");
                script.setAttribute("charset","UTF-8");
                if(file.charAt(0)==="@"){
                    script.setAttribute("src",(file.replace("@","")));
                }else{
                    script.setAttribute("src",dir+file+".js?v="+version);
                }
                document.head.appendChild(script);
                script.onload=function(){
                    (f)(script.getAttribute("src"));
                    if(i<length){
                        poll();
                    }else{
                        (resolve)();
                    }
                };
            })();
        }
    });
};
window.Includer = function(dir){
    if(!dir) dir = {
        css: "",
        js: "",
        components: ""
    };

    this.getComponentsLocation=function(){
        return dir.components;
    };
    this.getJSLocation=function(){
        return dir.js;
    };
    this.getCSSLocation=function(){
        return dir.css;
    };
    var $this = this;
    this.currentComponentRequest = null;
    this.currentCSSRequest = null;
    this.currentJavaScriptRequest = null;
    this.js=function(value,version=0){
        return include.js(dir.js,value,version,function(file){
            $this.currentJavaScriptRequest = file;
        });
    };
    this.css=function(value,version=0){
        return include.css(dir.css,value,version,function(file){
            $this.currentCSSRequest = file;
        });
    };
    this.component=function(value,apply=true,version=0){
        return include.component(dir.components,value,apply,version,function(mod){
            $this.currentComponentRequest = mod;
        });
    };this.components = this.component;
};
window.use = new window.Includer({
    "components":"components",
    "js":"js",
    "css":"css"
});
/*
INCLUDER ENDS
*/
    
Array.prototype.remove = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
        this.splice(i, 1);
        i--;
        }
    }
    return this;
};

String.prototype.splice = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
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

Element.prototype.applyHtml=async function(data,allowVariables){
    await applyHtml(this,data,allowVariables);
};

Element.prototype.insertChildAtIndex = function(child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
};

Number.prototype.truncate=function(places){
    if(Math.trunc) return this;
        return Math.trunc(this * Math.pow(10, places)) / Math.pow(10, places);
};

Boolean.prototype.btoa = function() {
        return btoa(unescape(encodeURIComponent(this+"")));
};
Boolean.prototype.atob = function() {
        return decodeURIComponent(escape(atob(this+"")));
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




document.head.appendChild(create("style",
    "@keyframes clickeffect {"
        +"from {"
            +"opacity: 0.7;"
            +"transform: scale(0);"
        +"}"
        +"to {"
                +"opacity: 0;"
                +"transform: scale(2);"
        +"}"
    +"}"

    +"@-webkit-keyframes clickeffect {"
        +"from {"
            +"opacity: 0.7;"
            +"transform: scale(0);"
        +"}"
        +"to {"
            +"opacity: 0;"
            +"transform: scale(2);"
        +"}"
    +"}"
    )
);
