var request  = require('request');
var constants = require('../constants');

module.exports = function(app){
	app.get('/admin/ability/add',isAuth,function(req,res){
		/**** get city infos ****/
		var data = {
			session:req.session,
			errmsg :'',
			action : 'add',
			constants : constants
		};
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST +"/api/city/viewall",
		        headers: {
		            "Content-Type": "application/json",
		            "Accept": "application/json"
		        }
		    };
		request(options, function(err,response,body){
			var resObj = JSON.parse(body);
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			}else{
				data.cities = resObj.datas;
				/****** get cartype infos ***/
				options = {
				        method: 'GET',
				        rejectUnauthorized: false,
				        url: constants.HOST +"/api/cartype/view",
				        headers: {
				            "Content-Type": "application/json",
				            "Accept": "application/json"
				        }
				    };
				request(options, function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						data.errmsg = resObj.errmsg;
					}else{
						data.cabs = resObj.datas;
						if(req.session.errmsg != null){
							data.errmsg = req.session.errmsg;
							req.session.errmsg =  null;
						}
						if(req.session.ability != null){
							data.ability = req.session.ability;
							req.session.ability = null;
						}
					}
					res.render('ability/edit.html',data);
				});
			}
		});
	});
	
	app.post('/admin/ability/save',isAuth,function(req,res){
		var action = req.body.action;
		var startcity = req.body.startcity;
		var endcity =  req.body.endcity;
		var date  = req.body.date;
		var startingtime = req.body.startingtime;
		var cabtype =  req.body.cabtype;
		var numseats = req.body.numseats;
		var price = req.body.price;
		var pickuppts = req.body.pickuppt;
		var pickuptimes = req.body.pickuptime;
		var pickup = '[';
		if(pickuppts != null && pickuppts != '' && pickuppts instanceof Array){
			for(i = 0; i< pickuppts.length;i++){
				pickup += '{ "point" : "'+pickuppts[i]+'","pickuptime" : "'+pickuptimes[i]+'"},';
			}
			pickup = pickup.substr(0,pickup.length-1);
		}else if(pickuppts != null && pickuppts != '' && typeof pickuppts == 'string'){
			pickup += '{ "point" : "'+pickuppts+'","pickuptime" : "'+pickuptimes+'"}';
		}
		pickup += ']';
		
		var droppts = req.body.droppt;
		var drop = '[';
		if(droppts != null && droppts != '' && droppts instanceof Array){
			for(i =0;i < droppts.length;i++){
				drop +='{ "point" : "'+ droppts[i]+'"},';
			}
			drop = drop.substr(0,drop.length-1);
		}else if(droppts != null && droppts != '' && typeof droppts =='string'){
			drop +='{ "point" : "'+ droppts+'"}';
		}
		drop +=']';
		if(action =="add"){
			request.post({
				url : constants.HOST +'/api/ability/create',
				form : {
					token : req.session.auth.token,
					startcity : startcity,
					endcity : endcity,
					date :date,
					startingtime : startingtime,
					cabtype : cabtype,
					numseats : numseats,
					pickup : pickup,
					drop : drop,
					price : price
				}
			},function(err,response,body){
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					req.session.ability = {
						startcity : startcity,
					    endcity : endcity,
					    date : date,
					    startingtime : startingtime,
					    cabtype : cabtype,
					    numseats : numseats,
					    pickup : JSON.parse(pickup),
					    drop : JSON.parse(drop),
					    price: price,
					};
					req.session.errmsg = resObj.errmsg;
					res.redirect('/admin/ability/add');
				}else{
					req.session.errmsg = resObj.msg;
					res.redirect('/admin');
				}
			});
		}else if(action =="save"){
			var id = req.body.id;
			var status = req.body.status;
			if(id != null || id != ''){
				request.post({
					url : constants.HOST +'/api/ability/edit',
					form : {
						token : req.session.auth.token,
						startcity : startcity,
						endcity : endcity,
						date :date,
						startingtime : startingtime,
						cabtype : cabtype,
						numseats : numseats,
						pickup : pickup,
						drop : drop,
						price : price,
						id : id,
						status : status
					}
				},function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){
						req.session.errmsg = resObj.errmsg;
						req.session.ability = {
								startcity : startcity,
							    endcity : endcity,
							    date : date,
							    startingtime : startingtime,
							    cabtype : cabtype,
							    numseats : numseats,
							    pickup : JSON.parse(pickup),
							    drop : JSON.parse(drop),
							    price: price,
							    _id : id,
							    status : status
							};
						backURL=req.header('Referer');
						res.redirect(backURL);
					}else{
						req.session.errmsg = resObj.msg;
						res.redirect('/admin');
					}
				});
			}
		}		
	});
	
	app.get('/admin',isAuth,function(req,res){
		var data = {
				errmsg : '',
				session : req.session,
				abilities :[],
				constants : constants
			};
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
			if(resObj.err ==  true){
				data.cities = [];
				data.errmsg = resObj.errmsg;
			}else{
				data.cities = resObj.datas;				
			}
			var options = {
			        method: 'GET',
			        rejectUnauthorized: false,
			        url: constants.HOST+"/api/ability/viewall",
			        headers: {
			            "Content-Type": "application/json",
			            "Accept": "application/json"
			        }

			    };
			request(options, function(err,response,body){
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					data.errmsg = resObj.errmsg;
				}else{
					data.abilities = resObj.datas;
					if(req.session.errmsg != null){
						data.errmsg = req.session.errmsg;
						req.session.errmsg =  null;
					}
				}
				res.render('ability/list.html',data);
			});
		});		
		
	});
	
	app.get('/admin/ability/edit',isAuth,function(req,res){
		var id = req.query.id;
		if(id !=null || id != ''){
			/**** get city infos ****/
			var data = {
				session:req.session,
				errmsg :'',
				action : 'save',
				constants : constants
			};
			var options = {
			        method: 'GET',
			        rejectUnauthorized: false,
			        url: constants.HOST +"/api/city/viewall",
			        headers: {
			            "Content-Type": "application/json",
			            "Accept": "application/json"
			        }
			    };
			request(options, function(err,response,body){
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					data.errmsg = resObj.errmsg;
				}else{
					data.cities = resObj.datas;
					/****** get cartype infos ***/
					options = {
					        method: 'GET',
					        rejectUnauthorized: false,
					        url: constants.HOST +"/api/cartype/view",
					        headers: {
					            "Content-Type": "application/json",
					            "Accept": "application/json"
					        }
					    };
					request(options, function(err,response,body){
						var resObj = JSON.parse(body);
						if(resObj.err == true){
							data.errmsg = resObj.errmsg;
						}else{
							data.cabs = resObj.datas;
							if(req.session.errmsg != null){
								data.errmsg = req.session.errmsg;
								req.session.errmsg =  null;
							}
							
							request.post({
								url : constants.HOST +'/api/ability/get',
								form : {
									token : req.session.auth.token,
									id : id
								}
							},function(err,response,body){
								var resObj = JSON.parse(body);
								if(resObj.err == true){
									data.errmsg = resObj.errmsg;
								}else{
									data.ability = resObj.data;		
									if(req.session.errmsg != null){
										data.errmsg = req.session.errmsg;
										req.session.errmsg = null;
									}
								}
								
								if(req.session.ability != null){
									data.ability = req.session.ability;
									req.session.ability = null;
								}
								console.log(data);
								res.render('ability/edit.html',data);
							});
						}					
					});
				}
			});
		}
	});
	
	app.get('/admin/ability/delete',function(req,res){
		var id =  req.query.id;
		if(id != null || id != ''){
			request.post({
				url : constants.HOST +'/api/ability/delete',
				form : {
					token : req.session.auth.token,
					id : id
				}
			},function(err,response,body){
				var resObj = JSON.parse(body);
				if(resObj.err == true){
					req.session.errmsg = resObj.errmsg;
				}else{
					req.session.errmsg = resObj.msg;
				}
				res.redirect('/admin');
		   });
		}
	});
	
	app.get('/admin/ability/booking',isAuth,function(req,res){
		var id  =  req.query.id;
		var total = req.query.total;
		request.post({
			url : constants.HOST +'/api/booking/getall',
			form : {
				token : req.session.auth.token,
				aid : id
			}
		},function(err,response,body){
			var resObj = JSON.parse(body);
			var data = {
				session : req.session,
				errmsg : '',
				bookings : [],
				total : total,
				title:'Availability',
				id : id
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;				
			}else{
				if(req.session.errmsg != null){
				  data.errmsg = req.session.errmsg;
				  req.session.errmsg = null;
				}
				data.bookings = resObj.datas;
			}
			res.render('ability/bookinglist.html',data);
		});
	});
	
	app.get('/admin/ability/bcancel',isAuth,function(req,res){
		var id = req.query.id;
		var aid = req.query.aid;
		request.post({
			url : constants.HOST +'/api/booking/cancel',
			form : {
				token : req.session.auth.token,
				id : id
			}
		},function(err,response,body){
			var resObj = JSON.parse(body);
			if(resObj.err == true){
				req.session.errmsg = resObj.errmsg;	
				backURL=req.header('Referer');
				res.redirect(backURL);
			}else{
				request.post({
					url : constants.HOST +'/api/ability/deletebooking',
					form : {
						token : req.session.auth.token,
						id : aid,
						bookingid : id
					}
				},function(err,response,body){
				   if(resObj.err == true){
					   req.session.errmsg = resObj.errmsg;							
				   }else{
					   req.session.errmsg = resObj.msg;
				   }				   
					backURL=req.header('Referer');
					res.redirect(backURL);
				});
			}			
		});
	});
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'ability';
		return next();
	}
}