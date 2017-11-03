/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* BOOTSTRAP Breadcumb only
 *
 *
 <ol id="main-breadcumb" class="breadcrumb">
   <li><a href="#">AreaRiservata</a></li>
   <li><a href="#">comunityAttive</a></li>
   <li>[numero comuity]</li>
 </ol>
 *
 *
 */

function Breadcumb(){
  var bread = create("ol");
  bread.className="breadcumb";
  var items = new Array();
  var i = 0;
  var $this = this;
  this.push=function(label,uri){
    item = create("li");
    console.log("LABEL:"+label);
    if(isset(uri)){
      anchor = create("a");
      anchor.innerHTML = label;
      anchor.onclick=e=>{
        setContent(uri,window["main-content"]);
      };
      item.appendChild(anchor);
    }else{
      item.innerHTML = label;
    }
    items[i] = item;
    bread.appendChild(item);
    i++;
  };

  this.pop=function(){
    items[i-1].remove();
    delete items[i-1];
    i--;
  }

  this.getElement=function(){
    return bread;
  }

  this.update=function(){
    //clear bread
    bread.innerHTML = "";
    //prepare tmp string
    var concatUri = "";
    //run through keywords
    foreach(getJobLocation().split("/"),function(label,i,isLast){
      //push keyword and relative uri
      concatUri += (i===0?"":"/")+label;
      if(isLast){
        $this.push(label.capitalize());
      }else{
        $this.push(label.capitalize(),concatUri);
      }
    });
  }
}
