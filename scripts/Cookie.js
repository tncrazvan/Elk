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
    key =isset(key)?"/"+key:"/?";
    path =isset(path)?path:"";
    domain =isset(domain)?domain:document.location.hostname;
    this.set=function(f){
        var e = new HttpEvent(controllerSet+key
                +(isset(value)?"/"+value
                    +(isset(path)?"/"+path
                        +(isset(domain)?"/"+domain
                            +(isset(expire)?"/"+expire:'')
                        :'')
                    :'')
                :'')
                ,result=>{
            delete window.COOKIE[path+key];
            window.COOKIE[path+key]={
              "DataType":"Cookie",
              "Value":value
            };
            if(isset(f))
                (f)();
        });
        e.run();
    };
    this.unset=function(f){
        var e = new HttpEvent(controllerUnset+key,result=>{
            delete window.COOKIE[path+key];
            if(isset(f))
                (f)();
        });
        e.run();
    };
    this.get=function(f){
        var e = new HttpEvent(controllerGet+key,e=>{
            if(isset(f))
                (f)(JSON.parse(e));
            else{
                window.COOKIE[path+key]=JSON.parse(e);
            }
        });
        e.run();
    };
}
