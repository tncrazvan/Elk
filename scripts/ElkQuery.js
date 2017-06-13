ElkQuery.CLASS="_ElkAjaxEval";
ElkQuery.waiting=false;
function ElkQuery(query){
    var $={
        query: query
    };
    this.submit=function(f){
        var j = new Job(function(data){
            ElkQuery.waiting=false;
            if(isset(f)){
                (f)(data);
            }
        });
        j.setLocalClass(ElkQuery.CLASS);
        j.setProcedure("request",[$.query]);
        (function poll(){
            setTimeout(function(){
                if(ElkQuery.waiting){
                    poll();
                }else{
                    ElkQuery.waiting=true;
                    j.run();
                }
            },10);
        })();
    };
}