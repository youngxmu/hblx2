(function(P){
	var _this = null;
	_this = P.tm = {
    tpl : {
      userMsgTpl : juicer('我是${nickname}，我觉得我的老家${city}${ftype}${fmsg}${ltype}${lmsg}总体来说近年来的发展${title}。'),
      replyMsgTpl : juicer('${leader}向你问好，感谢你对家乡建设发展的关心和支持，你反映的问题我们会认真思考，尽力改进！')
    },
		init : function(){
      _this.nickname = $('#nickname').val();
      _this.avatar = $('#avatar').val();
      _this.msgTpl = juicer($('#msg-tpl').html());
			_this.initEvent();
      _this.loadMsgs();
      weui.searchBar('#searchBar');
      
		},
		initEvent : function(){
      // $('#wrapper').on('touchstart', function(event){
      //   event.preventDefault();
      // });
      $('#wrapper').on('keydown', '#msg_input', function(ev){
        // console.log(ev.keyCode);
        if(ev.keyCode == 13){
          _this.commit();
        }
      });

      $('#wrapper').on('touchstart', '#btn_send', _this.commit);

  
      $('#wrapper').on('touchstart', '#btn_music', function(ev){
        if($(this).hasClass('rotate')){
          $(this).removeClass('rotate');
          $('#bgm')[0].pause();
        }else{
          $(this).addClass('rotate');
          $('#bgm')[0].play();
        }
      });

      $('#wrapper').on('touchstart', '.btn-msg', _this.showInput);
      $('#wrapper').on('touchstart', '.btn-like', _this.like);


      $('#wrapper').on('touchstart', '.btn-share', function(){
        $('#share_panel').addClass('on').removeClass('off');
      });
      $('#share_panel').on('touchstart', function(){
        $('#share_panel').addClass('off').removeClass('on');
      });
    },
    getStyle : function(index){
      // var left = ;
      var top = util.randomNum(1, 3);
      if(top == _this.lastTop){
        top = top - 1;
      }
      _this.lastTop = top;
      top = top * 0.5;
      var transition = 'transform 6s linear ' + index + 's';
      var style = 'top:' + top + 'rem;transition:' + transition;
      return style;
    },
    loadMsgs : function(){
      $.ajax({
        url : 'index/tm',
        type : 'post',
        success : function(result){
          if(result.success){
            var defaultMsgs = result.defaultMsgs;
            // var msgs = result.msgs;
            var html = _this.msgTpl.render({list: defaultMsgs});
            $('.msg-box').append(html);
            setTimeout(function(){
              $('.msg-box li').addClass('flow');
            }, 100);
          }else{
            weui.alert(result.msg);
          }
        }
      });
      _this.msgTpl
    },
    like : function(){
      $('.like-avatar').addClass('pop');
    },
    showInput : function(){
      $('#msg_input').val('');
      $('.msg-input').show();
    },
    commit : function(){
      var msg = $('#msg_input').val();
      $('#msg_input').val('');
      $('.msg-input').hide();
      $.ajax({
        url : 'index/msg',
        type : 'post',
        data : {
          msg : msg
        },
        success : function(result){
          if(result.success){
            var list = result.list;
            var html = _this.msgTpl.render({list: list});
            $('.msg-box').append(html);
            setTimeout(function(){
              $('.msg-box li').addClass('flow');
            }, 100);
          }else{
            return weui.alert(result.msg);
          }
        }
      });
    }
	};
  juicer.register('getStyle', _this.getStyle);
}(moka));
