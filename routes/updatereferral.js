const connection = require('../middleware/connection');
const express = require('express')
const updatereferral = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Update Referral for a specific User
 */

updatereferral.post('/', (req, res) => { 
    const email = req.body.email;
    const uid = req.body.uid;
    try {
        checkUserRecordByUid(uid); 
    } catch (error) {
        console.log("Error with Update Referral:", error)
    }

    function checkUserRecordByUid(uid){
         return new Promise((resolve, reject)=>{
            connection.query(`SELECT id from ${process.env.DB_PREFIX}referral WHERE uid = ?`, uid , (error, results) => {
                if (error) 
                    reject(new Error(`Server Error with referral records Id`));
                if(results.length !== 0){
                    updateReferralById(results[0].id)
                }else {
                    insertReferral();
                }
                resolve(true);
                res.send({'success':true, 'message':'Added / Update'});
            });
         });
    }

    function updateReferralById(id){
        return new Promise((resolve, reject)=>{
            connection.query(`UPDATE ${process.env.DB_PREFIX}referral SET email = ? WHERE id = ?`, [email,id] , error => {
                if (error) reject(new Error(`Server Error Updating records`));

                resolve(true);
            });
        });
    }

    function insertReferral(){
        const data = {
			email,
            uid
		};
        return new Promise((resolve, reject)=>{
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}referral SET ?`, data , (error,results) => {
                if (error) 
                    reject(new Error(`Server Error unable to insert referral records`));

				resolve(true);
        	});
        });
    }
    
});
module.exports = updatereferral;