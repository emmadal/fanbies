const connection = require('../middleware/connection');
const express = require('express')
const userdropupload = express.Router();
const multer = require('multer')
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
 * Upload user drop video router
 */

userdropupload.post('/',upload.single('file'), (req, res) => {
    const trimusername = req.body.ownername.replace(/ /g, '');
    const requestfilename = `./uploads/${Date.now()}_${trimusername}.mp4`;
    const thumbnailFilePath = `./uploads/thumbnails/${Date.now()}_${trimusername}.png`;
    const owner_id = req.body.video_owner_id;

    const datePath = new Date().toJSON().slice(0,10);
    const webmFile = `./${req.file.path}`;
    
    
    let s3FileArr = [];
    let s3Promise = [];
    async function convertFFG(input, vidOutput,imgOut) {
      try {
        //await updateStatusProcessing(reqId);
        await exec(`ffmpeg -ss 0 -i ${input} -i ./watermark_fanbies.png -filter_complex 'overlay=5:5' -vcodec libx264  -r 29.7 ${vidOutput} -vframes 1 ${imgOut}`);
      } catch(e) {
        console.log("😱", e);
      }
    }

    //FFMPEG convert wemb to mp4 with screenshot and watermarking
    convertFFG(webmFile,requestfilename,thumbnailFilePath)
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
          //check if user already as a record or not
          checkuserbyid()
          .then(res =>{
            if(res){
              updateVideoReq(S3VideoFile, S3ImageFile, requestfilename,webmFile,thumbnailFilePath)
            }else{
              insertVideoReq(S3VideoFile, S3ImageFile, requestfilename,webmFile,thumbnailFilePath)
            }
            
          }).catch(e => {
            console.log("😱🔥", e)
          })
          

          //response 
          res.send({'success':true, 'message':'Drop Uploaded Successfully'}); 
          //resolve(true);

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

    // check if the user already have an existing record
    function checkuserbyid(){
      return new Promise((resolve,reject) => {
          connection.query(`SELECT owner_id from ${process.env.DB_PREFIX}video_drop WHERE owner_id = ?`, owner_id , async (error,results) => {
              if (error) 
                reject(error);

              if(results.length !== 0){
                resolve(true);
              }else{
                resolve(false);
              }
        	})
      })
    };

    // Update DB
    function updateVideoReq(S3Videolocation,S3Imglocation,requestfilename,webmFile,thumbnailFilePath) {
      return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}video_drop SET link = ?, thumbnail = ? WHERE owner_id = ?`, [S3Videolocation,S3Imglocation,owner_id] , error => {
            if(error) return reject(error);
        
              const removeFiles = [requestfilename,webmFile,thumbnailFilePath];
              deleteFiles(removeFiles, (err)=> {
                  if(err) {
                    console.log("🔥",'can not delete video file');
                  }
              });
              resolve(true);
            });
      })
    }
    // insert record to DB
    function insertVideoReq(S3Videolocation,S3Imglocation,requestfilename,webmFile,thumbnailFilePath) {
      return new Promise((resolve,reject) => {
            const req_data = {
                owner_id,
                link:  S3Videolocation,
                thumbnail: S3Imglocation
            }
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}video_drop SET ?`, req_data , error => {
              if(error) return reject(error);
              
              const removeFiles = [requestfilename,webmFile,thumbnailFilePath];
              deleteFiles(removeFiles, (err)=> {
                  if(err) {
                    console.log("🔥",'can not delete video file');
                  }
              });
              resolve(true);
          }); 
      })
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

module.exports = userdropupload;