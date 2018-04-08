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

Project.workspace='';
Project.ready = false;

function Project(){}
window.workspace = Project.workspace;
window.use = new Includer({
  "components":"/components",
  "js":"/js",
  "css":"/css"
});
function Includer(dir){
  dir = dir || {
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
  this.js=function(value){
    return include.js(dir.js,value,function(file){
      $this.currentJavaScriptRequest = file;
    });
  };
  this.css=function(value){
    return include.css(dir.css,value,function(file){
      $this.currentCSSRequest = file;
    });
  };
  this.component=function(value){
    return include.component(dir.components,value,function(mod){
      $this.currentComponentRequest = mod;
    });
  };this.components = this.component;
  this.elk=function(dir){
    return new Promise(function(resolve,reject){
      $this.js([
        dir+"Project",
        dir+"Cookie",
        dir+"Main"
      ]).then(function(){
        window.components = create("div");
        window.components.style.display="none";
        document.body.appendChild(window.components);
        Project.ready = true;
        (resolve)();
      });
    });
  };

};

function include(){}
window.components = document.createElement("div");
window.components.setAttribute("id","components");
window.components.style.display="none";
document.documentElement.appendChild(window.components);
include.components = function(dir,list,f){
  if(typeof list == "string")
    list = [list];

  if(dir === "") dir = "/components/";
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
        new HttpEvent(dir+file+".html",function(result){
          window[file] = create("component",result);
          window[file].setAttribute("id",file);
          components.appendChild(window[file]);
          (f)(file);
          if(i<length){
            poll();
          }else{
            (resolve)();
          }
        }).run();
      })();
    }
  });
};
include.component = include.components;

include.css = function(dir,list,f){
  if(typeof list =="string")
    list = [list];

  if(dir === "") dir = "/css/";
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
          style.setAttribute("href",dir+file+".css");
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

include.js = function(dir,list,f){
  if(typeof list =="string")
    list = [list];

  if(dir === "") dir = "/js/";
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
          script.setAttribute("src",dir+file+".js");
        }
        document.body.appendChild(script);
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
