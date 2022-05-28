const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const updateprofilepic = express.Router();
const multer = require('multer')
const AWS = require('aws-sdk');
var multerS3 = require('multer-s3')

//configuring the AWS environment
AWS.config.update({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_KEY
});

const s3 = new AWS.S3();
require('dotenv').config({ path: './.env' });

const upload = multer({
    storage: multerS3({
    s3: s3,
    bucket: 'fanbiesapp',
    metadata: function (req, file, cb) {
        cb(null, {fieldName: `fanbiesapp.${file.originalname}`});
    },
    acl: 'public-read',
    key: function (req, file, cb) {
        const ext = file.mimetype === 'image/jpeg' ? 'jpg' : 'png'
        const datePath = new Date().toJSON().slice(0,10);
        const timestmp = new Date().getTime();
        const rand = Math.floor((Math.random() * 1000) + 1);
        cb(null, `img/${datePath}/${timestmp}_${rand}.${ext}`)
    }
    })
})

/**
 * Update user pic and store on aws
 */

updateprofilepic.post('/',upload.single('file'), (req, res) => { 
    try{
        const picturePath = req.file.location;
        const id  = req.body.id;

        connection.query('UPDATE nolly_users SET picture = ? WHERE id = ?', [picturePath,id] , error => {
        if(error) return res.status(500).send(error);
        res.send({'response':picturePath,'success':true, 'message':'Details Updates.'})

        });
    }catch(e){
        console.log("😱", e);
    }
    

});



module.exports = updateprofilepic;