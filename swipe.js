document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);
window.swipe={
    left: function(){},
    right: function(){},
    up: function(){},
    down: function(){},
    start: function(){},
    moving: function(){},
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

function showLeftMenu(menu){
    return new Promise(function(resolve,reject){
        let x = menu.offsetLeft;
        if(x >= 0) return;
        menu.style.zIndex = 4;
        (function poll(){
            x += 10;
            if(x > 0){
                x = 0;
            }
            menu.style.left = Pixel(x);
            if(x < 0){
                setTimeout(poll,1);
            }else{
                menu.state = 1;
                (resolve)();
            }
        })();
    });
};

function hideLeftMenu(menu){
    return new Promise(function(resolve,reject){
        let x = menu.offsetLeft;
        if(x <= -menu.offsetWidth) return;
        (function poll(){
            x -= 10;
            if(x < -menu.offsetWidth){
                x = -menu.offsetWidth;
            }
            menu.style.left = Pixel(x);
            if(x > -menu.offsetWidth){
                setTimeout(poll,1);
            }else{
                menu.style.zIndex = 0;
                menu.state = 0;
                (resolve)();
            }
        })();
    });
};

function toggleLeftMenu(menu){
    if(menu.offsetLeft !== 0){
        return showLeftMenu(menu);
    }else{
        return hideLeftMenu(menu);
    }
};

swipe.setLeftMenu=function(menu){
    swipe.start=function(x,y){
        swipe.start.x = x;
        swipe.start.y = y;
    };
    menu.dxDelta = 0;
    swipe.moving=function(x,y){
        if(!swipe.allow) return;

        //let dx = (x - swipe.start.x)/20 + menu.dxDelta;
        let dx = x - swipe.start.x;
        if(dx > 0){
            if(menu.state === 0 && swipe.start.x > menu.offsetWidth*.5){
                return;
            }
        }else if(dx < 0){
            if(menu.state === 1 && swipe.start.x > menu.offsetWidth*1.5){
                return;
            }
        }


        //x = menu.offsetLeft+dx;
        x = dx;
        menu.style.zIndex = 4;
        if(x >= 0){
            x -= menu.offsetWidth;
            if(x > 0){
                x = 0;
            }
            menu.state = 1;
            menu.dxDelta += -dx;
        }else if(x <= -menu.offsetWidth){
            x = -menu.offsetWidth;
            menu.style.zIndex = 0;
            menu.state = 0;
            menu.dxDelta += -dx;
        }

        if(dx < 0){
            if(x <= -menu.offsetWidth*.1){
                menu.state = 0;
            }
        }else if(dx > 0){
            if(x > -menu.offsetWidth*.9){
                menu.state = 1;
            }
        }

        menu.style.left = Pixel(x);
    };

    swipe.end=function(){
        menu.dxDelta = 0;
        if(menu.state === 1){
            showLeftMenu(menu);
        }else if(menu.state === 0){
            hideLeftMenu(menu);
        }
    };

    document.addEventListener('touchend', swipe.end, false);
    document.addEventListener('touchcancel', swipe.end, false);
};