MainActivity.counter = 0;
function MainActivity(){
    if(MainActivity.counter>0) return;

    /*
     * at this point MainActivity has been instantiated once
     */
    MainActivity.counter++;
    (function MainActivity(){
        if(getJobLocation()===""){
          go(Project.defaultController);
        }else{
          go(getJobLocation());
        }
        document.session={};
        (function Client(){
            //Your code starts here
            App();
            //your code ends here
        })();
    })();
}
