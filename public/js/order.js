(function(P){
	var _this = null;
	_this = P.order = {
    tpl : {},
		init : function(){
      _this.animalTpl = juicer($('#animal-tpl').html());
			_this.initData();
			_this.initEvent();

      // _this.currIndex = 1;
      var $animal = $('.avatar-box').eq(0);
      $animal.addClass('active');
      _this.loadAnimal(1);
		},
		initData : function(){
      $('#wrapper').on('tap', '.avatar-box', function(){
        var $this = $(this);
        var index = parseInt($this.attr('data-index')) + 1;
        var json = $this.attr('data-json');
        var animal = JSON.parse(json);
        $this.addClass('active').siblings('.avatar-box').removeClass('active');
        _this.loadAnimal(index);
      })
		},
		initEvent : function(){
      $('#wrapper').on('click', '.btn-start', function(){
      });
    },
    loadAnimal : function(index){
      if(!_this.currIndex){
        
      }else{
        if(index > _this.currIndex){
          $('.prevv').remove();
          $('.prev').removeClass('prev').addClass('prevv');
          $('.current').removeClass('current').addClass('prev').html('');
          $('.next').removeClass('next').addClass('current');
          $('.nextt').removeClass('nextt').addClass('next');
          $('.next').after('<div class="animal-view nextt"></div>');
        }else{
          $('.nextt').remove();
          $('.next').removeClass('next').addClass('nextt');
          $('.current').removeClass('current').addClass('next').html('');
          $('.prev').removeClass('prev').addClass('current');
          $('.prevv').removeClass('prevv').addClass('prev');
          $('.prev').before('<div class="animal-view prevv"></div>');
        }
      }
      _this.currIndex = index;
      var $animal = $('.avatar-box').eq(parseInt(index) - 1);
      var aindex = parseInt($animal.attr('data-index')) + 1;
      var json = $animal.attr('data-json');
      var animal = JSON.parse(json);
      animal.index = aindex;
      var html = _this.animalTpl.render(animal);
      $('.animal-view.current').html(html);
      console.log(animal);
    }
	};
}(moka));