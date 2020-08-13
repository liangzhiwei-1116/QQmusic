$(function(){
    
    //自定义滚动条
    $(".content_list").mCustomScrollbar();
    
    //找到歌曲标签
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
    
    //利用ajax加载歌曲列表
    getPlayerList();
    function getPlayerList(){
        $.ajax({
            //调用地址
            url:"./source/musiclist.json",
            //数据类型
            dataType:"json",
            //返回调用结果
            success: function(data){
                player.musicList = data;
                //遍历获取到的数据 创建歌单
                var $musicList = $(".content_list ul");
                $.each(data,function(index,ele){
                    var $item = createMusicItem(index,ele);
                    $musicList.append($item);
                });
//              initMusicInfo(data[0]);
//              initMusicLyric(data[0]);
            },
            error: function(e){
            console.log(e);
            }
        });
    }
    
    //初始化页面布局
    function initMusicInfo(music){
        //获取对应的元素
        var $musicImage = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAblum = $(".song_info_ablum a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".mask_bg");
        
        //给获取到的元素赋值
        $musicImage.attr("src",music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAblum.text(music.ablum);
        $musicProgressName.text(music.name+" / "+music.singer);
        $musicProgressTime.text("00:00 / " + music.time);
        $musicBg.css("background","url('"+music.cover+"')");
    }
    
    //初始化歌词信息
    function initMusicLyric(music){
        lyric = new Lyric(music.link_lrc);
        var $lryicContainer = $(".song_lyric");
        //清空上一首歌的数据
        $lryicContainer.html("");
        lyric.LoadLyric(function(){
            //传将歌词列表
            $.each(lyric.lyrics,function(index,ele){
                var $item = $("<li>"+ele+"</li>");
                $lryicContainer.append($item);
            });
        });
    }
    
    //初始化进度条
    initProgress();
    function initProgress(){
        //找到进度条
        var $progressBar = $(".music_progress_bar");
        var $progressLine = $(".music_progress_line");
        var $progressDot = $(".music_progress_dot");
        progress = Progress($progressBar,$progressLine,$progressDot);
        progress.progressClick(function(value){
            player.musicSeekTo(value);
        });
        progress.progressMove(function(value){
            player.musicSeekTo(value);
        });

        //找到音量控制条
        var $voiceBar = $(".music_voice_bar");
        var $voiceLine = $(".music_voice_line");
        var $voiceDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceBar,$voiceLine,$voiceDot);
        voiceProgress.progressClick(function(value){
            player.musicVoiceSeekTo(value);
        });
        voiceProgress.progressMove(function(value){
            player.musicVoiceSeekTo(value);
        });
    }
    
    //初始化事件监听
    initEvents();
    function initEvents(){
        //监听歌单中鼠标移入移出的操作 显示menu 隐藏时长
        //动态创建歌单后使用事件委托帮助创建
        $(".content_list").delegate(".list_music","mouseenter",function(){
            $(this).find(".list_menu").stop().fadeIn(1);
            $(this).find(".list_time span").stop().fadeOut(1);
            $(this).find(".list_time a").stop().fadeIn(1);
            $(this).find("div").css("color","#fff");
        });
        $(".content_list").delegate(".list_music","mouseleave",function(){
            $(this).find(".list_menu").stop().fadeOut(1);
            $(this).find(".list_time a").stop().fadeOut(1);
            $(this).find(".list_time span").stop().fadeIn(1);
            $(this).find("div").css("color","rgba(255,255,255,0.5)");
        });
        
        //给歌曲添加选择操作
        $(".content_list").delegate(".list_check","click",function(){
            $(this).toggleClass("list_checked");
        });
        
        //添加播放按钮的点击
        var $musicPlay = $(".music_play");
        $(".content_list").delegate(".list_menu_play","click",function(){
            var $item = $(this).parents(".list_music");
            $(this).toggleClass("list_menu_play2");
            //让其他歌曲处于暂停状态
            $(this).parents(".list_music").siblings().find(".list_menu_play")
            .removeClass("list_menu_play2");
            //同步底部播放按钮
            if($(this).attr("class").indexOf("list_menu_play2") != -1)
            {
                //底部按钮为播放状态
                $musicPlay.addClass("music_play2");
                //让文字高亮
                $item.find("div").css("color","#fff");
                $item.siblings().find("div").css("color","rgba(255,255,255,0.5)");
                $item.find(".list_number").addClass("list_number2");
                $item.siblings().find(".list_number").removeClass("list_number2");
            } else {
                //底部按钮为暂停状态
                $musicPlay.removeClass("music_play2");
                $item.find("div").css("color","rgba(255,255,255,0.5)");
                $item.find(".list_number").removeClass("list_number2");
            }
            
            //播放歌曲&&歌曲信息
            player.playMusic($item.get(0).index,$item.get(0).music);
            initMusicInfo($item.get(0).music);
            //切换歌词信息
            initMusicLyric($item.get(0).music);
        });
        
        //监听底部上一首 暂停 下一首三个按钮的点击
        $(".music_play").click(function(){
        //判断是否播放过音乐
            if (player.currentIndex==-1)
            {
                $(".list_music").eq(0).find(".list_menu_play").trigger("click");
            } else {
                $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
            }
        });
        $(".music_pre").click(function(){
            $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click"); 
        });
        $(".music_next").click(function(){
            $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");   
        });
        
        //监听歌曲中删除按钮的点击
        $(".content_list").delegate(".list_menu_del","click",function(){
            /*console.log(player.currentIndex);*/
            var $item = $(this).parents(".list_music");
            
            //判断当前删除歌曲是否正在播放
            if($item.get(0).index == player.currentIndex)
            {
                $(".music_next").trigger("click");
            }
            
            $item.remove();
            
            //在后台数据列表中删除&&重新排序
            player.changeMusic($item.get(0).index);
            $(".list_music").each(function(index,ele){
                ele.index = index;
                $(ele).find(".list_number").text(index+1);
            })
        });
        
        //监听顶部删除按钮的点击 删除选中的歌曲
        $(".content_del").click(function(){
            $(".content_list ul li").each(function(){
                var $item = $(this).find(".list_checked");
                $item.parents(".list_music").find(".list_menu_del").trigger("click");
            });
        });
        
        //监听清空列表按钮的点击
        $(".content_empty").click(function(){
            $(".list_music").remove();
        });
        
        //监听我喜欢的按钮点击
        $(".music_fav").click(function(){
            $(".music_fav").toggleClass("music_fav2");
        });
        
        //监听纯净模式的按钮点击
        $(".music_only").click(function(){
            $(".music_only").toggleClass("music_only2");
        });
        
        //播放模式的点击
        $(".music_mode").click(function(){
            $(".music_mode").toggleClass("music_mode4");
        });
        
        //创建播放歌曲与下面的时间和进度条的同步
        player.musicTimeUpdate(function(currentTime,duration,timeStr){
            //同步时间
            if (timeStr!="00:00 / NaN:NaN")
            {
                $(".music_progress_time").text(timeStr);
            }
            //播放完毕根据播放模式选择播放歌曲
            if (currentTime==duration)
            {
                mode_play();
            }
            //同步进度条
            var value = 100*currentTime/duration;
            progress.setProgress(value);
            //实现歌词的同步
            var index = lyric.currentIndex(currentTime);
            var $item = $(".song_lyric li").eq(index);
            $item.addClass("cur");
            $item.siblings().removeClass("cur");
            if (index<=2) return;
            $(".song_lyric").css({
                marginTop: (-index+2)*30
            })
        });
        
        //监听声音按钮的点击
        $(".music_voice_icon").click(function(){
            //图标切换
            $(this).toggleClass("music_voice_icon2");
            //声音切换
            if ($(this).attr("class").indexOf("music_voice_icon2")!=-1)
            {
                //变为没有声音
                player.musicVoiceSeekTo(0);
            } else {
                //变为有声音
                player.musicVoiceSeekTo(1);
            }
        })
    }
  
    //定义播放模式的方法
    function mode_play(){
        if ($("#musicmode").attr("class").indexOf("music_mode4")!=-1)
        {
            $(".music_next").trigger("click");
            $(".music_pre").trigger("click");
        } else {
            $(".music_next").trigger("click");
        }
    }
    
    //定义歌单中的每一条li
    function createMusicItem(index,music){
        var $item = $("<li class=\"list_music\"><div class=\"list_check\" id=\"listcheck\"><i></i></div><div class=\"list_number\">"+(index+1)+"</div><div class=\"list_name\">"+music.name+"<div class=\"list_menu\"><a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a><a href=\"javascript:;\" title=\"添加\"></a><a href=\"javascript:;\" title=\"下载\"></a><a href=\"javascript:;\" title=\"分享\"></a></div></div><div class=\"list_singer\">"+music.singer+"</div><div class=\"list_time\"><span>"+music.time+"</span><a href=\"javascript:;\" class=\"list_menu_del\" title=\"删除\"></a></div></li>");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }
});











