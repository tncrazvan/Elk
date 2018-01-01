/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

window.COOKIE={};
window.Cookie = function(key, value, path, domain, expire){
    var $this = this;
    var controllerSet = "/@Set/cookie";
    var controllerUnset = "/@Unset/cookie";
    var controllerGet = "/@Get/cookie";
    var controllerIsset = "/@Isset/cookie";
    key =isset(key)?key:"?";
    path =isset(path)?path:"/";
    value =isset(value)?value:"";
    domain =isset(domain)?domain:document.location.hostname;
    expire =isset(expire)?expire:new String((Date.now()/1000).truncate(0)+60*60*24*7); //1 week of cookie is default

    /*
    IMPORTANT: reading cookies and unsetting cookies is done using the GET method of HTTP,
    however, in order to set the value of a (new or old) cookie the POST method is used instead.
    Using the POST method the cookie's length is not limied and it is not sent in clear, eg:
    setting a password for an account should not be visible anywhere on your browser, but that is not the case with GET requests,
    as browsers often display the URL of every GET request in some way (on the javascript console or on the address bar).
    */
    this.set=function(f){
      var e = new PostHttpEvent(controllerSet,function(result){
          delete window.COOKIE[path+key];
          window.COOKIE[path+key]=JSON.parse(result);
          if(isset(f)) (f)();
      },
      {
        "name":key,
        "path":path,
        "domain":domain,
        "expire":expire,
        "value":value
      });
      e.run();
    };
    this.unset=function(f){
      var e = new PostHttpEvent(controllerUnset,function(result){
          delete window.COOKIE[path+key];
          if(isset(f)) (f)();
      },
      {
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };
    this.get=function(f){
      var e = new PostHttpEvent(controllerGet,function(e){
          window.COOKIE[path+key]=JSON.parse(e);
          if(isset(f))
              (f)(JSON.parse(e));
      },
      {
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };

    this.isset=function(f){
      var e = new PostHttpEvent(controllerIsset,function(e){
          if(isset(f)) (f)(Number(JSON.parse(e))>=0);
      },{
        "name":key,
        "path":path,
        "domain":domain
      });
      e.run();
    };
};
window.AppCookie = window.Cookie;
window.CookieHandler = window.Cookie;
