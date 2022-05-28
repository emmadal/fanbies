const connection = require('../middleware/connection');
const express = require('express')
const updaterequestbyid = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Update a Pending Request Api.
 */

updaterequestbyid.post('/', (req, res) => {
    const jtoken = req.body.jtoken;
    const description = req.body.description;
    const title = req.body.title;
    const privacy = req.body.privacy ? '1': '0';
    const requestId = req.body.requestId;
    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err) => {
            if(err) res.status(500).send(error);
            
            updaterequestbyid();
        })
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }
   
    function updaterequestbyid() {
        connection.query(`UPDATE ${process.env.DB_PREFIX}shoutout SET mention_name = ?, message_shoutout = ?, privacy = ? WHERE id = ?`, [title,description,privacy,requestId] , error => {
            if(!!error) return res.status(500).send(error);
        
            res.send({'success':true, 'message':'Updated'})
        });
    }

});

module.exports = updaterequestbyid;