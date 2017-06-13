/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function convertToIcon(id,info){
    var local={
        item: document.getElementById(id),
        clicks: 0,
        frame: (info.frame?info.frame:new Frame(info.title,"")),
        visible: false
    };
    local.frame.onExit(function(f){
        f.hide();
        local.item.style.transform = "scale(1.00,1.00)";
        local.item.style.backgroundColor = "transparent";
        local.visible = false;
        local.item.onmouseout();
    });
    local.item.style.backgroundColor= "transparent";
    local.item.style.color= "#ffffff";
    local.item.style.wordWrap= "break-word";
    local.item.style.padding= Pixel(20);
    local.item.style.border= Pixel(0);
    local.item.style.marginBottom= Pixel(30);
    local.item.style.borderRadius = Percent(10);
    local.item.style.transition = "background-color 0.2s, transform 0.2s,border-radius 0.5s";
    local.item.onmouseover=function(){
        if(!local.visible){
            this.style.backgroundColor = Rgba(255,255,255,0.1);
            this.style.borderRadius = Percent(50);
        }
    };
    local.item.onmouseout=function(){
        if(!local.visible){
            this.style.backgroundColor = "transparent";
            this.style.borderRadius = Percent(10);
        }
    };
    local.item.onmouseup=function(){
        if(isset(info.src)){
            if(local.clicks>0){
                local.frame.show();
            }else{
                local.clicks++;
                var iframe = document.createElement("iframe");
                    iframe.setAttribute("src",info.src);
                    iframe.setAttribute("width",Percent(100));
                    iframe.setAttribute("height",Percent(100));
                    iframe.style.border= Pixel(0);
                local.frame.add(iframe);
                local.frame.overflow({
                   x: false,
                   y: false
                });
                local.frame.create();
            }
        }
        if(isset(info.frame)){
            info.frame.show();
        }
        local.visible = true;
        local.item.style.transform = "scale(0.5,0.5)";
        local.item.style.backgroundColor = Rgba(17,0,34,1.0);
    };
}