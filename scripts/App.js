window.App=function(){
    /*
    Layout definition requests should be sent from here
    */
    if(getJobLocation() === ""){
      setContent(Project.DEFAULT_CONTROLLER,main,true);
    }else{
      setContent(getJobLocation(),main,true);
    }
};
