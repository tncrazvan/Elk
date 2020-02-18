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

const ObjectInspector=function(object,callback=null){
    for(let key in object){
        if(!input.hasOwnProperty(key)) continue;
        if(callback !== null)
            if((callback)(key) === true)
                return;
    }
}

const LinkedListElement = function(value){
    let data = value;
    let next = null;
    this.getData=function(){
        return data;
    };
    this.getNext=function(){
        return next;
    };
    this.setNext = function(n){
        next = n;
    }
}

const LinkedList = function(){
    let head = null;
    let tail = null;
    let length = 0;
    this.getFirst=function(){
        return head;
    };
    this.getLast=function(){
        return tail;
    };
    this.getLength=function(){
        return length;
    };

    this.add=(lle)=>{
        if(head === null)
            head = lle;
        else{
            tail.setNext(lle);
        }
        tail = lle;
        length++;
    }
    this.remove=(lle)=>{
        let item = head;
        let prev = null;
        while(item !== null){
            if(item !== lle) {
                prev = item;
                item = item.getNext();
                continue;
            }

            if(prev === null){
                head == null;
            }else{
                prev.setNext(null)
            }
            length--;
        }
    };
}

const create=function(tag,content,options,extra={},async=false){
    let ts;
    tag = tag.split(".");
    let element;
    for(let i = 0; i < tag.length; i++){
        if(i === 0){
            ts = tag[i].split("#");
            if(ts[0] === "") ts[0] = "div";
            element = document.createElement(ts[0]);
            if(ts.length > 1){
                window[ts[1]] = element;
            }
        }else{
            element.className +=tag[i];
            if(i < tag.length-1)
                element.className +=" ";
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

    if(isset(content) && content !== null){
        if(isElement(content)){
            element.innerHTML = "";
            element.appendChild(content);
        }else if(content.constructor.name === "Array"){
            if(content.length > 0){
                element.innerHTML = "";
                for(let i = 0; i<content.length; i++){
                    if(content[i] === undefined || content[i] === null)
                        continue;
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
                await element.applyHtml(content,extra);
                (resolve)();
            });
        }else{
            element.applyHtml(content,extra)
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
const sortBy = function(key,reverse){
    // Move smaller items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    const moveSmaller = reverse ? 1 : -1;
  
    // Move larger items towards the front
    // or back of the array depending on if
    // we want to sort the array in reverse
    // order or not.
    const moveLarger = reverse ? -1 : 1;
    
    return (a, b) => {
        if(a === null || b === null) return 0;
        if (a[key] < b[key]) {
            return moveSmaller;
        }
        if (a[key] > b[key]) {
            return moveLarger;
        }
        return 0;
    };
}

const insertAfter=function(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
};
const parseElement=async function(item,extra={}){

    //if this current element has an "id" attribute set to something...
    if(item.hasAttribute("id")){
        window[item.getAttribute("id")] = item;
    }
    if(item.hasAttribute("import")){
        const importName = item.getAttribute("import").split("=>");
        const templateName = importName[0].trim();
        if(importName.length === 1 || importName[1].trim() === "*"){
            const req = await use.template(templateName,null,false);
            item.applyHtml(req,{templateName:templateName});
        }else{
            const selectors = importName[1].trim().split(",");
            for(let i=0;i<selectors.length;i++){
                const selector = selectors[1];
                const req = await use.template(templateName);
                const selected = req[templateName].querySelector(selector);
                if(selected === null) continue;
                if(selected.tagName === "SCRIPT"){
                    if(selected.hasAttribute("src")){
                        await use.js(":"+selected.getAttribute("src"));
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
    }else if(item.children.length > 0 && !item.hasAttribute(":foreach")){
        await recursiveParser(item,extra);
    }
    
    if(item.hasAttribute("export")){
        let exportTarget = item.getAttribute("export").trim();
        if(exportTarget !== ""){
            if(item.hasAttribute("replace")){
                window[exportTarget].innerHTML="";
            }
            window[exportTarget].appendChild(item);
            if(extra.templateName && item.hasAttribute("js")){
                await use.js(item.getAttribute("js"));
            }
        }else if(extra.bindElement){
            if(item.hasAttribute("replace")){
                extra.bindElement.innerHTML="";
            }
            extra.bindElement.appendChild(item);
            if(extra.templateName && item.hasAttribute("js")){
                await use.js(item.getAttribute("js"));
            }
        }
        if(item.$onMount){
            await item.$onMount();
        }else if(window[item.hasAttribute("$onMount")]){
            await (window[item.getAttribute("$onMount")])();
        }
    }
    if(item.$onLoad){
        await item.$onLoad();
    }else if(window[item.hasAttribute("$onLoad")]){
        await (window[item.getAttribute("$onLoad")])();
    }
};
const uuid=function(){
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-yxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}

const COMPONENT_DATA_NAME = "this.data";

const ForeachResolver=async function(item,extra,bind=COMPONENT_DATA_NAME){
    //debugger;
    let data = new Function("return "+bind+";").call(item);
    let targetName = item.getAttribute(":foreach").trim();
    let last = item;
    let clone;
    let i;
    let j;
    let key;
    let attribute;
    let list;
    let hasId = item.hasAttribute("id");
    let id = null;
    if(hasId) id = item.getAttribute("id");
    let hasSortBy = item.hasAttribute(":sortby");
    let hasDesc = item.hasAttribute(":desc");

    list = new Function("return "+targetName).call(data);
    

    if(hasSortBy){
        let sort = item.getAttribute(":sortby");
        list.sort(sortBy(sort,item.hasAttribute(":desc")));
    }

    let dive={
        set: function(live,input){
            for(let key in input){
                if(!input.hasOwnProperty(key)) continue;
                if((Object.getPrototypeOf(input[key]) === Object.prototype || Object.getPrototypeOf(input[key]) === Array.prototype)){
                    dive.set(live[key],input[key]);
                }else{
                    live[key] = input[key];
                }
            }
        }
    };
    //debugger;
    
    resolveData(list,CALLBACKS.getCallback,CALLBACKS.setCallback,item,extra);

    if(!item.$clones)
        item.$clones = new Array();
    item.$isClone = false;

    let check = async function(){
        let first = true;
        for(let key in list){
            if (!list.hasOwnProperty(key) || list[key] === undefined) continue;
            if(item.$clones[key]){
                first = false;
                continue;
            }
            clone = item.cloneNode(true);
            //clone.innerHTML = item.innerHTML;
            //debugger;
            //clone = await create(item.tagName,item.innerHTML);
            if(key > item.$clones.length){
                delete list[key];
                continue;
            }
            clone.$isClone = true;
            item.$clones[key] = clone;
            clone.$key = key;
            clone.$dataTargetName = targetName;;

            clone.data = list[key];
            clone.$originalElement = item;

            if(hasId) clone.setAttribute("id",id+key);
            clone.removeAttribute(":foreach");
            if(hasSortBy) clone.removeAttribute(":sortby");
            if(hasDesc) clone.removeAttribute(":desc");
            
            clone.$prev = (first?item:item.$lastClone);

            while(!clone.$prev.parentNode){
                if(clone.$prev === item.$originalElement){
                    clone.$prev = clone.$prev.$originalParent;
                    break;
                }
                clone.$prev = clone.$prev.$prev;
                
            }
            if(clone.$prev === item.$originalParent){
                clone.$originalParent =  clone.$prev;
            }else{
                clone.$originalParent =  (first?item.parentNode:clone.$prev.$originalParent);
            }
            
            insertAfter(clone,clone.$prev);
            await ComponentResolver(clone,extra,true);
            if(clone.$foreach)
                clone.$foreach(clone);
            await recursiveParser(clone,extra);
            last = clone;
            item.$lastClone = clone;
            first=false;
        }
        //setTimeout(check,0);
    };

    await check();

    

    item.$originalElement = item;
    item.$originalParent = item.parentNode;
    if(item.parentNode)
        item.parentNode.removeChild(item);
    
    
};

const ConditionResolver=function(item,bind=COMPONENT_DATA_NAME){
    this.$item=item;
    this.$master=null;
    const IF = 0, ELSE = 1, ELSEIF = 2;
    this.result=false;
    const ID = ConditionResolver.stack.length;
    const PREV = ID-1 < 0? null: ID-1;

    if(item.$masterCondition && item.$masterCondition.$item !== item)
        data = new Function("return "+bind+";").call(item.$masterCondition.$item);
    else
        data = new Function("return "+bind+";").call(item);

    if(!item.$originalDisplay && item.$originalDisplay !== "") {
        item.$originalDisplay = getComputedStyle(item, null).display;
    }

    if(item.hasAttribute(":if")){
        item.$masterCondition=this;
        let result = "";
        let statement = item.getAttribute(":if");
        if(statement.trim() !== ""){
            try{
                result = new Function("return "+statement+";").call(data);
                if(result){
                    item.style.display = item.$originalDisplay;
                }else if(item.parentNode && item.parentNode !== null){
                    item.style.display = "none";
                }
                this.result=result;
                let exists = false;
                for(let i=0, len = ConditionResolver.stack.length; i<len;i++){
                    if(ConditionResolver.stack[i].$item == item){
                        exists = true;
                        break;
                    }
                }
                if(!exists)
                    ConditionResolver.stack[ID] = this;
                this.type = IF;
            }catch(e){
                console.error(":if statement could not be parsed ",item);
            }
        }else{
            item.style.display = "none";
            console.warn(":if statement does not contain a condition in ",item);
        }
    }else if(item.hasAttribute(":elseif") ){
        if(PREV !== null && (ConditionResolver.stack[PREV].type === IF || ConditionResolver.stack[PREV].type === ELSEIF)){
            if(ConditionResolver.stack[PREV].type === IF){
                item.$masterCondition = ConditionResolver.stack[PREV];
            }else if(ConditionResolver.stack[PREV].type === ELSEIF){
                item.$masterCondition = ConditionResolver.stack[PREV].$item.$masterCondition;
            }
            if(ConditionResolver.stack[PREV].result){
                item.style.display = "none";
            }else{
                let result = "";
                let statement = item.getAttribute(":elseif");
                if(statement.trim() !== ""){
                    try{
                        result = new Function("return "+statement+";").call(data);
                        if(result){
                            item.style.display = item.$originalDisplay;
                        }
                        else{
                            item.style.display = "none";
                        }
                        this.result=result;
                    }catch(e){
                        console.error(":elseif statement could not be parsed ",item);
                    }
                }else{
                    item.style.display = "none";
                    console.warn(":elseif statement does not contain a condition or the condition is redundant with the :if statement or a previous :elseif statement in ",item);
                }
            }
        }else if(item.parentNode && item.parentNode !== null){
            item.style.display = "none";
            console.warn(":elseif statement must follow and :if statement. No :if statement found.",item);
        }
        let exists = false;
        for(let i=0, len = ConditionResolver.stack.length; i<len;i++){
            if(ConditionResolver.stack[i].$item == item){
                exists = true;
                break;
            }
        }
        if(!exists)
            ConditionResolver.stack[ID] = this;
        this.type = ELSEIF;
    }else if(item.hasAttribute(":else")){
        if(PREV !== null && (ConditionResolver.stack[PREV].type === IF || ConditionResolver.stack[PREV].type === ELSEIF)){
            if(ConditionResolver.stack[PREV].type === IF){
                item.$masterCondition = ConditionResolver.stack[PREV];
            }else if(ConditionResolver.stack[PREV].type === ELSEIF){
                item.$masterCondition = ConditionResolver.stack[PREV].$item.$master;
            }
            if(ConditionResolver.stack[PREV].result && item.parentNode && item.parentNode !== null){
                item.$oldParentNode = item.parentNode;
                item.style.display = "none";
            }else if(item.$oldParentNode){
                item.style.display = item.$originalDisplay;
            }
        }else if(item.parentNode && item.parentNode !== null){
            item.style.display = "none";
        }
        let exists = false;
        for(let i=0, len = ConditionResolver.stack.length; i<len;i++){
            if(ConditionResolver.stack[i].$item == item){
                exists = true;
                break;
            }
        }
        if(!exists)
            ConditionResolver.stack[ID] = this;
        this.type = ELSE;
    }
};
ConditionResolver.stack = new Array();

const inherit = function(item,map){
    const REGEX_INHERIT_LEFT_KEY = /[A-z]+.*(?=\:)/;
    const REGEX_INHERIT_RIGHT_KEY = /\:\s*[A-z]+.*/;
    let parent = item.getParentComponent();
    let groups = map.split(/\;/);
    groups.forEach(group=>{
        let leftKey = group.match(REGEX_INHERIT_LEFT_KEY)[0];
        group = group.replace(REGEX_INHERIT_LEFT_KEY,"");
        let rightKey = group.match(REGEX_INHERIT_RIGHT_KEY)[0];

        leftKey = leftKey === ''?"item":["item",leftKey].join(".");

        rightKey = rightKey.replace(/\:\s*/,"");
        rightKey = rightKey === ''?"parent":["parent",rightKey].join(".");

        let tmp = new Function('parent','item',leftKey+'='+rightKey+';');
        tmp(parent,item);
    });
};

const CLASSNAME = {
    VARIABLE_OBJECT: 2
};
Object.freeze(CLASSNAME);

const exploreElementDependents = function(component,callback){
    if(component.$dependents){
        for(let i=0;i<component.$dependents.length;i++){
            callback(component.$dependents[i]);
            if(component.$dependents[i].$dependents){
                exploreElementDependents(component.$dependents[i],callback);
            }
        }
    }
};

const CALLBACKS = {
    setCallback: function(key,item,extra,triggerForEach){
        if(item.hasAttribute(":foreach") && !triggerForEach){
            for(let localKey in item.$clones){
                if(!item.$clones.hasOwnProperty(localKey)) continue;
                VariableResolver(item.$clones[localKey],extra);
            }
            return;
        }
        VariableResolver(item,extra);
        
        exploreElementDependents(item,target=>{
            VariableResolver(target,extra);
        });

        if(!item.$isComponent){
            let parent = item.getParentComponent();
            if(parent && parent !== null)
                VariableResolver(parent,extra);
        }
    },
    getCallback: function(key,item,extra,triggerForEach){
        
    }
};

const isArray = function(a) {
    return (!!a) && (a.constructor === Array);
};

const isObject = function(a) {
    return (!!a) && (a.constructor === Object);
};

const VariableObject=function(value,getCallback,setCallback,item,extra,ignoreDataGetter=false,ignoreDataSetter=false,triggerForEach=false){
    this.$classname = CLASSNAME.VARIABLE_OBJECT;
    if(value && value !== null && typeof(value) !== "string" && typeof(value) !== "number" && (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === Array.prototype)){
        resolveData(value,getCallback,setCallback,item,extra,ignoreDataGetter,ignoreDataSetter,triggerForEach);
    }
    let val = value;

    Object.defineProperty(this, "value", {
        get: function() {
            return val;
        },
        set: function(v) {
            if(v && v !== null && typeof(v) !== "string" && typeof(v) !== "number" && (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === Array.prototype)){
                resolveData(v,getCallback,setCallback,item,extra,ignoreDataGetter,ignoreDataSetter,triggerForEach);
            }
            val = v;
        }
    });
};

const resolveData=function(object,getCallback,setCallback,item,extra,ignoreDataGetter=false,ignoreDataSetter=false,triggerForEach=false){
    let root = {};
    let pointerRoot = root;
    let copy = {};
    let pointerCopy = copy;
    let dive=function(object,pointerRoot,pointerCopy){
        if(object && object != null && (Object.getPrototypeOf(object) === Object.prototype || Object.getPrototypeOf(object) === Array.prototype)){
            for(let key in object){
                if (!object.hasOwnProperty(key)) continue;
                if(pointerCopy){
                    if(pointerCopy.$classname){
                        continue;
                    }
                    pointerRoot[key] = object[key];
                    pointerCopy[key] = object[key];
                    bind(object,pointerRoot,pointerCopy,key,item,extra,getCallback,setCallback,triggerForEach);

                    if (!object.hasOwnProperty("delete")){
                        Object.defineProperty(object, "delete", {
                            enumerable: false, // hide from for...in
                            configurable: false, // prevent further meddling...
                            writable: false, // see above ^
                            value: function (key) {
                                if(!key){
                                    throw new Error("In order to delete an object you must specify its key.")
                                }
                                object[key] = undefined;
                            }
                        });
                    }

                    if (!object.hasOwnProperty("push")){
                        Object.defineProperty(object, "push", {
                            enumerable: false, // hide from for...in
                            configurable: false, // prevent further meddling...
                            writable: false, // see above ^
                            value: function (value) {
                                object[object.length] = value;
                                resolveData(object,getCallback,setCallback,item,extra,ignoreDataGetter,ignoreDataSetter,true);
                                if(!ignoreDataSetter)
                                    (setCallback)(key,item,extra,true);
                                ignoreDataSetter = false;
                            }
                        });
                    }
                }
            }
        }
    };

    let bind = function(object,pointerRoot,pointerCopy,key,item,extra,getCallback,setCallback,triggerForEach){
        const ref = new VariableObject(object[key],getCallback,setCallback,item,extra,ignoreDataGetter,ignoreDataSetter);
        pointerCopy[key] = ref;
        pointerRoot[key] = ref;

        Object.defineProperty(pointerCopy, key, {
            get: function() { 
                if(!ignoreDataGetter) 
                    (getCallback)(key,item,extra,triggerForEach);
                ignoreDataGetter = false;
                return pointerRoot[key].value;
            },
            set: function(value) {
                //debugger;
                if(!pointerRoot[key].$classname){
                    pointerRoot[key] = value;
                }else{
                    pointerRoot[key].value = value;
                }
                if(!ignoreDataSetter)
                    (setCallback)(key,item,extra,triggerForEach);
                ignoreDataSetter = false;
            }
        });

        Object.defineProperty(object, key, {
            get: function() {
                return pointerCopy[key];
            },
            set: function(value) {
                pointerCopy[key] = value;
                ignoreDataSetter = false;
            }
        });
    };
    
    dive(object,pointerRoot,pointerCopy);

    return copy;
};

window.Components={
    $namespace: function(name,callbacks = null,namespace = null){
        let pointer = Components;
        if(name === null){
            for(let key in callbacks){
                if(callbacks[key].hasOwnProperty())
                    continue;
                key = key.trim();
                if(key.match(/(\$init)|(\$namespace)/)){
                    console.error("You're trying to override the core method ","Components."+key," which is not allowed.");
                    return;
                }
                pointer[key] = callbacks[key];
            }
            return;
        }
        name = name.split(/[\.\/]/);
        for(let i=0;i<name.length;i++){
            if(!pointer[name[i]]){
                pointer[name[i]] = {};
                if(callbacks !== null && i===name.length-1){
                    for(let key in callbacks){
                        if(callbacks[key].hasOwnProperty())
                            continue;
                        key = key.trim();
                        pointer[name[i]][key] = callbacks[key];
                    }
                }
            }else{
                if(callbacks !== null && i===name.length-1){
                    for(let key in callbacks){
                        if(callbacks[key].hasOwnProperty())
                            continue;
                        key = key.trim();
                        pointer[name[i]][key] = callbacks[key];
                    }
                }
            }
            pointer = pointer[name[i]];
        }
        return;
    },
    $init: function(name,callback=null){
        let namespace = name.trim().replace(/^\s*\//,"").split(/[\.\/]/);
        name = namespace.splice(-1);
        let obj = {};
        obj[name] = callback;
        return Components.$namespace(namespace.length>0?namespace.join("/"):null,obj,namespace);
    }
};

const ComponentResolver=async function(item,extra,useOldPointer=false){
    const REGEX_MATCH_HTTP = /^https?\:\/\/.+/i;
    const REGEX_MATCH_HTTP_WITH_ARROW = /^https?\:\/\/.+(?=\=\>)/i;
    item.$parsed = true;

    let namespace = null;
    if(item.parentNode && item.parentNode.hasAttribute("@namespace")){
        namespace = item.parentNode.getAttribute("@namespace").trim();
    }
    if(item.hasAttribute("@namespace")){
        const tmp = item.getAttribute("@namespace").trim();
        if(namespace === null)
            namespace = tmp;
        else if(tmp[0] === "/")
            namespace = tmp.substr(1);
        else
            namespace += "/"+tmp
    }

    let parse = async function(pointer,keys,index,namespace=null){
        if(!keys[index]) return;
        const key = keys[index];

        for (let c in pointer) {
            if(c.toLowerCase() === key.toLowerCase()){
                if(!isFunction(pointer[c])){
                    return parse(pointer[c],keys,index+1);
                }else{
                    try{
                        let tmp = pointer[c];
                        
                        //this part refers to the "foreach" old pointer, aka the original pointer.
                        if(useOldPointer){
                            let p = item.data;
                            if(namespace !== null)
                                item.$namespace=namespace;

                            (tmp).call(item);
                            item.data = p;
                        }else{
                            if(namespace !== null)
                                item.$namespace=namespace;

                            (tmp).call(item);
                        }
                        item.$isComponent = true;
                        return true;
                    }catch(e){
                        console.error(e);
                        item.$isComponent = false;
                        return false;
                    }
                }
            }
        }
    };

    let getParentComponent = function(){
        let parent = item.parentNode;
        if(parent === null) return null;
        let key = parent.tagName;
        if(parent.hasAttribute(":extends")){
            key = parent.getAttribute(":extends");
        }
        while(true){
            if(parent.$isComponent){
                return parent;
            }
            if(parent.parentNode){
                if(parent.parentNode === document) return null;
                parent = parent.parentNode;
                key = parent.tagName;
                if(parent.hasAttribute(":extends")){
                    key = parent.getAttribute(":extends");
                }
            }else{
                return null;
            }
        }
    };

    item.getParentComponent=function(){
        return getParentComponent();
    };

    item.ref=function(name){
        return item.querySelector("*[ref=\""+name+"\"]");
    };

    item.setData=function(object){
        for(let key in object){
            item.data[key] = object[key];
        }
    }
    item.$isComponent = false;
    item.$dependents = new Array();
    item.$dataResolved=false;
    item.$parent = item.getParentComponent();
    namespace = namespace !== null && namespace !== ""?namespace.split(/[\.\/]/):[];
    let extendsArray = null;
    if(item.hasAttribute(":extends"))
    extendsArray = item.getAttribute(":extends").split("/");
    item.$namespace = namespace;

    if(!item.data)
        item.data = {};
    if(item.$parent !== null){
        item.$parent.$dependents.push(item);
        item.data.$parent = item.$parent.data;
    }
    item.$el = item;

    let key = [...namespace,item.tagName];

    if(!item.extends)
        item.extends=async function(name){
            name = name.trim();
            name = name !== null && name !== ""?name.split(/[\.\/]/):[];
            let key;

            if(name.length > 0 && name[0] === "")
                key = [...name.splice(1)];
            else
                key = [...item.$namespace,...name];
            await parse(Components,key,0);
        };

    if(item.hasAttribute(":fetch")){
        let fetchUrl = item.getAttribute(":fetch");
        if(fetchUrl.match(REGEX_MATCH_HTTP_WITH_ARROW)){
            const SPLIT = fetchUrl.split(/\=\>/i);
            const REQUEST = await fetch(SPLIT[0].trim());
            const target = SPLIT[1].trim();
            new Function("response",target+"=response;").call(item.data,await REQUEST.json());
        }else if(fetchUrl.match(REGEX_MATCH_HTTP)){
            const REQUEST = await fetch(fetchUrl);
            item.data = await REQUEST.json();
        }
    }
    /*console.log(item);
    debugger;*/
    if(extendsArray !== null){
        if(extendsArray.length > 0 && extendsArray[0] !== "")
            extendsArray = [...namespace,...extendsArray];
        let tmp = new Array();
        for(let i = 0; i< extendsArray.length; i++){
            if(extendsArray[i].trim() !== "")
                tmp.push(extendsArray[i]);
        }
        await parse(Components,tmp,0);
    }
    let tmp = new Array();
    for(let i = 0; i< key.length; i++){
        if(key[i].trim() !== "")
            tmp.push(key[i]);
    }
    await parse(Components,tmp,0);


    if(!item.$dataResolved && item.$isComponent){
        
        item.data = resolveData(item.data,CALLBACKS.getCallback,CALLBACKS.setCallback,item.$parent!==null?item.$parent:item,extra);
    }
    if(item.hasAttribute(":if")){
        if(item.$origin)
            item.$origin();
    }else if(!item.$isClone && !item.hasAttribute(":else") && !item.hasAttribute(":elseif")){
        if(item.$origin)
            item.$origin();
    }

    await VariableResolver(item,extra);

    if(item.hasAttribute(":else") || item.hasAttribute(":elseif")){
        item.$masterCondition.$item.$dependents.push(item);
    }

    if(item.$onReady){
        item.$onReady();
    }
};

const VariableResolver=async function(item,extra,bind=COMPONENT_DATA_NAME){
    let data;
    if(item.$isClone){
        data = new Function("return "+bind).call(item.$originalElement);
        data = new Function("return "+item.$dataTargetName+"["+item.$key+"];").call(data);
        if(data === undefined && item.parentNode) item.parentNode.removeChild(item);
    }else{
        if(item.$masterCondition && item.$masterCondition.$item !== item)
            data = new Function("return "+bind+";").call(item.$masterCondition.$item);
        else
            data = new Function("return "+bind+";").call(item);
    }
    const REGEX_VALUE = /^\s*[\$A-z0-9\.]*/g;
    const REGEX_PARENT = /^\$parent\.*/g;
    const SUCCESS = 0, NO_DATA = 1, NO_MATCH = 2;
    let resolve = function(input,callback){
        let matches = [...new Set(input.match(REGEX_VALUE))];
        if(matches.length === 0){
            (callback)(undefined,NO_MATCH);
            return;
        }
        matches.forEach(match=>{
            let key = match.trim();
            if(data){
                try{
                    let result = new Function("return "+key+";").call(data);;
                    (callback)(result,SUCCESS,isElement(result));
                }catch(e){
                    console.error("Could not resolve variable "+key,item,e);
                    (callback)(undefined,NO_DATA,false);
                }
                
            }else{
                (callback)(undefined,NO_DATA,false);
            }
        });
    };
    let bindings = {};
    let i = 0;
    let attributes = [...item.attributes];
    for(i = 0; i < attributes.length; i++){
        if(attributes[i].name[0] !== ":")
            continue;
        let callback;
        if(attributes[i].name.substr(0,3) === ':on'){
            callback = function(result,state){
                if(state === SUCCESS){
                    item[attributes[i].name.substr(1)]=result;
                    bindings[attributes[i].name] = result;
                }
            };
        }else{
            switch(attributes[i].name){
                case ":extends":
                case "@namespace":
                case ":fetch":
                    continue;
                break;
                case ":if":
                case ":elseif":
                case ":else":
                        new ConditionResolver(item);
                    continue;
                case ":foreach":
                        await ForeachResolver(item,extra);
                    continue;
                case ":sortby":
                case ":desc":
                    //reserved attributes
                    continue;
                case ":html":
                    callback = function(result,state,isElement){
                        if(state === SUCCESS){
                            if(!isElement){
                                item.innerHTML = result;
                            }else{
                                item.innerHTML = "";
                                item.appendChild(result);
                            }
                            bindings[attributes[i].name] = result;
                        }
                    };
                break;
                case ":css":
                    callback = function(result,state){
                        if(state === SUCCESS){
                            item.css(result)
                            bindings[attributes[i].name] = result;
                        }
                    };
                break;
                case ":value":
                    callback = function(result,state){
                        if(state === SUCCESS){
                            item.value = result;
                            bindings[":value"] = result;
                        }
                    };
                break;
                default:
                    callback = function(result,state){
                        if(state === SUCCESS){
                            item.setAttribute(attributes[i].name.substr(1),result);
                            bindings[attributes[i].name] = result;
                        }
                    };
                break;
    
            }
        }
        
        resolve(attributes[i].value,callback);
    }

    let boundName;
    let boundNameValue;
    let value;

    if(item.hasAttribute(":value")){
        item.addEventListener("change",()=>{
            if(item.$ignoreDataSetter) return;
            item.$ignoreDataSetter = true;
            let script = item.getAttribute(':value');
            new Function('value',script+"= value;").call(item.data,item.value);
        });

        let tmp = item.value;

        item.setValue=function(value){
            item.value = value;
            if(item.$ignoreDataSetter) return;
            item.$ignoreDataSetter = true;
            let script = item.getAttribute(':value');
            new Function('value',script+"= value;").call(item.data,item.value);
        };
        item.getValue=function(){
            return item.value;
        };
    }

    if(item.$originalElement && !item.$observer){
        const config = {subtree: true,childList: true};
        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if(mutation.type === 'childList'){
                    mutation.removedNodes.forEach(element=>{
                        if(element !== item.$originalElement && element === item){
                            delete item.$originalElement.data.list[item.$key];
                            delete item.$originalElement.$clones[item.$key];
                        }
                    });
                }
            }
        };
        const observer = new MutationObserver(callback);
        item.$observer = observer;
        if(item.$originalParent && item.$originalParent.parentNode)
            observer.observe(item.$originalParent.parentNode, config);
    }else if(!item.$observer){
        const config = {attributes: true, subtree: true, characterData: true};
        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes') {
                    boundName = ':'+mutation.attributeName;
                    if(item.hasAttribute(boundName)){
                        if(item.$ignoreDataSetter) continue;
                        value = item.getAttribute(mutation.attributeName);
                        boundNameValue = item.getAttribute(boundName);
                        item.$ignoreDataSetter = true;
                        new Function('value',boundNameValue+"=value;").call(item.data,value);
                    }
                }else if(mutation.type === 'characterData'){
                    boundName = ':html';
                    if(item.hasAttribute(boundName)){
                        if(item.$ignoreDataSetter) continue;
                        boundNameValue = item.getAttribute(boundName);
                        item.$ignoreDataSetter = true;
                        new Function('value',boundNameValue+"=value;").call(item.data,mutation.target.data);
                    }
                }
            }
        };

        const observer = new MutationObserver(callback);
        item.$observer = observer;
        observer.observe(item, config);
    }

    if(item.children > 0) 
        for(let i = 0;i<item.children.length;i++){
            await VariableResolver(item.children[i],extra);
        }
};
VariableResolver.stack = new Array();

//iterating through every child node of the provided target
const recursiveParser=async function(target,extra={},log){
    //await ComponentResolver(target,extra);
    let children = new Array();
    let i;
    for(i = 0; i < target.children.length;i++){
        children.push(target.children[i]);
    }
    //debugger;
    for(i = 0; i < children.length;i++){
        let child = children[i];
        switch(child.tagName){
            case "SCRIPT":
                if(child.hasAttribute("src")){
                    await use.js(":"+child.getAttribute("src"));
                }else{
                    await eval(child.innerText);
                }
            break;
            case "STYLE":
                document.head.appendChild(child);
            break;
            default:
                await ComponentResolver(child,extra);
                await parseElement(child,extra);
            break;
        }
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
const applyHtml=function(target,data,extra={}){
    //pushing data to the target
    //NOTE: just pushing html text into an element won't execute
    //the scripting inside the data, it will just print it as plain
    //text and ignore it. The parsing is being done below inside the foreach cycle.

    //target.innerHTML = data;

    //temporary parent element
    //I'm using this to throw in the result data
    //and parse it as child nodes.
    target.innerHTML = data;
    return recursiveParser(target,extra);
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
    }else if (input.createTextRange) {
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

const url=function(string){
    return "url(\""+string+"\")";
};

const percent=function(value){
    return value+"%";
};

const pixel=function(value){
    return value+"px";
};

const rgb=function(red,green,blue){
    return new String("rgb("+red+","+green+","+blue+")");
};

const rgba=function(red,green,blue,alfa){
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
        templates: ""
    };
    this.loadedScripts = {};
    this.getTemplatesLocation=function(){
        return dir.templates;
    };
    this.getJSLocation=function(){
        return dir.js;
    };
    this.getCSSLocation=function(){
        return dir.css;
    };
    let $this = this;
    this.currentTemplateRequest = null;
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
    this.template=async function(value,bindElement=null,data=null,stateUrl=null,version=0,apply=true){
        if(stateUrl !== null) {
            state(stateUrl);
        }

        bindElement.data=data;
        const template = await include.template(dir.templates,value,bindElement,version,apply,function(file){
            $this.currentTemplateRequest = file;
        });
        return template;
    };this.templates = this.template;
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
        templates:{},
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
    templates:async function(dir,list,bindElement,version=0,apply=true,f){
        if(typeof list =="string")
        list = [list];

        if(dir === "") dir = "/Template/";
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
                if(!include.cache.templates[file]){
                    if(file.charAt(0)===":"){
                        req = await fetch(dir+file.substr(1)+"?v="+version);
                    }else{
                        req = await fetch(dir+file+".html?v="+version);
                    }
                    text = await req.text();
                    include.cache.templates[file] = text;
                }else{
                    text = include.cache.templates[file];
                }
                
                if(apply){
                    const templateName = file +"#"+(Object.keys(TEMPLATES).length+1);
                    const o = await create("tmp",text,{},{templateName:templateName,bindElement:bindElement},true);
                    /*templates[templateName] = o;
                    currentList[templateName] = o;*/
                    (f)(templateName,o);
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
                        if(file.match(/(^https?)|(^\/\/)/)){
                            text = await fetch(file);
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
                    let file = list[i]; //without extension
                    
                    let text;
                    if(!include.cache.js[file]){
                        if(file.charAt(0)===":"){
                            text = await fetch(file.replace(/\:/g,""));
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
                    i++;
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

include.template = include.templates;


window.use = new Includer({
    "templates":"/Template",
    "js":"/js",
    "css":"/css"
});
const TEMPLATES = {};
//window.template=use.template;

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

Element.prototype.run=function(f){
    (f)(this);
    return this;
};

Element.prototype.template=async function(templateName,data=null,stateUrl=null,version=0,apply=true){
    await use.template(templateName,this,data,stateUrl,version,apply);
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

Element.prototype.applyHtml=async function(data,extra={}){
    await applyHtml(this,data,extra);
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