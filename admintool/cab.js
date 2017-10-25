var request  = require('request');
var constants = require('../constants');

module.exports = function(app){
	app.get('/admin/cab/add',isAuth,function(req,res){
		request.post({
			url : constants.HOST + '/api/cabcat/viewall',
			},
			function(err,resonse,body){
				var data = {
						session : req.session,
						action :'add',
						cat : []
				};
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					data.errmsg = resObj.errmsg;
				}else{
					data.cat = resObj.datas;
				}
				if(req.session.cab != null){
					data.cab = req.session.cab;
					req.session.cab = null;
				}
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
				res.render('cab/edit.html',data);
		   }
		);	
	});
	
	app.post('/admin/cab/save',isAuth,function(req,res){
		var vendor = req.body.vendor.trim();
		var model = req.body.model.trim();
		var seatmap = req.body.seatmap.trim();
		var cat = req.body.cat.trim();
		var action = req.body.action;
		if(action == 'add'){
			request.post({
				url : constants.HOST + '/api/cartype/create',
				form : {
					token : req.session.auth.token,
					vendor : vendor,
					model : model,
					seatmap : seatmap,
					cat : cat
				}},
				function(err,resonse,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						req.session.cab = {
							vendor : vendor,
							model : model,
							seatmap : seatmap,
							cat : cat
						};
						req.session.errmsg  = resObj.errmsg;
						res.redirect('/admin/cab/add');
					}else{
						req.session.errmsg  =resObj.msg;
						res.redirect('/admin/cab/list');
					}
				}
			);
		}else if(action == 'save'){
			var id = req.body.id;
			if(id != null || id != ''){
				request.post({
					url :constants.HOST + '/api/cartype/edit',
					form :{
						token  : req.session.auth.token,
						vendor   : vendor,
						model  : model,
						seatmap : seatmap,
						id : id,
						cat : cat
					}
					},
					function(err,response,body){
						var resObj = JSON.parse(body);
						if(resObj.err == true){
							req.session.cab = {
								_id : id,
								vendor : vendor,
								model : model,
								seatmap : seatmap,
								cat : cat
							};
							req.session.errmsg = resObj.errmsg;
							backURL=req.header('Referer');
							res.redirect(backURL);
						}else{
							req.session.errmsg = resObj.msg;
							res.redirect('/admin/cab/list');
						}
				});
			}
		}
	});
	
	app.get('/admin/cab/list',isAuth,function(req,res){
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST+"/api/cartype/view",
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
				cabs : []
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			}else{
				data.cabs = resObj.datas;
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('cab/list.html',data);
		});
	});
	
	app.get('/admin/cab/edit',isAuth,function(req,res){
		request.post({
			url : constants.HOST + '/api/cabcat/viewall',
			},
			function(err,resonse,body){
				var data = {
						session : req.session,
						action :'save',
						cat : []
				};
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					data.errmsg = resObj.errmsg;
				}else{
					data.cat = resObj.datas;
				}
				
				var id = req.query.id;
				if(id != null || id != ''){
					 request.post({
							url :constants.HOST + '/api/cartype/get',
							form :{
								id : id
							}
							},
							function(err,response,body){
								var resObj = JSON.parse(body);
								if(resObj.err == true){	
									req.session.errmsg = resObj.errmsg;
									res.redirect('/admin/cab/list');
								}else{
									data.cab = resObj.data;
									if(req.session.errmsg != null){
										data.errmsg = req.session.errmsg;
										req.session.errmsg = null;
									}
									if(req.session.cab != null){
										data.cab =  req.session.cab;
										req.session.cab = null;
									}
									res.render('cab/edit.html',data);
								}
					  });
				}
			});		
	});
	
	app.get('/admin/cab/delete',function(req,res){
		var id = req.query.id;
		if(id != null || id != ''){
			request.post({
				url :constants.HOST + '/api/cartype/delete',
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
					res.redirect('/admin/cab/list');
				});
		}
	});
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'cab';
		return next();
	}
}