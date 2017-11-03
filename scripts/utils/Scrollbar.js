/* 
 * Custom scrollbar linked to an overflown element
 */

function Scrollbar(overflownDiv){
    overflownDiv.style.overflowY="hidden";
    var scrollbarContainer = R.new("div");
        scrollbarContainer.className="scrollbarContainer";
    var scrollbar = R.new("div");
        scrollbar.className="scrollbar";
        scrollbarContainer.appendChild(scrollbar);
    
    scrollbar.initialOffset = getElementOffset(scrollbarContainer);
    scrollbar.push=function(value){
        scrollbar.style.top=Pixel(getElementOffset(scrollbar).y-scrollbar.initialOffset.y+value);
    };
    
    var hasBeenClickedFor = 0;
    var mousePosInsideScrollbar = 0;
    var scrollbarModifier = 0;
    var deltaY = 0;
    var wheelTemp = 0;
    scrollbar.percentY=0;
    
    this.startListening=function(){
        (function poll(){
            scrollbar.mouseover = false;
            scrollbar.clicked = false;
            overflownDiv.mouseover = false;
            scrollbar.offset=getElementOffset(scrollbar);
            overflownDiv.offset=getElementOffset(overflownDiv);
            if(
                Mouse.position.x > overflownDiv.offset.x &&
                Mouse.position.x < overflownDiv.offset.x+overflownDiv.offsetWidth &&
                Mouse.position.y > overflownDiv.offset.y &&
                Mouse.position.y < overflownDiv.offset.y+overflownDiv.offsetHeight
            ){
                overflownDiv.mouseover = true;
            }
            
            if(
                Mouse.position.x > scrollbar.offset.x && 
                Mouse.position.x < scrollbar.offset.x+scrollbar.offsetWidth &&
                Mouse.position.y > scrollbar.offset.y &&
                Mouse.position.y < scrollbar.offset.y+scrollbar.offsetHeight
            ){
                scrollbar.mouseover = true;
            }
            //left button clicked
            if(Mouse.leftButtonDown){
                //mouse is over scrollbar
                if(scrollbar.mouseover){
                    if(hasBeenClickedFor===10){
                        scrollbar.clickOffset={
                            x: Mouse.position.x,
                            y: Mouse.position.y
                        };
                        mousePosInsideScrollbar = Mouse.position.y - scrollbar.offset.y; 
                    }
                    scrollbar.active = true;
                    deltaY = Mouse.position.y;
                }else{
                    if(!isnull(scrollbar.clickOffset)){
                        scrollbar.active = true;
                        deltaY = Mouse.position.y;
                    }
                }
            }else if(Keyboard.arrowDown && overflownDiv.mouseover){
                scrollbar.active = true;
                if(deltaY<scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y){
                    deltaY +=20;
                }else if(deltaY>scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y && overflownDiv.mouseover){
                    deltaY = scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y;
                }
                mousePosInsideScrollbar = 0;
                scrollbar.clickOffset={
                    x: scrollbar.offset.x,
                    y: scrollbar.offset.y
                };
            }else if(Keyboard.arrowUp && overflownDiv.mouseover){
                scrollbar.active = true;
                if(deltaY>0){
                    deltaY -=20;
                }else if(deltaY<0 && overflownDiv.mouseover){
                    deltaY = 0;
                }
                mousePosInsideScrollbar = 0;
                scrollbar.clickOffset={
                    x: scrollbar.offset.x,
                    y: scrollbar.offset.y
                };
            }else if(Mouse.wheelIsMoving && overflownDiv.mouseover){
                wheelTemp = Mouse.wheel.deltaY;
                scrollbar.active = true;
                if(deltaY+wheelTemp<scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y && deltaY+wheelTemp>0 && overflownDiv.mouseover){
                    deltaY +=wheelTemp;
                }else if(deltaY+wheelTemp>scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y && overflownDiv.mouseover){
                    deltaY = scrollbarContainer.offsetHeight+getElementOffset(scrollbarContainer).y;
                }else if(deltaY+wheelTemp<0 && overflownDiv.mouseover){
                    deltaY = 0;
                }
                mousePosInsideScrollbar = 0;
                scrollbar.clickOffset={
                    x: scrollbar.offset.x,
                    y: scrollbar.offset.y
                };
            }else{
                hasBeenClickedFor = 0;
                scrollbar.clickOffset=null;
            }


            //scrollbar can be scrolled
            if(scrollbar.active && hasBeenClickedFor >= 10){
                scrollbarModifier = deltaY-scrollbar.initialOffset.y-mousePosInsideScrollbar;
                if(scrollbarModifier<0){
                    scrollbarModifier = 0;
                }
                if(scrollbarModifier > scrollbarContainer.offsetHeight - scrollbar.offsetHeight){
                    scrollbarModifier = scrollbarContainer.offsetHeight - scrollbar.offsetHeight;
                }
                scrollbar.percentY = scrollbarModifier/(scrollbarContainer.offsetHeight-scrollbar.offsetHeight);
                scrollbar.style.top=Pixel(scrollbarModifier);

            }

            //calculating inner height for left div element
            overflownDiv.innerHeight = overflownDiv.scrollHeight-overflownDiv.offsetHeight;

            overflownDiv.scrollTop=scrollbar.percentY*overflownDiv.innerHeight;

            new Thread(function(){
                hasBeenClickedFor+=10;
                poll();
            },10).run();
        })();
    };
    
    this.getScrollbarContainer=function(){
        return scrollbarContainer;
    };
}

