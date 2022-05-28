const connection = require('../middleware/connection');
const express = require('express')
const getuserfeedbyid = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get User By Feed by Id
 */

getuserfeedbyid.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken;
    const username = req.body.username;
    //check subscribers is valid then get feed is another logic needed
    // when subscription is done and ready

    try{
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, async (err, loggedin) => {
                if(err) return res.send({'response':[],'success':false, 'message': err});
                if(loggedin.uid !== null) {
                    //await userDetails(loggedin.uid);
                    await getuserfeedbyid(loggedin.uid);
                }
            }) 
    }catch(e){
        res.send({'success':false, 'message': e,'response':[]})
    }

    function getuserfeedbyid(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from ${process.env.DB_PREFIX}feeds WHERE user_id = ? ORDER BY date Desc`, [id] , (error, results) => {
                if (error) reject(new Error(`Server Error with messages Table`));
                
                res.send({
                    'response':results,
                    'success':true, 
                    'message':''
                    })
                resolve(results);
            });
        })
    }

    // function getUserSubscribed(tokenid){
    //     const columns = ['id'];
    //     const trimvalue = username.trim();
    //     return new Promise((resolve, reject) => {
    //         connection.query(`SELECT DISTINCT ?? from ${process.env.DB_PREFIX}subscriber WHERE username = ?`, [columns,trimvalue] ,function (error, results) {
    //             if (error) reject(new Error(`Server Error with messages Table`));
                
    //             let myprofile = false;
    //             if(results.length !== 0){
    //                 if(tokenid !== undefined){
    //                     myprofile = tokenid === results[0]["id"];
    //                     results[0]["mypage"] = myprofile;
    //                 }
    //                 results[0]["rand_"] = results[0]["id"];
    //                 delete results[0]["id"];
    //                 results[0]["mypage"] = myprofile;
    //                 resolve(results);
    //             }else{
    //                 resolve(results);
    //             }

    //         });
    //     });
    // }

});
module.exports = getuserfeedbyid;