const connection = require('../middleware/connection');
const express = require('express')
const getuserclaimstatus = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get User Claim Status
 */

getuserclaimstatus.post('/', (req, res) => { 
    const uid = req.body.uid;

    connection.query(`SELECT * from ${process.env.DB_PREFIX}account_claim WHERE uid = ?`, [uid] , (error, results) => {
        if (error) res.status(500).send(error);
        
        res.send({'response':results,'success':true, 'message':''})
        
    });
    
});
module.exports = getuserclaimstatus;