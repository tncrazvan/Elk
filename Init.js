window.loader = new Includer();
loader.css([
  //"style"
]);

loader.js([
  "ElkServer/Elk/Project",
  "ElkServer/Elk/Cookie",
  "ElkServer/Elk/Main",
  "ElkServer/Elk/App",
  "ElkServer/Elk//Index"
]).then(function(){
    window.modules = create("div");
    window.modules.style.display="none";
    document.body.appendChild(window.modules);
    Project.ready = true;
    new MainActivity();
});
