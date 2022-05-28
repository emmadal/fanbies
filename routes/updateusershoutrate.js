const connection = require('../middleware/connection');
const express = require('express')
const updateusershoutrate = express.Router();
const jwt = require('jsonwebtoken');

/**
 * Update Shoutrate and Video Call Rate for a user Details by uid
 */
updateusershoutrate.post('/', (req, res) => {
    const jtoken = req.body.jtoken;
    const shoutrate = req.body.shoutrate;
    const videocallrate = req.body.callrate;

    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err, loggedin) => {
             updateshoutrate(loggedin.uid)
        })
    }catch(e){
        res.send({'success':false, 'message':`Update Failed, Invalid Token. ${e}`})
    }

    function updateshoutrate(id){
       return new Promise((resolve, reject)=>{
        const sql=`UPDATE ${process.env.DB_PREFIX}users SET shoutrate = ?, callrate= ? WHERE id = ?`;
            connection.query(sql,[shoutrate,videocallrate,id], (error, results) => {
                if (error) reject(new Error(error));
                
                resolve(true);
                res.send({'success':true, 'message':'Updated...'})
            });
        })
    }
});
module.exports = updateusershoutrate;
