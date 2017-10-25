var models = require('../models');
var helper = require('../helper');
var constants  = require('../constants');
var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/api/cartype/create',function(req,res){
		var vendor = req.body.vendor;
		var model = req.body.model;
		var seatmap = req.body.seatmap;
		var cat = req.body.cat;
		if(vendor == null || vendor == ''){
			res.send({ err : true , errmsg : "please enter vendor name."});
		}else if(model == null || model == ''){
			res.send({ err : true , errmsg : "please enter model name."});
		}else if(seatmap == null || seatmap == ''){
			res.send({ err : true , errmsg : "please select seatmap."});
		}else if(cat == null || cat == ''){
			res.send({ err : true , errmsg : "please select category."});
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
								var newRecord = new models.CarType;
								newRecord.vendor  = vendor;
								newRecord.model = model;
								newRecord.seatmap = seatmap;
								newRecord.cat = cat;
								newRecord.save(function(err){
									if(err){
										res.send({ err : true , errmsg : "DB ERROR"});
									}else{
										res.send({err : false, msg : "Successfully created",token : token.token});
									}
								});
							}
						});
					}
				}
			});	
		}
	});
	
	app.post('/api/cartype/edit',function(req,res){
		var vendor = req.body.vendor;
		var model = req.body.model;
		var seatmap = req.body.seatmap;
		var cat = req.body.cat;
		if(vendor == null || vendor == ''){
			res.send({ err : true , errmsg : "please enter vendor name."});
		}else if(model == null || model == ''){
			res.send({ err : true , errmsg : "please enter model name."});
		}else if(seatmap == null || seatmap == ''){
			res.send({ err : true , errmsg : "please select seatmap."});
		}else if(cat == null || cat == ''){
			res.send({ err : true , errmsg : "please select category."});
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
								models.CarType.findOne({_id : mongoose.Types.ObjectId(req.body.id)},function(err,cartype){
									cartype.vendor = vendor;
									cartype.model =  model;
									cartype.seatmap = seatmap;
									cartype.cat = cat;
									cartype.save(function(err){
										if(err){
											res.send({ err : true , errmsg : "DB ERROR"});
										}else{
											res.send({err : false, msg : "Successfully updated.",token : token.token});
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
	
	app.post('/api/cartype/delete',function(req,res){
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
							models.CarType.remove({_id : mongoose.Types.ObjectId(req.body.id)},function(err,obj){
								if(err){
									res.send({ err : true , errmsg : "DB ERROR"});
								}
								if(obj.result.n == 0){
									res.send({ err : true , errmsg : "invalid cartype id"});
								}else{
									res.send({ err : false, msg : "Successfully remved.",token : token.token});
								}
							});							
						}
					});
				}
			}
		});		
	});
	
	app.get('/api/cartype/view',function(req,res){
		models.CarType.find({},function(err,cartypes){
			if(err){
				res.send({ err : true , errmsg : "DB ERROR"});
			}
			if(cartypes){
				res.send({ err : false , datas: cartypes});
			}else{
				res.send({ err : false , datas : []});
			}
		});
	});
	
	app.post('/api/cartype/get',function(req,res){
		models.CarType.findOne({_id : mongoose.Types.ObjectId(req.body.id)},function(err,cartype){
			if(err){
				res.send({ err : true, errmsg :"DB ERROR"});
			}
			if(!cartype){
				res.send({ err : true, errmsg :"There is no car info which you just select."});
			}else{
				res.send({ err : false, data : cartype});
			}
		});
	});
};