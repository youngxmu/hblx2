var utils = require('../lib/utils.js');
var redisUtils = require('../lib/wxRedisUtils.js');
var rp = require('request-promise');
var logger = require('../lib/log.js').logger('wxUtils');

var wxConfig = {
    jcw : {
        appId : 'wxf947d7d09ef1f584',
        appSecret : 'bd53a5a17da75f90e261dc5ccb86ba72',
        noncestr : 'xkXGEs8VMCP',
        timestamp : '1414587499'
    },
    zy : {
        appId : 'wxcc3d79aa1e85e05f',
        appSecret : '7f060e7785e2471b850f1b9abde47ff5',
        noncestr : 'xkXGEs8VMCP',
        timestamp : '1414587499'
    },
    tokenUrl : 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=APPID&secret=SECRET',
    ticketUrl : 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=TOKEN&type=jsapi',
    oauth2Url : 'https://api.weixin.qq.com/sns/oauth2/access_token?appid=APPID&secret=SECRET&code=CODE&grant_type=authorization_code',
    baseinfoUrl : 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN',
    userinfoUrl : 'https://api.weixin.qq.com/sns/userinfo?access_token=ACCESS_TOKEN&openid=OPENID&lang=zh_CN',
    userlistUrl : 'https://api.weixin.qq.com/cgi-bin/user/info/batchget?access_token=ACCESS_TOKEN'
};

var refreshToken = 0;
var refreshTicket = 0;
var clearRedisToken = function(type, callback){
    var currTime = new Date().getTime();
    var offset = currTime - refreshToken;
    if(refreshToken !=0 ){
        if(offset < 60000){
            return callback('不能频繁刷新' + offset);
        }
    }
    var APPID = wxConfig[type].appId;
    var SECRET = wxConfig[type].appSecret;
    var url = wxConfig.tokenUrl.replace("APPID", APPID).replace("SECRET", SECRET);
    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(function (repos) {
        token = repos.access_token;
        console.log('from weixin, '+ type +'_token is ' + token);
        redisUtils.setWithExpire(type + '_token', token, 120 * 60, function(err){
            if(!err){
                refreshToken = currTime;
                console.log(type + '_token is clear offset is' + offset + ' currTime ' + currTime + ' refreshToken ' +refreshToken);
                callback();
            }
        });
    }).catch(function (err) {
        callback(err);
    });
};


var clearRedisTicket = function(type, callback){
    var currTime = new Date().getTime();
    var offset = currTime - refreshTicket;
    if(refreshTicket != 0 ){
        if(offset < 60000){
            return callback('不能频繁刷新' + offset);
        }
    }
    refreshTicket = new Date().getTime();
    redisUtils.del(type + '_ticket', function(err){
        if(err){
            return callback(err);
        }
        getTicket(type, function(err, ticket){
            if(err || !ticket || ticket == ''){
                logger.error(ticket, err);
                return callback('error');
            }
            
            return callback(null, ticket);
        })
    });
};
var getToken = function(type, callback){
    if(!wxConfig[type]){
        callback('error');
        return;
    }
    redisUtils.get(type + '_token', function(err, reply){
        var token = reply;
        var APPID = wxConfig[type].appId;
        var SECRET = wxConfig[type].appSecret;
        var url = wxConfig.tokenUrl.replace("APPID", APPID).replace("SECRET", SECRET);
        if(!callback){
            callback = function(){};
        }
        if(token && token != 'pLzielo7aBqbjyJF6zebzSEK9TwA-iJ4ArUYRZsNRBEg9JJMSptJVN_84UeZyDSesZe5ihRtXjDE-80Gcfkmlo50viAigVKbzPeyWuS_q4K6T9QcF_7A_Nlaw4dnXBipXLNlCDAKYA'){
            // console.log('from redis, '+ type +'_token is ' + token);
            callback(null, token);
        }else{
            var options = {
                uri: url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options).then(function (repos) {
                token = repos.access_token;
                console.log('from weixin, '+ type +'_token is ' + token);
                redisUtils.setWithExpire(type + '_token', token, 120 * 60, function(err){
                    if(!err){
                        refreshToken = new Date().getTime();
                        callback(null, token);
                    }
                });
            }).catch(function (err) {
                callback(err);
            });
        }
    });
};
var getTicket = function(type, callback){
    if(!wxConfig[type]){
        callback('error');
        return;
    }
    redisUtils.get(type + '_ticket',function(err, reply){
        var ticket = reply;
        var token;
        var APPID = wxConfig[type].appId;
        var SECRET = wxConfig[type].appSecret;
        if(!callback){
            callback = function(){};
        }
        if(ticket){
            callback(null, ticket);
            return;
        }else{
            getToken(type, function(err, token){
                if(err){
                    callback('error');
                    return;
                }
                var ticketUrl = wxConfig.ticketUrl.replace("TOKEN", token);
                var options = {
                    uri: ticketUrl,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true // Automatically parses the JSON string in the response
                };

                rp(options).then(function (repos) {
                    ticket = repos.ticket;
                    if(!ticket){
                        logger.error('from weixin, '+ type +'ticket is unvalid', repos.errcode);
                        if(repos.errcode == '40001'){
                            clearRedisToken(type);    
                        }
                        callback(repos);
                    }else{
                        redisUtils.setWithExpire(type + '_ticket', ticket, 120 * 60, function(err){
                            if(!err){
                                callback(null, ticket);
                            }
                        });
                    }
                }).catch(function (err) {
                    logger.warn('err');
                     callback(err);
                });
            });
            
        }
    });
};
var getOauth2 = function(type, code, callback){
    var APPID = wxConfig[type].appId;
    var SECRET = wxConfig[type].appSecret;
    var url = wxConfig.oauth2Url.replace("APPID", APPID).replace("SECRET", SECRET).replace("CODE", code);
    if(!callback){
        callback = function(){};
    }
    var options = {
        uri: url,
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true // Automatically parses the JSON string in the response
    };
    rp(options).then(function (repos) {
        if(repos.errcode){
            return callback(repos);
        }
        callback(null, repos);
    }).catch(function (err) {
        callback('error');
    });
};

module.exports = {
    config : wxConfig,
    getSignature : function(url, type, callback){
        if(!callback){
            callback = function(){};
        }
        getTicket(type, function(err, ticket){
            if(err || !ticket || ticket == ''){
                logger.error(ticket, err);
                callback('error');
                return;
            }
            var string1 = "jsapi_ticket=" + ticket + "&noncestr=" + wxConfig[type].noncestr + "&timestamp=" + wxConfig[type].timestamp + "&url=" + url;
            var signature = utils.sha1(string1);    
            callback(null, signature);
        })
    },
    getBaseInfo : function(type, code, callback){
        getOauth2(type, code, function(err, authInfo){
            if(err){
                callback(err);
                return;
            }
            var userInfo = {};
            getToken(type, function(err, token){
                if(err){
                    callback(err);
                    return;
                }
                var userInfo = {};
                var url = wxConfig.baseinfoUrl.replace("ACCESS_TOKEN", token).replace("OPENID", authInfo.openid);
                var options = {
                    uri: url,
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json: true // Automatically parses the JSON string in the response
                };
                rp(options).then(function (repos) {
                    if(repos.errcode){
                        if(repos.errcode == '40001'){
                            return clearRedisToken(type, function(){
                                callback(repos);
                            });
                        }else{
                            callback(repos);
                        }
                    }else{
                        callback(null, repos);    
                    }
                }).catch(function (err) {
                    logger.error('getBaseInfo err');
                    callback(err);
                });
            });
            // var APPID = wxConfig[type].appId;
            // var SECRET = wxConfig[type].appSecret;
            // var url = wxConfig.userinfoUrl.replace("ACCESS_TOKEN", authInfo.access_token).replace("OPENID", authInfo.openid);
            // var options = {
            //     uri: url,
            //     headers: {
            //         'User-Agent': 'Request-Promise'
            //     },
            //     json: true // Automatically parses the JSON string in the response
            // };
            // rp(options).then(function (repos) {
            //     if(repos.errcode){
                    //     callback(repos);    
                    // }else{
                    //     callback(null, repos);    
                    // }
            // }).catch(function (err) {
            //     callback(err);
            // });
        });
    },
    getUserInfoByToken : function(access_token, openid, callback){
        var userInfo = {};
        var url = wxConfig.baseinfoUrl.replace("ACCESS_TOKEN", access_token).replace("OPENID", openid);
        url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token=gYd3jgWNadZX_HPhWqKsTKiThl-y2Ulf6Z2UKQNwTiyRga4LNJeq1bwe2Q9fw8IZpqDnJSmAeyxO8YLsX-udL31Jcy1_1uU3_KEz_TBEQOVNHJjuu2i8gT0CKph7FtaxHEYcCDABYS&openid=o-OiHjgx_vtoywPWCiXfsUYIxTI8';
        var options = {
            uri: url,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true // Automatically parses the JSON string in the response
        };
        rp(options).then(function (repos) {
            if(repos.errcode){
                callback(repos);    
            }else{
                callback(null, repos);    
            }
        }).catch(function (err) {
            logger.warn(err);
            callback('error');
        });
    },
    getBaseInfoByOpenid : function(type, openid, callback){//getUserInfoByOpenid
        getToken(type, function(err, token){
            if(err){
                logger.err('getBaseInfoByOpenid err ',  err);
               
                return  callback(err);
            }
            var userInfo = {};
            var url = wxConfig.baseinfoUrl.replace("ACCESS_TOKEN", token).replace("OPENID", openid);
            var options = {
                uri: url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options).then(function (repos) {
                // console.log('-----getBaseInfoByOpenid-----');
                if(repos.errcode){
                    if(repos.errcode == 40001){
                        return clearRedisToken(type, function(){
                            callback(repos);
                        });
                        logger.error('from weixin, '+ type +'_token is unvalid');    
                    }
                }else{
                    callback(null, repos);    
                }
            }).catch(function (err) {
                logger.error('getBaseInfoByOpenid rp err', err);
                callback(err);
            });
        });
    },
    getUserInfoByCode : function(type, code, callback){
        getOauth2(type, code, function(err, authInfo){
            if(err){
                callback(err);
                return;
            }
            var userInfo = {};
            var url = wxConfig.userinfoUrl.replace("ACCESS_TOKEN", authInfo.access_token).replace("OPENID", authInfo.openid);
            var options = {
                uri: url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options).then(function (repos) {
                if(repos.errcode){
                    callback(repos);
                }else{
                    callback(null, repos);    
                }
            }).catch(function (err) {
                callback(err);
            });
        });
    },
    getBaseInfoByUnionid :  function(type, openid, callback){
        getToken(type, function(err, token){
            if(err){
                logger.error('getBaseInfoByOpenid err ' + openid);
                callback(err);
                return;
            }
            var userInfo = {};
            var url = wxConfig.baseinfoUrl.replace("ACCESS_TOKEN", token).replace("OPENID", openid);
            var options = {
                uri: url,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json: true // Automatically parses the JSON string in the response
            };
            rp(options).then(function (repos) {
                if(repos.errcode){
                    if(repos.errcode == 40001){
                        logger.error('from weixin, '+ type +'_token is unvalid');    
                        return clearRedisToken(type, function(){
                            callback(repos);
                        });
                    }
                }else{
                    callback(null, repos);    
                }
            }).catch(function (err) {
                logger.error('getBaseInfoByOpenid rp err');
                callback(err);
            });
        });
    },
    getToken : function(type, callback){//getUserInfoByOpenid
        getToken(type, function(err, token){
            if(err){
                logger.error('getBaseInfoByOpenid err ' , openid);
                return callback(err);
            }
            return callback(null, {token:token,time:refreshToken});
        });
    },
    clearRedisToken : clearRedisToken,
    clearRedisTicket : clearRedisTicket
};