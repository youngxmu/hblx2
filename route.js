var logger = require("./lib/log.js").logger("route");
var config = require("./config");
var indexRouter = require('./routes/indexRouter.js');
module.exports = function (app) {
    app.use('/index', indexRouter);
    app.get("/", function (req, res, next) {
        res.redirect(config.redirectPath + "index")
    });
};
