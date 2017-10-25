var request  = require('request');
var constants = require('../constants');

module.exports = function(app){
	app.get('/admin/route/add',isAuth,function(req,res){		
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST+"/api/city/viewall",
		        headers: {
		            "Content-Type": "application/json",
		            "Accept": "application/json"
		        }

		    };
		request(options, function(err,response,body){
			var resObj = JSON.parse(body);
			var data = {
				session : req.session,
				cities : [],
				action : 'add'
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			 }else{
				 data.cities = resObj.datas;				 
			 }
			if(req.session.route != null){
				data.route = req.session.route;
				req.session.route = null;
			}
			if(req.session.errmsg != null){
				data.errmsg = req.session.errmsg;
				
			}
			res.render('route/edit.html',data);
		});		
	});
	
	app.post('/admin/route/save',isAuth,function(req,res){
		var from = req.body.from;
		var to  = req.body.to;
		var dis = req.body.dis;
		var time = req.body.time;
		var action = req.body.action;
		if(action == 'add'){
			request.post({
				url :constants.HOST + '/api/route/create',
				form :{
					token  : req.session.auth.token,
					from  : from,
					to : to,
					dis : dis,
					hours : time
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						req.session.route = {
							from : from,
							to : to,
							dis : dis,
							hours: time
						};
						req.session.errmsg = resObj.errmsg;
						res.redirect('/admin/route/add');
					}else{
						req.session.errmsg = resObj.msg;
						res.redirect('/admin/route/list');
					}
			});
		}else if(action == 'save'){
			var id = req.body.id;
			if(id != null || id != ''){
				request.post({
					url :constants.HOST + '/api/route/edit',
					form :{
						token  : req.session.auth.token,
						from : from,
						to : to,
						dis : dis,
						hours : time,
						id : id
					}
					},
					function(err,response,body){
						var resObj = JSON.parse(body);
						if(resObj.err == true){
							req.session.route = {
								from : from,
								to : to,
								hours : time,
								dis : dis,
								_id : id
							};
							req.session.errmsg = resObj.errmsg;
							backURL=req.header('Referer');
							res.redirect(backURL);
						}else{
							req.session.errmsg =  resObj.msg;
							res.redirect('/admin/route/list');
						}
				});
			}
		}
	});	
	
	app.get('/admin/route/list',isAuth,function(req,res){
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST+"/api/route/viewall",
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
					routes: []
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			}else{
				data.routes = resObj.datas;
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('route/list.html',data);
		});
	});
	
	app.get('/admin/route/edit',isAuth,function(req,res){
		var id = req.query.id;
		if(id != null || id != ''){
			var options = {
			        method: 'GET',
			        rejectUnauthorized: false,
			        url: constants.HOST+"/api/city/viewall",
			        headers: {
			            "Content-Type": "application/json",
			            "Accept": "application/json"
			        }

			    };
			request(options, function(err,response,body){
				var resObj = JSON.parse(body);
				var data = {
					session : req.session,
					cities : [],
					action : 'save'
				};
				if(resObj.err == true){
					data.errmsg = resObj.errmsg;
				 }else{
					 data.cities = resObj.datas;				 
				 }				
				request.post({
					url :constants.HOST + '/api/route/get',
					form :{
						id : id
					}
					},
					function(err,response,body){
						var resObj = JSON.parse(body);
						if(resObj.err == true){	
							req.session.errmsg = resObj.errmsg;
							res.redirect('/admin/route/list');
						}else{			
							data.route = resObj.data;
							if(req.session.errmsg != null){
								data.errmsg = req.session.errmsg;
								req.session.errmsg = null;
							}
							if(req.session.route != null){
								data.route = req.session.route;
								req.session.route =  null;
							}
							res.render('route/edit.html',data);
						}
				});				
			});	
			
		}
	});
	
	app.get('/admin/route/delete',function(req,res){
		var id = req.query.id;
		if(id != null || id !=''){
			request.post({
				url :constants.HOST + '/api/route/delete',
				form :{
					id : id,
					token  : req.session.auth.token
				}
				},
				function(err,response,body){				
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						req.session.errmsg = resObj.errmsg;					
					}else{
						req.session.errmsg = resObj.msg;					
					}
					res.redirect('/admin/route/list');
				});
		}
	});
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'route';
		return next();
	}
}