var loader = new Includer();
loader.css([
  "template"
]);

loader.js([
  "Elk/Project",
  "Elk/Cookie",
  "Elk/Main",
  "Elk/App",
  "Elk//Index"
]).then(function(){
    Project.ready = true;
    new MainActivity();
});
