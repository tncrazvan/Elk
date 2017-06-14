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
                ,e=>{
            delete window.COOKIE[path+key];
            window.COOKIE[path+key]=value;
            if(isset(f))
                (f)();
        });
        e.run();
    };
    this.unset=function(f){
        expire="Thu, 01 Jan 1970 00:00:00 GMT";
        $this.set(f);
        expire="";
    };
    this.get=function(f){
        var e = new HttpEvent(controllerGet+key,e=>{
            if(isset(f))
                (f)(JSON.parse(e));
            else{
                console.log(e);
                window.COOKIE[path+key]=JSON.parse(e);
            }
        });
        e.run();
    };
}
