import './css/style.css';
import './utils/flexible';
import songData from './data/songData';
import MusicPlay from './js/musicPlay';
import gesture from './utils/gesture';
import * as App from './utils/app';
const  musicPlay = new MusicPlay(songData);
$('.music-player-button-play').on('click',function () {
    const $this =$(this);
    if($this.hasClass('music-player-button-pause')){
        musicPlay.toPlay('pause');
    }else{
        musicPlay.toPlay('play');
    }
});
$('.music-player-button-next').on('click',function(){
    musicPlay.songPlayMode("next");
});
$('.music-player-button-pre').on('click',function(){
    musicPlay.songPlayMode("pre");
});
$('.music-love').on('click',function () {
    const $this = $(this);
    if($(this).hasClass('music-love-full')){
        $this.removeClass('music-love-full');
    }else{
        $this.addClass('music-love-full');
    }
});
$('.music-style').on('click',function(){
    musicPlay.setMusicStyleIndex();
    musicPlay.showMusicPlayStyleTip();
});
$('.music-cover').on('click',function(){
    musicPlay.showLrcBox();
});
$('.lrc-box').on('click',function(){
    musicPlay.hideLrcBox();
});
$('.music-player-slider-wrap').on('click',function (e) {
    musicPlay.goToAimTime(e.pageX);
});
const sliderBar = function () {
    let sliderBarW;
    const wW = $(window).width();
    gesture({
        $area:$('.music-player-slider-wrap'),
        downFn:function(e,sx,sy){
			musicPlay.stopMusicTimer();
            sliderBarW = $('.music-player-slide-bar').width();
        },
        moveFn:function(e,dx,dy){
            let curWidth = Math.round((sliderBarW+dx)/wW * 100);
			musicPlay.stopMusicTimer();
            curWidth = curWidth<0 ? 0 : curWidth>100 ? 100 : Math.round(curWidth);
            $('.music-player-slide-bar').css('width',curWidth+'%');
            musicPlay.songPlayTime(musicPlay.totalTime(),Math.round(musicPlay.totalTime() * curWidth) / 100);
            
        },
        upFn:function(e,dx,dy){
			musicPlay.goToAimTime(sliderBarW+dx);
			musicPlay.startMusicTimer();
        }
    });
}();
App.getRequestAnimFrame();
if(module.hot){
    module.hot.accept();
}
