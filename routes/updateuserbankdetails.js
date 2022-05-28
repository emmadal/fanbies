const connection = require('../middleware/connection');
const express = require('express')
const updatebankdetailsroute = express.Router();
const _ = require('lodash');

/**
 * Update Bank Details by uid
 */
updatebankdetailsroute.post('/', (req, res) => {
    const uid = req.body.uid;
    const accname = req.body.accname;
    const sortcode = req.body.sortcode;
    const accnumber = req.body.accnumber;
    const bankname = req.body.bankname;
    const otherplatforms = req.body.otherplatforms;
    // Promise
    validateBankDetail(uid)
    .then(length => {
        if(length === 0){
            //insert
            InsertBankDetail()
        }else{
            //update
            UpdateBanksDetails()
        }
    })
    .then(() => {
        res.send({'success':true, 'message':'Bank Details Updated.'})
    }).catch(e => console.log("🤓",e));

    //Check existing record for a bank details already exist
    function validateBankDetail(value) {
        return new Promise((resolve,reject) => {
            connection.query(`SELECT * from ${process.env.DB_PREFIX}payment_detail WHERE uid = ?`, value , (error,results)=> {
            if (error) 
                reject(error);

                resolve(results.length);
            })
        })
    }

    //Insert Bank details
    function InsertBankDetail(){
        const data = {
            uid,
            account_name: accname,
            account_sort_code: sortcode,
            account_number: accnumber,
            bank_name: bankname,
            extra_info: otherplatforms
        };
        return new Promise((resolve,reject) => {
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}payment_detail SET ?`, data , (error) => {
                if(error) return reject(error);
                
                resolve(true);
            });
        });
    }

    //Update Bank Details
    function UpdateBanksDetails(){
       return new Promise((resolve, reject)=>{
        const sql=`UPDATE ${process.env.DB_PREFIX}payment_detail SET account_name = ?, account_sort_code = ?, account_number = ?, bank_name = ?, extra_info = ? WHERE uid = ?`;
            connection.query(sql,[accname,sortcode,accnumber,bankname,otherplatforms,uid], (error, results) => {
                if (error) reject(new Error(error));
                
                resolve(results);
                
            });
        })
    }
});
module.exports = updatebankdetailsroute;
