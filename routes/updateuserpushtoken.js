const connection = require('../middleware/connection');
const express = require('express')
const updatepushtoken = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Store User Device ID for Push Notification
 */

updatepushtoken.post('/', (req, res) => { 
    const pushtoken = req.body.pushtoken;
    const jtoken = req.body.jtoken;
    try{
        if(jtoken){
            jwt.verify(
                jtoken, 
                process.env.JWT_KEY, (err, loggedin) => userDetails(loggedin.uid,pushtoken ))
        }
    } catch(e){
        console.log("😱", e);
        res.send({'success':false, 'message':'Push Token Not Stored.'})
    };

    function userDetails(uid, value){
        return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}users SET reg_id = ? WHERE id = ?`, [value, uid] , error => {
                    if(error) return reject(error);
                    
                    resolve(true);
                    res.send({'success':true, 'message':''})
                });
        });
    }
});
module.exports = updatepushtoken;