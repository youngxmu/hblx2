(function(P){
	var _this = null;
	_this = P.index = {
		init : function(){
			_this.initEvent();
		},
		initEvent : function(){
      document.addEventListener("WeixinJSBridgeReady", function () { 
          $('#bgm')[0].play();
      }, false); 
      $('#wrapper').on('touchstart', '#btn_music', function(ev){
        if($(this).hasClass('rotate')){
          $(this).removeClass('rotate');
          $('#bgm')[0].pause();
        }else{
          $(this).addClass('rotate');
          $('#bgm')[0].play();
        }
      });
		}  
	};
}(moka));


(function(){
  var currIndex = 0;
  var wrapper = document.getElementById('page_panel');
  var startPos = {x:0,y:0};
  var endPos = {x:0,y:0};
  var length = 6;
  var start = currIndex + 1 - length;

  wrapper.removeEventListener('touchstart',move,false);
  wrapper.removeEventListener('touchmove',move,false);
  wrapper.removeEventListener('touchend',end,false);

  var start = function(event){
    var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
    startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
    isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
    wrapper.addEventListener('touchmove',move,false);
    wrapper.addEventListener('touchend',end,false);
  };
  
  var move = function(event){
      //当屏幕有多个touch或者页面被缩放过，就不执行move操作
      if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
      var touch = event.targetTouches[0];
      endPos = {x:touch.pageX - startPos.x,y:touch.pageY - startPos.y};

      isScrolling = Math.abs(endPos.x) < Math.abs(endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
      // if(isScrolling === 0){
      //     event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
      // }
      event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
  };
  //滑动释放
  var end = function(event){
      var duration = +new Date - startPos.time;    //滑动的持续时间

      if(isScrolling === 1){    //当为竖直滚动时
        if(Number(duration) > 50){     
          //判断是左移还是右移，当偏移量大于10时执行
          if(endPos.y > 50){
            if (currIndex <= 0) {
              return;
            }
            currIndex--;
          }else if(endPos.y < -50){
            if (currIndex >= (length - 1)) {
              return;
            }
            currIndex++;
          }
          for(var index in wrapper.getElementsByTagName('li')){
            var li = wrapper.getElementsByTagName('li')[index];
            if(li.style){
              li.style['-webkit-transform'] = 'translateY('+ (index - currIndex)* 100 + '%' +')'; 
            }
          }
        }
      }
      //解绑事件
      wrapper.removeEventListener('touchmove',move,false);
      wrapper.removeEventListener('touchend',end,false);
      // console.log(currIndex);
      // if(currIndex>=4){
      //   wrapper.removeEventListener('touchstart',start,false);
      // }
  }
  wrapper.addEventListener('touchstart',start,false);



  var t;
  var el = document.createElement('fakeelement');
  var transitions = {
    'OTransition'      :'oTransitionEnd',
    'MSTransition'     :'msTransitionEnd',
    'MozTransition'    :'transitionend',
    'webkitTransition' :'webkitTransitionEnd',
    'transition'       :'transitionEnd'
  }

  var transitionend = 'transitionend';
  for(t in transitions){
    if( el.style[t] !== undefined){
        transitionend = transitions[t];
        break;
    }
  }

  wrapper.getElementsByTagName('li')[0].addEventListener(transitionend,function(event){
    if(event.target.tagName !== 'LI'){
      return;
    }
    for(var index in wrapper.getElementsByTagName('li')){
      var li = wrapper.getElementsByTagName('li')[index];
      if (li.classList) {
        li.classList.remove('current');
        wrapper.getElementsByTagName('li')[currIndex].classList.add('current');
      }
    }
    event.stopPropagation();
  }, true);
  setTimeout(function(){
    wrapper.getElementsByTagName('li')[0].classList.add('current');
  }, 100);
  



  var tojson = function(jsonStr){
    if(!jsonStr)
      return {};
    if(typeof JSON == 'undefined'){
      return eval('(' + jsonStr + ')');
    }else{
      return JSON.parse(jsonStr);
    }
  };
 
  var u = navigator.userAgent, app = navigator.appVersion;
  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
  var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  
  var next = function(){
    if (currIndex >= (length - 1)) {
      return;
    }
    currIndex++;
    for(var index in wrapper.getElementsByTagName('li')){
      var li = wrapper.getElementsByTagName('li')[index];
      if(li.style){
        li.style['-webkit-transform'] = 'translateY('+ (index - currIndex)* 100 + '%' +')'; 
      }
    }
  };
  if (!isAndroid && !isiOS) {
    document.getElementById('wrapper').addEventListener('click',next,false);
  }
}());