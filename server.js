
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
//const morgan = require('morgan');

const app = express();
app.use(helmet());
app.use(helmet.hidePoweredBy());
app.use(cors({
    origin: '*',
    allowedHeaders: 'Content-Type',
    methods: ['PUT', 'GET', 'POST', 'DELETE'],
    maxAge: 2592000
}));

const port = process.env.PORT || 5500;
//const port =  3000;
require('dotenv').config();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Routers
const authuser = require('./routes/auth')
const authmobileuser = require('./routes/authmobile')
const mobilloginbyusername = require('./routes/authmobilebyusername')
const getcelebs = require('./routes/allcelebs')
const getuserbyusername = require('./routes/getuser')
const userreg = require('./routes/userreg')
const recommend = require('./routes/recommend')
const paymentReg = require('./routes/regpay')
const talentList = require('./routes/talentlist')
const consoleDetail = require('./routes/consoledetail')
const getuserbytalent = require('./routes/userbytalent')
const getuserbytalentsearch = require('./routes/userbytalentsearch')
const searchuserbyterm = require('./routes/searchuserbyterm')
const updatenotifytable = require('./routes/notifybyemail')
const updateuser = require('./routes/updateuserprofile')
const forgottentreset = require('./routes/forgotten')
const validateRestHash = require('./routes/validateusertoken')
const updateuserpass = require('./routes/updateuserpass')
const getusershoutout = require('./routes/getshoutout')
const shoutoutbyid = require('./routes/getshoutoutbyid')
const webrecordedvideo = require('./routes/webvideorecorded')
const updateprofilepic = require('./routes/updateprofilepic')
const deleteuser = require('./routes/deleteuserbyid')
const apprecordedvideo = require('./routes/appvideorecorded')
const updatepushbyid = require('./routes/updatepushbyid')
const promorequestlist = require('./routes/promorequest')
const authfb = require('./routes/fbauth')
const getusersettings = require('./routes/getusersetting')
const getpendingshoutout = require('./routes/getpendingshoutout')
const getcompletedrequest = require('./routes/getcompletedshoutout')
const getdisclaimer = require('./routes/getdisclaimer')
const updaterequestbyid = require('./routes/updaterequestbyid')
const getfeatured = require('./routes/getfeatureduser')
const authlogin = require('./routes/authiguserweb')
const getuserdrop = require('./routes/getuserdrop')
const getalluserpendings = require('./routes/getmypendings')
const getallusercompletedrequest = require('./routes/getallusercompletedrequest')
// Send Messages
const getmessage = require('./routes/getmessage')
const sendmessage = require('./routes/sendmessage')
const getconversationbyuid = require('./routes/getconversationbyuid')
const deletemessage = require('./routes/deletemessage')
//Admin Routers
const dashboardauthuser = require('./routes/dashboardauth')
const validateToken = require('./routes/usertoken')
const updatedashboarduser = require('./routes/updateprofiledashboard')
const updateconsole = require('./routes/updateconsole')
const userlist = require('./routes/getuserlist') 
const dashboardupdateuser = require('./routes/updateuserdashboard')
const getbankdetailsroute = require('./routes/getuserbankdetails')
const updatebankdetailsroute = require('./routes/updateuserbankdetails')
const totalusers = require('./routes/gettotalusers')
const totalcelebs = require('./routes/gettotalcelebs')
const adduserdashboard = require('./routes/adduserdashboard')
const totalrequest = require('./routes/totalrequest')
const getusertotalrequest = require('./routes/totaluserrequest')
const requestinvoice = require('./routes/requestinvoice')
const getcompletedrequestadmin = require('./routes/dashboardgetcompletedshoutout')
const updateinvoice = require('./routes/updateinvoicebyid')
const admingetuserprofile = require('./routes/getuserbyadmin')
/// Push Notification
const updatepushtoken = require('./routes/updateuserpushtoken')
const updaterequeststatusbyid = require('./routes/updaterequeststatusbyid')
const getrequestbystatus = require('./routes/getrequestbystatus')
const updateuserpassadmin = require('./routes/updatepasswordbyidadmin')
const getuserclaimstatus = require('./routes/getuserclaimstatus')
const updateclaimaccount = require('./routes/updateclaimaccount')
const getuserbyclaimhash = require('./routes/getuserbyclaimhash')
const claimuseraccount = require('./routes/updateclaimuseraccount')
const userdropupload = require('./routes/userdropupload')
const getactiveusers = require('./routes/getactiveusers')
const updatefeatureduser = require('./routes/updatefeatureduser')
const updatereferral = require('./routes/updatereferral')
const getuserreferral = require('./routes/getuserreferral')
const deletereferralbyid = require('./routes/deletereferralbyid')
const updateusertypebyid = require('./routes/updateusertypebyid')
////
const reservebooking = require('./routes/reservebooking')
const validatereservationtoken = require('./routes/validatereservetoken')
const validatevideocallreservetoken = require('./routes/validatevideocallreservetoken')
//reserve video booking
const reservevideocallbooking = require('./routes/reservevideocallbooking')
const processvideocall = require('./routes/updatevideocallstatusbyid')
const sendvideocallreminderbyid = require('./routes/sendvideocallreminderbyid')
const getmyearningsroute = require('./routes/getmyearnings')
const requestearning = require('./routes/requestearning')
const validatevideocalljoiner = require('./routes/validatevideocalljoiner')
const getappitem = require('./routes/getappitem')
const inapppurchases = require('./routes/inapppurchases')
//TEST
const firetoken = require('./routes/firetoken');
// Feeds 
const uploadfeedsdata = require('./routes/uploadfeedsdata');
const deletes3Obj = require('./routes/deletes3data');
const getuserfeeds = require('./routes/getuserfeedbyid')

//App APi
const updateusershoutrate = require('./routes/updateusershoutrate')
//Router Middleware
app.use('/okiki/api/login', authuser)
app.use('/okiki/api/recommend', recommend)
app.use('/okiki/api/allceleb', getcelebs)
app.use('/okiki/api/getprofile', getuserbyusername)
app.use('/okiki/api/registeruser', userreg)
app.use('/okiki/api/paymentRegister', paymentReg)
app.use('/okiki/api/getTalentList', talentList)
app.use('/okiki/api/getConsoleDetail', consoleDetail)
app.use('/okiki/api/getUserByTalent', getuserbytalent)
app.use('/okiki/api/getSearchUser', searchuserbyterm)
app.use('/okiki/api/notifybyemail', updatenotifytable)
app.use('/okiki/api/updateuserprofile', updateuser)
app.use('/okiki/api/forgottenpass', forgottentreset)
app.use('/okiki/api/validateresthash', validateRestHash)
app.use('/okiki/api/resetuserpass', updateuserpass)
app.use('/okiki/api/usershoutout', getusershoutout)
app.use('/okiki/api/getshoutoutbyid', shoutoutbyid)
app.use('/okiki/api/uploadrecvideo', webrecordedvideo)
app.use('/okiki/api/getUserByTalentSearch', getuserbytalentsearch)
//
//not completed yet.. App video mp4 uploading
app.use('/okiki/api/uploadapprecvideo', apprecordedvideo)
//
//app push token Api
app.use('/okiki/api/mobilelogin', authmobileuser)
app.use('/okiki/api/updatepushtoken', updatepushtoken)
app.use('/okiki/api/igmobilelogin', mobilloginbyusername)
//
app.use('/okiki/api/profilepicupdate', updateprofilepic)
app.use('/okiki/api/promorequest', promorequestlist)
app.use('/okiki/api/fblogin', authfb)
app.use('/okiki/api/getpendings', getpendingshoutout)
app.use('/okiki/api/getusersettings', getusersettings)
app.use('/okiki/api/getcompletedrequest', getcompletedrequest)
app.use('/okiki/api/deleteuser', deleteuser)
//Admin Middelwares
app.use('/okiki/api/dashboardlogin', dashboardauthuser)
app.use('/okiki/api/validateusertoken', validateToken)
app.use('/okiki/api/dashboardupdateprofile', updatedashboarduser)
app.use('/okiki/api/updateconsole', updateconsole)
app.use('/okiki/api/userlist', userlist)
app.use('/okiki/api/admingetuserprofile', admingetuserprofile)
app.use('/okiki/api/dashboardupdateuser', dashboardupdateuser)
app.use('/okiki/api/getbankdetails', getbankdetailsroute)
app.use('/okiki/api/updateuserbankdetail', updatebankdetailsroute)
app.use('/okiki/api/gettotaluser', totalusers)
app.use('/okiki/api/gettotalcelebs', totalcelebs)
app.use('/okiki/api/adduserprofile', adduserdashboard)
app.use('/okiki/api/gettotalrequest', totalrequest)
app.use('/okiki/api/getmytotalrequest', getusertotalrequest)
app.use('/okiki/api/invoicerequest', requestinvoice)
app.use('/okiki/api/getcompletedrequestadmin', getcompletedrequestadmin)
app.use('/okiki/api/updateinvoice', updateinvoice)
app.use('/okiki/api/disclaimer', getdisclaimer)
app.use('/okiki/api/updatenotification', updatepushbyid)
app.use('/okiki/api/updaterequestbyid', updaterequestbyid)
app.use('/okiki/api/updaterequeststatusbyid', updaterequeststatusbyid)
app.use('/okiki/api/getRequestByStatus', getrequestbystatus)
app.use('/okiki/api/updateuserpasswordbyid', updateuserpassadmin)
app.use('/okiki/api/getfeatureduser', getfeatured)
app.use('/okiki/api/getclaimstatus', getuserclaimstatus)
app.use('/okiki/api/updateclaimaccount', updateclaimaccount)
app.use('/okiki/api/validateclaimhash', getuserbyclaimhash)
app.use('/okiki/api/claimprofile', claimuseraccount)
app.use('/okiki/api/useriglogin', authlogin)

//Admin new routes
app.use('/okiki/api/dropbyuserid', userdropupload)
app.use('/okiki/api/getuserdrop', getuserdrop)
app.use('/okiki/api/getactiveusers', getactiveusers)
app.use('/okiki/api/updatefeatureduser', updatefeatureduser)
app.use('/okiki/api/updatereferral', updatereferral)
app.use('/okiki/api/getuserreferral', getuserreferral)
app.use('/okiki/api/deleteuserreferral', deletereferralbyid)
app.use('/okiki/api/updateusertype', updateusertypebyid)
//
//DMs
app.use('/okiki/api/getconversationbyuserid', getconversationbyuid)
app.use('/okiki/api/getmessage', getmessage)
app.use('/okiki/api/sendmessage', sendmessage)
app.use('/okiki/api/deletemessage', deletemessage)

//Reserve a booking 
app.use('/okiki/api/reserveabooking', reservebooking)
app.use('/okiki/api/validatereservation', validatereservationtoken)

//Reserve a video call booking  reservevideocallbooking
app.use('/okiki/api/reservevideocallbooking', reservevideocallbooking)
app.use('/okiki/api/validatevideocallreservetoken', validatevideocallreservetoken)

// FEEDS Api
app.use('/okiki/api/uploadfeed', uploadfeedsdata)
app.use('/okiki/api/deletefeedbyid', deletes3Obj)
app.use('/okiki/api/getuserfeeds', getuserfeeds)
//App Api
app.use('/okiki/api/updaterate', updateusershoutrate)
//
app.use('/okiki/api/requestforearning', requestearning)
app.use('/okiki/api/getmyearnings',getmyearningsroute)

app.use('/okiki/api/processvideocall', processvideocall)
app.use('/okiki/api/reminderbyid', sendvideocallreminderbyid)
app.use('/okiki/api/getallpendings', getalluserpendings)
app.use('/okiki/api/getallusercompletedrequest', getallusercompletedrequest)
///okiki/api/validatevideocallhash
app.use('/okiki/api/validatevideocallhash', validatevideocalljoiner)
app.use('/okiki/api/getappitem', getappitem)
//TEST - firetoken
app.use('/okiki/api/firetoken', firetoken)
//
app.use('/okiki/api/inapppurchases', inapppurchases)

app.listen(port, () => console.log(`Listening on port ${port}`));