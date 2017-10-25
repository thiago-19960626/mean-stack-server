var models = require('../models');
var helper = require('../helper');
var constants  = require('../constants');
var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/api/route/create',function(req,res){
		var from = req.body.from;
		var to  = req.body.to;
		var dis = req.body.dis;
		var hours = req.body.hours;
		if(from == null || from  == '' || to == null || to == ''){
			res.send({ err : true , errmsg : "please select city name"});
		}else if(dis == null || dis == ''){
			res.send({ err : true , errmsg :"please enter distance."});
		}else if(hours == null || hours == ''){
			res.send({ err : true , errmsg :"please enter travel hours."});
		}else{
			from = from.trim();
			to = to.trim();
			dis = dis.trim();
			hours = hours.trim();
			var token = req.body.token;
			helper.tokenvalidate(token,function(validate,token){
				if(!validate){				
					res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
				}else{
					
					if(token.role != constants.USERTYPE.ADMIN){
						res.send({ err : true , errmsg : "Current User is not a ADMIN Account."});
					}else{
						helper.checkuserstate(token.email,function(err,isActive,userid){
							if(err){
								res.send({ err : true, errmsg : "DB ERROR"});
							}
							if(!isActive){
								res.send({ err : true , errmsg : "you don't have Active Status."});
							}else{
								var newRoute = new models.Route;
								newRoute.from = mongoose.Types.ObjectId(req.body.from);
								newRoute.to = mongoose.Types.ObjectId(req.body.to);
								newRoute.dis = req.body.dis;
								newRoute.hours = req.body.hours;
								newRoute.save(function(err){
									if(err){
										res.send({ err : true , errmsg : "DB ERROR"});
									}else{
										res.send({ err : false , msg : "Successfully created.", token : token.token});
									}
								});
							}
						});
					}
				}
			});
		}		
	});
	
	app.post('/api/route/edit',function(req,res){
		var from = req.body.from.trim();
		var to  = req.body.from.trim();
		var dis = req.body.dis;
		var hours = req.body.hours.trim();
		if(from == null || from  == '' || to == null || to == ''){
			res.send({ err : true , errmsg : "please select city name"});
		}else if(dis == null || dis == ''){
			res.send({ err : true , errmsg :"please enter distance."});
		}else if(hours == null || hours == ''){
			res.send({ err : true , errmsg :"please enter travel hours."});
		}else{
			var token = req.body.token;
			helper.tokenvalidate(token,function(validate,token){
				if(!validate){				
					res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
				}else{
					
					if(token.role != constants.USERTYPE.ADMIN){
						res.send({ err : true , errmsg : "Current User is not a ADMIN Account."});
					}else{
						helper.checkuserstate(token.email,function(err,isActive,userid){
							if(err){
								res.send({ err : true, errmsg : "DB ERROR"});
							}
							if(!isActive){
								res.send({ err : true , errmsg : "you don't have Active Status."});
							}else{
								models.Route.findOne( { _id : mongoose.Types.ObjectId(req.body.id)},function(err,route){
									if(req.body.from != null){
										route.from =  mongoose.Types.ObjectId(req.body.from);
									}
									if(req.body.to != null){
										route.to  =  mongoose.Types.ObjectId(req.body.to);
									}
									if(req.body.dis != null){
										route.dis = req.body.dis;
									}
									if(req.body.hours != null){
										route.hours = req.body.hours;
									}
									route.save(function(err){
										if(err){
											res.send({ err : true , errmsg : "DB ERROR"});
										}else{
											res.send({ err: false, msg : "Successfully updated.", token : token.token});
										}
									});
								});
							}
						});
					}
				}
			});
		}
	});
	
	app.post('/api/route/delete',function(req,res){
		var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){				
				res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
			}else{
				
				if(token.role != constants.USERTYPE.ADMIN){
					res.send({ err : true , errmsg : "Current User is not a ADMIN Account."});
				}else{
					helper.checkuserstate(token.email,function(err,isActive,userid){
						if(err){
							res.send({ err : true, errmsg : "DB ERROR"});
						}
						if(!isActive){
							res.send({ err : true , errmsg : "you don't have Active Status."});
						}else{
							models.Route.remove( { _id : mongoose.Types.ObjectId(req.body.id)},function(err,obj){
								if(err){
									res.send({ err : true , errmsg :"DB ERROR"});
								}
								if(obj.result.n == 0){
									res.send({ err : true , errmsg : "invalid route id."});
								}else{
									res.send({ err : false, msg : "Successfully removed.", token : token.token});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.get('/api/route/viewall',function(req,res){
		models.Route.find({}).populate('from','name').populate('to','name').exec(function(err,routes){
			console.log(err);
			if(err){
				res.send({ err : true, errmsg :"DB ERROR"});
			}
			if(routes){
				res.send({ err : false, datas: routes});
			}else{
				res.send({ err : false, datas: []});
			}
		});		
	});
	
	app.post('/api/route/get',function(req,res){
		models.Route.findOne({_id : mongoose.Types.ObjectId(req.body.id)}).populate('from').populate('to').exec(function(err,route){
			if(err){
				res.send({ err : true, errmsg : "DB ERROR"});
			}
			if(!route){
				res.send({ err : true, errmsg : "There is no route info which you just select."});
			}else{
				res.send({ err : false, data : route});
			}
		});
	});
	
	app.post('/api/route/availableroutes',function(req,res){
		models.Route.find({from : mongoose.Types.ObjectId(req.body.from)}).populate('from','name').populate('to','name').exec(function(err,routes){
			console.log(err);
			if(err){
				res.send({ err : true, errmsg :"DB ERROR"});
			}
			if(routes){
				res.send({ err : false, datas: routes});
			}else{
				res.send({ err : false, datas: []});
			}
		});	
	});
};