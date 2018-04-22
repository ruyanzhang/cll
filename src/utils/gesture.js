import * as App  from '../utils/app';
const gesture = function(obj){
    const $area = obj.$area, $document = $(document),$W = $(window);
    let sX = null, sY = null, dX = null, dY = null, time = 0, isDown=false;
    const moveFn = function (e) {
			const evt = e.targetTouches ? e.targetTouches[0] : e;
            if(isDown){
                e.preventDefault();
                dX = evt.pageX - sX;
                dY = evt.pageY - sY;
                obj.moveFn && obj.moveFn(evt, dX, dY);
            }
        },
        upFn = function (e) {
            $document.off(App.moveEvt, moveFn);
            time = new Date().getTime() - time;
            obj.upFn && obj.upFn(e, dX, dY,time);
            sX = null, sY = null, dX = null, dY = null, time = 0, isDown = false;
        };
    $area.on(App.downEvt, function(e){
        const target = e.target, nodeName = target.nodeName;
		const evt = e.targetTouches ? e.targetTouches[0] : e;
        if(nodeName !== 'INPUT' && nodeName !== 'TEXTAREA'){
            isDown = true;
            sX = evt.pageX;
            sY = evt.pageY;
            time = new Date().getTime();
            obj.downFn && obj.downFn(evt,sX,sY);
            $document.on(App.moveEvt, moveFn).one(App.upEvt, upFn);
        }
    });
};
export default gesture;
