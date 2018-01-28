var moka = {
};
Math.easeout = function (A, B, rate, callback) {
    if (A == B || typeof A != 'number') {
        return;    
    }
    B = B || 0;
    rate = rate || 2;
    
    var step = function () {
        A = A + (B - A) / rate;
        if(Math.abs(A-B) < 1){
            callback(B, true);
            return;
        }
        callback(A, false);
        requestAnimationFrame(step);    
    };
    step();
};
var util = {
	formatIndex : function(index){
		return parseInt(index, 10) + 1;
	},
	loadingPanel : '<div id="loading_panel" class="weui_loading_toast" style="display:none;"><div class="weui_mask_transparent"></div><div class="weui_toast"><div class="weui_loading"><div class="weui_loading_leaf weui_loading_leaf_0"></div><div class="weui_loading_leaf weui_loading_leaf_1"></div><div class="weui_loading_leaf weui_loading_leaf_2"></div><div class="weui_loading_leaf weui_loading_leaf_3"></div><div class="weui_loading_leaf weui_loading_leaf_4"></div><div class="weui_loading_leaf weui_loading_leaf_5"></div><div class="weui_loading_leaf weui_loading_leaf_6"></div><div class="weui_loading_leaf weui_loading_leaf_7"></div><div class="weui_loading_leaf weui_loading_leaf_8"></div><div class="weui_loading_leaf weui_loading_leaf_9"></div><div class="weui_loading_leaf weui_loading_leaf_10"></div><div class="weui_loading_leaf weui_loading_leaf_11"></div></div><p class="weui_toast_content">数据加载中</p></div></div>',
	showLoading : function(msg){
		var $loadingPanel = $('#loading_panel');
		if($loadingPanel.length == 0){
			$('body').append(util.loadingPanel);
			$loadingPanel = $('#loading_panel');
		}
		if(msg){
			$loadingPanel.find('.weui_toast_content').text(msg);
		}
		$loadingPanel.show();
	},
	closeLoading : function(){
		var $loadingPanel = $('#loading_panel');
		if($loadingPanel.length == 0){
			$('body').append(util.loadingPanel);
			$loadingPanel = $('#loading_panel');
		}
		$loadingPanel.hide();
		$loadingPanel.find('.weui_toast_content').text('数据加载中');
	},
	date : {
		format : function(longTime){
			var date = new Date(longTime);

			var Year= date.getFullYear();//ie火狐下都可以 
			var Month= date.getMonth()+1; 
			var Day = date.getDate(); 
			var Hour = date.getHours(); 
			var Minute = date.getMinutes(); 
			var Second = date.getSeconds(); 

			if (Month < 10 ) { 
				Month = "0" + Month; 
			} 
			if (Day < 10 ) { 
				Day = "0" + Day; 
			}
			if (Hour < 10 ) { 
				Hour = "0" + Hour; 
			} 
			if (Minute < 10 ) { 
				Minute = "0" + Minute; 
			} 
			if (Second < 10 ) { 
				Second = "0" + Second; 
			}  

			var CurrentDate = Year + '-' + Month + '-' + Day + ' ' + Hour + ':' + Minute + ':' + Second;

			return CurrentDate;
		}
	},
	randomNum : function(Min, Max) {
		var Range = Max - Min;   
	    var Rand = Math.random();   
	    return(Min + Math.round(Rand * Range));   
	}
};
juicer.register('formatIndex', util.formatIndex);
juicer.register('formatDate', util.date.format);
