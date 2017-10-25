var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema  = new Schema({
	 fname 		: String,
	 lname 		: String,
	 email 		: String,
	 pass  		: String,
	 mob   		: String,
	 role  		: Number,
	 gen   		: Boolean,
	 dob   		: Date,
	 status     : Number,
	 created_at : Date,
	 photo      : String
});

 module.exports.User = mongoose.model('user',UserSchema);

 var CitySchema = new Schema({
		name    : String,
		state   : String,
		points  : [String]
	});

module.exports.City = mongoose.model('city',CitySchema);
 
 var TokenSchema = new Schema({
	email     :  String,
	pass  	  :  String,
	role 	  :  Number,
	expire_dt :  Date,
	token     :  String
 });
 
 module.exports.Token = mongoose.model('token',TokenSchema);
 
 var BookingSchema  = new Schema({	 
	 date       : Date,	
	 status     : Number,	 
  	 cab_num      : Schema.Types.ObjectId,
  	 created_by   : { type :Schema.Types.ObjectId,ref:'user'}
});
 
module.exports.Booking = mongoose.model('booking',BookingSchema);

var CarTypeSchema = new Schema({
	vendor   : String,
	model    : String,
	seatmap  : Number,
	cat      : String
});

module.exports.CarType = mongoose.model('cartype',CarTypeSchema);

var CabAbilitySchema  = new Schema({
	 cabtype 		: { type : Schema.Types.ObjectId, ref:'cartype'},
	 startcity      : { type : Schema.Types.ObjectId, ref :'city'},
	 endcity        : {type : Schema.Types.ObjectId, ref:'city'},
	 date   		: Date,
	 startingtime   : String,
	 pickup         : [Schema.Types.Mixed],//[{point : "",pickuptime : ""},..]
	 drop           : [Schema.Types.Mixed],//[{point : ""},....]
	 price         : Number,
	 bookings       : [{type :Schema.Types.ObjectId,ref :'booking'}],
	 numseats       : Number,
	 remainingseats : Number,
	 status         : Number,
	 driver         : {
		   name    : String,
		   contact : String,
		   registration : String,
		   assigned : Boolean
	 } 
});

module.exports.CabAbility = mongoose.model('cabability',CabAbilitySchema);

var RouteSchema = new Schema({
	from : { type : Schema.Types.ObjectId ,ref:'city'},
	to   : { type : Schema.Types.ObjectId ,ref:'city'},
	dis   : Number,
	hours : Number
});

module.exports.Route = mongoose.model('route',RouteSchema);

var SeatmapSchema  = new Schema({
	num  : Number,
	desc : String
});

module.exports.Seatmap = mongoose.model('seatmap',SeatmapSchema);

var CabCateSchema  = new Schema({
	name  : String
});

module.exports.CabCate = mongoose.model('cabcate',CabCateSchema);


