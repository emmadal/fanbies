const connection = require('../middleware/connection');
const express = require('express')
const getmyearningsroute = express.Router();

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Get user earnings 
 */
getmyearningsroute.post('/', (req, res) => {
    const token = req.body.jtoken;
    // Promise

     jwt.verify(token, process.env.JWT_KEY, (err, loggedin) => {
        if (err){
            return res.send({
                'success':false, 
                'message':'Error with server token'
                });
        }
        //check the uid from jwt is not empty 
        if(loggedin.uid !== null){
            
            getshoutdetails(loggedin.uid)
            .then(data =>{
                res.send({'response':data,'success':true})
            }).catch((e)=>{
                res.send({
                'success':false, 
                'message':'No Earnings at the moment.'
                });
            });
            // Sum of my earnings
            function getshoutdetails(uid) {
                return new Promise((resolve, reject)=>{
                    const sql=`SELECT SUM(charge) FROM ${process.env.DB_PREFIX}shoutout WHERE responseid = ? AND payout = ? AND ( status = ? OR status = ? )`;
                        connection.query(sql,[uid,'0','completed','ended'],function (error, results) {
                            if (error) 
                            return res.status(500).send(error);
                            
                            if(results.length !== 0){
                                resolve(results);
                            }else{
                                reject(new Error(`User doesn't have any earning`));
                            }
                        });
                    })
            }
        }
    });

});
module.exports = getmyearningsroute;
