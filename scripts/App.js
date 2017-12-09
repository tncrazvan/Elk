window.App=function(uri){
    /*
    Your code goes here
    */
    console.log("Your application is ready.");

    include.module([
      "test"
    ]).then(function(){
      switch (uri.trim()) {
        case "":
          setContent(Project.DEFAULT_PAGE,main,true,true);
          break;
        default:
          setContent(uri,main,true,true);
          break;
      }
    });
};
