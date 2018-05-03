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
        
        menu.style.zIndex = 4;

        if(dx >= 0){
            if(menu.offsetLeft >= 0){
                return;
            }
            if(dx >= 25){
                if(dx > menu.offsetWidth){
                    dx = menu.offsetWidth;
                }
                menu.state = 1;
            }
        }else if(dx < 0){
            if(menu.offsetLeft <= -menu.offsetWidth){
                return;
            }
            if(dx <= -25){
                if(dx < -menu.offsetWidth){
                    dx = -menu.offsetWidth;
                }
                menu.state = 0;
            }
        }
        
        menu.style.left = Pixel(menu.start.x + dx);
    };

    swipe.end=function(){
        if(menu.state === 1){
            showLeftMenu(menu);
        }else if(menu.state === 0){
            hideLeftMenu(menu);
        }
    };

    document.addEventListener('touchend', swipe.end, false);
    document.addEventListener('touchcancel', swipe.end, false);
};