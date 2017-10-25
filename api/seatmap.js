var models = require('../models');
var helper = require('../helper');
var constants  = require('../constants');
var mongoose = require('mongoose');

module.exports = function(app){
   app.post('/api/seatmap/create',function(req,res){
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
						   var newRecord = new models.Seatmap;
						   newRecord.num = req.body.num;
						   newRecord.desc = req.body.desc;
						   newRecord.save(function(err){
							  if(err){
								  res.send({ err : true, errmsg : "DB ERROR"});
							  }else{
								  res.send({ err : false, msg : "Successfully created.",token : token.token});
							  } 
						   });
						}
					});
				}
			}
		});
   });
   
   app.post('/api/seatmap/edit',function(req,res){
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
							   models.Seatmap.findOne({ _id  : mongoose.Types.ObjectId(req.body.seatmapid)},function(err, seatmap){
								   if(err){
									   res.send({ err : true , errmsg :"DB Error"});
								   }
								   if(!seatmap){
									   res.send({ err : true , errmsg :"invalid seatmap id"});
								   }else{
									   if(req.body.num != null){
										   seatmap.num = req.body.num;
									   }
									   if(req.body.desc != null){
										   seatmap.desc = req.body.desc;
									   }
									   seatmap.save(function(err){
										  if(err){
											  res.send({err : true , errmsg : "DB ERROR"});
										  }else{
											  res.send({err : false, msg : "Successfully updated.",token : token.token});
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
   
   app.post('/api/seatmap/delete',function(req,res){
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
							   models.Seatmap.remove({ _id  : mongoose.Types.ObjectId(req.body.seatmapid)},function(err, obj){
								   if(err){
									   res.send({ err : true, errmsg : "DB ERROR"});
								   }
								   if(obj.result.n == 0){
									   res.send({ err : true, errmsg : "Invalid seatmap id."});
								   }else{
									   res.send({ err : false, msg : "Successfully removed.",token : token.token});
								   }
							   });
							}
						});
					}
				}
			});
	  });
   
   app.get('/api/seatmap/viewall',function(req,res){
	   models.Seatmap.find({},function(err, seats){
		  if(err){
			  res.send({ err : true, errmsg : "DB ERROR"});
		  }
		  if(seats){
			  res.send({ err : false, datas: seats});
		  }else{
			  res.send({ err : false, datas: []});
		  }
	   });
   });
};