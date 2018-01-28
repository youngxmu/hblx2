var path = require('path');

module.exports = {
	port: 8548,
	viewEngine: 'ejs',
	views: path.resolve(__dirname, '..', 'views'),
	staticPath: path.resolve(__dirname, '..', 'public'),
	uploadDir: path.resolve(__dirname, '..', 'public/uploads'),
	env: 'dev',
	logfile: path.resolve(__dirname, '..', 'logs/access.log'),
	redirectPath : 'http://act.cnhubei.com/hblx2/',
	// redirectPath : '/',
	imgHost : 'http://act.cnhubei.com/hblx2/',
	sessionSecret: 'session_secret_random_seed',
	wxapptype : 'jcw',
	//mysql config
	host: "10.99.113.47",
	user: "root",
	password: "123a321",
	database: "animal",
	enableDBLog: false,
	winston:{
		exceptionFile:path.resolve(__dirname, '..', 'logs/exceptions.log'),
		dailyRotateFile:path.resolve(__dirname, '..', 'logs/daily.log')
	},
	//redis config
	"redis": {"address": "10.99.113.48", "port": "6379", "passwd": "Hs1JlTXOGsDRtq8UH"},
	"wxRedis": {"address": "10.99.113.69", "port": "6379", "passwd": "Hs1JlTXOGsDRtq8UH"},
	"token_secret": "generated_token_secret",//用于生成“授权token”的secret
	"testValidCode" : true,
	"whitelist": [
		"/",
	]
};