const connection = require('../middleware/connection');
const express = require('express');
const inapppurchases = express.Router();
const nodemailer = require('nodemailer');
const md5 = require('md5');
const firepush = require('../middleware/firepush');
require('dotenv').config({ path: './.env' });


/**
 * 1. Take User Payment Via In App Purchase
 * 2. Record payment 
 * 3. Create Shoutout Post on the Database
 * 4. Email all users (Payee, Celeb and Fanbies team)
 * 5. Shoutout Table - Status (created,pending,cancelled,completed)
 * 6. Update the available slot shout out for the celeb after payment successful!!!!!
 * 7. Send Notification and email of confirmation  
 */

inapppurchases.post('/', (req, res) => {
    const emailValue = req.body.useremail;
    const dataDate =  Math.floor(new Date() / 1000);
    const privacyType = req.body.videoPrivacy ? "(Private video)":"";
    const typeof_booking = req.body.bookingtype;

    let isAnonymous = false;
    //Check if the email value is unique before registation
    emailExist(emailValue);
    function emailExist(emailValue) {
        connection.query(`SELECT email,id,name,username from ${process.env.DB_PREFIX}users WHERE email = ?`, emailValue , (error, results) => {
            if (error) 
                return res.status(500).send(error);

            if(results.length === 0){
                //User doesn't exist
                isAnonymous = true;
                registerAnonymousmyuser().then((res) => {
                    recordPaymentRegister(res.id,res.name,res.username,res.pass)
                });
            }else{
                //User exist
                recordPaymentRegister(results[0].id, results[0].name, results[0].username);
            }
        });
    }

    async function recordPaymentRegister(uid,name,username,genpass) {
        const responderusername = req.body.celebUname;
        const celebName = req.body.celebName; // the celebrity common name
        
        try {
            let celebInfo = await getCelebDetails(responderusername);
            let shoutoutId = await createShoutOut(uid,celebInfo[0].id);
            await paymentrecord(shoutoutId,uid,celebInfo[0].id);
            await updateAvailableSlot(celebInfo[0].id,celebName);
            let referralEmail = await getRefarralEmailByUserId(celebInfo[0].id);
            await sendResponderEmail(shoutoutId, responderusername, celebName, celebInfo[0].email, referralEmail);
            if(!isAnonymous){
                await sendConfirmationEmail(shoutoutId, name,username, emailValue, celebName);
            } else{
               await sendAutomatedUserEmail(shoutoutId, name, emailValue, celebName,genpass); 
            }
            if(celebInfo[0].reg_id != null) pushnotification(celebInfo[0].reg_id); //device expo id 
            
        } catch(err) {
            res.send({'success':false, 'message':'failed, something is wrong!!'})
            //store on sentry
            console.log(err);
        }
    }

    /**
     * 
     * @param {*} referral email from celeb user id
     */
    function getRefarralEmailByUserId(uid) {
        return new Promise((resolve,reject) => {
            connection.query(`SELECT email from ${process.env.DB_PREFIX}referral WHERE uid = ?`, uid , (error, results) => {
            if(error)
                return res.status(500).send(error);

                if(results.length !== 0) {
                    resolve(results[0].email)
                } else{ 
                    resolve('')
                }
            });
        })
    }

    /**
     * 
     * @param {*} celeb given username 
     */
    function getCelebDetails(username) {
        return new Promise((resolve,reject) => {
            const columns = ['id','email','reg_id'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,username] ,function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error('No User Available at this moment.'))
                }

            });
        });
    }

    /**
     * Update celeb user available slot after payment recorded and respond
     */

    function updateAvailableSlot(cid,celebName){
        return new Promise((resolve,reject) => {
            let sql = `UPDATE ${process.env.DB_PREFIX}users
                SET available_slot = available_slot - 1
                WHERE id = ?`;

            connection.query(sql, [cid] , error => {
                if(error){
                    reject(error);
                } else{
                    res.send({'response': [], 'success':true, 'message': `Booking confirmed, please check your email ( or junk ) for more details as the Fanbies team will check ${celebName} availability`});

                    resolve();
                }
            });
        });
    }

    /**
     * Store payment details
     */
    function paymentrecord(id,uid,cid) {
        return new Promise((resolve,reject) => {
            const iap_data = req.body.purchase; //purchase
            const iap_email = req.body.paymentemail;

            const data = {
                    userid: uid,
                    responderid : cid,
                    requestid: id,
                    receipt: iap_data.transactionReceipt,
                    transactionDate: iap_data.transactionDate,
                    productId:  iap_data.productId,
                    transactionId: iap_data.transactionId,
                    paymentEmail: iap_email
            }

            connection.query(`INSERT INTO ${process.env.DB_PREFIX}iap_record SET ?`, data , (error, results) => {
                if(error){
                    reject(error);
                } else{
                    resolve(results.insertId);
                }
            });
        });
    }

    /**
     * Register new user 
     */
    function registerAnonymousmyuser(){
        return new Promise((resolve,reject)=>{
            let passRand = Math.floor(Math.random() * 9)+"_fanbies_"+Math.floor(Math.random() * 999);
            const generateUsername = emailValue.substring(0,emailValue.lastIndexOf("@"));
            const phonenumber = req.body.phonenumber;
            const utype = req.body.usertype;

            const data = {
                username: generateUsername,
                name : generateUsername,
                email: emailValue,
                password:  md5(passRand),
                date:  dataDate,
                contactnumber: phonenumber,
                usertype: utype,
                picture: `${process.env.DEFAULT_PIC}`
            }
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}users SET ?`, data , (error, results) => {
                if(error){
                    reject(error);
                } else{
                    const val = {
                        id: results.insertId,
                        username: generateUsername,
                        name: generateUsername,
                        pass: passRand
                    }
                    resolve(val);
                }
            });
        });
    }
    /**
     * Store shoutout details; 1 for videocall, 0 for normal
     */
    function createShoutOut(userid,cid) {
        return new Promise((resolve,reject) => {
            const messageTitle = req.body.messagetitle;
            const messageShoutout = req.body.messageDescription;
            const privacy = req.body.videoPrivacy;
            const amountPaid = parseInt(req.body.amountPaid); // paid value request

            //new records for video call 
            const call_date = req.body.calldate != null ? req.body.calldate : 0;
            const call_duration = req.body.callduration;
            const typeof_booking = req.body.bookingtype;
            let bookingType = 0;
            if(typeof_booking === 'videocall') bookingType = 1;

            const data = {
                    requestid: userid,
                    responseid : cid,
                    mention_name: messageTitle,
                    message_shoutout:  messageShoutout,
                    privacy,
                    status:'created',
                    date:  dataDate,
                    charge: amountPaid,
                    call_date,
                    call_duration,
                    booking_type: bookingType
            }

            connection.query(`INSERT INTO ${process.env.DB_PREFIX}shoutout SET ?`, data , (error, results) => {
                if(error){
                    reject(error);
                } else{
                    resolve(results.insertId);
                }
            });
            
        });
    }

    /**
     * 
     * @param {the firebase reg id of device of celeb} value
     */
    function pushnotification(id){
        const payload = {
          notification: {
            title: 'Shoutout Request',
            body: `A fan just requested for a fanbies video request`,
            sound: 'default'
          },
          data: { page: 'userTask' }
        };

        const options = {
            priority: 'high',
            contentAvailable: true,
            timeToLive: 60 * 60 * 24
        };

        firepush(id,payload,options);
	}

    /**
     * Automated creation account for random user
     */
    async function sendAutomatedUserEmail(orderid, username, userEmail, celebName,genpass) {
        const emailTxtAdmin = `Thank you: ${username} here is your confirmation email for a fanbies video ${privacyType} request for ${celebName} - #FBN-19-${orderid}`;

        const htmlEmailAdmin = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Fanbies - Shoutout request is now completed</title>
        <style type="text/css">

        #outlook a {padding:0;}
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        .ExternalClass {width:100%;}
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
        #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
        img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;display:inline-block;}
        .image_fix {display:block;}

        h1, h2, h3, h4, h5, h6 {color: black !important;}

        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}

        h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {
        color: red !important;
        }

        h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {
        color: purple !important;
        }

        table td {border-collapse: collapse;}

        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

        a {color: #000;}

        @media only screen and (max-device-width: 480px) {

        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: black; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important; /* or whatever your want */
        pointer-events: auto;
        cursor: default;
        }
        }


        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: blue; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important;
        pointer-events: auto;
        cursor: default;
        }
        }

        p {
        margin:0;
        color:#555;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        line-height:160%;
        }
        a.link2{
        text-decoration:none;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        color:#fff;
        border-radius:4px;
        }
        h2{
        color:#181818;
        font-family:Helvetica, Arial, sans-serif;
        font-size:22px;
        font-weight: normal;
        }

        .bgItem{
        background:#F4A81C;
        }
        .bgBody{
        background:#ffffff;
        }

        </style>

        <script type="colorScheme" class="swatch active">
        {
        "name":"Default",
        "bgBody":"ffffff",
        "link":"f2f2f2",
        "color":"555555",
        "bgItem":"F4A81C",
        "title":"181818"
        }
        </script>

        </head>
        <body>
        <table cellpadding="0" width="100%" cellspacing="0" border="0" id="backgroundTable" class='bgBody'>
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="border-collapse:collapse;">
        <tr>
        <td class='movableContentContainer'>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr height="40">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        <tr>
        <td width="200" valign="top">&nbsp;</td>
        <td width="200" valign="top" align="center">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <img src=${process.env.SITE_LOGO_URL} width="100" height='100' alt='Logo'  data-default="placeholder" />
        </div>
        </div>
        </td>
        <td width="200" valign="top">&nbsp;</td>
        </tr>
        <tr height="25">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        </table>
        </div>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="3" align="center" style="padding-bottom:10px;padding-top:25px;">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <h1>Hi ${username}</h1>
        </div>
        </div>
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">

        <p style="font-size:1.4em;color:#797878;">Here is your confirmation email of your fanbies video <b>${privacyType}</b> request from <b>${celebName}</b></p>
        
        <p style="font-size:1.3em;color:#797878;">Request Ref No: #FBN-19-${orderid}</p>
        <p style="font-size:1.35em;color:#000;">Your Fanbies Password is ${" "} ${genpass}</p>
        <p style="font-size:1.2em;color:#000;">Please change your password from the settings page after you login.</p>
        <div class="contentEditable" >
        
        <a style="border: 1px solid #ccc;padding: 10px 0px;margin: 10px;display: block;border-radius: 10px;text-decoration: none;background-color: #9c27b0;color: #fff;font-size: 1.1em;font-family: sans-serif;" shape="rect" target="_blank" href=${process.env.SITE_NAME}user/${username} >View Your Profile</a>
        </div>
        </div>
        </td>
        <td width="100">&nbsp;</td>
        </tr>
        </table>
        </div>
        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="2" style="padding-top:65px;">
        <hr style="height:1px;border:none;color:#333;background-color:#ddd;" />
        </td>
        </tr>
        <tr>
        <td width="60%" height="70" valign="middle" style="padding-bottom:20px;">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <span style="font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%;">[Fanbies Team]</span>
        <br/>
        <span style="font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%;">Stay Connected. </span>
        </div>
        </div>
        </td>
        <td width="40%" height="70" align="right" valign="top" align='right' style="padding-bottom:20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align='right'>
        <tr>
        <td width='57%'><span style="font-size: .75em; color: #008081;">Don't forget to Follow Us:<span></td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentFacebookEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://www.facebook.com/fanbies/" data-default="placeholder"  style="text-decoration:none;">
            <img src=${process.env.FB_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='facebook' style='margin-right:40x;' data-customIcon="true" >
        </a>    </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentTwitterEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://twitter.com/fanbies" data-default="placeholder"  style="text-decoration:none;">
                <img src=${process.env.Twitter_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='twitter' style='margin-right:40x;' data-customIcon="true" >
        </a>
            </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentImageEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href=${process.env.IG_ACC} data-default="placeholder"  style="text-decoration:none;">
                    <img src=${process.env.IG_LOGO} width="30" height="30" data-max-width="30" alt='instagram' style='margin-right:40x;' />
                </a>
            </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <!-- END BODY -->
        </td>
        </tr>
        </table>
        <!-- End of wrapper table -->
        </body>
        </html>`;


        let transporter = await nodemailer.createTransport({
            host: process.env.SMTP,
            port: process.env.SMPT_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMPT_USR, // generated ethereal user
                pass: process.env.SMPT_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: process.env.SMPT_USR, // sender address
            to: [userEmail],
            bcc: [process.env.Admin_EMAIL],
            subject: `Fanbies: Requested for ShoutOut ✔ #FBN-19-${orderid}`, // Subject line
            text: emailTxtAdmin, // plain text body
            html: htmlEmailAdmin // html body
        };

        transporter.sendMail(mailOptions);
    }

    /**
     * Send email confirmation to request booker
     */
    async function sendConfirmationEmail(orderid, name, username, userEmail, celebName) {
        //Email settings
        const emailTxtAdmin = `Thank you: ${name} here is your confirmation email for a fanbies video ${privacyType} request for ${celebName} - #FBN-19-${orderid}`;
        const htmlEmailAdmin = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Fanbies - Shoutout request is now completed</title>
        <style type="text/css">

        #outlook a {padding:0;}
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        .ExternalClass {width:100%;}
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
        #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
        img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;display:inline-block;}
        .image_fix {display:block;}

        h1, h2, h3, h4, h5, h6 {color: black !important;}

        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}

        h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {
        color: red !important;
        }

        h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {
        color: purple !important;
        }

        table td {border-collapse: collapse;}

        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

        a {color: #000;}

        @media only screen and (max-device-width: 480px) {

        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: black; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important; /* or whatever your want */
        pointer-events: auto;
        cursor: default;
        }
        }


        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: blue; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important;
        pointer-events: auto;
        cursor: default;
        }
        }

        p {
        margin:0;
        color:#555;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        line-height:160%;
        }
        a.link2{
        text-decoration:none;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        color:#fff;
        border-radius:4px;
        }
        h2{
        color:#181818;
        font-family:Helvetica, Arial, sans-serif;
        font-size:22px;
        font-weight: normal;
        }

        .bgItem{
        background:#F4A81C;
        }
        .bgBody{
        background:#ffffff;
        }

        </style>

        <script type="colorScheme" class="swatch active">
        {
        "name":"Default",
        "bgBody":"ffffff",
        "link":"f2f2f2",
        "color":"555555",
        "bgItem":"F4A81C",
        "title":"181818"
        }
        </script>

        </head>
        <body>
        <table cellpadding="0" width="100%" cellspacing="0" border="0" id="backgroundTable" class='bgBody'>
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="border-collapse:collapse;">
        <tr>
        <td class='movableContentContainer'>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr height="40">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        <tr>
        <td width="200" valign="top">&nbsp;</td>
        <td width="200" valign="top" align="center">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <img src=${process.env.SITE_LOGO_URL} width="100" height='100' alt='Logo'  data-default="placeholder" />
        </div>
        </div>
        </td>
        <td width="200" valign="top">&nbsp;</td>
        </tr>
        <tr height="25">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        </table>
        </div>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="3" align="center" style="padding-bottom:10px;padding-top:25px;">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <h1>Hi ${name}</h1>
        </div>
        </div>
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">

        <p style="font-size:1.4em;color:#797878;">Here is your confirmation email of your fanbies <b>${privacyType}</b> video request from <b>${celebName}</b></p>

        <p style="font-size:1.3em;color:#797878;">Request Ref No: #FBN-19-${orderid}</p>
        <div class="contentEditable" >
        <a style="border: 1px solid #ccc;padding: 10px 0px;margin: 10px;display: block;border-radius: 10px;text-decoration: none;background-color: #9c27b0;color: #fff;font-size: 1.1em;font-family: sans-serif;" shape="rect" target="_blank" href=${process.env.SITE_NAME}user/${username} >View Your Profile</a>
        </div>
        </div>
        </td>
        <td width="100">&nbsp;</td>
        </tr>
        </table>
        </div>
        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="2" style="padding-top:65px;">
        <hr style="height:1px;border:none;color:#333;background-color:#ddd;" />
        </td>
        </tr>
        <tr>
        <td width="60%" height="70" valign="middle" style="padding-bottom:20px;">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <span style="font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%;">[Fanbies Team]</span>
        <br/>
        <span style="font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%;">Stay Connected. </span>
        </div>
        </div>
        </td>
        <td width="40%" height="70" align="right" valign="top" align='right' style="padding-bottom:20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align='right'>
        <tr>
        <td width='57%'><span style="font-size: .75em; color: #008081;">Don't forget to Follow Us:<span></td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentFacebookEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://www.facebook.com/fanbies/" data-default="placeholder"  style="text-decoration:none;">
            <img src=${process.env.FB_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='facebook' style='margin-right:40x;' data-customIcon="true" >
        </a>    </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentTwitterEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://twitter.com/fanbies" data-default="placeholder"  style="text-decoration:none;">
                <img src=${process.env.Twitter_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='twitter' style='margin-right:40x;' data-customIcon="true" >
        </a>
            </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentImageEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href=${process.env.IG_ACC} data-default="placeholder"  style="text-decoration:none;">
                    <img src=${process.env.IG_LOGO} width="30" height="30" data-max-width="30" alt='instagram' style='margin-right:40x;' />
                </a>
            </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <!-- END BODY -->
        </td>
        </tr>
        </table>
        <!-- End of wrapper table -->
        </body>
        </html>`;


        let transporter = await nodemailer.createTransport({
            host: process.env.SMTP,
            port: process.env.SMPT_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMPT_USR, // generated ethereal user
                pass: process.env.SMPT_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: process.env.SMPT_USR, // sender address
            to: [userEmail],
            bcc: [process.env.Admin_EMAIL],
            subject: `Fanbies: Completed booking ${typeof_booking} ✔ #FBN-19-${orderid}`, // Subject line
            text: emailTxtAdmin, // plain text body
            html: htmlEmailAdmin // html body
        };

        transporter.sendMail(mailOptions);
    }

    /**
     * Email confirmation to the Famous face
     */
    async function sendResponderEmail(shoutoutId, celebusername, celebName, cemail, referralEmail) {
        //Email settings
        const messageTitle = req.body.messagetitle;
        const messageShoutout = req.body.messageDescription;
        const amountPaid = parseInt(req.body.amountPaid); // paid value request

        const typeof_booking = req.body.bookingtype;
        let altEmailMessg = "";
        let altEmailTitle = "";
        const emailMessage =`Hello ${celebName}, One of your fans just made a booking costing 
                            $ ${amountPaid} for a requested fanbies ${privacyType} ${typeof_booking} video request  - #FBN-19-${shoutoutId}`;
        
        if(typeof_booking !== 'videocall') {
            altEmailMessg= `Alternatively, you can also send us your recorded video to <b>myvideo@fanbies.com</b> with the Request Ref Number as subject line. <b>(Max length for a video is 1 minute)</b>`;
            altEmailTitle = `<b>Title:</b> ${messageTitle}`;
        }

        const emailTxtAdmin = emailMessage;

        const htmlEmailAdmin = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Fanbies - Shoutout request is now completed</title>
        <style type="text/css">

        #outlook a {padding:0;}
        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0;}
        .ExternalClass {width:100%;}
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
        #backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
        img {outline:none; text-decoration:none; -ms-interpolation-mode: bicubic;}
        a img {border:none;display:inline-block;}
        .image_fix {display:block;}

        h1, h2, h3, h4, h5, h6 {color: black !important;}

        h1 a, h2 a, h3 a, h4 a, h5 a, h6 a {color: blue !important;}

        h1 a:active, h2 a:active,  h3 a:active, h4 a:active, h5 a:active, h6 a:active {
        color: red !important;
        }

        h1 a:visited, h2 a:visited,  h3 a:visited, h4 a:visited, h5 a:visited, h6 a:visited {
        color: purple !important;
        }

        table td {border-collapse: collapse;}

        table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; }

        a {color: #000;}

        @media only screen and (max-device-width: 480px) {

        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: black; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important; /* or whatever your want */
        pointer-events: auto;
        cursor: default;
        }
        }


        @media only screen and (min-device-width: 768px) and (max-device-width: 1024px) {
        a[href^="tel"], a[href^="sms"] {
        text-decoration: none;
        color: blue; /* or whatever your want */
        pointer-events: none;
        cursor: default;
        }

        .mobile_link a[href^="tel"], .mobile_link a[href^="sms"] {
        text-decoration: default;
        color: orange !important;
        pointer-events: auto;
        cursor: default;
        }
        }

        p {
        margin:0;
        color:#555;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        line-height:160%;
        }
        a.link2{
        text-decoration:none;
        font-family:Helvetica, Arial, sans-serif;
        font-size:16px;
        color:#fff;
        border-radius:4px;
        }
        h2{
        color:#181818;
        font-family:Helvetica, Arial, sans-serif;
        font-size:22px;
        font-weight: normal;
        }

        .bgItem{
        background:#F4A81C;
        }
        .bgBody{
        background:#ffffff;
        }

        </style>

        <script type="colorScheme" class="swatch active">
        {
        "name":"Default",
        "bgBody":"ffffff",
        "link":"f2f2f2",
        "color":"555555",
        "bgItem":"F4A81C",
        "title":"181818"
        }
        </script>

        </head>
        <body>
        <table cellpadding="0" width="100%" cellspacing="0" border="0" id="backgroundTable" class='bgBody'>
        <tr>
        <td>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="100%" style="border-collapse:collapse;">
        <tr>
        <td class='movableContentContainer'>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr height="40">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        <tr>
        <td width="200" valign="top">&nbsp;</td>
        <td width="200" valign="top" align="center">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <img src=${process.env.SITE_LOGO_URL} width="100" height='100' alt='Logo'  data-default="placeholder" />
        </div>
        </div>
        </td>
        <td width="200" valign="top">&nbsp;</td>
        </tr>
        <tr height="25">
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        <td width="200">&nbsp;</td>
        </tr>
        </table>
        </div>

        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="3" align="center" style="padding-bottom:10px;padding-top:25px;">
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">
        <p style="font-size:1.3em;color:#000;">${emailMessage}</p>
        <br />
        <p style="font-size:1.2em;color:#000;">
            ${altEmailTitle}
        </p>
        <p style="font-size:1.2em;color:#000;">
            <b>Purpose for the shoutout:</b> ${messageShoutout}
        </p>
        <br />
        <br />
        <p style="font-size:1.3em;color:#000;">
        To complete / review your pending request use the button below to visit your profile on Fanbies website, alternatively you can also use the Fanbies Mobile App to complete your request and get paid. Thanks you
        </p>
        <br />
        <br />
        <p style="font-size:1.1em;color:#000;">${altEmailMessg}</p>

        <p style="font-size:1.4em;color:#797878;">Your request ref no: #FBN-19-${shoutoutId}</p>
        <div class="contentEditable" >
        <a style="border: 1px solid #ccc;padding: 10px 0px;margin: 10px;display: block;border-radius: 10px;text-decoration: none;background-color: #9c27b0;color: #fff;font-size: 1.1em;font-family: sans-serif;" shape="rect" target="_blank" href=${process.env.SITE_NAME}user/${celebusername} >View video pending request</a>
        </div>
        </div>
        </td>
        <td width="100">&nbsp;</td>
        </tr>
        </table>
        </div>
        <div class='movableContent'>
        <table cellpadding="0" cellspacing="0" border="0" align="center" width="600">
        <tr>
        <td width="100%" colspan="2" style="padding-top:65px;">
        <hr style="height:1px;border:none;color:#333;background-color:#ddd;" />
        </td>
        </tr>
        <tr>
        <td width="60%" height="70" valign="middle" style="padding-bottom:20px;">
        <div class="contentEditableContainer contentTextEditable">
        <div class="contentEditable" >
        <span style="font-size:13px;color:#181818;font-family:Helvetica, Arial, sans-serif;line-height:200%;">[Fanbies Team]</span>
        <br/>
        <span style="font-size:11px;color:#555;font-family:Helvetica, Arial, sans-serif;line-height:200%;">Stay Connected. </span>
        </div>
        </div>
        </td>
        <td width="40%" height="70" align="right" valign="top" align='right' style="padding-bottom:20px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" align='right'>
        <tr>
        <td width='57%'><span style="font-size: .75em; color: #008081;">Don't forget to Follow Us:<span></td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentFacebookEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://www.facebook.com/fanbies/" data-default="placeholder"  style="text-decoration:none;">
            <img src=${process.env.FB_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='facebook' style='margin-right:40x;' data-customIcon="true" >
        </a>    </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentTwitterEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href="https://twitter.com/fanbies" data-default="placeholder"  style="text-decoration:none;">
                <img src=${process.env.Twitter_LOGO} data-default="placeholder" data-max-width="30" width='30' height='30' alt='twitter' style='margin-right:40x;' data-customIcon="true" >
        </a>
            </div>
        </div>
        </td>
        <td valign="top" width='34'>
        <div class="contentEditableContainer contentImageEditable" style='display:inline;'>
            <div class="contentEditable" >
                <a target='_blank' href=${process.env.IG_ACC} data-default="placeholder"  style="text-decoration:none;">
                    <img src=${process.env.IG_LOGO} width="30" height="30" data-max-width="30" alt='instagram' style='margin-right:40x;' />
                </a>
            </div>
        </div>
        </td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
        </div>
        </td>
        </tr>
        </table>
        <!-- END BODY -->
        </td>
        </tr>
        </table>
        <!-- End of wrapper table -->
        </body>
        </html>`;


        let transporter = await nodemailer.createTransport({
            host: process.env.SMTP,
            port: process.env.SMPT_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMPT_USR, // generated ethereal user
                pass: process.env.SMPT_PASS // generated ethereal password
            }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: process.env.SMPT_USR, // sender address
            to: [cemail],
            bcc: [process.env.Admin_EMAIL, referralEmail],
            subject: `Fanbies: You have a booking for ${typeof_booking} ✔ #FBN-19-${shoutoutId}`,
            text: emailTxtAdmin, // plain text body
            html: htmlEmailAdmin // html body
        };
        transporter.sendMail(mailOptions);
    }
});

module.exports = inapppurchases;