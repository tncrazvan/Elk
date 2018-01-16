window.loader = new Includer();
loader.css([
  //"style"
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
