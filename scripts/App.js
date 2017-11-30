window.App=function(uri){
    /*
    Your code goes here
    */
    console.log("Your application is ready.");
    include.modules([
      "test"
    ]).then(function(){
      switch (uri) {
        case "":
          setContent(Project.DEFAULT_CONTROLLER,main,true);
          break;
        default:
          setContent(uri,main,true);
          break;
      }
    });

};
