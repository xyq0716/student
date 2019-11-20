(function(){
    function TurnPage(options){
        this.wrap = options.wrap;
        this.curPage = options.curPage || 1;
        this.allPage = options.allPage || 1;
        this.changePage = options.changePage || function(){};

        if(this.curPage > this.allPage){
            alert('请输入正确页码');
            return false;
        }

        this.fillHTML();
        this.bindEvent();
    }
    
    TurnPage.prototype.fillHTML = function(){
        $(this.wrap).empty();
        //添加上一页按钮
        if(this.curPage > 1){
            $(this.wrap).append('<li class="prev-page">上一页</li>');
        }else{
            $(this.wrap).remove('.prev-page');
        }

        //填充中间页
        //添加第一页———— 当前页不为第一页且与前两页之差>2
        if(this.curPage != 1 && this.curPage - 2 > 1){
            $('this.wrap').append('<li class="tab-number">1</li>');
        }

        //添加前省略号———— 当前页数与第一页相差两页以上
        if(this.curPage - 2 > 2){
            $(this.wrap).append('<span>...</span>');
        }

        //填充中间页———— 渲染当前页的左右两页
        for(var i = this.curPage-2; i <= this.curPage+2; i++){
            if(i > 0 && i <= this.allPage){
                var oLi = $('<li class="tab-number">'+ i + '</li>');
                if(i == this.curPage){
                    oLi.addClass('cur-page');
                }
                $(this.wrap).append(oLi);
            }
        }

        //添加后省略号———— 当前页数与最后一页相差三页以上
        if(this.allPage - this.curPage > 3){
            $(this.wrap).append('<span>...</span>');
        }

        //添加最后一页
        if(this.curPage + 2 < this.allPage){
            $(this.wrap).append('<li class="tab-number">' + this.allPage +'</li>');
        }

        //添加下一页按钮
        if(this.curPage < this.allPage){
            $(this.wrap).append('<li class="next-page">下一页</li>');
        }else{
            $(this.wrap).remove('.next-page');
        }
    } 

    TurnPage.prototype.bindEvent = function(){
        var self = this;

        $('.prev-page',this.wrap).click(function(){
            self.curPage --;
            self.change();
        });

        $('.next-page',this.wrap).click(function(){
            self.curPage ++;
            self.change();
            //页面重构，重新绑定事件
        });

        $('.tab-number').click(function(){
            var curPage = parseInt($(this).text()); //获取点击页码的内容（字符串——'数字'）
            self.curPage = curPage;
            self.change();
        });
    }

    TurnPage.prototype.change = function(){
        this.fillHTML();
        this.bindEvent(); //先重构完成页面后再绑定事件
        this.changePage(this.curPage);
    }

    $.fn.extend({
        turnPage:function(options){
            options.wrap = this;
            new TurnPage(options);
            return this;
        }
    });
}())