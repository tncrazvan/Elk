function Poll(f,condition,t){
	(function poll_instance(f,condition,t){
		setTimeout(function(){
			(f)();
			if(condition){
				//stop
			}else{
				poll_instance();
			}
			
		},(isset(t)?t:30));
	})(f,condition,t);
}