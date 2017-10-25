var request  = require('request');
var constants = require('../constants');

module.exports = function(app){
	app.get('/admin/city/add',isAuth,function(req,res){
		var data = {
			session: req.session,
			action : 'add'
		};
		if(req.session.city != null){
			data.city = req.session.city;			
			req.session.city = null;
		}
		if(req.session.errmsg != null){
			data.errmsg = req.session.errmsg;
			req.session.errmsg = null;
		}
		res.render('city/edit.html',data);
	});
	
	app.post('/admin/city/save',isAuth,function(req,res){
		
		var name = req.body.name.trim();
		var state = req.body.state.trim();
		var pdpts = req.body.pdpt;
		var action = req.body.action;
		var points = '';
		if(pdpts != null && pdpts !='' && pdpts instanceof Array){
			for(i = 0;i < pdpts.length;i++){
				if(pdpts[i].trim() != ''){
					points +=pdpts[i].trim()+",";
				}			
			}
			points = points.substr(0,points.length-1);
		}
		if(pdpts != null && pdpts !='' && typeof pdpts === 'string'){
			points =pdpts;
		}
		if(action == 'add'){
			request.post({
				url :constants.HOST + '/api/city/create',
				form :{
					token  : req.session.auth.token,
					name   : name,
					state  : state,
					points : points
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){	
						if(points == ''){
							points = [];
						}else{
							points = points.split(",");
						}
						
						req.session.city = {
								state  : state,
								name   : name,
								points : points
						};
						req.session.errmsg = resObj.errmsg;
						
						res.redirect('/admin/city/add');
					}else{
						req.session.errmsg = resObj.msg;
						res.redirect('/admin/city/list');
					}
			});
		}else if(action == 'save'){
			var id = req.body.id;
			if(id != null && id != ''){
				request.post({
					url :constants.HOST + '/api/city/edit',
					form :{
						token  : req.session.auth.token,
						name   : name,
						state  : state,
						points : points,
						id : id
					}
					},
					function(err,response,body){
						var resObj = JSON.parse(body);
						if(resObj.err == true){	
							if(points == ''){
								points = [];
							}else{
								points = points.split(",");
							}
							req.session.city = {									
									state  : state,
									name   : name,
									points : points,
									_id    : id
							};
							req.session.errmsg = resObj.errmsg;
							backURL=req.header('Referer');
							res.redirect(backURL);
						}else{
							req.session.errmsg = resObj.msg;
							res.redirect('/admin/city/list');
						}
				});
			}
		}						
	});
	
	app.get('/admin/city/list',isAuth,function(req,res){
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
					errmsg :'',
					session: req.session,
					cities: []
			};
			if(resObj.err == true){
				data.errmsg =resObj.errmsg;
			}else{
				data.cities = resObj.datas;
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('city/list.html',data);
		});
	});
	
	app.get('/admin/city/edit',isAuth,function(req,res){	
		var id = req.query.id;
	     if(id != null && id != ''){
	    	 request.post({
				url :constants.HOST + '/api/city/get',
				form :{
					id : id
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){	
						req.session.errmsg = resObj.errmsg;
						res.redirect('/admin/city/list');
					}else{
						var data = {
							session : req.session,
							city : resObj.data,
							action : 'save'
						};		
						if(req.session.errmsg != null){
							data.errmsg = req.session.errmsg;
							req.session.errmsg = null;
						}
						if(req.session.city != null){
							data.city  =req.session.city;
							req.session.city = null;
						}
						res.render('city/edit.html',data);
					}
		      });
	     }
	});
	
	app.get('/admin/city/delete',isAuth,function(req,res){
		var id = req.query.id;
		if(id != null || id != ''){
			request.post({
			url :constants.HOST + '/api/city/delete',
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
				res.redirect('/admin/city/list');
			});
		}
	});
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'city';
		return next();
	}
}