document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
window.swipe={
    left: function(){},
    right: function(){},
    up: function(){},
    down: function(){},
    start: function(){},
    moving: function(){},
    onLeftMenuMove: function(){},
    onLeftMenuShow: function(){},
    onLeftMenuHide: function(){},
    end: function(){},
    allow: true
};

let xDown = null;
let yDown = null;

function handleTouchStart(evt) {
    xDown = evt.touches[0].clientX;
    yDown = evt.touches[0].clientY;
    swipe.start(evt.touches[0].clientX,evt.touches[0].clientY);
};

function handleTouchMove(evt) {
    swipe.moving(evt.touches[0].clientX,evt.touches[0].clientY);

    if ( ! xDown || ! yDown ) {
        return;
    }

    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = xDown - xUp;
    let yDiff = yDown - yUp;

    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            /* left swipe */
            window.swipe.left(xDiff);
        } else {
            /* right swipe */
            window.swipe.right(xDiff);
        }
    } else {
        if ( yDiff > 0 ) {
            /* up swipe */
            window.swipe.up(yDiff);
        } else {
            /* down swipe */
            window.swipe.down(yDiff);
        }
    }
    /* reset values */
    xDown = null;
    yDown = null;
};

function showLeftMenu(menu,speed = 20){
    return new Promise(function(resolve,reject){
        let x = menu.offsetLeft;
        if(x >= 0) return;
        (function poll(){
            x += speed;
            if(x > 0){
                x = 0;
            }
            menu.style.left = Pixel(x);
            (swipe.onLeftMenuMove)(x);
            if(x < 0){
                setTimeout(poll,1);
            }else{
                menu.state = 1;
                (swipe.onLeftMenuShow)();
                (resolve)();
            }
        })();
    });
};

function hideLeftMenu(menu,speed = 20){
    return new Promise(function(resolve,reject){
        let x = menu.offsetLeft;
        if(x <= -menu.offsetWidth) return;
        (function poll(){
            x -= speed;
            if(x < -menu.offsetWidth){
                x = -menu.offsetWidth;
            }
            menu.style.left = Pixel(x);
            (swipe.onLeftMenuMove)(x);
            if(x > -menu.offsetWidth){
                setTimeout(poll,1);
            }else{
                menu.state = 0;
                (swipe.onLeftMenuHide)();
                (resolve)();
            }
        })();
    });
};

function toggleLeftMenu(menu,speed = 20){
    if(menu.offsetLeft !== 0){
        return showLeftMenu(menu,speed);
    }else{
        return hideLeftMenu(menu,speed);
    }
};

swipe.setLeftMenu=function(menu,speed = 20){
    menu.style.position = "fixed";
    menu.style.height = Percent(100);
    menu.style.width = "22em";
    menu.style.left = Pixel(-menu.offsetWidth);
    menu.style.top = 0;
    menu.style.overflowX = "hidden";
    menu.style.overflowY = "auto";
    //menu.style.transition = "width 0.2s";

    swipe.start=function(x,y){
        menu.start = {
            x: menu.offsetLeft,
            y: menu.offsetTop
        };
        swipe.start.x = x;
        swipe.start.y = y;
    };
    menu.dxDelta = 0;
    swipe.moving=function(x,y){
        if(!swipe.allow) return;
 
    
        let dx = x - swipe.start.x;

        if(dx > 0 && dx < 40){
            return;
        }
        if(dx < 0 && dx > -40){
            return;
        }

        let value = menu.start.x + (dx > 0?dx-40:dx+40);

        if(dx > 0){
            if(swipe.start.x >= menu.offsetLeft+menu.offsetWidth+40){
                return;
            }

            if(value >= -menu.offsetWidth+40){
                menu.state = 1;
            }
            if(menu.offsetLeft >= 0){
                menu.state = 1;
                return;
            }
            
        }else if(dx < 0){
            if(value < -40){
                menu.state = 0;
            }

            if(menu.offsetLeft <= -menu.offsetWidth){
                menu.state = 0;
                return;
            }
        }else{
            return;
        }
        
        if(value > 0) 
            value = 0;
        else if(value < -menu.offsetWidth) 
            value = -menu.offsetWidth;

        menu.style.left = Pixel(value);
        (swipe.onLeftMenuMove)(value);
    };

    swipe.end=function(){
        if(menu.state === 1){
            showLeftMenu(menu,speed);
        }else if(menu.state === 0){
            hideLeftMenu(menu,speed);
        }
    };

    document.addEventListener('touchend', swipe.end, false);
    document.addEventListener('touchcancel', swipe.end, false);
};