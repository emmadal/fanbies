const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const validateToken = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Login Authentication
 */

validateToken.post('/', (req, res) => {
	const tokenuser = req.body.jwtoken	
	jwt.verify(tokenuser, process.env.JWT_KEY, (err, loggedin) => {
		if (err) res.send({'success':false, 'message':'Invalid Token.'});
		res.send({'success':true, 'message':'','response':loggedin});
	});
});



module.exports = validateToken;

