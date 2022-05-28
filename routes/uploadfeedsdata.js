const connection = require('../middleware/connection');
const express = require('express');
const uploadfeedsdata = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const fs = require('fs');
const sharp = require('sharp');
const filepath = require('path');
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

uploadfeedsdata.post('/',upload.single('file'), (req, res) => {
    const trimusername = req.body.ownername.replace(/ /g, '');
    const requestfilename = `./uploads/${Date.now()}_${trimusername}.mp4`;
    const thumbnailFilePath = `./uploads/thumbnails/${Date.now()}_${trimusername}.png`;
    const user_id = req.body.uid;
    const caption_title = req.body.title;
    const feed_type = req.body.type;
    //emailsif(feedtype === 'video') {
    //const owner_email = req.body.useremail;
    const datePath = new Date().toJSON().slice(0,10);
    const webmFile = `./${req.file.path}`;
    
    if( feed_type === 'video') {
        let s3FileArr = [];
        let s3Promise = [];
        async function convertFFG(input, vidOutput,imgOut) {
          try {
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

        //AWS Storage for Video
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
            let params = {
              Bucket: 'fanbiesapp',
              Body : fs.createReadStream(obj),
              ACL: 'public-read',
              Key : `video/${datePath}/${filepath.basename(obj)}`
            };
            return s3.upload(params).promise();
        }

    } else {
      const rand = Math.floor((Math.random() * 1000) + 1);
      const processedFile = `./uploads/${datePath}_${rand}.png`;

      function uploadImgS3(obj) {
        let params = {
            Bucket: 'fanbiesapp',
            Body : fs.createReadStream(obj),
            ACL: 'public-read',
            Key : `img/${datePath}/${filepath.basename(obj)}`
        };
        return s3.upload(params).promise();
      }

      // IMG Start process
      try{
        const sharpFile = req.file.path;
          sharp(sharpFile)
          .resize(540,320)
          .png()
          .toFile(processedFile, (err, info) => { 
              if (info !== null) {
                  //S3
                  uploadImgS3(processedFile).then(data =>{
                      const s3PicPath = data.Location;
                      insertVideoReq('',s3PicPath)
                      .then(()=>{
                          //then delete all files 
                          const removeFiles = [sharpFile,processedFile];
                          deleteFiles(removeFiles, (err)=> {
                              if(err) {
                              console.log("🔥",'can not delete video file');
                              }
                          });
                      })
                      
                  });
                  
              }
          });
      }catch(e){
          console.log("e", e);
          res.send({'response':'','success':false, 'message':'Fail Update.'})
      }

    }

    function insertVideoReq(S3Videolocation,S3Imglocation) {
      return new Promise((resolve,reject) => {
            const date =  Math.floor(new Date() / 1000);
            const req_data = {
                user_id,
                title: caption_title,
                video_link:  S3Videolocation,
                img_link: S3Imglocation,
                type: feed_type,
                date
            }
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}feeds SET ?`, req_data , error => {
              if(error) return reject(error);
              
              resolve([]);
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

module.exports = uploadfeedsdata;