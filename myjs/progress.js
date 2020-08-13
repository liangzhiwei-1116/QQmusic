(function(window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    //强制初始化
    Progress.prototype = {
        constructor: Progress,
        init: function($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressLine = $progressLine;
            this.$progressDot = $progressDot;
        },
        isMove: false,
        progressClick: function(callBack){
            var $this = this;//此时的this是progress
            //监听背景的点击
            this.$progressBar.click(function(event){
                var normalLeft = $(this).offset().left;//此时的this是$progressBar
                var eventLeft = event.pageX;
                $this.$progressLine.css("width",eventLeft-normalLeft);
                $this.$progressDot.css("left",eventLeft-normalLeft);
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $(this).width();
                callBack(value);
            });
        },
        //监听进度条的拖拽
        progressMove: function(callBack){
            var $this = this;
            //获取默认位置
            var normalLeft = this.$progressBar.offset().left;
            var eventLeft;
            var barWidth = this.$progressBar.width();
            //监听鼠标的按下事件 使用doucument监听
            this.$progressBar.mousedown(function(){
                this.isMove = true;
                //监听进度条拖动的事件 使用doucument监听
                $(document).mousemove(function(event){
                    eventLeft = event.pageX;
                    var differ = eventLeft-normalLeft;
                    if (differ>=0 && differ<barWidth){
                        $this.$progressLine.css("width",differ);
                        $this.$progressDot.css("left",differ);
                    }
                });
            });
            //监听鼠标的抬起事件
            $(document).mouseup(function(){
                $(document).off("mousemove");
                this.isMove = false;
                //计算进度条的比例
                var value = (eventLeft-normalLeft) / $this.$progressBar.width();
                callBack(value);
            });
        },
        setProgress: function(value){
            if (this.isMove) return;
            if(value<0 || value>100)
                return;
            this.$progressLine.css({
                width: value+"%"
            });
            this.$progressDot.css({
                left: value+"%"
            });
        }
    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);/*window将闭包中的数据传递给外部*/