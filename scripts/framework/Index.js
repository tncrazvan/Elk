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
            App(getJobLocation());
        })();
    })();
}
