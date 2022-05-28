const connection = require('../middleware/connection');
const express = require('express');
const updateprofilepic = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const sharp = require('sharp');
const fs = require('fs');
const filepath = require('path')
//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY
});

const s3 = new AWS.S3();
require('dotenv').config({ path: './.env' });

const upload = multer({ dest: 'uploads/' });

/**
 * 
 * S3 upload
 */
function uploadtoS3(obj) {
    const datePath = new Date().toJSON().slice(0,10);
    var params = {
        Bucket: 'fanbiesapp',
        Body : fs.createReadStream(obj),
        ACL: 'public-read',
        Key : `img/${datePath}/${filepath.basename(obj)}`
    };
    return s3.upload(params).promise();
}


/**
 * Update user pic and store on aws
 */
updateprofilepic.post('/', upload.single('file'), (req, res) => { 
    const id  = req.body.id;
    const sharpFile = req.file.path;
    const timestmp = new Date().getTime();
    const rand = Math.floor((Math.random() * 1000) + 1);
    processedFile = `./uploads/${timestmp}_${rand}.png`;

    // Start process
    try{
        sharp(sharpFile)
        .resize(200,200)
        .png()
        .toFile(processedFile, (err, info) => { 
            if (info !== null) {
                //S3
                uploadtoS3(processedFile).then(data =>{
                    const s3PicPath = data.Location;
                    updatePicQuery(s3PicPath)
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

    function updatePicQuery(path){
        return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}users SET picture = ? WHERE id = ?`, [path,id] , error => {
                if(error) return reject(error);

                res.send({'response':path,'success':true, 'message':'Details Updates.'})
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


module.exports = updateprofilepic;