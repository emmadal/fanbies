const connection = require('../middleware/connection');
const express = require('express')
const updateusertypebyid = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Update a Pending Request Api.
 */

updateusertypebyid.post('/', (req, res) => {
    const usertype = req.body.usertype;
    const uid = req.body.uid;
   
    connection.query(`UPDATE ${process.env.DB_PREFIX}users SET usertype = ? WHERE id = ?`, [usertype,uid] , error => {
        if(!!error) return res.status(500).send(error);
    
        res.send({'success':true, 'message':'Updated'})
    });
    

});

module.exports = updateusertypebyid;