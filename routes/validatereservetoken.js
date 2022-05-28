const connection = require('../middleware/connection');
const express = require('express')
const validatereservationtoken = express.Router();

/**
 * Vaidate Reservation booking token
 */
validatereservationtoken.post('/', (req, res) => {
    const hashtoken = req.body.hash;

    async function validation(){
        try {
            const details = await validateToken();
            if(details.length !== 0){
                const influencer = await getuserbyid(details[0].responseid);
                details[0]["influencer"] = influencer;
                delete details[0]["responseid"]; //delete influencer id
                res.send({'response':details,'success':true, 'message':''})
            }else {
                res.send({'response': [],'success':false, 'message':'Sorry, Invalid token / Your token is expired. Please contact Fanbies Admin.'})
            }
        } catch (error) {
            res.send({'success':false, 'message':'Failed, Invalid Token.'})
        }
    }
    
    // validate the user reserve token
    function validateToken() {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from ${process.env.DB_PREFIX}reservebookings WHERE tokenkey = ? AND status = ?`, [hashtoken, 'created'] , (error, results) => {
                if (error) reject(new Error(`Server Error Reserve Table`));
                
                resolve(results);
            });
        });
    }

    // Get user id by username
    function getuserbyid(id) {
        return new Promise((resolve, reject) => {
            const col = ['username','name','shoutrate','picture','profession'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE id = ? `, [col,id] , (error, results) => {
                if (error) reject(new Error(error));
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error('No User Available at this moment.'))
                }
            });
        })
    }


    validation();
});


module.exports = validatereservationtoken;
