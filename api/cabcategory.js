var models = require('../models');
var helper = require('../helper');
var constants  = require('../constants');
var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/api/cabcat/create',function(req,res){
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
							var newRecord = new models.CabCate;
							newRecord.name = req.body.name;
							newRecord.save(function(err){
								if(err){
									res.send({err : true, errmsg : "DB ERROR"});
								}else{
									res.send({ err : false, msg : "Successfully created.",token: token.token});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.post('/api/cabcat/edit',function(req,res){
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
							models.CabCate.findOne({_id : mongoose.Types.ObjectId(req.body.cabcateid)},function(err,cabcate){
								if(err){
									res.send({ err : true, errmsg : "DB ERROR"});
								}
								if(!cabcate){
									res.send({ err : true, errmsg : "Invalid cabcate id."});
								}else{
									if(req.body.name != null){
										cabcate.name = req.body.name;
										console.log(cabcate);
									}
									cabcate.save(function(err){
										if(err){
											res.send({err : true, errmsg : "DB ERROR"});
										}else{
											res.send({err : false, msg :"Scussfully updated.",token : token.token});
										}
									});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.post('/api/cabcat/delete',function(req,res){
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
							models.CabCate.remove({_id : mongoose.Types.ObjectId(req.body.cabcateid)},function(err,obj){
								if(err){
									res.send({err : true, errmsg : "DB ERROR"});
								}
								if(obj.result.n == 0){
									res.send({err: true, errmsg :"invalid cabcategory id."});
								}else{
									res.send({err: false, msg : "Successfully delete.",token : token.token});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.post('/api/cabcat/viewall',function(req,res){
		models.CabCate.find({},function(err,cabcates){
			if(err){
				res.send({err : true, errmsg : "DB ERROR"});
			}
			if(cabcates){
				res.send({ err : false, datas : cabcates});
			}else{
				res.send({err : false, datas: []});
			}
		});
	});
}