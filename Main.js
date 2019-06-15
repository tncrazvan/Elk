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

const state=function(...url){
    let joined = url.join("/");
    history.pushState({},'',joined);
}

const CLASS={};
const isset=function(object){
    if(object!==undefined){
        return true;
    }else{
        return false;
    }
};
const isnull=function(object){
    if(object === null) {
        return true;
    } else {
        return false;
    }
};
const isempty=function(object){
    if(object===""){
        return true;
    }else{
        return false;
    }
};
const isFunction=function(functionToCheck) {
    let getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
const isElement=function(obj) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return obj instanceof HTMLElement;
    }catch(e){
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof obj==="object") &&
        (obj.nodeType===1) && (typeof obj.style === "object") &&
        (typeof obj.ownerDocument ==="object");
    }
};
const create=function(tag,content,options,allowVariables,extra={},async=false){
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
    if(isset(content) && content !== null){
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
        }else if(async){
            return new Promise(async function(resolve){
                await element.applyHtml(content,allowVariables,extra);
                (resolve)();
            });
        }else{
            element.applyHtml(content,allowVariables,extra)
        }
    }

    if(options)
        for(let key in options){
            if(typeof(options[key]) === "object" && key === "style"){
                element.css(options[key]);
            }else{
                element.setAttribute(key,options[key]);
            }
        }
        

    return element;
};
const css = function(element,attributes={}){
    for(let key in attributes){
        element.style[key]=attributes[key];
    }
    return element;
};
const insertAfter=function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
const parseElement=async function(item,allowVariables,extra={}){
    //if this current element has an "id" attribute set to something...
    if(item.hasAttribute("id")){
        window[item.getAttribute("id")] = item;
    }
    if(item.hasAttribute("import")){
        const importName = item.getAttribute("import").split("=>");
        const componentName = importName[0].trim();
        if(importName.length === 1 || importName[1].trim() === "*"){
            const req = await use.component(componentName,null,false);
            item.applyHtml(req,allowVariables,{componentName:componentName});
        }else{
            const selectors = importName[1].trim().split(",");
            for(let i=0;i<selectors.length;i++){
                const selector = selectors[1];
                const req = await use.component(componentName);
                const selected = req[componentName].querySelector(selector);
                if(selected === null) continue;
                if(selected.tagName === "SCRIPT"){
                    if(selected.hasAttribute("src")){
                        await use.js("@"+selected.getAttribute("src"));
                    }else{
                        await eval(selected.innerText);
                    }
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
        await recursiveParser(item,allowVariables,extra);
    }
    
    if(item.hasAttribute("export")){
        let exportTarget = item.getAttribute("export").trim();
        if(exportTarget !== ""){
            if(item.hasAttribute("replace")){
                window[exportTarget].innerHTML="";
            }
            window[exportTarget].appendChild(item);
            if(extra.componentName && item.hasAttribute("use")){
                await use.js(item.getAttribute("use"));
            }
        }else if(extra.bindElement){
            if(item.hasAttribute("replace")){
                extra.bindElement.innerHTML="";
            }
            extra.bindElement.appendChild(item);
            if(extra.componentName && item.hasAttribute("use")){
                await use.js(item.getAttribute("use"));
            }
        }
        if(item.onload){
            await (item.onload)();
        }else if(window[item.hasAttribute("onload")]){
            await (window[item.getAttribute("onload")])();
        }
    }
    resolveComponent(item,extra);
};


//iterating through every child node of the provided target
const recursiveParser=async function(target,allowVariables,extra={}){
    const tmp = new Array();
    await foreach(target.children,child=>{
        tmp.push(child);
    });
    await foreach(tmp,async child=>{
        switch(child.tagName){
            case "SCRIPT":
                if(child.hasAttribute("src")){
                    await use.js("@"+child.getAttribute("src"));
                }else{
                    await eval(child.innerText);
                }
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
                    const alpha = options[3]?options[3]:0.7;
                    await setClickEffect(child,red,green,blue,alpha);
                }
                await parseElement(child,allowVariables,extra);
            break;
        }
    });
};

const Component={};
const resolveComponent=function(element,extra){
    const key = element.tagName;
    for ( let c in Component ) {
        if(c.toLowerCase() === key.toLowerCase()){
            try{
                element.data = extra.bindElement.data;
                let obj = (Component[c])(element);
                break;
            }catch(e){
                console.error(e);
                break;
            }
        }
    }
};

const setClickEffect=async function(element,r=255,g=255,b=255,alpha=0.7){
    const playRippleEffect = async function(x,y,maxRadius){
        const canvas = await create("canvas","",{
            width: element.offsetWidth,
            height: element.offsetHeight
        });
        
        /*canvas.style.transition = "background-color 100ms";
        canvas.style.backgroundColor = "rgba("+r+","+g+","+b+",0)";*/

        //canvas.style.cursor="pointer";
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

    if(isMobile.any()){
        element.addEventListener("touchend",async function(e){
            let pos = element.getBoundingClientRect();
            await playRippleEffect(e.changedTouches[0].clientX-pos.x,e.changedTouches[0].clientY-pos.y,element.offsetWidth);
        });
    }else{
        element.addEventListener("mouseup",async function(e){
            await playRippleEffect(e.offsetX,e.offsetY,element.offsetWidth);
        });
    }
};

const isMobile = {
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
const applyHtml=async function(target,data,allowVariables,extra={}){
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
    await recursiveParser(target,allowVariables,extra);
};
const foreachChild=function(children,f){
    foreach(children,function(child){
        if(child.childNodes.length > 0){
        foreachChild(child.childNodes,f);
        }else if(child.nodeName !== "#text" && child.nodeName !== "#comment"){
        (f)(child);
        }
    });
};
const forevery=async function(array, $function, counter, from, to) {
    let i;
    let isLast = false;
    for (i = (from ? from : 0); i < (to ? to : array.length); i += counter) {
        isLast=!(i+1 < (to ? to : array.length));
        await $function(array[i],i,isLast);
    }
};
const foreach=async function(array, $function, from, to) {
    await forevery(array, $function, 1, from, to);
};
const foreachr=async function(array, $function) {
    let i;
    for (i = array.length - 1; i >= 0; i--) {
        let element = array[i];
        await $function(element);
    }
};
const notify=function(message) {
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
const Thread=function(f){
    this.run=function(t=0){
        if(t>0) setTimeout(f,t);
        else (f)();
    };
};

const getInputCursorPos=function(input) {
    if ("selectionStart" in input && document.activeElement == input) {
        return {
        start: input.selectionStart,
        end: input.selectionEnd
        };
    }
    else if (input.createTextRange) {
        let sel = document.selection.createRange();
        if (sel.parentElement() === input) {
        let rng = input.createTextRange();
        rng.moveToBookmark(sel.getBookmark());
        for (let len = 0;
        rng.compareEndPoints("EndToStart", rng) > 0;
        rng.moveEnd("character", -1)) {
            len++;
        }
        rng.setEndPoint("StartToStart", input.createTextRange());
        for (let pos = { start: 0, end: len };
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
const getEditableCursorPos=function(editableDiv) {
    let caretPos = 0,
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
const selectText=function(container) {
    if (document.selection) {
        let range = document.body.createTextRange();
        range.moveToElementText(container);
        range.select();
    } else if (window.getSelection) {
        let range = document.createRange();
        range.selectNode(container);
        window.getSelection().addRange(range);
    }
};
const base64ToVideoBlob=function(string){
    let byteCharacters = atob(string);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    let byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], {type: 'video/webm'});
}

const base64ToBlob=function(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    let byteCharacters = atob(b64Data);
    let byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        let byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    let blob = new Blob(byteArrays, {type: contentType});
    return blob;
};
const prependToArray=function(value,array){
    let newArray = array.slice();
    newArray.unshift(value);
    return newArray;
};

const Url=function(string){
    return "url(\""+string+"\")";
};

const Percent=function(value){
    return value+"%";
};

const Pixel=function(value){
    return value+"px";
};

const Rgb=function(red,green,blue){
    return new String("rgb("+red+","+green+","+blue+")");
};

const Rgba=function(red,green,blue,alfa){
    return new String("rgba("+red+","+green+","+blue+","+alfa+")");
};

const Popup=function(url,title=null,i={}) {

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
};

const Includer=function(dir){
    if(!dir) dir = {
        css: "",
        js: "",
        components: ""
    };
    this.loadedScripts = {};
    this.getComponentsLocation=function(){
        return dir.components;
    };
    this.getJSLocation=function(){
        return dir.js;
    };
    this.getCSSLocation=function(){
        return dir.css;
    };
    let $this = this;
    this.currentComponentRequest = null;
    this.currentCSSRequest = null;
    this.currentJavaScriptRequest = null;
    this.routes=async function(routes,pathname,eventualF=null){
        return (await include.routes(routes,pathname,eventualF));
    };this.route = this.routes;
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
    this.component=async function(value,bindElement=null,data=null,stateUrl=null,version=0,apply=true){
        if(stateUrl !== null) {
            state(stateUrl);
        }
        let filename = value.split(/\//);
        if(filename.length > 0){
            filename = filename[filename.length-1];
        }else{
            filename = value;
        }
        const scriptName = "@"+dir.components+"/"+value+"/"+filename+".js";
        if(!this.loadedScripts[scriptName] || !this.loadedScripts[scriptName][version]){
            const js = await this.js(scriptName,version);

            if(!this.loadedScripts[scriptName]){
                this.loadedScripts[scriptName] = {};
            }
            this.loadedScripts[scriptName][version] = true;

            if(bindElement === null)
            return js;
        }

        bindElement.data=data;
        const component = await include.component(dir.components,value+"/"+filename,bindElement,version,apply,function(file){
            $this.currentComponentRequest = file;
        });
        return component;
    };this.components = this.component;
};

window.onpopstate=e=>{
    e.preventDefault();
    for(let key of Object.keys(include.cache.routes)){
        const ROUTE_REGEX = new RegExp(key,"i");
        const ARGS = include.tools.getArgs(ROUTE_REGEX);
        if(ARGS !== null){
            (include.cache.routes[key])(ARGS);
            break;
        }
    }
};

const include={
    tools:{
        getArgs: function(ROUTE_REGEX){
            const pathname = location.pathname;
            if(pathname.match(ROUTE_REGEX) !== null){
                const ARGS = {
                    path: pathname.replace(ROUTE_REGEX,""),
                };
                ARGS["args"] = ARGS.path.split("/");
                if(ARGS["args"].length>0 && ARGS["args"][0] === ""){
                    ARGS["args"]=[];
                }else if(ARGS["args"].length>0){
                    for(let i=0;i<ARGS["args"].length;i++){
                        if(!isNaN(ARGS["args"][i])) ARGS["args"][i] = parseInt(ARGS["args"][i]);
                    }
                }
                return ARGS;
            }
            return null;
        }
    },
    cache:{
        components:{},
        js:{},
        css:{},
        routes:{}
    },
    routes:async function(routes,eventualF=null){
        if(typeof routes === "string"){
            let o = {};
            o[routes]=eventualF;
            return include.routes(o);
        }
        let executed = false;
        for(let key of Object.keys(routes)){
            const ROUTE_REGEX = new RegExp(key,"i");
            const ARGS = include.tools.getArgs(ROUTE_REGEX);
            include.cache.routes[key] = routes[key];
            if(ARGS !== null && !executed){
                executed = true;
                await (include.cache.routes[key])(ARGS);
            }
        }
    },
    components:async function(dir,list,bindElement,version=0,apply=true,f){
        if(typeof list =="string")
        list = [list];

        if(dir === "") dir = "/components/";
        if(dir[dir.length-1] !== "/"){
            dir +="/";
        }
        f = f || function(){};
        const currentList = {};
        let length = list.length;
        if(length>0){
            for(let i = 0; i<length; i++){
                let file = list[i];
                let req,text
                if(!include.cache.components[file]){
                    if(file.charAt(0)==="@"){
                        req = await fetch(dir+file.substr(1)+"?v="+version);
                    }else{
                        req = await fetch(dir+file+".html?v="+version);
                    }
                    text = await req.text();
                    include.cache.components[file] = text;
                }else{
                    text = include.cache.components[file];
                }
                
                if(apply){
                    const componentName = file +"#"+(Object.keys(COMPONENTS).length+1);
                    const o = await create("component",text,{},true,{componentName:componentName,bindElement:bindElement},true);
                    /*components[componentName] = o;
                    currentList[componentName] = o;*/
                    (f)(componentName,o);
                }else{
                    return text;
                }
            }
            return currentList;
        }
        return null;
    },
    css:function(dir,list,version=0,f){
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
                (async function poll(){
                    i++;
                    let file = list[i-1]; //without extension

                    let text;
                    if(!include.cache.css[file]){
                        if(file.charAt(0)==="@"){
                            text = await fetch(file.replace(/@/g,""));
                        }else{
                            text = await fetch(dir+file+".css?v="+version);
                        }
                        text = await text.text();
                        include.cache.css[file] = text;
                    }else{
                        text = include.cache.css[file];
                    }

                    let style = document.createElement("style");
                    style.setAttribute("rel","stylesheet");
                    style.setAttribute("type","text/css");
                    style.innerHTML = text;
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
    },
    js:function(dir,list,version=0,f){
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
                (async function poll(){
                    i++;
                    let file = list[i-1]; //without extension
                    
                    let text;
                    if(!include.cache.js[file]){
                        if(file.charAt(0)==="@"){
                            text = await fetch(file.replace(/@/g,""));
                        }else{
                            text = await fetch(dir+file+".js?v="+version);
                        }
                        text = await text.text();
                        include.cache.js[file] = text;
                    }else{
                        text = include.cache.js[file];
                    }

                    let script = document.createElement("script");
                    script.setAttribute("type","text/javascript");
                    script.setAttribute("charset","UTF-8");
                    script.text = text;
                    document.head.appendChild(script);
                    (f)(script.getAttribute("src"));
                    if(i<length){
                        poll();
                    }else{
                        (resolve)();
                    }
                })();
            }
        });
    }
};

include.component = include.components;


window.use = new Includer({
    "components":"/components",
    "js":"/js",
    "css":"/css"
});
const COMPONENTS = {};
//window.component=use.component;


Array.prototype.remove = function(deleteValue) {
    for (let i = 0; i < this.length; i++) {
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

Element.prototype.addClassNames=function(classnames){
    classnames.forEach(classname=>{
        this.classList.add(classname);
    });
};

Element.prototype.removeClassNames=function(classnames){
    classnames.forEach(classname=>{
        this.classList.remove(classname);
    });
};

Element.prototype.css=function(attributes={}){
    return css(this,attributes);
};

Element.prototype.component=async function(componentName,data=null,stateUrl=null,version=0,apply=true){
    await use.component(componentName,this,data,stateUrl,version,apply);
    return this;
};

Element.prototype.clear=function(){
    this.innerHTML = "";
    return this;
};

Element.prototype.remove=function(){
    this.oldParent = this.parentElement;
    this.parentElement.removeChild(this);
};

Element.prototype.applyHtml=async function(data,allowVariables,extra={}){
    await applyHtml(this,data,allowVariables,extra);
    return this;
};

Element.prototype.insertChildAtIndex = function(child, index) {
    if (!index) index = 0
    if (index >= this.children.length) {
        this.appendChild(child)
    } else {
        this.insertBefore(child, this.children[index])
    }
    return this;
};

Element.prototype.setClickEffect = function(red=255,green=255,blue=255,alpha=0.7){
    setClickEffect(this,red,green,blue,alpha);
}

Number.prototype.truncate=function(places){
    if(!isset(Math.trunc)) return this;
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