var models = require('../models');
var constants  = require('../constants');
var helper  = require('../helper');
var md5 = require('md5');
var mongoose = require('mongoose');
var fs = require('fs');

module.exports = function(app){
	app.post('/api/user/register',function(req,res){
	    var email = req.body.email.trim();
	    var pass = req.body.pass.trim();	  
	    if(email == null || email == ''){
    		res.send({ err : true , errmsg :"please enter email address."});
    	}else if(pass == null || pass == ''){
    		res.send({ err : true , errmsg :"please enter password."});
    	}else{
		    models.User.findOne({email : email},function(err,user){
		    	var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    	var strongRegex = new RegExp("^(?=.{7,})");
		    	if(err){
		    		res.send({ err : true , errmsg : err});
		    	}else if(user){
		    		res.send({ err : true, errmsg : "Email already exists."});
		    	}else{		    	
			    	if(!filter.test(email)){
			    		res.send({ err : true , errmsg :"Invalid email."});
			    	}else if(!strongRegex.test(pass)){
			    		res.send({ err : true , errmsg :"password must be at least 7 charactors."});
			    	}
			    	else{
			    		var newUser = new models.User;
				    	newUser.email = email;
				    	newUser.pass = md5(pass);
			    		newUser.role = constants.USERTYPE.ADMIN;
				    	newUser.created_at = new Date().getTime();
				    	newUser.status = constants.USERSTATUS.ACTIVE;
				    	newUser.save(function(err){
				    		if(err){
				    			res.send({ err : true , errmsg : err});
				    		}else{
					    		helper.updatetoken(newUser.email, newUser.pass, newUser.role,function(err,token){
					    			if(err){
					    				res.send({ err : true, errmsg : "DB ERROR"});
					    			}else{
					    				res.send({ err : false, token : token.token});
					    			}
					    		});
				    		}
				    	});
			    	}		    	
		    	}
		    });
    	}
	});
	
	app.post('/api/user/login',function(req,res){
		var email = req.body.email.trim();
		var pass = req.body.pass.trim();		
		if(email == null || email ==''){
			res.send({ err : true , errmsg : "please enter email address."});
		}else if(pass == null || pass == ''){
			res.send({ err : true , errmsg : "please enter password."});
		}else{
			models.User.findOne({email : email,pass : md5(pass)}, function(err,user){
				if(err){
					res.send({ err : true , errmsg : err});
				}else if(!user){
					res.send({ err : true , errmsg : "Invalid Email or Password."});
				}else{					
					helper.updatetoken(user.email,user.pass,user.role,function(err,token){
						if(err){
							res.send({ err : true , errmsg : "DB ERROR"});
						}else{
							res.send({ err : false, token : token.token});
						}
					});					
				}			
			});
		}
	});
	
	app.post('/api/user/superlogin',function(req,res){
		var email = req.body.email.trim();
		var pass = req.body.pass;		
		if(email == null || email ==''){
			res.send({ err : true , errmsg : "please enter email address."});
		}else if(pass == null || pass == ''){
			res.send({ err : true , errmsg : "please enter password."});
		}else{
			models.User.findOne({email : email,pass : md5(pass)}, function(err,user){
				if(err){
					res.send({ err : true , errmsg : err});
				}else if(!user){
					res.send({ err : true , errmsg : "Invalid Email or Password."});
				}else{	
					if(user.role != constants.USERTYPE.ADMIN){
						res.send({ err : true , errmsg : "Current user is not admin user."});
					}else{
						helper.updatetoken(user.email,user.pass,user.role,function(err,token){
							if(err){
								res.send({ err : true , errmsg : "DB ERROR"});
							}else{
								res.send({ err : false, token : token.token, fullname : user.fname +" "+user.lname , createdat : user.created_at,photo : user.photo});
							}
						});	
					}									
				}			
			});
		}
	});
	
	app.get('/api/user/profile',function(req,res){
		var token = req.query.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true , errmsg : "This Token is Invalid Token or Expired Token."});
			}else{				
				models.User.findOne({ email : token.email, pass : token.pass} , function(err, user){
					if(err){
						res.send({ err : true , errmsg : "DB ERROR."});
					}
					if(!user){
						res.send({ err : true, errmsg : "User not found."});
					}
					res.send({ err : false , data : user,token : token.token});
				});				
			}				
		});	
	});
	
	app.post('/api/user/profile',function(req,res){
		var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true , errmsg : "This Token is Invalid Token or Expired Token."});
			}else{
				models.User.findOne({ email : token.email, pass : token.pass} , function(err, user){
					if(err){
						res.send({ err : true , errmsg : "DB ERROR"});
					}
					if(!user){
						res.send({ err : true, errmsg : "User not found."});
					}
					
					var fname = req.body.fname;
					if(fname != null){
						user.fname = fname;
					}
					var lname = req.body.lname;
					if(lname != null){
						user.lname = lname;
					}
					var gen = req.body.gen;
					if(gen != null){
						user.gen = gen;
					}
					var dob = req.body.dob;
					if(dob != null){
						user.dob = dob;
					}
					var mob = req.body.mob;
					if(mob != null){
						user.mob = mob;
					}
					if(req.body.photo != ''){
						if(user.photo != null){						 
							fs.unlinkSync(__dirname+"/../public/images/"+user.photo);
						}
						user.photo = req.body.photo;
					}
					
					user.save(function(err){
						if(err){
							res.send({ err : true , errmsg : "DB ERROR"});
							console.log(err);
						}
						res.send({ err : false , token : token.token.token, msg : "Successfully updated."});
					});
					
				});
			}
		});			
	});
	
	app.get('/api/user/list',function(req,res){
		var token = req.query.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
			}else{
				if(token.role != constants.USERTYPE.ADMIN){
					
					res.send({ err : true , errmsg : "Current User is not a ADMIN Account."});
					
				}else{	
					
					models.User.find({},'_id fname lname email dob mob gen status role created_at',function(err,users){
						if(err){
							res.send({ err : true , errmsg : err});
						}
						if(!users){
							res.send({ err : false , datas : []});
						}else{
							res.send({ err : false , datas : users,token : token.token});
						}
					});
					
				}
			}
		});			
	});
	
	app.post('/api/user/changestatus',function(req,res){
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
						if(isActive){
							var _id = mongoose.Types.ObjectId(req.body.id);
							models.User.findOne({ _id : _id},function(err,user){
								if(err){
									res.send({ err : true , errmsg : "DB ERROR"});
								}
								if(!user){
									res.send({ err : true , errmsg : "This is invalid email."});
								}else{
									if(user.status == constants.USERSTATUS.ACTIVE){
										user.status = constants.USERSTATUS.INACTIVE;
									}else{
										user.status = constants.USERSTATUS.ACTIVE;
									}									
									user.save(function(err){
										if(err){
											res.send({ err : true , errmsg : "DB ERROR"});
										}else{
											res.send({ err : false, msg : "Successfully changed.", token : token.token});
										}
									});
								}
							});
						}else{
							res.send({ err : true , errmsg : "Current User Status is Inactive."});
						}
					});														
				}
				
			}
		});
	});
	
	app.post('/api/user/deactivate',function(req,res){
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
						if(isActive){
							var _id = mongoose.Types.ObjectId(req.body.uid);
							models.User.findOne({ _id : _id},function(err,user){
								if(err){
									res.send({ err : true , errmsg : "DB ERROR"});
								}
								if(!user){
									res.send({ err : true , errmsg : "This is invalid email."});
								}else{
									user.status = constants.USERSTATUS.INACTIVE;
									user.save(function(err){
										if(err){
											res.send({ err : true , errmsg : "DB ERROR"});
										}else{
											res.send({ err : false, msg : "Successfully updated.", token : token.token});
										}
									});
								}
							});	
						}else{
							res.send({ err : true , errmsg : "Current User status in Inactive."});
						}
					});
				}
				
			}
		});
	});
	
	
	app.post('/api/user/logout',function(req,res){
		var token = req.body.token;
		models.Token.findOne({ token : token},function(err, token){
			if(err){
				res.send({ err : true , errmsg : "DB ERROR"});
			}
			if(token){
				var cur_dt  = new Date().getTime();
				token.expire_dt = cur_dt - 2 * 60 * 60 * 1000;
				token.save(function(err){
					if(err){
						res.send({ err : true , errmsg : "DB ERROR"});
					}else{
						res.send({ err :false , msg : "Successfully logout."});
					}
				});
			}else{
				res.send({ err : true , errmsg : "invalid token."});
			}
		})
	});
};