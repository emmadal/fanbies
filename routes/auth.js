const connection = require('../middleware/connection');
const _ = require('lodash');
const jwt = require('jsonwebtoken')
const express = require('express')
const authrouter = express.Router();
const md5 = require('md5')
require('dotenv').config({ path: './.env' });



//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Login Authentication
 */

authrouter.post('/', (req, res) => {
	const useremail = req.body.useremail
	const password = md5(req.body.password)
	const columns = ['id','username','name','picture','email','usertype','bio','reg_id'];

	connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE email = ? AND password = ?`, [columns,useremail,password] ,(error, results) => {
	  if (error) 
	  	return res.status(500).send(error);
		
	  if(results.length !== 0){
		  	const payloadToken = jwt.sign({
				loggedin:true, 
				uid:results[0].id,
				utype:results[0].usertype, 
				username:results[0].username
			}, process.env.JWT_KEY);
			results[0]['token'] = payloadToken;
			//delete results[0]["id"];
			res.send({'response':results,'success':true, 'message':''})
		}else{
			res.send({'response':results,'success':false, 'message':'Invalid Login.'})
		}
	});
});



module.exports = authrouter;

