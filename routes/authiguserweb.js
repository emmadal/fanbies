const connection = require('../middleware/connection');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const express = require('express')
const authlogin = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Login Authentication For Instagram Web
 */

authlogin.post('/', (req, res) => {
	const authid = req.body.authid;
	const authusername = req.body.username;
	const authname = req.body.name;
	const authbio = req.body.bio;
	const authtype = req.body.authtype;
	async function authStart() {
        try{
            const value = await validateAuthID();
			if(value === true) {
				//login user, get uid from auth_login table
				const responseid = await profileuserid();
				await signinuserbyid(responseid[0].uid);
			}else{
				const reguser = await registeruser();
				const completedRes = await registeruserauth(reguser);
				await regCompleteEmail(completedRes.name,completedRes.username);
				let resArr = [];
				resArr[0]= completedRes;
				res.send({'response': resArr,
                'success':true, 'message':'Auth Registration Completed'});
			}
        } catch(e){
            res.send({'success':false, 'message': e})
            //store on sentry
            //console.log(e);
        }
    }

	//validate the authid value 
    function validateAuthID() {
        return new Promise((resolve,reject) => {
            connection.query(`SELECT auth_id from ${process.env.DB_PREFIX}auth_login WHERE auth_id = ?`, authid , async (error,results) => {
				if (error) 
					reject(error);

				if(results.length === 0){
					resolve(false);
				}else{
					resolve(true);
				}
        	})
    	})
    }

	// get user profile id by auth_id
	function profileuserid() {
		return new Promise((resolve,reject) => {
			connection.query(`SELECT uid from ${process.env.DB_PREFIX}auth_login WHERE auth_id = ?`, authid , (error,results)=> {
				if (error) 
					reject(error);

				resolve(results);
        	})
		})
	}

	// sign in user by uid
	function signinuserbyid(uid) {
		const columns = ['id','username','name','picture','email','usertype','bio','reg_id'];
		return new Promise((resolve,reject) => {
			connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE id = ?`, [columns,uid] , (error,results)=> {
				if (error) 
					return reject(error);

				if(results.length !== 0){
					const payloadToken = jwt.sign({
							loggedin: true, 
							uid: results[0].id,
							utype: results[0].usertype, 
							username: results[0].username
						}, process.env.JWT_KEY);
						results[0]['token'] = payloadToken;
						results[0]['auth_status'] = 'login';
						//delete results[0]["id"];
						res.send({'response':results,'success':true, 'message':''})
						resolve(true);
					}else{
						res.send({'success':false, 'message':'Invalid Login.'})
						resolve('Invalid Login.');
				}

        	})
		})
	}

	function registeruser() {
		const dataDate =  Math.floor(new Date() / 1000);
		const desfultProfilePic = `${process.env.DEFAULT_PIC}`;
		const devicetoken = req.body.devicetoken !== undefined ? req.body.devicetoken : "";
        //user type 
        let utype = 0;
        const followed_by = req.body.follower;
        if (followed_by >= 10000) {
            utype = 1;
        }
		const data = {
            username: authusername,
            name : authname,
            email: "",
            password:  "",
            date:  dataDate,
            contactnumber: "",
            usertype: utype,
			bio: authbio,
            picture: desfultProfilePic
		}
		return new Promise((resolve,reject) => {
			connection.query(`INSERT INTO ${process.env.DB_PREFIX}users SET ?`, data , (error,results) => {
                if(error) return reject(error);
                
                const payloadToken = jwt.sign({
                    loggedin: true,
                    uid: results.insertId
                }, process.env.JWT_KEY);

				const resData = {
                    id: results.insertId,
                    username: data.username,
                    name: data.name,
                    email: data.email,
                    usertype: utype,
                    picture: data.picture,
                    bio: data.bio,
                    reg_id: devicetoken,
                    token: payloadToken,
					auth_status: 'register'
                };
                resolve(resData);
            });
		})
	}


	// Auth user login
	function registeruserauth(resData) {
		const data = {
            auth_id: authid,
        	auth_type: authtype,
            uid: resData.id,
		}
		return new Promise((resolve,reject) => {
			connection.query(`INSERT INTO ${process.env.DB_PREFIX}auth_login SET ?`, data , error => {
				if (error) 
					return reject(error);

				resolve(resData);

        	})
		})	
	}
	// Send Email to Admin for social user registration
	async function regCompleteEmail(uname,username){
        const emailTxtOnly = `${uname}, just registed on Fanbies. with user name ${username} `;

        const htmlEmail = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

        <html xmlns="http://www.w3.org/1999/xhtml">
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Fanbies App - Reset Password Email</title>
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
        <h1>${uname}, Just registered</h1>
		<h2>Username: ${username}</h2>
        </div>
        </div>
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">

        <p style="font-size:1em;color:#797878;">Use the button below to view profile</p>

        <div class="contentEditable" >
        <a style="border: 1px solid #ccc;padding: 10px 0px;margin: 10px;display: block;border-radius: 10px;text-decoration: none;background-color: #9c27b0;color: #fff;font-size: 1.1em;font-family: sans-serif;" shape="rect" target="_blank" href=${process.env.SITE_NAME}user/${username}>View Profile</a>
        </div>
        <p style="font-size:1em;color:#797878;">.</p>

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
            to: process.env.Admin_EMAIL,
            subject: `Fanbies: Social User Registration Complete`, // Subject line
            text: emailTxtOnly, // plain text body
            html: htmlEmail // html body
        };

        await transporter.sendMail(mailOptions);
    }


	authStart()
});



module.exports = authlogin;

