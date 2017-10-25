var models = require('../models');
var constants  = require('../constants');
var helper  = require('../helper');
var md5 = require('md5');
var mongoose = require('mongoose');

module.exports = function(app){	
    app.post('/api/ability/create',function(req,res){
    	var startcity = req.body.startcity;
    	var endcity = req.body.endcity;
    	var date = req.body.date;
    	var startingtime = req.body.startingtime;
    	var cabtype = req.body.cabtype;
    	var numseats = req.body.numseats;
    	var price = req.body.price;
    	var pickup = req.body.pickup;
    	var drop = req.body.drop;
    	if(startcity == null || startcity == ''){
    		res.send({ err : true, errmsg :"please select start city."});
    	}else if(endcity == null || endcity == ''){
    		res.send({ err : true, errmsg : "please select end city."});
    	}else if(date == null || date == ''){
    		res.send({ err : true , errmsg :"please select date."});
    	}else if(startingtime == null || startingtime == ''){
    		res.send({ err : true , errmsg :"please select time"});
    	}else if(cabtype == null || cabtype == ''){
    		res.send({ err : true, errmsg :"please select a cab."})
    	}else if(numseats == null || numseats == ''){
    		res.send({ err : true , errmsg : "please select seats"});
    	}else if(price == null || price == ''){
    		res.send({ err : true, errmsg :"please enter price"});
    	}else if(pickup == null || pickup == '[]'){
    		res.send({ err : true, errmsg :"please select a pickup point at least."});
    	}else if(drop == null || drop == '[]'){
    		res.send({ err : true, errmsg :"please select a drop point at least."});
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
    						if(isActive){
    							var cabability = new models.CabAbility;
    							cabability.cabtype = mongoose.Types.ObjectId(cabtype);
    							cabability.startcity = mongoose.Types.ObjectId(startcity);
    							cabability.endcity = mongoose.Types.ObjectId(endcity);
    							cabability.date = date;
    							cabability.startingtime = startingtime;
    							var pickups  = JSON.parse(pickup);
    							for(i = 0;i < pickups.length;i++){
    								cabability.pickup[i] = {
    										point      : pickups[i].point,
    										pickuptime : pickups[i].pickuptime	
    								};
    							}
    							var drops = JSON.parse(drop);
    							for(i = 0; i< drops.length;i++){
    								cabability.drop[i] = {
    										point : drops[i].point
    								}
    							}
    							cabability.price = price;
    							cabability.numseats = numseats; 
    							cabability.status = 0;
    							cabability.save(function(err){
    								if(err){
    									res.send({ err : true , errmsg : err});
    								}else{
    									res.send({ err : false, msg : "Successfully created.", token : token.token});
    								}
    							});
    						}
    					});
    				}
    			}
    		});
    	}
    });
    
    app.post('/api/ability/edit',function(req,res){
    	var id = req.body.id;
    	var startcity = req.body.startcity;
    	var endcity = req.body.endcity;
    	var date = req.body.date;
    	var startingtime = req.body.startingtime;
    	var cabtype = req.body.cabtype;
    	var numseats = req.body.numseats;
    	var price = req.body.price;
    	var pickup = req.body.pickup;
    	var drop = req.body.drop;
    	var status = req.body.status;
    	if(startcity == null || startcity == ''){
    		res.send({ err : true, errmsg :"please select start city."});
    	}else if(endcity == null || endcity == ''){
    		res.send({ err : true, errmsg : "please select end city."});
    	}else if(date == null || date == ''){
    		res.send({ err : true , errmsg :"please select date."});
    	}else if(startingtime == null || startingtime == ''){
    		res.send({ err : true , errmsg :"please select time"});
    	}else if(cabtype == null || cabtype == ''){
    		res.send({ err : true, errmsg :"please select a cab."})
    	}else if(numseats == null || numseats == ''){
    		res.send({ err : true , errmsg : "please select seats"});
    	}else if(price == null || price == ''){
    		res.send({ err : true, errmsg :"please enter price"});
    	}else if(pickup == null || pickup == '[]'){
    		res.send({ err : true, errmsg :"please select a pickup point at least."});
    	}else if(drop == null || drop == '[]'){
    		res.send({ err : true, errmsg :"please select a drop point at least."});
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
							if(isActive){
								models.CabAbility.findOne({ _id :  mongoose.Types.ObjectId(req.body.id)},function(err,cabability){
									if(err){
										res.send({ err : true , errmsg : "DB Error"});
									}
									if(!cabability){
										res.send({ err : true, errmsg : "There is not current cab ability."});
									}else{
										cabability.cabtype = mongoose.Types.ObjectId(cabtype);
		    							cabability.startcity = mongoose.Types.ObjectId(startcity);
		    							cabability.endcity = mongoose.Types.ObjectId(endcity);
		    							cabability.date = date;
		    							cabability.startingtime = startingtime;
		    							var pickups  = JSON.parse(pickup);
		    							for(i = 0;i < pickups.length;i++){
		    								cabability.pickup[i] = {
		    										point      : pickups[i].point,
		    										pickuptime : pickups[i].pickuptime	
		    								};
		    							}
		    							var drops = JSON.parse(drop);
		    							for(i = 0; i< drops.length;i++){
		    								cabability.drop[i] = {
		    										point : drops[i].point
		    								}
		    							}
		    							cabability.price = price;
		    							cabability.numseats = numseats; 
		    							cabability.status = status;
										cabability.save(function(err){
											if(err){
												res.send({ err : true , errmsg : err});
											}else{
												res.send({ err : false, msg : "Successfully updated.", token : token.token});
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
    
    app.post('/api/ability/deletebooking',function(req,res){
    	var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
			}else{
				helper.checkuserstate(token.email,function(err,isActive,userid){
					if(err){
						res.send({ err : true, errmsg : "DB ERROR"});
					}
					if(!isActive){
						res.send({err : true, errmsg :"Current user has no active status"});
					}else{
						var id = req.body.id;
						var bookingid = req.body.bookingid;
						models.CabAbility.findOne({_id :mongoose.Types.ObjectId(id)},function(err,cab){
							if(err){
								res.send({ err: true, errmsg :"DB ERROR"});
							}
							if(!cab){
								res.send({ err : true, errmsg :"There is no availability which you just select."});
							}else{
								console.log(cab.bookings);
								var bookings = cab.bookings;
								var newbookings = [];
								var n = 0;
								for(i =0 ;i < bookings.length;i++){
									if(bookings[i] != bookingid){
										newbookings[n] = bookings[i];
										n++;
									}
								}
								cab.bookings = newbookings;
								cab.save(function(err){
									if(err){
										res.send({ err : true, errmsg :"DB ERROR"});
									}else{
										res.send({ err : false, msg :"Successfully cancelled."});
									}
								});
							}
						});
					}
				});
			}
		});
    });
    
    app.post('/api/ability/get',function(req,res){
    	models.CabAbility.findOne({_id : mongoose.Types.ObjectId(req.body.id)},function(err,ability){
    		if(err){
				res.send({ err : true, errmsg :"DB ERRROR"});
			}
			if(!ability){
				res.send({ err : true, errmsg :"There is no availability info which you just select."});
			}else{
				res.send({ err : false, data : ability});
			}
    	});
    });
    
    app.post('/api/ability/delete',function(req,res){
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
							models.CabAbility.remove({ _id :  mongoose.Types.ObjectId(req.body.id)},function(err,num){
								if(err){
									res.send({ err : true , errmsg : "DB ERROR"});
								}								
								if(num.result.n == 0){
									res.send({ err : true , errmsg : "invalid cabability id."});
								}else{
									res.send({ err : false, msg : "Successfully removed.",token: token.token});
								}
							});							
						}
					});
				}
			}
		});
    });
    
    app.get('/api/ability/viewall',function(req,res){
    	models.CabAbility.find({}).populate('startcity','name').populate('endcity','name').populate('cabtype')    	
    	.exec(function(err,cababilities){
    		if(err){
    			res.send({ err : true , errmsg : "DB ERROR"});
    		}
    		if(!cababilities){
    			res.send({ err : false, datas: []});
    		}else{
    			res.send({ err : false , datas : cababilities});
    		}
    	});
    });
    
    app.post('/api/ability/assign',function(req,res){
    	var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true , errmsg : "This Token is InValid Token or Expired Token."});
			}else{
				
				if(token.role != constants.USERTYPE.ADMIN){
					res.send({ err : true , errmsg : "Current User is not a ADMIN Account."});
				}else{
					var id = req.body.id;
					var name = req.body.name;
					var contact = req.body.contact;
					var reg = req.body.reg;
					models.CabAbility.findOne({ _id : mongoose.Types.ObjectId(id)},function(err,cabability){
						if(err){
							res.send({ err : true , errmsg :"DB ERROR"});
						}
						if(!cabability){
							res.send({ err : true , errmsg :"you couldn't assign because there is no availability which you just select."});
						}else{
							cabability.driver = {
									name : name,
									contact : contact,
									registration : reg,
									assigned : false
							};
							cabability.save(function(err){
								if(err){
									res.send({ err : true , errmsg :"DB ERROR"});
								}else{
									res.send({ err : false, msg :"Successfully assigned."});
								}
							})
						}
					});
				}
			}
		});
    });    
};