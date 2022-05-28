const connection = require('../middleware/connection');
const express = require('express')
const getbankdetailsroute = express.Router();
const _ = require('lodash');

/**
 * Get shoutout by username 
 */
getbankdetailsroute.post('/', (req, res) => {
    const uid = req.body.uid;
    // Promise
    BanksDetails(uid)
    .then(data =>{
        res.send({'response':data,'success':true, 'message':''})
    }).catch(e => console.log("🤓",e));

    function BanksDetails(uid){
       return new Promise((resolve, reject)=>{
        const sql=`SELECT account_name, account_sort_code, account_number, bank_name, extra_info FROM ${process.env.DB_PREFIX}payment_detail WHERE uid = ?`;
            connection.query(sql,[uid], (error, results) => {
                if (error) reject(new Error(`Server Error No Bank detail at the moment`));
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    resolve([]);
                }
            });
        })
    }
});
module.exports = getbankdetailsroute;
