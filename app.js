var express = require('express');
var app  =  express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(bodyParser.urlencoded({
	extended : false,
	limit : '50mb'
}));
app.use(bodyParser.json({
	limit : '50mb'
}));
app.use(methodOverride());
app.use(express.static(__dirname+'/public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(multer({
	dest :'./public/images',
	limits : {
		fileSize : 1024 * 1024
	}
}));
app.use(cookieParser());

app.use(session({ secret : "shhhhhhhhhh",
	resave : false, 
	saveUninitialized : true
}));

app.use(function(req,res,next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});


/*** mongodb connection ***/
var mongodbConfig = require('./config/mongodb');
var mongodb = require('mongoose');
mongodb.connect(mongodbConfig.url);


/*** api config ***/
require('./api/user')(app);
require('./api/booking')(app);
require('./api/cabability')(app);
require('./api/cartype')(app);
require('./api/route')(app);
require('./api/seatmap')(app);
require('./api/cabcategory')(app);
require('./api/city')(app);

/*** admin tool ****/
require('./admintool/user')(app);
require('./admintool/ability')(app);
require('./admintool/city')(app);
require('./admintool/route')(app);
require('./admintool/booking')(app);
require('./admintool/cab')(app);


app.listen(80,function(){
	console.log('admin server is starting...');
});
