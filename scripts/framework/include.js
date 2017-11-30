Project.workspace='';
Project.ready = false;

function Project(){}
window.workspace = Project.workspace;

window.modules = document.createElement("div");
window.modules.setAttribute("id","modules");
window.modules.style.display = "none";

function include(){}

include.modules = function(list){
  if(list.constructor !== Array){
    return include.module([list]);
  }else{
    return new Promise(function(resolve,reject){
      let i = 0, length = list.length;
      if(length>0){
        (function poll(){
          i++;
          let file = list[i-1]; //without extension
          new HttpEvent("modules/"+file+".html",function(result){
            let moduleHolder = document.createElement("module");
            moduleHolder.applyHtml(result);
            (resolve)();
            if(i<length){
              poll();
            }
          }).run();
        })();
      }
    });
  }
};
include.module = function(list){
  return include.modules(list);
};

include.css = function(list){
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
            style.setAttribute("href",workspace+"assets/css/"+file+".css");
          }
          document.head.appendChild(style);
          style.onload=function(){
            (resolve)();
            if(i<length){
              poll();
            }
          };
        })();
      }
    });
  }
};
include.js = function(list){
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
            script.setAttribute("src",workspace+"scripts/"+file+".js");
          }
          document.body.appendChild(script);
          script.onload=function(){
            (resolve)();
            if(i<length){
                poll();
            }else{
                if(MainActivity.counter===0){
                    Project.ready = true;
                    new MainActivity();
                }
            }
          };
        })();
      }
    });
  }
};
