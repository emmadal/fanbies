const connection = require('../middleware/connection');
const express = require('express')
const deletemessage = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Delete message
 */

deletemessage.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken;
    const messageid = req.body.messageid;
    //const conversationId = req.body.conversationID ? req.body.conversationID : 0;
    try{
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, async (err, loggedin) => {
                if(err) throw new Error("Invalid Token...");
                if(loggedin.uid !== null) {
                    // check existing message occurs 
                    const isExist = await isMessageExist(messageid); 
                    if(isExist.length !== 0) {
                        await deleteMessage(isExist[0].id);
                    }
                    res.send({'response': {}, 'success':true, 'message':"Message Deleted"});
                }
            }) 
    }catch(e){
        res.send({'success':false, 'message':'Failed, Invalid Token.'})
    }

    function isMessageExist(id) {
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT DISTINCT id from ${process.env.DB_PREFIX}messages WHERE id = ?`, [id] , (error, results) => {
                if (error) reject(new Error(`Server Error with conversations Table`));
                
                resolve(results);
            });
        })
    }


    function deleteMessage(id) {
        return new Promise((resolve, reject) =>{
            connection.query(`DELETE FROM ${process.env.DB_PREFIX}messages WHERE id = ?`, id , (error, results) => {
                if (error) reject(new Error(`Server Error with messages Table`));
                
                resolve(results);
            });
        })
    }
});
module.exports = deletemessage;