/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function Expectation(f,time){
    var $this = this,
    canceled = false,
    running = false,
    timePassed = 0;
    
    this.cancel=function(){
        canceled = true;
        timePassed = 0;
        running = false;
    };
    
    this.isRunning=function(){
        return running;
    };
    this.start=function(){
        if(!running){
            canceled = false;
            running = true;
            (function poll(){
                setTimeout(function(){
                    timePassed +=10;
                    if(timePassed >= time){
                        (f)();
                        $this.cancel();
                    }else{
                        if(!canceled){
                            poll();
                        }/*else end poll*/
                    }
                },10);
            })();
        }
    };
}