const connection = require('../middleware/connection');
const express = require('express')
const md5 = require('md5')
const updateuserpassadmin = express.Router();
const jwt = require('jsonwebtoken');

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Vaidate Reset token
 */
updateuserpassadmin.post('/', (req, res) => {
    const upass = md5(req.body.password);
    const uid = req.body.uid;
    const jtoken = req.body.jwtoken;

    jwt.verify(jtoken, process.env.JWT_KEY, (err, loggedin) => {
        if (err) return res.send({'success':false, 'message':'Error with server token'});

         if(loggedin.utype >= 2) {
                updateProfile()
            }else {
                res.send({'success':false, 'message':'Invalid Access Token User.'});
            }
    });

    function updateProfile(){
        connection.query(`UPDATE ${process.env.DB_PREFIX}users SET password = ? WHERE id = ?`, [upass,uid] , error => {
            if(error) return res.status(500).send(error);
            
            res.send({'success':true, 'message':'Details Successfully Updated, Thank you.'})
        });
    }    
});


module.exports = updateuserpassadmin;
