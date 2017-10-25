var request  = require('request');
var constants = require('../constants');

module.exports = function(app){
	app.get('/admin/booking/list',isAuth,function(req,res){
		var options = {
		        method: 'GET',
		        rejectUnauthorized: false,
		        url: constants.HOST+"/api/booking/viewall?token="+req.session.auth.token,
		        headers: {
		            "Content-Type": "application/json",
		            "Accept": "application/json"
		        }

		    };
		request(options, function(err,response,body){
			var resObj = JSON.parse(body);
			var data = {
				errmsg : '',
				session : req.session,
				status  : constants.A_BOOKINGSTATUS
			};
			if(resObj.err == true){
				data.errmsg = resObj.errmsg;
			}else{
				data.bookings = resObj.datas;
				if(req.session.errmsg != null){
					data.errmsg = req.session.errmsg;
					req.session.errmsg = null;
				}
			}
			res.render('booking/list.html',data);
		});
	});
	
	app.get('/admin/booking/edit',isAuth,function(req,res){
		var id = req.query.id;
		if(id != null || id != ''){
			request.post({
				url :constants.HOST + '/api/booking/get',
				form :{
					id : id
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err == true){	
						req.session.errmsg = resObj.errmsg;
						res.redirect('/admin/booking/list');
					}else{
						var data = {
							session : req.session,
							booking : resObj.data
						};
						if(req.session.errmsg != null){
							data.errmsg  =req.session.errmsg;
							req.session.errmsg = null;
						}
						if(req.session.booking != null){
							data.booking = req.session.booking;
							req.session.booking = null;
						}
						res.render('booking/edit.html',data);
					}
			});
		}
	});
	
	app.post('/admin/booking/save',isAuth,function(req,res){
		var id = req.body.id;
		var cab_num = req.body.cab_num.trim();
		var status = req.body.status;
		var created_by = req.body.created_by.trim();
		var date = req.body.date;
		if(id != null || id != ''){
			request.post({
				url :constants.HOST + '/api/booking/edit',
				form :{
					token  : req.session.auth.token,
					cab_num : cab_num,
					status  : status,
					created_by : created_by,
					date : date,
					id : id
				}
				},
				function(err,response,body){
					var resObj = JSON.parse(body);
					if(resObj.err  ==  true){
						req.session.errmsg = resObj.errmsg;
						req.session.booking = {
							_id : id,
							cab_num : cab_num,
							status : status,
							date : date,
							created_by : created_by
						};
						backURL=req.header('Referer');
						res.redirect(backURL);
					}else{
						req.session.errmsg = resObj.msg;
						res.redirect('/admin/booking/list');
					}
			});
		}
	});
};

function isAuth(req,res,next){
	if( req.session.auth == null ){
		res.redirect('/admin/login');
	}else{
		req.session.controller = 'booking';
		return next();
	}
}