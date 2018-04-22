const W = window,D = document,isTouch = 'ontouchstart' in W;
export const downEvt = isTouch ? 'touchstart' : 'mousedown';
export const moveEvt = isTouch ? 'touchmove' : 'mousemove';
export const upEvt = isTouch ? 'touchend' : 'mouseup';
export const cancelEvt = isTouch ? 'touchcancel' : 'mouseout';
export const viewChangeEvt = 'onorientationchange' in W ? 'orientationchange' : 'resize';
export const prefix = ()=>{
    const div = D.createElement('div'),
          style = div.style;
    const arr=['t','webkitT','MozT','msT','oT'];
    for(let i in arr){
        let t = arr[i]+'ransform';
        if(t in style ){
            return arr[i].substring(0,arr[i].length-1);
        }
    }
};
export const cssVendor = prefix() ? '-' + prefix().toLowerCase() + '-' : '';
export const transformProperty = cssVendor + 'transform';
export const transitionProperty = cssVendor + 'transition';
export const getRequestAnimFrame = ()=>{
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
            window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            let id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
};
