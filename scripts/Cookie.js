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
    /*
    IMPORTANT: reading cookies and unsetting cookies is done using the GET method of HTTP,
    however, in order to set the value of a (new or old) cookie the POST method is used instead.
    Using the POST method the cookie's length is not limied and it is not sent in clear, eg:
    setting a password for an account should not be visible anywhere on your browser, but that is not the case with GET requests,
    as browsers often display the URL of every GET request in some way (on the javascript console or on the address bar).
    */
    this.set=function(f){
        var e = new PostHttpEvent(controllerSet+key
                  +(isset(path)?"/"+path
                      +(isset(domain)?"/"+domain
                          +(isset(expire)?"/"+expire:'')
                      :'')
                  :'')
                ,
                result=>{
            delete window.COOKIE[path+key];
            window.COOKIE[path+key]={
              "DataType":"Cookie",
              "Value":value
            };
            if(isset(f))
                (f)();
        },
        {
          "Value":isset(value)?value:null
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
            window.COOKIE[path+key]=JSON.parse(e);
            if(isset(f))
                (f)(JSON.parse(e));
        });
        e.run();
    };
}
