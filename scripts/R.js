function R(){}
R.cls=function(cls){
  if(isset(cls) && cls !== "")
    return document.getElementsByClassName(cls);
  else
    return null;
};
R.id=function(id){
  if(isset(id) && id !== "")
    return document.getElementById(id);
  else
    return null;
};
R.new=function(object){
  return document.createElement(object);
};
