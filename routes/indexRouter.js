var express = require("express");
var config = require("../config");
var userModel = require("../models/userModel");
var utils = require("../lib/utils");
var sysUtils = require("../lib/sysUtils");
var wxUtils = require("../lib/wxUtils");
var redisUtils = require("../lib/redisUtils");
var logger = require("../lib/log").logger("indexRouter");
var router = express.Router();

var murl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxf947d7d09ef1f584&redirect_uri=http%3a%2f%2fact.cnhubei.com%2fhblx2%2findex%2fm&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect';
router.get('', function (req, res, next) {
    res.redirect(murl);
});

var login = function (req, res, callback) {
    var code = req.query.code;
    var openid = '';//o-OiHjkAEb7IEPmIv-GcFS_i6lLE
    var view = 'index';
    var user = {
        avatar : 'http://wx.qlogo.cn/mmopen/1TKMRBgMD6d5fR0wbhe5QGhicQRCowJq7GldgtuPfKPoLN02fUFOPnIoEYPkSzoicAHViaKy4TABKsBvGWiciaBSgqb4Dfeyzbgce/0',
        openid : 'o-OiHjkAEb7IEPmIv-GcFS_i6lLE',
        nickname : 'nickname'
    };
   // req.session.user = user
    //return callback(null , user);
    if(req.session && req.session.user){
        return callback(null, req.session.user);
    }else{
        wxUtils.getUserInfoByCode(config.wxapptype, code, function(err, userInfo){//getUserInfoByCode
            if(err){
                logger.error('getUserInfoByCode', code, err);
                return callback(err);
            }
            userInfo.avatar = userInfo.headimgurl;
            req.session.user = userInfo;
            return callback(null, userInfo);
        });
    }
};

router.get('/m', function (req, res, next) {
    login(req, res, function(err, user){
        if(err){
            req.session.user = null;
            return res.redirect(murl);
        }
        return res.render('index', user);
    });
});

router.get('/tm', function (req, res, next) {
    login(req, res, function(err, user){
        if(err){
            req.session.user = null;
            return res.redirect(murl);
        }
        console.log(req.session.user);
        var cityIndex = req.query.city;
        user = req.session.user;
        var openid = user.openid;
        var defaultMsgs = sysUtils.defaultMsgs;
        sysUtils.getDBMsgs(openid, function(err, msgStr){

            var msgs = msgStr.split(',');
            var data = user;
            data['defaultMsgs'] = defaultMsgs;
            data['msgs'] = msgs;
            data.cityIndex = cityIndex;
            return res.render('tm', data);
        });
    });
});

router.post('/tm', function (req, res, next) {

    var user = {
        openid : 'XXX',
        nickname : '湖北网友',
        avatar : 'http://wx.qlogo.cn/mmopen/1TKMRBgMD6d5fR0wbhe5QGhicQRCowJq7GldgtuPfKPoLN02fUFOPnIoEYPkSzoicAHViaKy4TABKsBvGWiciaBSgqb4Dfeyzbgce/0'
    };
    user = req.session.user;
    var openid = user.openid;
    var avatar = user.avatar;
    var defaultMsgs = sysUtils.getMsgs();
    // console.log(defaultMsgs);
    sysUtils.getDBMsgs(openid, function(err, msgStr){
        if(err){
            return {success: false};
        }
        var m = [];
        var msgs = msgStr.split(',');
        var data = user;

        for(var index in defaultMsgs){
            m.push(defaultMsgs[index]);
        }

        for(var index in msgs){
            if(msgs[index])
            m.push({
                p : avatar,
                t : msgs[index]
            });
        }
        data['defaultMsgs'] = m;
        // data['msgs'] = msgs;
        data.success = true;
        return res.json(data);
    });
});

router.post('/msg', function (req, res, next) {
    var user = {
        openid : 'XXX',
        nickname : '湖北网友',
        avatar : 'http://wx.qlogo.cn/mmopen/1TKMRBgMD6d5fR0wbhe5QGhicQRCowJq7GldgtuPfKPoLN02fUFOPnIoEYPkSzoicAHViaKy4TABKsBvGWiciaBSgqb4Dfeyzbgce/0'
    };
    user = req.session.user;
    var openid = user.openid;
    var avatar =user.avatar;
    var msg = req.body.msg;
    sysUtils.getDBMsgs(openid, function(err, msgStr){
        if(msgStr.length == 0){
            msgStr = msg;
        }else{
            msgStr += ','+msg;
        }
        sysUtils.setDBMsgs(openid, msgStr, function(err){
            console.log(err);
            if(!err){
                console.log(err);
                res.json({
                    success: true,
                    list : [{
                        p : avatar,
                        t : msg
                    }]
                });
            }else{
                res.json({
                    msg: '发布失败'
                });
            }
        });    
    });
    
});

router.get('/order', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(murl);
    }
    var animals = sysUtils.getAnimals();
    return res.render('order', {animals : animals});
});

router.get('/list', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.redirect(murl);
    }
    var animals = sysUtils.getAnimals();
    return res.render('list', {animals : animals});
});

router.post('/share', function (req, res, next) {
    if(!req.session || !req.session.user){
        return res.json({
            success : false,
            msg : '身份信息获取失败！，请刷新重试'
        });
    }

    var user = req.session.user;
    var uid = user.id;
    var aid = req.body.aid;
    userModel.insertRepresent(uid, aid, function(err){
        if(err){
            logger.error('save is error!');
            return res.json({
                success : false,
                msg : '分享失败'
            });
        }else{
            return res.json({
                success : true,
                id : uid,
                msg : '分享成功'
            });
        }
    });
});

router.get('/start', function (req, res, next) {
    return res.render('bstart', {
        userInfo : {
            code : '',
            openid : ''
        }
    });
});

router.get('/end', function (req, res, next) {
    return res.render('end', {
        userInfo : {
            code : '',
            openid : ''
        }
    });
});

router.get('/error', function (req, res, next) {
    return res.render('error', {msg: '找不到页面啦'});
});

module.exports = router;