MainActivity.counter = 0;
function MainActivity(){
    if(MainActivity.counter>0) return;

    /*
     * at this point MainActivity has been instantiated once
     */
    MainActivity.counter++;
    (function MainActivity(){
        document.session={};
        (function Client(){
            if(getJobLocation() === ""){
              setContent(Project.DEFAULT_CONTROLLER,main,true),then(App);
            }else{
              setContent(getJobLocation(),main,true).then(App);
            }
        })();
    })();
}
