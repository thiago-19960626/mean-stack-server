/********************************************************
user management api
********************************************************/
login : 
 
url :host/api/user/login
type: post
request fields: email, pass
response fields: err , token



register:

url : host/api/user/register
type:post
request fields: email, pass
response fields: err , token


edit profile

url : host/api/user/profile
type : post
request fields: token, fname, lname , gen,dob,mob
response fields:err,token ,msg

get profile

url: host/api/user/profile
type : get
request  fields: token
response fields: err , data[ = user profile], token


get user list(admin)

url : host/api/user/list
type : get
request fields: token
response fields:err, datas[= user list], token

activate user status(admin)

url : host/api/user/activate
type : post
request fields: token, uid (_id field of user table)
response fields: err, msg ,token


deactivate user status(admin)

url : host/api/user/deactivate
type : post
request fields: token, uid (_id field of user table)
response fields: err, msg ,token


/**************************************************************
booking API
**************************************************************/

booking create

url : host/api/booking/create
type : post
request fields: token, from, to , date(DATE TIME format: example 2014-03-30 20:20:30), status(0 : confirm, 1 : cancelled),amount, maspasstitle,maspassfname,
                maspasslname,maspasscontact,slvpasstitle,slvpassfname,slvpasslname,seats[ 7,8],cabnum(24 charactors and numbers)
 
response fields:err , booking, token


booking view

url : host/api/booking/view
type : get
request fields:token
response fields:err, datas,token

booking cancel

url : host/api/booking/cancel
type: post
request fields: token , bookingid
response fields:err, msg, token

booking view all(admin)

url : host/api/booking/viewall
type : get
request fields : token
response fields: err , datas ,token

booking edit(admin)

url : host/api/booking/edit
type: post
request fields:token,bookingid, from, to , date(DATE TIME format: example 2014-03-30 20:20:30), status,amount, maspasstitle,maspassfname,
                maspasslname,maspasscontact,slvpasstitle,slvpassfname,slvpasslname,seats,cabnum
response fields: err, msg , token


/***************************************************************************************************************
Cab Ability API 
***************************************************************************************************************/

cab ability create(admin)

url : host/api/cabability/create
type:post
request fields : token, cabtype(24 charactors and numbers), startcity(24 charactors and numbers),endcity(24 charactors and numbers),
date,staringtime(date),picktup ( for example : "[ { 'point' :'xxx','pickuptime':'2014-12-23 02:23:43' },{ 'point' :'xxx','pickuptime':'2014-12-23 02:23:43' },....]")
drop ( for example "[{ 'point' : 'xxx'},{ 'point' : 'xxx'},......]")
journeytime(for example '2014-12-23 02:23:43'),stop (for example : "[{ 'name' : 'XXXX','stoptime':'2014-12-23 02:23:43'},{ 'name' : 'XXXX','stoptime':'2014-12-23 02:23:43'},....]")
row1price(for example : "[25,'NA']"),row2price,row3price(optional)

response fields:err , msg, token

cab ability edit(admin)

url : host/api/cabability/edit
type : post
request fields: refer the above requet fields,cabaid
response fields: err,msg ,token


cab ability delete(admin)

url : host/api/cabability/delete
type: post
request fields: token,cabaid(24 charactors and number , this is value of _id field).
response fields: token, err, msg

cab ability view all

url : host/api/cabability/viewall
type: get
request fields: none
response fields: err, datas

/***************************************************************************************************
 Cab Type API
******************************************************************************************************/

cab type create(admin)

url : host/api/cartype/create
type : post
request fields : token,vendor,model,seatmap
response fields: err ,msg , token

cab type edit(admin)

url : host/api/cartype/edit
type : post
request fields : token,vendor,model,seatmap,cartypeid
response fields: err ,msg , token

car type delete(admin)

url : host/api/cartype/delete
type : post
request fields: cartypeid,token
response feilds: err , msg, token

car type viewall

url : host/api/cartype/view
type :get
request fields:none
response fields:err, msg , datas

/***************************************************************************************************************
Route API
****************************************************************************************************************/

Route creat(admin)

url : host/api/route/create
type : post
request fields : token, from , to ,km, hours
response fields: err ,msg , token

Route edit(admin)

url : host/api/route/edit
type : post
request fields : token, from , to ,km, hours, routeid
response fields: err ,msg , token

Route delete(admin)

url : host/api/route/delete
type : post
request fields : token , routeid
response fields : err , msg  ,token

Route View ALL

url : host/api/viewall
type : get
request fields : none
response fields: err ,datas 

/***********************************************************************************************************
Seatmap API
***********************************************************************************************************/

Seatmap creat(admin)

url : host/api/seatmap/create
type : post
request fields : token, num,desc (== description)
response fields: err ,msg , token

Seatmap edit(admin)

url : host/api/seatmap/edit
type : post
request fields : token, num,desc (== description),seatmapid
response fields: err ,msg , token

Seatmap delete(admin)

url : host/api/seatmap/delete
type : post
request fields : token , seatmapid
response fields : err , msg  ,token

Seatmap View ALL

url : host/seatmap/viewall
type : get
request fields : none
response fields: err ,datas 

/****************************************************************************************************
Cab Category API
****************************************************************************************************/


Cab Category creat(admin)

url : host/api/cabcat/create
type : post
request fields : token, name
response fields: err ,msg , token

Cab Category edit(admin)

url : host/api/cabcat/edit
type : post
request fields : token, name , cabcateid
response fields: err ,msg , token

Cab Category delete(admin)

url : host/api/cabcat/delete
type : post
request fields : token , cabcateid
response fields : err , msg  ,token

Cab Category View ALL

url : host/cabcat/viewall
type : get
request fields : none
response fields: err ,datas 
