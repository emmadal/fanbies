const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const deletereferralbyid = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Delete a user from the dashboard
 */

deletereferralbyid.post('/', (req, res) => {
	const tokenuser = req.body.jwtoken;
	const userid = req.body.uid;
	try{
		jwt.verify(tokenuser, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");
			getReferralId();
		})
	}catch(e){
		res.send({'success':false, 'message': e});
	}

	function getReferralId(){
		connection.query(`SELECT id from ${process.env.DB_PREFIX}referral WHERE uid = ?`, userid , (error, results) => {
		if(!!error)
			return res.status(500).send(error);
			if(results.length !== 0) {
				deleteReferral(results[0].id);
			} else{
				res.send({'response':'', 'message':'No Record for the user', 'success':true})
			}	
		});
	}
	
	//Delete deleteReferral by id
	function deleteReferral(value) {
		connection.query(`DELETE FROM ${process.env.DB_PREFIX}referral WHERE id = ?`, value , (error) => {
			if (error) 
				return res.status(500).send(error);

			res.send({'success':true, 'message':"User Referral Deleted."})
		})
    }
});



module.exports = deletereferralbyid;

