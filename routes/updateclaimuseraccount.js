const connection = require('../middleware/connection');
const express = require('express')
const md5 = require('md5')
const claimuseraccount = express.Router();
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * User claim account
 */
claimuseraccount.post('/', (req, res) => {
    const userpassword = md5(req.body.password);
    const useremail = req.body.useremail;
    const name = req.body.uname;
    const uid = req.body.uid;
    
    async function claimAccount() {
        try{
            //await validateEmail(useremail);
            await updateProfile();
            await updateClaimStatus();
            const loginResult = await loginUser();
            res.send({'response':loginResult,'success':true, 'message':''})
            completeEmail(name,useremail,loginResult[0].username);
        } catch(e){
            res.send({'success':false, 'message': e })
        }
    }

    // function validateEmail(value) {
    //         return new Promise((resolve,reject) => {
    //             connection.query(`SELECT email from ${process.env.DB_PREFIX}users WHERE email = ?`, value , (error,results)=> {
    //             if (error) 
    //                 reject(error);
    //             if(results.length === 0){
    //                 resolve(results);
    //             }else{
    //                 reject('Email provided already exist, Please try another.');
    //             }
    //         })
    //     })
    // }

    async function updateProfile(){
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}users SET name = ?, password = ?, email = ? WHERE id = ?`, [name,userpassword,useremail,uid] , error => {
                if (error) reject(error);
            
                resolve([]);
            });
        })
        
    }

    function updateClaimStatus() {
        return new Promise((resolve, reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}account_claim SET status = ? WHERE uid = ?`, ['completed',uid] , error =>{
                if (error) reject(error);

                resolve([]);
            });
        })
    }

    function loginUser() {
        return new Promise((resolve, reject) => {
            const columns = ['id','username','name','picture','email','usertype','bio','reg_id'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE id = ?`, [columns,uid] , (error, results) =>{
                if (error) reject(error);

                const payloadToken = jwt.sign({
                    loggedin:true, 
                    uid:results[0].id,
                    utype:results[0].usertype, 
                    username:results[0].username
                }, process.env.JWT_KEY);
                results[0]['token'] = payloadToken;

                resolve(results);
            });
        })
    }

    async function completeEmail(uname,uemail,username){
        const emailTxtOnly = `Hi ${uname}, Fanbies Account is now registered as a claimed account.`;

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
        <h1>Welcome On Board ${uname}</h1>
        </div>
        </div>
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">

        <p style="font-size:1em;color:#797878;">Thank you for claiming your Fanbies Account. Fanbies works with an 80% - 20% ratio. Where you the Influencer takes 80% of the revenue booking on the platform and Yes you determine how much you charge for a single shoutout. </p>
        <p style="font-size:1em;color:#797878;">Email Join@fanbies.com for more information or simply login to your profile to set your charges and you good to go.</p>

        <p style="font-size:1em;color:#797878;">Use the button below to view your profile</p>

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
            to: uemail, //
            bcc: [process.env.Admin_EMAIL],
            subject: `Fanbies: Account Claim Completed`, // Subject line
            text: emailTxtOnly, // plain text body
            html: htmlEmail // html body
        };

        await transporter.sendMail(mailOptions);
    }

    claimAccount();
});


module.exports = claimuseraccount;
