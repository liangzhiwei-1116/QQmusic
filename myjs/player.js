(function(window){
    function Player($audio){
        return new Player.prototype.init($audio);
    }
    //强制初始化
    Player.prototype = {
        constructor: Player,
        musicList: [],
        init: function($audio){
            this.$audio = $audio;//jQuery包装好的对象
            this.audio = $audio.get(0);//获取原生的li
        },
        currentIndex: -1,
        playMusic: function (index,music){
            //判断是否是在同一首歌上点击
            if (this.currentIndex == index)
            {
                //同一首歌已暂停情况下
                if(this.audio.paused)
                {
                    this.audio.play();
                } else {
                    //同一首歌已播放情况下
                    this.audio.pause();
                }
            } else {
                //不同歌曲
                this.$audio.attr("src",music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        //将第一首的上一首定位到最后一首
        preIndex: function(){
            var index = this.currentIndex-1;
            if (index<0)
                index = this.musicList.length-1;
            return index;
        },
        //将最后一首的上一首定位到第一首
        nextIndex: function(){
            var index = this.currentIndex+1;
            if (index>this.musicList.length-1)
                index = 0;
            return index;
        },
        //在musicList数组中删除所选歌曲
        changeMusic: function(index){
            //根据索引删除
            this.musicList.splice(index,1);
            
            //判断当前删除的音乐是否是在当前播放音乐的前面
            if(index < this.currentIndex)
            {
                this.currentIndex = this.currentIndex-1;
            }
        },
        //获取下面进度条时间设置 使用回调函数传数据
        musicTimeUpdate: function(callBack){
            var $this = this;
            this.$audio.on("timeupdate",function(){
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.formatDate(currentTime,duration);
                callBack(currentTime,duration,timeStr);
            });
        },
        //创建一个格式化时间的方法
        formatDate: function(currentTime,duration){
            var endMin = parseInt(duration/60);
            var endSec = parseInt(duration%60);
            if (endMin<10)
                endMin = "0" + endMin;
            if (endSec<10)
                endSec = "0" + endSec;

            var startMin = parseInt(currentTime/60);
            var startSec = parseInt(currentTime%60);
            if (startMin<10)
                startMin = "0" + startMin;
            if (startSec<10)
                startSec = "0" + startSec;

            return startMin+":"+startSec+" / "+endMin+":"+endSec;
        },
        //根据传过来的值改变歌曲正在播放的位置
        musicSeekTo: function(value){
            if (isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        //设置音量的大小
        musicVoiceSeekTo: function(value){
            if (isNaN(value)) return;
            /*if (value<0 || value>=1) return;*/
            //范围0~1
            this.audio.volume = value;
        }
    }
    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);/*window将闭包中的数据传递给外部*/










