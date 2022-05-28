const connection = require('../middleware/connection');
const express = require('express')
const jwt = require('jsonwebtoken')
const getusertotalrequest = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get Total Users Shoutout Request
 */

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

getusertotalrequest.post('/', (req, res) => { 
    const jtoken = req.body.jtoken;
    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err, loggedin) => totalUserRequestType(loggedin.utype))
    }catch(e){
        res.send({'success':false, 'message':'Invalid Token get total request.'})
    }

    function totalUserRequestType(usertype){
        const type = req.body.type;
        const userid = req.body.uid;
        let restypeuser = 'requestid';
        if(usertype !== 0){
            restypeuser = 'responseid';
        }
        connection.query(`SELECT COUNT(id) AS count from ${process.env.DB_PREFIX}shoutout WHERE status = ? AND ${restypeuser} = ? `, [type,userid] , (error, results) => {
            if (error) return res.status(500).send(error);
            
            res.send({'response':results[0].count,'success':true, 'message':''})
        });
    }
});
module.exports = getusertotalrequest;