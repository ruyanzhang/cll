import {getLyrics} from '../service/musicPlay';
export default class MusicPlay{
    static musicStyleIndex = 0; // 0 列表循环  1 单曲循环  2 随机循环
    constructor(song){
        this._song=song;
        this._songIndex = 0;
        this._musicTimer = null;
        this._lrcTimer = null;
        this.musicPlayer = document.getElementById('music-audio');
		this._init();
    }
    toPlay=(type)=>{
        const $musicPlay = $('.music-player-button-play');
        const $img = $('.music-cover').find('img');
		if(this.musicPlayer.src===''){
            return;
        }
        if(type==='play'){
            this.musicPlayer.play();
            this._autoPlayTimer();
            $musicPlay.addClass('music-player-button-pause');
            $img.addClass('running');
        }else{
            this.musicPlayer.pause();
            clearTimeout(this._musicTimer);
            cancelAnimationFrame(this._lrcTimer);
            $musicPlay.removeClass('music-player-button-pause');
            $img.removeClass('running');
        }
    };
    playIndex=(songIndex=0)=>{
		clearTimeout(this._musicTimer);
        cancelAnimationFrame(this._lrcTimer);
		$('.lrc-wrap').remove();
		this._resetMusicPlay(songIndex);
        this.toPlay("play");
    };
    songPlayMode=(direction='next')=>{
        const song = this._song;
        const mode = MusicPlay.musicStyleIndex;
        const length = song.albumSong.length;
        let songIndex = this._songIndex;
        if(mode===0 || mode===1){
            if(direction==='next'){
                songIndex=(songIndex+1) % length;
            }else{
                songIndex--;
                if(songIndex < 0){
                    songIndex = length-1;
                }
            }
        }else{
            let newSongIndex=Math.floor(length*Math.random());
            while (newSongIndex===songIndex){
                newSongIndex=Math.floor(length*Math.random());
            }
            songIndex=newSongIndex;
        }
        this.playIndex(songIndex);
    };
    showMusicPlayStyleTip=()=>{
        const musicStyleIndex = MusicPlay.musicStyleIndex;
        const styleName = musicStyleIndex===0 ? '列表循环' : musicStyleIndex===1 ? '单曲循环' : '随机循环';
        const $div = $(`<div class="music-play-style-tip fadeIn">${styleName}</div>`);
        $('.music-play-style-tip').remove();
        $('.music-style').removeClass('music-older music-single music-random').addClass(musicStyleIndex===0 ? 'music-older' : musicStyleIndex===1 ? 'music-single' : 'music-random');
        $('body').append($div);
    };
    setMusicStyleIndex = ()=> {
        MusicPlay.musicStyleIndex = (MusicPlay.musicStyleIndex+1) % 3;
    };
    showLrcBox=()=>{
        $('.lrc-box').css('zIndex','1');
    };
    hideLrcBox=()=>{
        $('.lrc-box').css('zIndex','-999');
    };
    goToAimTime=(x=0)=>{
        const wW = $(window).width();
        const totalTime = this.totalTime();
        this._setCurrentTime(x * totalTime / wW);
		if(!$('.music-player-button-play').hasClass('music-player-button-pause')){
			this.toPlay('play');
		}
    };
    isPlaying=()=>{
      return !this.musicPlayer.paused
    };
    startMusicTimer=()=>{
        this._autoPlayTimer();
    };
    stopMusicTimer=()=>{
        clearTimeout(this._musicTimer);
    };
    totalTime=()=>{
	return this.musicPlayer.duration || 0;
    };
    currentTime=()=>{
        return this.musicPlayer.currentTime || 0;
    };
    songPlayTime=(totalTime,currentTime)=>{
        if(currentTime <= totalTime){
            $('.music-player-time-play').html(this._conversionTime(Math.floor(currentTime)));
            $('.music-player-time-total').html(this._conversionTime(Math.floor(totalTime)));
        }
    };
    _init=()=>{
        this.musicPlayer.addEventListener('canplay', ()=>{
            const totalTime = this.totalTime();
            const currentTime = this.currentTime();
            this.songPlayTime(totalTime,currentTime);
        });
        this._resetMusicPlay(0);
    };
    _resetMusicPlay=(songIndex=0)=>{
        const song = this._song;
        this._songIndex = songIndex;
        this.musicPlayer.src = song.albumSong[songIndex].musicLink;
        $('.music-player-time-play').html('00:00');
        $('.music-player-time-total').html('00:00');
        $('.music-player-slide-bar').css('width',0);
        $('.music-cover').find('img').attr('src',song.albumSong[songIndex].albumCover);
        $('.music-name').html(song.albumSong[songIndex].musicName);
        $('.music-singer').html(song.albumSong[songIndex].musicSinger);
        this._getLyrics();
    };
    _setCurrentTime=(currentTime)=>{
        this.musicPlayer.currentTime = Math.round(currentTime);
    };
    _insertLrc=(dataTxt)=>{
        let xhtml = '';
        let lrcArray;
        let lrcTimeArray = [];
        const lrcVal = dataTxt.replace(/\[(\d*):(\d*).\d*]/g,function () {
            let min = Math.round(arguments[1]) ||  0,
                sec = Math.round(arguments[2]) || 0,
                realMin = min * 60 + sec;
            lrcTimeArray.push(realMin);
            return "";
        });
        lrcArray = lrcVal.split("\n");
        lrcArray.splice(0,4);
        for(let i=0;i<lrcArray.length;i++){
            if(/\S/g.test(lrcArray[i])){
                xhtml+=`<p data-timeLine="${lrcTimeArray[i]}">${lrcArray[i]}</p>`;
            }
        }
        const $lrcWrap = $(`<div class="lrc-wrap" id="lrc-wrap">
                <div id="lrc-content" class="lrc-content transition">${xhtml}</div>
        </div>`);
        $('.lrc-box').prepend($lrcWrap);
        const $lrcContent = $('.lrc-content');
        const $lrcWrapH = $('.lrc-wrap').height();
        this.lrcHeight = $lrcContent.find('p').eq(0).height();
        $lrcContent.css({
            'marginTop': ($lrcWrapH / 2 - this.lrcHeight / 2) + 'px',
            'marginBottom': ($lrcWrapH / 2 - this.lrcHeight / 2) + 'px'
        });
    };
    _getLyrics=()=>{
        const song = this._song;
        const songIndex = this._songIndex;
        const songLrc = song.albumSong[songIndex].lyricsLink;
        const $lrcContent = $('.lrc-content');
        if(songLrc===''){
            $lrcContent.html('暂无歌词');
        }else{
            getLyrics(songLrc).then((dataTxt)=>{
                if(dataTxt){
                    this._insertLrc(dataTxt)
                }else{
                    $lrcContent.html('暂无歌词');
                }
            });
        }
    };
    _lrcScrollTop=(endTop)=>{
        const $lrcWrap = $('.lrc-wrap');
        this._lrcTimer = ()=>{
            let top = $lrcWrap.get(0).scrollTop + 3;
            if (top < endTop){
                requestAnimationFrame(this._lrcTimer);
            }else{
                top = endTop;
            };
            $lrcWrap.get(0).scrollTop = top;
        };
        this._lrcTimer();
    };
    _lrcMove=(currentTime)=>{
        const $p = $('.lrc-content').find('p');
        for(let i= 0,length=$p.length;i<length;i++){
            let dataTimeLine = Math.round($p.eq(i).attr('data-timeLine'));
            if(dataTimeLine>0 && dataTimeLine===Math.round(currentTime)){
                $p.removeClass('pCur');
                $p.eq(i).addClass('pCur');
                this._lrcScrollTop(this.lrcHeight * i);
            }
        }
    };
    _autoPlayTimer=()=>{
        const musicPlayer = this.musicPlayer;
        let totalTime = this.totalTime();
        let currentTime = this.currentTime();
        $('.music-player-slide-bar').css('width',Math.round(currentTime/totalTime*100) + '%');
        this.songPlayTime(totalTime,currentTime);
        this._lrcMove(currentTime);
        this._musicTimer = setTimeout(this._autoPlayTimer,100);
        if(musicPlayer.ended){
            const musicStyleIndex = MusicPlay.musicStyleIndex;
            if(musicStyleIndex===1){
                this.playIndex(this._songIndex);
            }else{
                $('.music-player-button-next').click();
            }
        }
    };
    _conversionTime=(time)=>{
        let minute,seconds,cTime;
        minute = Math.floor((time/60)%60);
        seconds = Math.floor(time%60);
        if(minute<10){
            minute = '0' + minute;
        }
        if(seconds<10){
            seconds = '0'+seconds;
        }
        cTime = minute+':'+ seconds;
        return cTime;
    }
}
