const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const deleteuser = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Delete a user from the dashboard
 */

deleteuser.post('/', (req, res) => {
	const tokenuser = req.body.jwtoken;
	const userid = req.body.uid;
	try{
		jwt.verify(tokenuser, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");
			deleteUser(userid)
		})
	}catch(e){
		res.send({'success':false, 'message': "Invalid Token"});
	}

	
	//Delete user by id
	function deleteUser(value) {
		connection.query(`DELETE FROM ${process.env.DB_PREFIX}users WHERE id = ?`, value , (error) => {
			if (error) 
				return res.status(500).send(error);

			res.send({'success':true, 'message':"User Deleted."})
		})
    }
});



module.exports = deleteuser;

