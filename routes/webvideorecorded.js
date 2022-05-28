const connection = require('../middleware/connection');
const express = require('express')
const nodemailer = require('nodemailer');
const webrecordedvideo = express.Router();
const multer = require('multer')
const firepush = require('../middleware/firepush');
const AWS = require('aws-sdk');
const fs = require('fs');
const filepath = require('path')
const ffmpeg = require('fluent-ffmpeg');

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const ffprobePath = require('@ffprobe-installer/ffprobe').path;
// ScreenShot FFMEG fix
ffmpeg.setFfprobePath(ffprobePath);

//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY
});

const s3 = new AWS.S3();
require('dotenv').config({ path: './.env' });


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const rand = Math.floor((Math.random() * 99) + 1);
    cb(null, `${rand}_${Date.now()}.${ext}`)
  }
});


const upload = multer({ storage });

/**
 * Request video router
 */

webrecordedvideo.post('/',upload.single('file'), (req, res) => {
    const trimusername = req.body.ownername.replace(/ /g, '');
    const requestfilename = `./uploads/${Date.now()}_${trimusername}.mp4`;
    const thumbnailFilePath = `./uploads/thumbnails/${Date.now()}_${trimusername}.png`;
    //const thumbnailName = `${Date.now()}_${trimusername}.png`;
    const request_id = req.body.request_id;
    const recorder_id = req.body.video_recorder_id;
    const owner_id = req.body.video_owner_id;
    const video_privacy = req.body.video_privacy;
    const recorder_name = req.body.recorder_name;
    const rec_date = renderDateStamp(req.body.video_req_date);
    const ownername = req.body.ownername;
    const owner_uname = req.body.owner_uname;
    //emails
    const owner_email = req.body.video_owner_email;
    const recorder_email = req.body.video_recorder_email;

    const datePath = new Date().toJSON().slice(0,10);
    const webmFile = `./${req.file.path}`;
    
    
    let s3FileArr = [];
    let s3Promise = [];
    async function convertFFG(input, vidOutput,imgOut,reqId) {
      try {
        await updateStatusProcessing(reqId);
        await exec(`ffmpeg -ss 0 -i ${input} -i ./watermark_fanbies.png -filter_complex 'overlay=5:5' -vcodec libx264  -r 29.7 ${vidOutput} -vframes 1 ${imgOut}`);
      } catch(e) {
        console.log("😱", e);
      }
    }

    //FFMPEG convert wemb to mp4 with screenshot and watermarking
    convertFFG(webmFile,requestfilename,thumbnailFilePath,request_id)
    .then(()=> {
      S3Storage();
    }).catch(e => {
      console.log("😱", e);
    });
    
    function S3Storage() {
        s3FileArr.push(requestfilename,thumbnailFilePath);
        s3FileArr.forEach((item)=>{
          s3Promise.push(uploadtoS3(item));
        })

        Promise.all(s3Promise).then(data =>{
          const S3VideoFile = data[0].Location;
          const S3ImageFile = data[1].Location;

          insertVideoReq(S3VideoFile, S3ImageFile)
          .then(()=>{
            updateStatusCompleted(request_id);
            requestCompletedEmail();
            pushnotification(owner_id);
            //Video Files to delete afte success upload to s3
            const removeFiles = [requestfilename,webmFile,thumbnailFilePath];
            deleteFiles(removeFiles, (err)=> {
                if(err) {
                  console.log("🔥",'can not delete video file');
                }
            });
          }).catch(e =>{
            console.log("😱🔥", e)
          });

        }).catch(e =>{
          console.log("😱", e);
        })
    }
    
    function uploadtoS3(obj) {
        var params = {
          Bucket: 'fanbiesapp',
          Body : fs.createReadStream(obj),
          ACL: 'public-read',
          Key : `video/${datePath}/${filepath.basename(obj)}`
        };
        return s3.upload(params).promise();
    }

    function insertVideoReq(S3Videolocation,S3Imglocation) {
      return new Promise((resolve,reject) => {
            const data_completed =  Math.floor(new Date() / 1000);
            const req_data = {
                shoutout_id: request_id,
                recorder_id,
                owner_id,
                path:  datePath,
                link:  S3Videolocation,
                thumbnail: S3Imglocation,
                privacy: video_privacy,
                date: data_completed
            }
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}video_request SET ?`, req_data , error => {
              if(error) return reject(error);
              
              resolve([]);
          }); 
      })
    }
    /**
     * 
     * update status to processing
     */
    function updateStatusProcessing(id){
        return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}shoutout SET status = ? WHERE id = ?`, ['processing',id] ,function (error) {
              if(error) return reject(error);

              res.send({'success':true, 'message':'Request Completed, An Email Confirmation will be sent when video is ready. Please check you junk mail in some cases. Thank you'}); 
              resolve(true);
          });
        })
    }

        /**
     * 
     * update status to completed
     */
    function updateStatusCompleted(id){
        return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}shoutout SET status = ? WHERE id = ?`, ['completed',id] ,function (error) {
              if(error) return reject(error);

              resolve([]);
          });
        })
    }

    /**
     * 
     * @param {the expo reg id of device of celeb} value 
    */
    async function pushnotification(ownerid){
      const regId = await getOwnerRegID(ownerid);
      if(regId != null) pushMessage(regId[0].reg_id);
    }

    function getOwnerRegID(uid){
       return new Promise((resolve, reject)=>{
        const sql=`SELECT reg_id FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
            connection.query(sql,[uid], (error, results) => {
                if (error) 
                reject(new Error(`No Can not get Reg ID for user`));
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error(`No User detail at the moment`));
                }
            });
        })
    }

    /**
     * 
     * @param {the firebase reg id of device} value 
    */

    function pushMessage(id) {
      const payload = {
        notification: {
          title: 'Shoutout completed',
          body: `${recorder_name}, has completed your video request`,
          sound: 'default'
        },
        data: { page: 'MyCompletedRequest' }
      };

      const options = {
          priority: 'high',
          contentAvailable: true,
          timeToLive: 60 * 60 * 24
      };

      firepush(id,payload,options);
    }

    /**
     * 
     * @param {*} referral email from celeb user id
     */
    function getRefarralEmailByUserId() {
        return new Promise((resolve,reject) => {
            connection.query(`SELECT email from ${process.env.DB_PREFIX}referral WHERE uid = ?`, recorder_id , (error, results) => {
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

    async function requestCompletedEmail(){
      const emailTxtOnly = `Your video request is now completed, login to view the wonderful video.`;

      const htmlEmail = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">

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
        <h1>Hi ${ownername}</h1>
        </div>
        </div>
        </td>
        </tr>
        <tr>
        <td width="100">&nbsp;</td>
        <td width="400" align="center" style="padding-bottom:5px;">
        <div class="contentEditableContainer contentTextEditable">

        <p style="font-size:1.4em;color:#797878;">Your video request from ${recorder_name} is now completed, login to view the wonderful video.</p>

        <p style="font-size:1.3em;color:#797878;">Request Ref No: #FBN-19-${request_id}</p>
        <p style="font-size:1em;color:#797878;">Video Request Date: ${rec_date}</p>

        <div class="contentEditable" >
        <a style="border: 1px solid #ccc;padding: 10px 0px;margin: 10px;display: block;border-radius: 10px;text-decoration: none;background-color: #9c27b0;color: #fff;font-size: 1.1em;font-family: sans-serif;" shape="rect" target="_blank" href=${process.env.SITE_NAME}user/${owner_uname} >View Your Profile</a>
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


      let referralEmail = await getRefarralEmailByUserId();
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
          to: [owner_email],
          bcc: [recorder_email, process.env.Admin_EMAIL, referralEmail],
          subject: `Fanbies: Shoutout request is now completed`,
          text: emailTxtOnly, // plain text body
          html: htmlEmail // html body
      };

      await transporter.sendMail(mailOptions);
    }

});


// Delete multiple files
function deleteFiles(files, callback){
  var i = files.length;
  files.forEach(function(filepath){
    fs.unlink(filepath, function(err) {
      i--;
      if (err) {
        callback(err);
        return;
      } else if (i <= 0) {
        callback(null);
      }
    });
  });
}

//Epoch Date/ timestamp
function renderDateStamp(stamp) {
    // Convert timestamp to milliseconds
    var months_arr = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];

    var date = new Date(stamp * 1000);

    // Year
    var year = date.getFullYear();

    // Month
    var month = months_arr[date.getMonth()];

    // Day
    var day = date.getDate();

    // Display date time in MM-dd-yyyy h:m:s format
    const convdataTime = `${month}-${day}-${year}`;

    return convdataTime;
  } 

module.exports = webrecordedvideo;