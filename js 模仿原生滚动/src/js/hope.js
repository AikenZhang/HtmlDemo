function Hope(){
    var me=this;
    this.scroll={
            _bodyTarget:null,//scroll 舒适化target
            _start:0,   //移动初始位置
            _move:0,    //移动中间位置
            _end:0,     //移动末尾位置
            _speed:5,   //
            _scrollY:0,//记录总共滚动的距离
            _getBodyTargetHeight:function(target){
                return this._bodyTarget.scrollHeight || target.body.scrollHeight ||0;
            },
            _getMaxScroll:function(){
                return (this._getBodyTargetHeight()-screen.height) || 0;
            },
            init:function(target){
                let self=this;
                self._bodyTarget=target.body;
                //禁止body的touchmove默认事件 解决浏览器上下滑动问题
                document.querySelector("body").addEventListener("touchmove",function(e){
                    e.preventDefault();
                })
                //添加touchStart事件
                target.body.addEventListener("touchstart",function(e){
                    self._start=e.touches[0].clientY;
                    e.preventDefault();
                })
                //添加touchMove 事件
                self._bodyTarget.addEventListener("touchmove",function(e){
                    console.log(e);
                   let moveY;
                   move=e.touches[0].clientY;
                   moveY=self._scrollY+(move-self._start);
                   if(moveY<=0 && (-moveY)<=self._getMaxScroll()){
                    requestAnimFrame(function(){
                        me.setAttribute(self._bodyTarget,"style",{
                            transform:"translate3d(0,"+moveY+"px,0)"
                        })
                    })
                   }else{
                       //滚动到最顶部时状态归零
                       if(moveY>0){
                        self._scrollY=0;
                        requestAnimFrame(function(){
                            me.setAttribute(self._bodyTarget,"style",{
                                transform:"translate3d(0,0px,0)"
                            })
                        })
                       }
                       //移动到最底部  状态锁定
                       
                       else if(-(moveY)>self._getMaxScroll()){
                            self._scrollY=-self._getMaxScroll();
                       }
                      
                   }
                   e.preventDefault();
                })
                //添加touched事件
                self._bodyTarget.addEventListener("touchend",function(e){
                    self._end=e.changedTouches[0].clientY;
                    self._scrollY+=self._end-self._start;
                    e.preventDefault();
                })
            }
        }
}
Hope.prototype.setAttribute=function(target,attr,val){
    let qz=["","-webkit-","-ms-","-moz-","-o-"];
    let newVal="";
    if(typeof val=="object"){
        qz.forEach(function(item,index){
            for(let c in val){
                newVal+=item+c+":"+val[c]+";"
            }
        })
        target.setAttribute(attr,newVal);
        return;
    }
   target.setAttribute(attr,val);
}
Hope.prototype.getTouchY=function(touches){
    switch (touches.length){
        case 0: return null;break;
        case 1: return touches[0];
    }
}
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       || 
            window.webkitRequestAnimationFrame || 
            window.mozRequestAnimationFrame    || 
            window.oRequestAnimationFrame      || 
            window.msRequestAnimationFrame     || 
            function( callback ){
              let setId=window.setTimeout(callback, 1000 / 60);
              return setId;
            };
  })();
