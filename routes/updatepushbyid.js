const connection = require('../middleware/connection');
const express = require('express')
const updatepushbyid = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Update User Push Notification Settings Api.
 */

updatepushbyid.post('/', (req, res) => {
    const jtoken = req.body.jtoken;
    const val = req.body.active;
    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err,loggedin) => {
            if(err) res.status(500).send(error);
            
            updatepushbyid(val, loggedin.uid);
        })
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }
   
    function updatepushbyid(value,uid) {
        connection.query(`UPDATE ${process.env.DB_PREFIX}users SET push_active = ? WHERE id = ?`, [value,uid] , error => {
            if(!!error) return res.status(500).send(error);
        
            res.send({'success':true, 'message':'Push Value Updated'})
        });
    }

});

module.exports = updatepushbyid;