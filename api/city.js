var models = require('../models');
var helper = require('../helper');
var constants  = require('../constants');
var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/api/city/create',function(req,res){
		var token = req.body.token;
		var name = req.body.name.trim();
		var state =  req.body.state.trim();
		var points  = req.body.points;
		if(name == null || name == ''){
			res.send({ err : true , errmsg : "please enter city name."});
		}else if(state == null || state == ''){
			res.send({ err : true , errmsg : "please enter state name."});
		}else if(points == null || points == ''){
			res.send({ err : true , errmsg : "please enter a pick/drop point at least."});
		}else{
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
								models.City.findOne({ name : req.body.name},function(err,city){
									if(err){
										res.send({ err : true, errmsg : "DB ERROR"});
									}
									if(city){
										res.send({ err : true , errmsg :"The city name already exists."});
									}else{
										var newCity = new models.City;
										newCity.name = req.body.name;
										newCity.state = req.body.state;
										newCity.points = points.split(',');
										newCity.save(function(err){
											if(err){
												res.send({ err : true , errmsg : "DB ERROR"});
											}else{
												res.send({ err : false, msg : "Successfully create.",city : newCity,token : token.token});
											}
										});
									}
								});							
							}
						});
					}
				}
			});
		}		
	});
	
	app.post('/api/city/edit',function(req,res){
		
		var token = req.body.token;
		var name = req.body.name.trim();
		var state =  req.body.state.trim();
		var points  = req.body.points;	
		if(name == null || name == ''){
			res.send({ err : true , errmsg : "please enter city name."});
		}else if(state == null || state == ''){
			res.send({ err : true , errmsg : "please enter state name."});
		}else if(points == null || points == ''){
			res.send({ err : true , errmsg : "please enter one pick/drop point at least."});
		}else{
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
								models.City.findOne({ _id :  mongoose.Types.ObjectId(req.body.id)},function(err,city){
									if(err){
										res.send({ err : true , errmsg : "DB ERROR"});
									}									
									if(city){										
										city.name = req.body.name;										
										city.state = req.body.state;
										city.points = points.split(',');
										city.save(function(err){
											if(err){
												res.send({ err : true , errmsg : "DB ERROR"});
											}else{
												res.send({ err : false, msg : "Successfully updated.",city : city,token : token.token});
											}
										});
									}else{
										res.send({ err : true , errmsg : "There is no city info which you just select."});
									}
								});
							}
						});
					}
				}
			});	
		}
	});
	
	app.post('/api/city/delete',function(req,res){
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
							models.City.remove({ _id :  mongoose.Types.ObjectId(req.body.id)},function(err,obj){
							   if(err){
								   res.send({ err : true, errmsg : "DB ERROR"});
							   }
							   if(obj.result.n == 0){
								   res.send({ err : true, errmsg : "invalid city id."});
							   }else{
								   res.send({ err : false, msg : "Successfully deleted.",token : token.token});
							   }
							});
						}
					});
				}
			}
		});
	});	
	
	app.get('/api/city/viewall',function(req,res){
		models.City.find({},function(err,cities){
			if(err){
				res.send({ err : true , errmsg : "DB ERROR"});
			}
			if(cities){
				res.send({ err : false, datas : cities});
			}else{
				res.send({ err : false, datas : []});					
			}
		});
	});
	
	app.post('/api/city/get',function(req,res){
		models.City.findOne({_id : mongoose.Types.ObjectId(req.body.id)},function(err,city){
			if(err){
				res.send({ err : true, errmsg :"DB ERRROR"});
			}
			if(!city){
				res.send({ err : true, errmsg :"There is no city info which you just select."});
			}else{
				res.send({ err : false, data : city});
			}
		});
	});
}