module.exports.HOST = 'http://localhost';

module.exports.USERTYPE = {
		ADMIN : 0,
		EMP   : 1,
		USER  : 2
};

module.exports.USERSTATUS = {
	  ACTIVE   : 0,
	  INACTIVE : 1,
	  PEDDING  : 2
};

module.exports.BOOKINGSTATUS = {
	  SCHEDULED_PAID : 0,
	  SCHEDULED_UNPAID :  1,
	  COMPLETED : 2,
	  CANCELLED : 3
};

module.exports.BOOKINGSEATS = {
	  ONESEAT :  1,
	  TWOSEAT : 2
};


module.exports.monthNames = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];
module.exports.A_BOOKINGSTATUS = ["SCHEDULED PAID","SCHEDULED UNPAID","COMPLETED","CANCALLED"];

module.exports.AVAILABILITYSTATUS = ["SCHEDULED","CANCELLED","CONFIRMED"];