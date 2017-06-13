/*
<div class="sk-cube-grid">
  <div class="sk-cube sk-cube1"></div>
  <div class="sk-cube sk-cube2"></div>
  <div class="sk-cube sk-cube3"></div>
  <div class="sk-cube sk-cube4"></div>
  <div class="sk-cube sk-cube5"></div>
  <div class="sk-cube sk-cube6"></div>
  <div class="sk-cube sk-cube7"></div>
  <div class="sk-cube sk-cube8"></div>
  <div class="sk-cube sk-cube9"></div>
</div>
*/

function SquareSpinner(){
  var grid=R.new("div");
      grid.className="sk-cube-grid";
  var cube=[
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div"),
    R.new("div")
  ];
  foreach(cube,function(item,i){
    item.className="sk-cube sk-cube"+(i+1);
    grid.appendChild(item);
  });
  this.getSpinner=function(){
    return grid;
  };
}
