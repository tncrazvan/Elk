function Popup(url,title,i) {
    
    if(isset(i.toolbar)){
    	if(i.toolbar) i.toolbar = 'yes';
    	if(!i.toolbar) i.toolbar = 'no';
    }else i.toolbar = 'no';
    
    if(isset(i.location)){
    	if(i.location) i.location = 'yes';
    	if(!i.location) i.location = 'no';
    }else i.location = 'no';
    
    if(isset(i.directories)){
    	if(i.directories) i.directories = 'yes';
    	if(!i.directories) i.directories = 'no';
    }else i.directories = 'no';
    
    if(isset(i.status)){
    	if(i.status) i.status = 'yes';
    	if(!i.status) i.status = 'no';
    }else i.status = 'no';
    
    if(isset(i.menubar)){
    	if(i.menubar) i.menubar = 'yes';
    	if(!i.menubar) i.menubar = 'no';
    }else i.menubar = 'no';
    
    if(isset(i.scrollbars)){
    	if(i.scrollbars) i.scrollbars = 'yes';
    	if(!i.scrollbars) i.scrollbars = 'no';
    }else i.scrollbars = 'no';
    
    if(isset(i.resizable)){
    	if(i.resizable) i.resizable = 'yes';
    	if(!i.resizable) i.resizable = 'no';
    }else i.resizable = 'no';
    
    if(isset(i.copyhistory)){
    	if(i.copyhistory) i.copyhistory = 'yes';
    	if(!i.copyhistory) i.copyhistory = 'no';
    }else i.copyhistory = 'no';
    
    if(!isset(i.width)) i.width = 800;
    if(!isset(i.height)) i.height = 500;
    

    i.left = (screen.width/2)-(i.width/2);
    i.top = (screen.height/2)-(i.height/2);
    
    return window.open(url, title, 
    		'toolbar='+i.toolbar+', '+
    		'location='+i.location+', '+
    		'directories='+i.directories+', '+
    		'status='+i.status+', '+
    		'menubar='+i.menubar+', '+
    		'scrollbars='+i.scrollbars+', '+
    		'resizable='+i.resizable+', '+
    		'copyhistory='+i.copyhistory+', '+
    		'width='+i.width+', '+
    		'height='+i.height+', '+
    		'top='+i.top+', '+
    		'left='+i.left+'');
} 