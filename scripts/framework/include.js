Project.workspace='';
Project.ready = false;

function Project(){}
window.workspace = Project.workspace;

function Includer(){
  var $this = this;
  this.currentModuleRequest = null;
  this.currentCSSRequest = null;
  this.currentJavaScriptRequest = null;
  this.js=function(value){
    return include.js(value,function(file){
      $this.currentJavaScriptRequest = file;
    });
  };
  this.css=function(value){
    return include.css(value,function(file){
      $this.currentCSSRequest = file;
    });
  };
  this.module=function(value){
    return include.module(value,function(mod){
      $this.currentModuleRequest = mod;
    });
  };
};

function include(){}

include.modules = function(list,f){
  f = f || function(){};
  if(list.constructor !== Array){
    return include.modules([list]);
  }else{
    return new Promise(function(resolve,reject){
      let tmpModules = '';
      let i = 0, length = list.length;
      if(length>0){
        (function poll(){
          i++;
          let file = list[i-1]; //without extension
          new HttpEvent("modules/"+file+".html",function(result){
            tmpModules += result;
            (f)(file);
            if(i<length){
              poll();
            }else{
              modules.applyHtml(tmpModules,true);
              (resolve)();
            }
          }).run();
        })();
      }
    });
  }
};
include.module = function(list,f){
  return include.modules(list,f);
};

include.css = function(list,f){
  f = f || function(){};
  if(list.constructor !== Array){
    return include.css([list]);
  }else{
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
            style.setAttribute("href",workspace+"css/"+file+".css");
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
  }
};

include.js = function(list,f){
  f = f || function(){};
  if(list.constructor !== Array){
    return include.js([list]);
  }else{
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
            script.setAttribute("src",workspace+"js/"+file+".js");
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
  }
};
