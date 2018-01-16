window.loader = new Includer({
  css: "/ElkServer/css/",
  js: "/ElkServer/js/",
  modules: "/ElkServer/modules/"
});
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
    window.modules = create("div");
    window.modules.style.display="none";
    document.body.appendChild(window.modules);
    Project.ready = true;
    new MainActivity();
});
