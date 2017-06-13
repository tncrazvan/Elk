/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/*
 * 
 * <a href="#">aaaaa</a>
    &gt;
    <a href="#">bbbbb</a>
 * 
 * 
 */

function Breadcumb(target){
    var 
    $this = this,
    selected,
    items = new Array(),
    object = (isset(target)?target:create("div"));
    object.className="breadcumb";
    this.push=function(name,uri){
        var arrow = create("span");
        arrow.className="arrow";
        arrow.innerHTML=" > ";
        var item = create("a");
        item.className="item";
        item.innerHTML=name;
        item.onclick=function(){
            go(uri);
            if(this!=selected){
                $this.pop();
            }
        };
        items.push({
            "arrow": arrow,
            "item": item
        });
        if(object.innerHTML!="")
            object.appendChild(arrow);
        object.appendChild(item);
        this.refresh();
    };
    this.pop=function(){
        items[items.length-1]["arrow"].remove();
        items[items.length-1]["item"].remove();
        items.splice(-1,1);
        this.refresh();
    };
    
    this.clear=function(){
        object.innerHTML="";
    };
    
    this.getBreadcumb=function(){
        return object;
    };
    this.refresh=function(){
        foreach(items,function(item,i){
            item["item"].className="item";
            if(i==items.length-1){
                item["item"].className +=" selected";
                selected = item["item"];
            }
        });
    };
}