(function(window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    //强制初始化
    Lyric.prototype = {
        constructor: Lyric,
        init: function(path){
            this.path = path;
        },
        times: [],
        lyrics: [],
        index: -1,
        LoadLyric: function(callBack){
            var $this = this;
            $.ajax({
                //调用地址
                url: $this.path,
                //数据类型
                dataType:"text",
                //返回调用结果
                success: function(data){
//                  console.log(data);
                    $this.parseLyric(data);
                    callBack();
                },
                error: function(e){
                    console.log(e);
                }
            });
        },
        parseLyric: function(data){
            var $this = this;
            //初始化两个数组信息
            $this.times = [];
            $this.lyrics = [];
            var array = data.split("\n");
            //正则表达式取出歌词对应的时间
            var timeReg = /\[(\d*:\d*\.\d*)\]/
            //遍历取出每一条歌词
            $.each(array,function(index,ele){
                //处理歌词
                var lrc = ele.split("]")[1];
                if (lrc.length==1) return true;/*排除空字符串*/
                $this.lyrics.push(lrc);
                //处理歌词
                var res = timeReg.exec(ele);
//              console.log(res);
                if (res==null) return true;
                var timeStr = res[1];
                var res2 = timeStr.split(":");
                var min = parseInt(res2[0])*60;
                var sec = parseFloat(res2[1]);
                var time = parseFloat(Number(min+sec).toFixed(2));
//              console.log(time);
                $this.times.push(time);
            });
        },
        currentIndex: function(currentTime){
//          console.log(currentTime);
            //根据目前实践判断是否是当前歌词
            if (currentTime >= this.times[0]){
                this.index++;
                this.times.shift();//删除数组最前面的一个元素
            }
            return this.index;
        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);/*window将闭包中的数据传递给外部*/










