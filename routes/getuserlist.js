const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const userlist = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get Normal User Account List
 */

userlist.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken; //usertype
    const usertype = req.body.usertype;
    const offset = req.body.offset;

    try{
        if(tokenuser){
            jwt.verify(
                tokenuser, 
                process.env.JWT_KEY, (err, loggedin) => userDetails(usertype)) 
        }
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }
    

    function userDetails(usertype){
        const type = usertype;
        const columns = ['username','name','picture','usertype'];
        const limitBy = 20;
        const offSetCounter = limitBy * offset;

        connection.query(`SELECT DISTINCT ?? from ${process.env.DB_PREFIX}users WHERE usertype = ? ORDER BY id Desc LIMIT ${limitBy} OFFSET ${offSetCounter}`, [columns,type] , (error, results) => {
            if (error) throw new Error(error);
            
            
            res.send({'response':results,'success':true, 'message':''})
        });
    }
});
module.exports = userlist;