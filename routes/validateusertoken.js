const connection = require('../middleware/connection');
const express = require('express')
const validateresethash = express.Router();

/**
 * Vaidate Reset token
 */
validateresethash.post('/', (req, res) => {
    const hashtoken = req.body.hash;
    connection.query(`SELECT * from ${process.env.DB_PREFIX}rest_password WHERE hash = ?`, [hashtoken] , (error, results) => {
        if (error) 
        return res.status(500).send(error);
        
        if(results.length !== 0){
            res.send({'response':results,'success':true, 'message':'Valid Hash'})
        }else{
            res.send({'response':results,'success':false, 'message':'Sorry, Invalid token / Your token is expired. Please contact Fanbies Admin.'})
        }

    });
});


module.exports = validateresethash;
