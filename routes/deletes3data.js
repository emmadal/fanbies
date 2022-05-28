const connection = require('../middleware/connection');
const express = require('express');
const jwt = require('jsonwebtoken')
const deletes3data = express.Router();
const AWS = require('aws-sdk');

//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY,
    region: 'eu-west-2'
});

const s3 = new AWS.S3();
require('dotenv').config({ path: './.env' });

/**
 * Delete S3 Object video / image 
 */

deletes3data.post('/', (req, res) => {
    const tokenuser = req.body.jwtoken;
    const feedid = req.body.id;
    const feedtype = req.body.assettype;
    let video_req = req.body.video_link;
    let img_req = req.body.img_link;
    
    const img_s3_key = img_req.replace(/https:\/\/fanbiesapp.s3.amazonaws.com\//g,"");
    const video_s3_key = video_req.replace(/https:\/\/fanbiesapp.s3.amazonaws.com\//g,"");

  // delete video object from s3
    function deleteS3VideoObj() {
      
      var params = {
          Bucket: 'fanbiesapp',
          Delete: {
            Objects: [
              {
                Key: img_s3_key
              },
              {
                Key: video_s3_key
              }
            ],
            Quiet: false
          }
        };
        s3.deleteObjects(params);
    }
  // delete img object from s3
    function deleteS3ImgObj() {
        var params = {
          Bucket: 'fanbiesapp',
          Key : img_s3_key
        };
        s3.deleteObject(params).promise();
    }

    function archiveS3(user_id) {
      return new Promise((resolve,reject) => {
            const archive_date =  Math.floor(new Date() / 1000);
            const req_data = {
                user_id,
                video_link:  video_s3_key,
                img_link: img_s3_key,
                type: feedtype,
                date: archive_date
            }
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}aws_archive SET ?`, req_data , error => {
              if(error) return reject(error);
              
              resolve([]);
          });
      })

      
    }

     function removeVideobyID(id) {
      return new Promise((resolve,reject) => {
            connection.query(`DELETE FROM ${process.env.DB_PREFIX}feeds WHERE id = ?`, id , error => {
              if(error) return reject(error);
              
              res.send({'success':true, 'message':'Video Deleted'})
              resolve([]);
          }); 
      })
    }

  
    try{
      jwt.verify(tokenuser, process.env.JWT_KEY, async (err,loggin) => {
        if(err) throw new Error("Invalid Token...");
        
        await archiveS3(loggin.uid);
        await removeVideobyID(feedid);

        if(feedtype === 'video') {
          deleteS3VideoObj();
        } else{
           deleteS3ImgObj();
        }
        
      })
    }catch(e){
      res.send({'success':false, 'message': e });
    }
  
});

module.exports = deletes3data;