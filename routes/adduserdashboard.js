const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const adduserdashboard = express.Router();
const md5 = require('md5');
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Add a new user from the dashboard
 */

adduserdashboard.post('/', (req, res) => {
	const tokenuser = req.body.jtoken;
	const email = req.body.useremail;
	const username = req.body.username;
	try{
		jwt.verify(tokenuser, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");
			userRegister(email,username)
		})
	}catch(e){
		res.send({'success':false, 'message': "Invalid Token"});
	}
	
	async function userRegister(emailvalue,uname) {
		try{
			await validateEmail(emailvalue);
			await validateUsername(uname);
			await addUser();
		}catch(e){
			console.log("😱", e)
		}
	}
	
	//Validate if username already exist
	function validateUsername(value) {
        return new Promise((resolve,reject) => {
                connection.query(`SELECT username from ${process.env.DB_PREFIX}users WHERE username = ?`, value , (error,results)=> {
                if (error) 
                    reject(error);
                if(results.length === 0){
                    resolve(results);
                }else{
					res.send({'success':false, 'message':'Username provided already exist, Please try another.','response':[]});
                    reject("Username provided already exist, Please try another.");
                }
            })
        })
    }

	//Validate if email already exist
	function validateEmail(value) {
        return new Promise((resolve,reject) => {
                connection.query(`SELECT email from ${process.env.DB_PREFIX}users WHERE email = ?`, value , (error,results)=> {
                if (error) 
                    reject(error);
                if(results.length === 0){
                    resolve(results);
                }else{
					res.send({'success':false, 'message':'Email provided already exist, Please try another.','response':[]});
                    reject("Email provided already exist, Please try another.");
                }
            })
        })
    }
	// register a new user
	function addUser(){
		const data = {
			email,
			name: req.body.name,
			username: req.body.username,
			password:  md5(req.body.password),
			picture: "https://fanbiesapp.s3.eu-west-2.amazonaws.com/2019-03-13/1552479858884_209.png",
			usertype: req.body.usertype
		};
		return new Promise((resolve,reject) => {
			connection.query(`INSERT INTO ${process.env.DB_PREFIX}users SET ?`, data , (error,results) => {
                if(error) return reject(error);

				res.send({'success':true, 'message':'New User Added','response':[]});
				resolve(true);
        	});
		});
	};
	
});



module.exports = adduserdashboard;

