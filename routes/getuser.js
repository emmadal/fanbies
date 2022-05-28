const connection = require('../middleware/connection');
const express = require('express')
const getuser = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get User Account 
 */

getuser.post('/', (req, res) => { 
    const username = req.body.username;
    const tokenuser = req.body.jtoken;
    if(tokenuser){
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, (err, loggedin) => userDetails(loggedin.uid))
    }else{
        userDetails();
    }

    function userDetails(tokenid){
        const columns = ['id','username','name','picture','extra_talent','active','primary_talent','secondary_talent','bio','mediaUrl','shoutrate','available_slot','twitter_id','fb_id','ig_id','linkedin_id','tik_id','usertype','profession','callrate'];
        const trimvalue = username.trim();

        connection.query(`SELECT DISTINCT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,trimvalue] ,function (error, results) {
            if (error) 
            return res.status(500).send(error);
            
            let myprofile = false;
            if(results.length !== 0){
                if(tokenid !== undefined){
                    myprofile = tokenid === results[0]["id"];
                    results[0]["mypage"] = myprofile;
                }
                results[0]["rand_"] = results[0]["id"];
                delete results[0]["id"];
                results[0]["mypage"] = myprofile;
                res.send({'response':results,'success':true, 'message':''})
            }else{
                res.send({'response':results,'success':false, 'message':'No User Available at this moment.'})
            }

        });
    }
});
module.exports = getuser;