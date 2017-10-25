var models = require('./models');
var md5 = require('md5');
var constants  = require('./constants');

module.exports.tokenvalidate = function(token,callback){
	if(token == null || token == ''){
			console.log("token is null or empty string");
			callback(false,null);
	}else{
		models.Token.findOne({token : token},function(err, token){
		  if(err){
			  callback(false,null);
		  }
		  if(!token){
			  callback(false,null);
		  }else{
			  var current_dt = new Date().getTime();
			  var diff = current_dt - token.expire_dt;
			  if(diff < 3 * 60 * 60 * 1000){
				  token.expire_dt = current_dt;
				  token.save(function(err){
					 if(err){
						 callback(false,null);
					 }else{
						 callback(true,token);
					 }
				  });
			  }else{
				  callback(false,null);
			  }
		  }
		});
	}
};


module.exports.updatetoken = function(email,  pass, role, callback){
	models.Token.findOne({ email : email ,pass : pass}, function(err , token){
		if(err){
			callback(err,null);
		}
		if(!token){
			var token = new models.Token;
			token.email = email;
			token.pass = pass;			
			token.role = role;
			token.expire_dt = new Date().getTime();
			token.token = md5(token.email) + md5(token.pass)+ md5(token.role) + md5(token.expire_dt);
		}else{
			token.token = md5(token.email) + md5(token.pass)+ md5(token.role) + md5(token.expire_dt);
			token.expire_dt = new Date().getTime();
		}
		
		token.save(function(err){
			if(err){
				callback(err,null);
			}else{
				callback(null,token);
			}
		});	
		
	});
};

/*
 * callback(err,isActive,userid);
 * 
 */
module.exports.checkuserstate = function(email,callback){
	models.User.findOne({ email : email}, function(err, user){
		if(err){
			callback(true,false,null);
		}
		if(!user){
			callback(true,false,null);
		}else{
			if(user.status == constants.USERSTATUS.ACTIVE){
				callback(false,true,user._id);
			}else{
				callback(false,false,user._id);
			}
		}
	});
};