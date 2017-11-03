DropdownMenu.list=[];
DropdownMenu.hideAllMenus=function(){
  foreach(DropdownMenu.list,function(o,i){
    o.hideMenu();
  });
};
function DropdownMenu(options){
  var $this=this;
  DropdownMenu.list.push($this);
  var items=new Array();
  var container = R.new("div");
      container.className="dropdownMenuContainer";
  var currentValue=null;
  var ul= R.new("ul");
      ul.className="dropdownMenu";
      ul.style.position="absolute";
  var showing=false;
  var button=R.new("button");
      button.innerHTML="loading...";
      button.className="dropdownMenuButton";
      button.onclick=function(){
        if(!showing){
          DropdownMenu.hideAllMenus();
          $this.showMenu();
        }else{
          $this.hideMenu();
        }
      };

  this.onChange=function(newValue){};
  var counter=0;
  for(var key in options){
    var value=(
      isset(options[key].value)?
      options[key].value
      :
      key
      .replace(" ","_")
      .toLowerCase()
    );
    var item = R.new("li");
        item.innerHTML=key;

        item.setAttribute("value",value);
        item.onclick=function(){
          currentValue = this.getAttribute("value");
          for(var key2 in items){
            items[key2].className="";
          }
          this.className="selected";
          button.innerHTML = this.innerHTML;
          if(isset(options[key].onSet)) options[key].onSet();
          if(showing){
            $this.hideMenu();
          }
          $this.onChange(currentValue);
        };
        if(counter===0){
          item.click();
        }
    items.push(item);
    ul.appendChild(item);
    counter++;
  }
  container.appendChild(button);
  container.appendChild(ul);

  this.getCurrentValue=function(){
    return currentValue;
  };
  this.hideMenu=function(){
    ul.style.display="none";
    showing=false;
  };
  this.showMenu=function(){
    ul.style.display="block";
    showing=true;
  };
  this.getDropDownMenuContainer=function(){
    return container;
  };

  this.setValue=function(value){
    foreach(items,function(item,i){
      if(item===value){
        item.click();
      }
    });
  };
}
