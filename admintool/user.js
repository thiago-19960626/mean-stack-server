var request  = require('request');
var constants = require('../constants.js');

module.exports = function(app){
	app.get('/admin/login',function(req,res){
		var data = {
			email  : '',
			errmsg : 'Sign in with your email and password',
			pass : ''
		};
		if(req.session.auth != null){
			data.email = req.session.auth.email;
			data.errmsg = req.session.auth.errmsg;
			data.pass = '';
			req.session.auth = null;
		}else{
			if(req.cookies.email != null && req.cookies.pass != null){
				data.email = req.cookies.email;
				data.pass =req.cookies.pass;
			}	
		}		
		res.render('user/login.html',data);
	});
	
	app.post('/admin/login',function(req,res){
		var remember = req.body.remember;
		if(remember == 'on'){
			res.cookie('email', req.body.email, { maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
			res.cookie('pass',req.body.pass, { maxAge : 1000 * 60 * 60 * 24 * 30 , httpOnly : true});
		}
		request.post({
		url :constants.HOST + '/api/user/superlogin',
		form :{
			email : req.body.email,
			pass  : req.body.pass
		}
		},
		function(err,response,body){
			var resObj = JSON.parse(body);
			if(resObj.err == true){		
				req.session.auth = { 
					email  : req.body.email,
					pass   : '',
					errmsg : '<font color="red">'+resObj.errmsg+'</font>'
				};
				res.redirect('/admin/login');
			}else{
				var date = new Date(resObj.createdat);
				req.session.auth = {
						createdat : constants.monthNames[date.getMonth()]+", "+date.getFullYear() ,
						token : resObj.token,
						name  : resObj.fullname,
						photo : resObj.photo
				};
				res.redirect('/admin');
			}
		});
	});	
	
	app.get('/admin/user/list',isAuth,function(req,res){
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST+"/api/user/list?token="+req.session.auth.token,
		        headers: {
		            "Content-Type": "application/json",
		            "Accept": "application/json"
		        }

		    };
		request(options, function(err,response,body){
			var resObj = JSON.parse(body);
			var data = {
					errmsg :'',
					session: req.session,
					users: []
			};
			if(resObj.err == true){				
				data.errmsg = resObj.errmsg;
			}else{
				data.users = resObj.datas;
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('user/list.html',data);
	    });
	});
	
	app.get('/admin/user/changestatus',isAuth,function(req,res){
		var id = req.query.id;
		if(id != null && id != ''){
			request.post({
				url :constants.HOST + '/api/user/changestatus',
				form :{
					token : req.session.auth.token,
					id : id
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){	
						req.session.errmsg = resObj.errmsg;						
					}else{
						req.session.errmsg  =resObj.msg;
					}
					res.redirect('/admin/user/list');
			});
		}
	});
	
	app.get('/admin/user/profile',isAuth,function(req,res){
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST + "/api/user/profile?token="+req.session.auth.token,
		        headers: {
		            "Content-Type": "application/json",
		            "Accept": "application/json"
		        }

		    };
		request(options, function(err,response,body){
			var resObj = JSON.parse(body);
			var data = {
				errmsg :'',
				session : req.session,
				user : null
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			}else{
				data.user = resObj.data;				
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('user/profile.html',data);
		});		
	});
	
	app.post('/admin/user/updateprofile',isAuth,function(req,res){
		var photo = '';
		if(req.files.img !== undefined){			
			photo = req.files.img.name;
		}
		var fname = req.body.fname.trim();
		var lname = req.body.lname.trim();
		var dob = req.body.dob.trim();
		var mob = req.body.mob.trim();
		var gen = req.body.gen;
		if(fname == null || fname == ''){
				res.send({ err : true, errmsg : "please enter first name."});
		}else if(lname == null || lname == ''){
			res.send({ err : true , errmsg :"please enter last name."});
		}else if(dob == null || dob == ''){
			res.send({ err : true , errmsg :"please enter your birthday."});
		}else if(mob == null || mob == ''){
			res.send({ err : true , errmsg :"please enter your contact number."});
		}else{
			request.post({
				url :constants.HOST + '/api/user/profile',
				form :{
					token : req.session.auth.token,
					fname : fname,
					lname : lname,
					mob : mob,
					dob :dob,
					gen : gen,
					photo :photo
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						req.session.errmsg = resObj.errmsg;
					}else{
						req.session.errmsg = resObj.msg;
						if(photo != ''){
							req.session.auth= {
									createdat : req.session.auth.createdat,
									token : req.session.auth.token,
									name : req.session.auth.name,
									photo : photo
							};
						}						
					}
					res.redirect('/admin/user/profile');
			});
		}		
	});
	
	app.get('/admin/user/logout',function(req,res){
		request.post({
			url :constants.HOST + '/api/user/logout',
			form :{
				token : req.session.auth.token
			}
			},
			function(err,response,body){
				var resObj = JSON.parse(body);
				if(resObj.err  == true){
					req.session.errmsg = resObj.errmsg;
					backURL=req.header('Referer');
					res.redirect(backURL);
				}else{
					res.redirect('/admin/login');
				}
			});
	});
	
	app.get('/admin/user/allbookings',isAuth,function(req,res){		
		var uid = req.query.uid;
		request.post({
			url :constants.HOST + '/api/booking/getallbyuser',
			form :{
				token : req.session.auth.token,
				uid : uid
			}
			},
			function(err,response,body){
				var resObj = JSON.parse(body);
				var data = {
						session : req.session,
						errmsg : '',
						bookings : [],						
						id : uid,
						title :'User'
				};
				if(resObj.err == true){
					req.session.errmsg = resObj.errmsg;
				}else{
					if(req.session.errmsg != null){
						data.errmsg = req.session.errmsg;
						req.session.errmsg = null;
					}
					data.bookings =  resObj.datas;
				}
				res.render('ability/bookinglist.html',data);
		});
	});
	
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'user';
		return next();
	}
}
