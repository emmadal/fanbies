const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const getuser = express.Router();
const axios = require('axios')
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get User Account for setting page 
 */

getuser.post('/', (req, res) => { 
    //const username = req.body.username;
    const tokenuser = req.body.jtoken;
    if(tokenuser){
        const username = req.body.username;
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, (err, loggedin) => {
                if (err)
                return res.send({'success':false, 'message':'Error with server token'});
                
                getuseridbyname(username).then(data =>{
                    if(data[0].id === loggedin.uid){
                        userDetails(username);
                    }else{
                        return res.send({'success':false, 'message':'Error with server token'});
                    }
                });
                
        })
    }

    function getuseridbyname(username){
        return new Promise((resolve, reject) =>{
            const columns = ['id'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,username] ,function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error('No User Available at this moment.'))
                }

            });
        })
    }

    function userDetails(value){
        const columns = ['id','email','username','name','picture','extra_talent','active','primary_talent','secondary_talent','bio','mediaUrl','shoutrate','available_slot','twitter_id','fb_id','ig_id','usertype','profession','callrate'];
        //const trimvalue = value.trim();

        connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,value] ,function (error, results) {
            if (error) 
            return res.status(500).send(error);
            
            if(results.length !== 0){
                res.send({'response':results,'success':true, 'message':''})
            }else{
                res.send({'response':results,'success':false, 'message':'No User Available at this moment.'})
            }

        });
    }
});
module.exports = getuser;