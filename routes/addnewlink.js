const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const addnewlink = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Add a new user link
 */

addnewlink.post('/', (req, res) => {
	const tokenuser = req.body.jtoken;

	try{
		jwt.verify(tokenuser, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");
			if(loggin.uid !== null) {
				createLink(loggin.uid)
			}
		})
	}catch(e){
		res.send({'success':false, 'message': "Invalid Token"});
	}
	
	
	// create a link for a user
	function createLink(owner_id){
		const data = {
			owner_id,
			title: req.body.linktitle,
			link_ref: req.body.linkref,
			clicks: 0,
			visible: req.body.linkvisible,
			link_order: 0,
			icon: '',
		};
		return new Promise((resolve,reject) => {
			connection.query(`INSERT INTO ${process.env.DB_PREFIX}links SET ?`, data , (error,results) => {
                if(error) return reject(error);

				res.send({'success':true, 'message':'Link Added','response':[]});
				resolve(true);
        	});
		});
	};
	
});



module.exports = addnewlink;

