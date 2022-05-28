const connection = require('../middleware/connection');
const express = require('express')
const getuserreferral = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * Get Referral Details
 */

getuserreferral.post('/', (req, res) => {
    const uid = req.body.uid;
    connection.query(`SELECT email from ${process.env.DB_PREFIX}referral WHERE uid = ?`, uid , (error, results) => {
    if(!!error)
        return res.status(500).send(error);

        if(results.length !== 0) {
            res.send({'response':results, 'message':'','success':true})
        } else{ 
            res.send({'response':[], 'message':'No referral for user','success':false})
        }
    });
    

});

module.exports = getuserreferral;