var utils = require("../lib/utils.js");
var redisUtils = require("../lib/redisUtils.js");

var defaultMsgs = [
	{
		p : 'http://images.liqucn.com/img/h1/h974/img201709251043530_info300X300.jpg',
		t : '必须满分！'
	},
	{
		p : 'http://img5.imgtn.bdimg.com/it/u=3176884911,2166115758&fm=27&gp=0.jpg',
		t : '666!'
	},
	{
		p : 'http://wx.qlogo.cn/mmopen/1TKMRBgMD6d5fR0wbhe5QGhicQRCowJq7GldgtuPfKPoLN02fUFOPnIoEYPkSzoicAHViaKy4TABKsBvGWiciaBSgqb4Dfeyzbgce/0',
		t : '露从今夜白，月是故乡明，为家乡打call！'
	},
	{
		p : 'http://img5.imgtn.bdimg.com/it/u=3259199518,756285691&fm=27&gp=0.jpg',
		t : '撒花撒花！'
	},
	{
		p : 'http://img0.imgtn.bdimg.com/it/u=3749313896,3845161526&fm=27&gp=0.jpg',
		t : '加油啊，家乡！'
	},
	{
		p : 'http://img0.imgtn.bdimg.com/it/u=801756313,1418308637&fm=27&gp=0.jpg',
		t : '就这样被你征服！'
	},
	{
		p : 'http://img2.imgtn.bdimg.com/it/u=4118388774,2466537492&fm=27&gp=0.jpg',
		t : '开挂的家乡，大写的服气！'
	},
	{
		p : 'http://img3.imgtn.bdimg.com/it/u=980781867,1210008246&fm=27&gp=0.jpg',
		t : '棒棒哒！'
	},
	{
		p : 'http://img1.imgtn.bdimg.com/it/u=1780056680,2721883533&fm=27&gp=0.jpg',
		t : '不能太骄傲哦！'
	},
	{
		p : 'http://img5.imgtn.bdimg.com/it/u=1550250258,1113748877&fm=27&gp=0.jpg',
		t : '无条件支持家乡！'
	},
	{
		p : 'http://img1.imgtn.bdimg.com/it/u=1138659146,799893005&fm=27&gp=0.jpg',
		t : '我的家乡我说了算~'
	}
];
var msgs = [];
var getDBMsgs = function(openid, callback){
	redisUtils.get('hblx2_' + openid, function(err, reply){
		if(err){
			return callback(err);
		}
		if(!reply){
			reply = '';
		}
		callback(null, reply);
	});
};
    
var setDBMsgs = function(openid, msgs, callback){
	redisUtils.set('hblx2_' + openid, msgs, callback);
};

var getMsgs = function(){
	return defaultMsgs;
};

exports.getMsgs = getMsgs;
exports.getDBMsgs = getDBMsgs;
exports.setDBMsgs = setDBMsgs;