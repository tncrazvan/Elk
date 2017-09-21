window.App=function(){
    /*
    Layout definition requests should be sent from here
    */
    if(getJobLocation() === ""){
      setContent(Project.DEFAUL_CONTROLLER,window["main-content"],true);
    }else{
      setContent(getJobLocation(),window["main-content"],true);
    }
};
