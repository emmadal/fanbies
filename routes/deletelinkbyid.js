const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const deletelinkbyid = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Delete user link by ID
 */

deletelinkbyid.post('/', (req, res) => {
	const tokenuser = req.body.jtoken;
	const link_id = req.body.id;
	try{
		jwt.verify(tokenuser, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");
			if(loggin.uid !== null) {
				deleteLink(loggin.uid)
			}
		})
	}catch(e){
		res.send({'success':false, 'message': "Invalid Token"});
	}
	
	
	// delete a user link
	function deleteLink(owner_id){
		return new Promise((resolve,reject) => {
			connection.query(`DELETE FROM ${process.env.DB_PREFIX}links WHERE id = ? AND owner_id = ?`, [link_id, owner_id] , (error) => {
			if (error) reject(new Error(`Server Error Linked Action`));

			res.send({'success':true, 'message':"User Referral Deleted."})
			resolve(results);
			});
		});
	};
	
});



module.exports = deletelinkbyid;

