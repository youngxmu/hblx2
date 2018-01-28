var cityData = [
  {city: '武汉',leader : '省委副书记、武汉市委书记陈一新',pos:{x:4.55,y:5.5}},
  {city: '黄石',leader : '黄石市委书记周先旺',pos:{x:5.25,y:6.3}},
  {city: '十堰',leader : '十堰市委书记张维国',pos:{x:2,y:4.1}},
  {city: '宜昌',leader : '省委常委、宜昌市委书记周霁',pos:{x:2.1,y:5.65}},
  {city: '襄阳',leader : '襄阳市委书记李乐成',pos:{x:2.75,y:4.45}},
  {city: '鄂州',leader : '鄂州市委书记李兵',pos:{x:4.8,y:6}},
  {city: '荆门',leader : '荆门市委书记别必雄',pos:{x:3.25,y:5.2}},
  {city: '孝感',leader : '孝感市委书记陶宏',pos:{x:4.05,y:5.3}},
  {city: '荆州',leader : '荆州市委书记李新华',pos:{x:2.85,y:6.5}},
  {city: '黄冈',leader : '黄冈市委书记刘雪荣',pos:{x:5.25,y:5.4}},
  {city: '咸宁',leader : '咸宁市委书记丁小强',pos:{x:4.5,y:6.6}},
  {city: '随州',leader : '随州市委书记刘晓鸣',pos:{x:3.7,y:4.55}},
  {city: '恩施',leader : '恩施州委书记李建明',pos:{x:0.9,y:6}},
  {city: '仙桃',leader : '仙桃市委书记胡玖明',pos:{x:4,y:6.2}},
  {city: '潜江',leader : '潜江市委书记胡功民',pos:{x:3.3,y:5.95}},
  {city: '天门',leader : '天门市委书记吴锦 ',pos:{x:3.65,y:5.6}},
  {city: '神农架',leader : '神农架林区党委书记周森锋',pos:{x:1.9,y:4.9}}
];

var scoreData = [
  {
    name: '经济发展',
    msgs : ['还可以更好！加油，','还有较大发展空间，','取得了较大进步，','取得的成就有目共睹，这几年工资涨了不少，']
  },
  {
    name: '文化、教育',
    msgs : ['事业发展进步很大，继续努力，','事业发展水平取得重大进展，','事业蓬勃发展，孩子不愁没学上，老人闲暇生活丰富，','事业繁荣发展，希望能带给我们更多惊喜，']
  },
  {
    name: '医疗保障',
    msgs : ['体系逐步完善，继续加油，','体系得到多方面的完善，保障水平稳步提升，','制度越来越完善，就医越来越方便，','制度健全，现在不出社区都能看病了，']
  },
  {
    name: '扶贫惠农',
    msgs : ['支持力度越来越大了，','政策补贴力度逐年加大，相信政府能带领我们致富奔小康，','政策落实的到位，不仅有农业补贴，还有技术人员手把手教我，点赞，','政策落实很到位，已经带领我发家致富奔小康了，']
  },
  {
    name: '交通、环境',
    msgs : ['情况还能更好~','情况日益改善！','全面改善，道路通畅许多，天也是蓝蓝的颜色。','有很大改善！交通拥堵之困已不存在，环境也好了，晚上还能看星星~']
  }
];

(function(P){
	var _this = null;
	_this = P.index = {
    tpl : {
      userMsgTpl : juicer('我是${nickname}，我觉得我的老家${city}${ftype}${fmsg}${ltype}${lmsg}总体来说近年来的发展${title}。'),
      replyMsgTpl : juicer('${leader}向你问好，感谢你对家乡建设发展的关心和支持，你反映的问题我们会认真思考，尽力改进！')
    },
		init : function(){
      _this.nickname = $('#nickname').val();
      _this.avatar = $('#avatar').val();
      _this.currIndex = 1;
			_this.initData();
			_this.initEvent();

      // _this.cityIndex = 1;
      // _this.currIndex = 2;
      // _this.next();
		},
		initData : function(){
      var html = '';
      for(var index in cityData){
        var city = cityData[index];
        html += '<span data-index="' + index + '" class="city" style="left:' + city.pos.x + 'rem;top:' + city.pos.y + 'rem;"></span>';
      }
      $('.page2').append(html);

      $('.cursor').each(function(){
        var $cursor = $(this);
        var cursorWidth = $cursor.width();
        var $box = $cursor.parent('div');
        var $bar = $cursor.siblings('.bar');
        var offset = $box.width()/2 - cursorWidth;//_this.endPos.x;// - _this.startPos.x;
        $cursor.css('-webkit-transform', 'translateX('+ offset +'px)');
        $bar.css('width', (offset + cursorWidth) +'px');  
      });
		},
		initEvent : function(){
      $('#wrapper').on('touchstart', function(event){
        //event.preventDefault();
      });

      $('#wrapper').on('touchstart', '.page3 .mail .content', function(event){
        var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
        _this.startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
        _this.isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
        var $mail = $('.mail .content');
        _this.scrollTop = $mail[0].scrollTop;
      });

      $('#wrapper').on('touchmove', '.page3 .mail .content', function(event){
        if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        var touch = event.targetTouches[0];
        _this.endPos = {x:touch.pageX - _this.startPos.x,y:touch.pageY - _this.startPos.y};

        isScrolling = Math.abs(_this.endPos.x) < Math.abs(_this.endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
        if(isScrolling === 0){
            event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
        }

        var $mail = $('.mail .content');
        var mailHeight = $mail.height();
        var $img = $mail.find('img');
        var imgHeight = $img.height();
        if(imgHeight < mailHeight){
          return;
        }

        var currScrollTop = _this.scrollTop - _this.endPos.y;//向下拖动
        //向上拖动_this.endPosY 会是正数
        // console.log(currScrollTop);
        var imgTop = $img.offset().top;
        var scrollTop = $mail[0].scrollTop;
        var end = scrollTop + mailHeight;
        
        console.log(end + ' ' + (imgHeight-1));
        if(end <= imgHeight + 1){
          console.log(end + ' ' + (imgHeight-1));
          $mail[0].scrollTop = currScrollTop;
          // Math.easeout($mail[0].scrollTop, currScrollTop , 4, function (value, isEnding) {
          //     // console.log(doc.scrollTop + ' ' +  scrollTop + ' '  +isEnding);
          //     $mail[0].scrollTop = value;
          //     return false;
          // });
        }
      });

      $('#wrapper').on('touchstart', '.p13', _this.next);

      $('#wrapper').on('touchstart', '.city', function(){
        var index = $(this).attr('data-index');
        _this.cityIndex = index;
        var cityIndex = parseInt(_this.cityIndex) + 1;
        $('.page3 .mail .content').append('<img src="img/mail/' + cityIndex + '.jpg" >');
        $('#bgm').remove();
        $('body').append('<audio src="http://act.cnhubei.com/static/hblx2/mp3/'+ cityIndex +'.mp3" id="bgm" style="display:none;" autoplay="autoplay" ></audio>')
        $('#bgm')[0].addEventListener('ended', function () {  
          $('#btn_music').removeClass('rotate');
        }, false);
        $('#bgm')[0].play();
        // $('#btn_music').show();
        $('.page3 img').attr('src', 'img/mail/' + cityIndex + '.jpg')
        $('.page4 img').attr('src', 'img/paper/' + cityIndex + '.jpg')
        _this.next();
      });

      $('#wrapper').on('touchstart', '.btn-open', function(){
        $(this).hide();
        $('.page3 .mail img').css('opacity', 1);
        
        $('.mail').css('-webkit-transform', 'translateY(2%)');

        $('.page3 .btn-back').show();
        $('.page3 .move').addClass('on');
      });
      $('#wrapper').on('touchstart', '.btn-score', function(){
        $('.page4 .move').addClass('on');
        _this.next();
      });

      $('#wrapper').on('touchstart', '#btn_music', function(ev){
        if($(this).hasClass('rotate')){
          $(this).removeClass('rotate');
          $('#bgm')[0].pause();
        }else{
          $(this).addClass('rotate');
          $('#bgm')[0].play();
        }
      });

      $('#wrapper').on('touchstart', '.cursor', function(event){
        var $cursor = $(this);
        var touch = event.targetTouches[0];     //touches数组对象获得屏幕上所有的touch，取第一个touch
        _this.startPos = {x:touch.pageX,y:touch.pageY,time:+new Date};    //取第一个touch的坐标值
        _this.isScrolling = 0;   //这个参数判断是垂直滚动还是水平滚动
      });

      $('#wrapper').on('touchmove', '.cursor', function(event){
        if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
        var touch = event.targetTouches[0];
        _this.endPos = {x:touch.pageX - _this.startPos.x,y:touch.pageY - _this.startPos.y};

        isScrolling = Math.abs(_this.endPos.x) < Math.abs(_this.endPos.y) ? 1:0;    //isScrolling为1时，表示纵向滑动，0为横向滑动
        if(isScrolling === 0){
            event.preventDefault();      //阻止触摸事件的默认行为，即阻止滚屏
        }

        var $cursor = $(this);
        var cursorWidth = $cursor.width();
        var $box = $cursor.parent('div');

        var $bar = $cursor.siblings('.bar');
        var offset = touch.pageX - $box.offset().left;//_this.endPos.x;// - _this.startPos.x;

        if(offset > $box.width() - cursorWidth || offset < 0){
          return;
        }
        $cursor.css('-webkit-transform', 'translateX('+ offset +'px)');
        $bar.css('width', (offset + cursorWidth) +'px');
      });

      $('#wrapper').on('touchstart', '.p41', _this.commit);

      $('#wrapper').on('touchstart', '.btn-send', function(){
        $(this).addClass('active');
        $('.page5 .p2').css('opacity', 1);
      });

      $('#wrapper').on('touchstart', '.btn-share', function(){
        $('#share_panel').addClass('on').removeClass('off');
      });
      $('#share_panel').on('touchstart', function(){
        $('#share_panel').addClass('off').removeClass('on');
      });

      $('#wrapper').on('touchstart', '.btn-back', function(){
        _this.cityIndex = '';
        _this.currIndex = 1;

        $('.btn-open').show();
        $('.page3 .mail .content img').remove();
        
        $('.mail').css('-webkit-transform', 'translateY(69%)');
        $('.page3 .move').removeClass('on');
        $('.page4 .move').removeClass('on');
        $('#bgm')[0].pause();
        $('#bgm').remove();
        _this.next();
      });

      $('#wrapper').on('touchstart', '.btn-paper', function(){
        var cityIndex = parseInt(_this.cityIndex) + 1;
        window.location.href = 'index/tm?city=' + cityIndex;
      });
    },
    next : function(){
      _this.currIndex++;
      var index = _this.currIndex;
      for(var i=1;i<6;i++){
        $('.page' + i).css('-webkit-transform', 'translateX('+ (i-index)*100 +'%)');
      }
    },
    commit : function(){
      var maxIndex = 0;
      var maxScore = 0;
      var minIndex = 4;
      var minScore = 4;
      _this.totalScore = 0;//全局变量
      $('.score-panel li').each(function(index){
        var $cursor = $(this).find('.cursor');
        var $box = $cursor.parent('div');
        var $bar = $cursor.siblings('.bar');
        var rate = $bar.width()/$box.width();
        var score = 0;
        if(rate > 0.95){
          score = 4;
        }else if(rate > 0.75){
          score = 3;
        }else if(rate > 0.5){
            score = 2;
        }else if(rate > 0.25){
            score = 1;
        }
        if(score > maxScore){
          maxIndex = index;
          maxScore = score;  
        }

        if(score < minScore){
          minIndex = index;
          minScore = score;  
        }
        _this.totalScore += score;
      });
      var city = cityData[_this.cityIndex];
      var cityName = city.city;
      var ftype = scoreData[maxIndex].name;
      var fmsg = scoreData[maxIndex].msgs[maxScore];
      var ltype = scoreData[minIndex].name;
      var lmsg = scoreData[minIndex].msgs[minScore];
      
      var score = moka.index.totalScore;
      if(score){
        var title = '还需加油';
        if(score > 0){
          title = '日新月异';
        }
        if(score > 4){
          title = '蒸蒸日上';
        }
        if(score > 8){
          title = '十分给力';
        }
        if(score > 12){
          title = '前景辉煌';
        }
        _this.title = title;
        console.log(_this.title);
      }


      var userMsg = _this.tpl.userMsgTpl.render({
        nickname : _this.nickname,
        city : cityName,
        ftype : ftype,
        fmsg : fmsg,
        ltype : ltype,
        lmsg : lmsg,
        title : _this.title
      });

      var replyMsg = _this.tpl.replyMsgTpl.render({
        leader : city.leader
      });
      
      $('.page5 .p1 .content').html(userMsg);
      $('.page5 .p2 .content').html(replyMsg);
      _this.next();
    }
	};
}(moka));

// var cityData = {
//   '武汉': {city: '武汉市',leader : '陈一新',pos:{x:4.75,y:4.35}},
//   '黄石': {city: '黄石市',leader : '周先旺',pos:{x:5.15,y:8.85}},
//   '十堰': {city: '十堰市',leader : '张维国',pos:{x:0.4,y:4.7}},
//   '宜昌': {city: '宜昌市',leader : '周霁',pos:{x:1.56,y:7.94}},
//   '襄阳': {city: '襄阳市',leader : '李乐成',pos:{x:1.6,y:4.05}},
//   '鄂州': {city: '鄂州市',leader : '李兵',pos:{x:4.95,y:5}},
//   '荆门': {city: '荆门市',leader : '别必雄',pos:{x:3.1,y:4.85}},
//   '孝感': {city: '孝感市',leader : '陶宏',pos:{x:4.05,y:3.5}},
//   '荆州': {city: '荆州市',leader : '李新华',pos:{x:1.55,y:8.65}},
//   '黄冈': {city: '黄冈市',leader : '刘雪荣',pos:{x:5.15,y:5.7}},
//   '咸宁': {city: '咸宁市',leader : '丁小强',pos:{x:4.45,y:8.2}},
//   '随州': {city: '随州市',leader : '刘晓鸣',pos:{x:3.3,y:4.15}},
//   '恩施': {city: '恩施州',leader : '李建明',pos:{x:0.25,y:8.55}},
//   '仙桃': {city: '仙桃市',leader : '胡玖明',pos:{x:3.9,y:9.35}},
//   '潜江': {city: '潜江市',leader : '胡功民',pos:{x:2.85,y:8.05}},
//   '天门': {city: '天门市',leader : '吴锦 ',pos:{x:3.1,y:8.75}},
//   '神农架': {city: '神农架林区',leader : '周森锋',pos:{x:0.2,y:5.5}}
// };