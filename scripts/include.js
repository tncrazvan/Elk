function include(type,list){
    switch(type){
        case "stylesheet":
        case "css":{
            var i = 0, length = list.length;
            if(list.constructor === Array && length>0){
                (function poll(){
                    i++;
                    var file = list[i-1]; //without extension
                    var style = document.createElement("link");
                        style.setAttribute("rel","stylesheet");
                        style.setAttribute("type","text/css");
                        if(file.charAt(0)==="@"){
                            style.setAttribute("href",(file.replace("@","")));
                        }else{
                            style.setAttribute("href",workspace+"/assets/css/"+(file/*.replace(".","/")*/)+".css");
                        }
                        document.head.appendChild(style);
                        style.onload=function(){
                            if(i<length){
                                poll();
                            }
                        };
                })();
            }
        }break;
        case "js":
        case "javascript":{
            var i = 0, length = list.length;
            if(list.constructor === Array && length>0){
                (function poll(){
                    i++;

                    var file = list[i-1]; //without extension
                    var script = document.createElement("script");
                        script.setAttribute("type","text/javascript");
                        script.setAttribute("charset","UTF-8");
                        if(file.charAt(0)==="@"){
                            script.setAttribute("src",(file.replace("@","")));
                        }else{
                            script.setAttribute("src",workspace+"/scripts/"+(file)+".js");
                        }
                        document.body.appendChild(script);
                        script.onload=function(){
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
        }break;
    }
}
