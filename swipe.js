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