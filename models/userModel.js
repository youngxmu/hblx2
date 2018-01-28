var db = require('../lib/db.js');

exports.insert = function (openid, nickname, avatar, callback) {
    var sql = 'insert into user(openid, nickname, avatar, create_time) values(?,?,?,?);';
    db.query(sql, [openid, nickname, avatar, new Date()], callback);
};

exports.query = function(id, callback){
    var sql = 'select u.* from user u where u.id = ?';
    db.query(sql, [id], callback);
};

exports.queryUserByOpenid = function(openid, callback){
    var sql = 'select u.* from user u where openid = ?';
    db.query(sql, [openid], callback);
};


exports.insertRepresent = function (uid, aid, callback) {
    var sql = 'insert into represent(uid, aid, create_time) values(?,?,?);';
    db.query(sql, [uid, aid, new Date()], callback);
};


exports.queryCount = function(callback){
    db.query("select aid, count(uid) as count from represent group by aid order by count desc;", [], callback);
};
