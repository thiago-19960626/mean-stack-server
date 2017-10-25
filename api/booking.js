var models = require('../models');
var constants  = require('../constants');
var helper  = require('../helper');
var md5 = require('md5');
var mongoose = require('mongoose');

module.exports = function(app){
	app.post('/api/booking/create',function(req,res){
		var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true, errmsg : "This token is invalid token."});
			}else{
				helper.checkuserstate(token.email,function(err,isActive,userid){
					if(err){
						res.send({ err : true, errmsg : "DB ERROR"});
					}
					if(!isActive){
						res.send({ err : true, errmsg : "Current user status is inactive."});
					}else{
						var newBooking = new models.Booking;
						    newBooking.from = req.body.from;
						    newBooking.to = req.body.to;
						    newBooking.date = req.body.date;
						    newBooking.status = req.body.status;
						    newBooking.amount = req.body.amount;
						    newBooking.passengers = [
						                             {
						                            	 title : req.body.maspasstitle,
						                            	 fname : req.body.maspassfname,
						                            	 lname : req.body.maspasslname,
						                            	 contact: req.body.maspasscontact
						                             },
						                             {
						                            	 title : req.body.slvpasstitle,
						                            	 fname : req.body.slvpassfname,
						                            	 lname : req.body.slvpasslname
						                             }
						                             ];
						    newBooking.seats = req.body.seats;
						    newBooking.cab_num = mongoose.Types.ObjectId(req.body.cabnum);
						    newBooking.created_by = userid;
						    newBooking.save(function(err){
						    	if(err){
						    		res.send({ err : true , errmsg : "DB ERROR"});
						    	}else{
						    		res.send({ err : false , booking: newBooking, token : token.token});
						    	}
						    });
					}
				});
			}
		});
	});
	
	app.get('/api/booking/view',function(req,res){
		var token = req.query.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true, errmsg : "This token is invalid token."});
			}else{
				helper.checkuserstate(token.email,function(err,isActive,userid){
					if(err){
						res.send({ err : true, errmsg : "DB ERROR"});
					}
					if(!isActive){
						res.send({ err : true, errmsg : "Current user status is inactive."});
					}else{						
						models.Booking.find({ created_by : userid} , function(err,bookings){
							if(err){
								res.send({ err : true, errmsg : "DB ERROR"});
							}
							if(bookings){
								res.send({ err : false, datas : bookings , token : token.token});
							}else{
								res.send({ err : false, datas : [] , token : token.token});
							}
						});
					}
				});				
			}
		});
	});
	
	app.post('/api/booking/cancel',function(req,res){
		var token = req.body.token;
		helper.tokenvalidate(token,function(validate,token){
			if(!validate){
				res.send({ err : true, errmsg : "This token is invalid token."});
			}else{
				helper.checkuserstate(token.email,function(err,isActive,userid){
					if(err){
						res.send({ err : true, errmsg : "DB ERROR"});
					}
					if(!isActive){
						res.send({ err : true, errmsg : "Current user status is inactive."});
					}else{		
						var bookingid = req.body.id;
						models.Booking.update({_id : mongoose.Types.ObjectId(bookingid)},{$set : { status : constants.BOOKINGSTATUS.CANCELLED}},{'multi': true},function(err,num){
							if(err){
								res.send({ err : true , errmsg : "you cann't cancel current booking."})
							}else{
								if(num == 0){
									res.send({ err : true , errmsg : "This booking don't exists."});
								}else{
									res.send({ err : false, msg : "Successfully updated.",token : token.token});
								}
							}
						});
					}
				});
			}
		});
	});
	
	app.get('/api/booking/viewall',function(req,res){
		var token = req.query.token;
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
							res.send({ err : true, errmsg : "Current user status is inactive."});
						}else{
							models.Booking.find({} , function(err,bookings){
								if(err){
									res.send({ err : true, errmsg : "DB ERROR"});
								}
								if(bookings){
									res.send({ err : false, datas : bookings , token : token.token});
								}else{
									res.send({ err : false, datas : [] , token : token.token});
								}
							});
						}
					});
				}
			}
		});		
	});
	
	app.post('/api/booking/edit',function(req,res){
		var cab_num = req.body.cab_num;
		var created_by =  req.body.created_by;
		var date =  req.body.date;
		var status = req.body.status;
		var id = req.body.id;
		if(id == null || id == ''){
			res.send({ err : true , errmsg : "please enter booking id."});
		}else if(cab_num == null || cab_num == ''){
			res.send({ err : true , errmsg : "please enter availability id."});
		}else if(created_by == null || created_by == ''){
			res.send({ err : true , errmsg : "please enter user id."});
		}else if(date == null || date == ''){
			res.send({ err : true , errmsg : "please select date."});
		}else if(status == null || status == ''){
			res.send({ err : true , errmsg : "please select status."});
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
								res.send({ err : true, errmsg : "Current user status is inactive."});
							}else{								
								models.Booking.findOne({ _id : mongoose.Types.ObjectId(id) },function(err, booking){
									if(err){
										res.send({ err : true , errmsg : "DB ERROR"});
									}
									if(!booking){
										res.send({ err : true , errmsg : "Current booking don't exists"});
									}else{
										booking.cab_num = cab_num;
										booking.date = date;
										booking.created_by = created_by;
										booking.status =  status;
										booking.save(function(err){
											if(err){
												res.send({ err : true , errmsg : "DB ERROR"});
											}else{
												res.send({ err : false , msg : "Successfully updated.",token : token.token});
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
	
	app.post('/api/booking/getall',function(req,res){
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
							res.send({ err : true, errmsg :"Your current status is inactive."});
						}else{
							models.Booking.find({cab_num : mongoose.Types.ObjectId(req.body.aid),status :{ $in : [constants.BOOKINGSTATUS.SCHEDULED_PAID,constants.BOOKINGSTATUS.SCHEDULED_UNPAID]} }).populate('created_by')
							.exec(function(err,bookings){
								if(err){
									res.send({ err : true , errmsg :"DB ERROR"});
								}
								if(!bookings){
									res.send({ err : false, datas:[],token : token.token});
								}else{
									res.send({ err : false, datas:bookings,token : token.token});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.post('/api/booking/getallbyuser',function(req,res){
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
							res.send({ err : true, errmsg :"Your current status is inactive."});
						}else{
							models.Booking.find({created_by : mongoose.Types.ObjectId(req.body.uid),status :{ $in : [constants.BOOKINGSTATUS.SCHEDULED_PAID,constants.BOOKINGSTATUS.SCHEDULED_UNPAID]} }).populate('created_by')
							.exec(function(err,bookings){
								if(err){
									res.send({ err : true , errmsg :"DB ERROR"});
								}
								if(!bookings){
									res.send({ err : false, datas:[],token : token.token});
								}else{
									res.send({ err : false, datas:bookings,token : token.token});
								}
							});
						}
					});
				}
			}
		});
	});
	
	app.post('/api/booking/get',function(req,res){
		var id = req.body.id;
		models.Booking.findOne({_id :  mongoose.Types.ObjectId(id)},function(err,booking){
			if(err){
				res.send({ err : true, errmsg :"DB ERROR"});
			}
			if(!booking){
				res.send({ err : true, errmsg :"There is no booking which you just select."});
			}else{
				res.send({ err : false, data : booking});
			}
		});
	});
};