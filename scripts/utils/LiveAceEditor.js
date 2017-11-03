function LiveAceEditor(editor,address,port,filename,onFileNotFound){
  $this = this;
  const
  ACTION_LOGICAL_SAVE = 0,
  ACTION_PHYSICAL_SAVE = 1,
  ACTION_REQUEST_FILE = 2,
  socket = new WebSocket("ws://"+address+":"+port);

  var
  originalContent = new Array(),
  currentContent = new Array(),
  undoManager = new ace.UndoManager();
  editor.setWrapBehavioursEnabled(false);
  editor.session.setUndoManager(undoManager);

  socket.onopen=function(e){
      console.log("Connected.");
      socket.send(JSON.stringify({
          "action":ACTION_REQUEST_FILE,
          "filename":filename
      }));
  };
  this.disconnect=function(){
      socket.close();
  };
  socket.onmessage=function(o){
      const result = JSON.parse(o.data);
      switch(result.action){
          case ACTION_REQUEST_FILE:
              if(isset(result.error)){
                  if(result.error === 404){
                      onFileNotFound();
                      break;
                  }
              }else{
                  tmp='';
                foreach(result.content,function(item,i){
                  //console.log(item);
                  originalContent[i]=item;
                  if(i>0) tmp +="\n";
                  tmp +=item;
                });
                editor.session.setValue(tmp,-1);
                delete tmp;
              }
            break;
          case ACTION_LOGICAL_SAVE:
            //console.log(result.content);
            currentContent=editor.getValue().split("\n");
            firstiteration = true;
            firstKey = null;
            criticalRow = null;
            for(var key in result.content){
              if(firstiteration){
                firstKey = key;
                firstiteration = false;
                criticalRow=currentContent[firstKey];
              }
              currentContent[key]=result.content[key].content;

              //editor.session.replace(new Range(key,0,key,originalContent[key].length),originalContent[key]);
            }
            delete firstiteration;

            tmp='';
            foreach(currentContent,function(item,i){
              if(item !== null && typeof item !== 'undefined'){
                originalContent[i]=item;
                if(i>0) tmp +="\n";
                tmp +=item;
              }
            });
            row = editor.getCursorPosition().row;
            column = editor.getCursorPosition().column;
            oldRowCounter = editor.getValue().split("\n").length;
            newRowCounter = tmp.split("\n").length;
            editor.session.setValue(tmp);

            deltaY = newRowCounter-oldRowCounter;
            if(row >= firstKey){
              if(deltaY === 0 && row == firstKey){
                oldColumnCounter = criticalRow.length;
                tmp_column=editor.getCursorPosition().column;
                truncatedOriginal = originalContent[row].substring(0,column);
                truncatedCritical = criticalRow.substring(0,column);
                if(truncatedOriginal !== truncatedCritical){
                  //console.log("##############################");
                  //console.log("T1: "+truncatedCritical);
                  //console.log("T2: "+originalContent[row]);
                  //console.log("T3: "+criticalRow);
                  deltaX = originalContent[row].length - criticalRow.length;
                  //console.log("deltaX: "+deltaX);
                  editor.selection.moveTo(row+deltaY, column+deltaX);
                  delete deltaX;
                  delete tmp_column;
                }else{
                  editor.selection.moveTo(row+deltaY, column);
                }
                delete oldColumnCounter;
                delete truncatedOriginal;
                delete truncatedCritical;
              }else{
                editor.selection.moveTo(row+deltaY, column);
              }
            }else{
              editor.selection.moveTo(row, column);
            }

            delete deltaY;
            delete row;
            delete column;
            delete tmp;
            delete newRowCounter;
            delete oldRowCounter;
            break;
      }
  };

  socket.onclose=function(){
      console.error("Connection closed");
  };

  this.physicalSave=function(){
      socket.send(JSON.stringify({
          "action":ACTION_PHYSICAL_SAVE
      }));
      //console.log("Data has been sent.");
  };
  this.logicalSave=function(){
      tmp = {};
      currentContent=editor.getValue().split("\n");
      for(var i = 0;i < currentContent.length || i < originalContent.length;i++){

          if(typeof originalContent[i] !== 'undefined'){
              if(typeof currentContent[i] === 'undefined'){
                  tmp[i] = {
                    "delete":true
                  };
              }else{
                  if(originalContent[i] !== currentContent[i]){
                      tmp[i]={
                        "content":currentContent[i]
                      };
                  }
              }
          }else{
              tmp[i]={
                "content":currentContent[i]
              };
          }
      }
      delete currentContent;
      if(Object.keys(tmp).length === 0 && tmp.constructor === Object){
        //console.log("Not sending.");
      }else{
        socket.send(JSON.stringify({
            "action":ACTION_LOGICAL_SAVE,
            "content":tmp
        }));
        //console.log("Sending.");
      }
      delete tmp;
      originalContent=editor.getValue().split("\n");
  };

  editor.getSession().on('change', function() {
    editor.contentChanged = true;
  });

  (function poll(){
    setTimeout(function(){
      if(editor.contentChanged){
        editor.contentChanged = false;
        $this.logicalSave();
      }
      poll();
    },10);
  })();
}
