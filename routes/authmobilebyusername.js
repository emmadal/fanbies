const connection = require('../middleware/connection');
const jwt = require('jsonwebtoken')
const express = require('express')
const mobilloginbyusername = express.Router();
//const md5 = require('md5')
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Login Authentication for Mobile IG User
 */

mobilloginbyusername.post('/', (req, res) => {
	const username = req.body.username
	const devicetoken = req.body.devicetoken
	//const password = md5(req.body.password)
	const columns = ['id','username','name','picture','email','usertype','bio','push_active'];

	connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,username] ,(error, results) => {
	  if (error) 
	  	return res.status(500).send(error);
		
	  if(results.length !== 0) {
		  	const payloadToken = jwt.sign({loggedin:true, uid:results[0].id, utype:results[0].usertype}, process.env.JWT_KEY);
			results[0]['token'] = payloadToken;
			if(devicetoken !== undefined ) {
				insertRegId(devicetoken, results[0].id).then(()=>{
					res.send({'response':results,'success':true, 'message':''})
				}).catch((e)=>{
					res.send({'success':false, 'message':'Login, Devive Id Failed'})
				});
			} else {
				res.send({'response':results,'success':true, 'message':''})
			}
		}else{
			res.send({'response':results,'success':false, 'message':'Invalid Login.'})
		}
	});

	function insertRegId(devicetoken, uid) {
		return new Promise((resolve,reject) => {
			connection.query(`UPDATE ${process.env.DB_PREFIX}users SET reg_id = ? WHERE id = ?`, [devicetoken, uid] , error => {
                if(error) return reject(error);

				resolve(true);
        	});
		});
	}
});



module.exports = mobilloginbyusername;

