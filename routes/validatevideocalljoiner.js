const connection = require('../middleware/connection');
const express = require('express')
const validatevideocallreservetoken = express.Router();

/**
 * Vaidate Video Call Reservation booking token
 */
validatevideocallreservetoken.post('/', (req, res) => {
    const hashtoken = req.body.hash;

    async function validation(){
        try {
            let details = await validateToken();
            if(details.length !== 0){
                let influencer = await getuserbyid(details[0].userid);
                details[0]["influencer"] = influencer;
                delete details[0]["userid"]; //delete influencer id
                const shoutoutdetails = await getshoutoutdetail(details[0].shoutoutid);
                if( shoutoutdetails[0].status === 'processing' 
                    && shoutoutdetails[0].booking_type === 1
                ){ //check call status is not ended else token expired
                    let joiner = await getuserbyid(shoutoutdetails[0].requestid);
                    joiner[0]["id"] = shoutoutdetails[0].requestid;
                    details[0]["joiner"] = joiner;

                    details[0]["calldetails"] = shoutoutdetails;
                    
                    res.send({'response':details,'success':true, 'message':''})
                } else {
                    res.send({'response':[],'success':false, 'message':'Expired / ended call'})
                }
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
            const col = ['shoutoutid','date','userid'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}callwaiting WHERE token = ?`, [col,hashtoken] , (error, results) => {
                if (error) reject(new Error(`Server Error Reserve Table`));
                
                resolve(results);
            });
        });
    }

    // Get celeb user by id
    function getuserbyid(id) {
        return new Promise((resolve, reject) => {
            const col = ['name','picture'];
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

    function getshoutoutdetail(id){
        return new Promise((resolve, reject) => {
            const col = ['booking_type','call_duration','message_shoutout','requestid','status'];
            const sql=`SELECT ?? FROM ${process.env.DB_PREFIX}shoutout WHERE id = ?`;
            connection.query(sql,[col,id],function (error, results) {
                if (error) return reject(new Error(error))
                if(results.length !== 0){
                    resolve(results);
                }else{
                     reject(new Error(`No shout out request`));
                }

            });
        })
    };


    validation();
});


module.exports = validatevideocallreservetoken;
