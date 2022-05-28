const connection = require('../middleware/connection');
const express = require('express')
const getconversationbyuid = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')
const _ = require('lodash');
//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get Conversation by user id
 */

getconversationbyuid.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken;
    try{
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, async (err, loggedin) => {
                if(err) throw new Error("Invalid Token...");
                if(loggedin.uid !== null) {
                    const data = await getMyConversation(loggedin.uid);
                    if(data.length !== 0) {
                      res.send({'response': data, 'success':true, message: '...'});  
                    } else{
                     res.send({'response': [], 'success':true, message: 'No conversation...'})   
                    }
                    
                }
            }) 
    }catch(e){
        res.send({'success':true, 'message': e})
    }

    function getMyConversation(uid) {
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT * from ${process.env.DB_PREFIX}conversations WHERE sender = ? OR receiver = ?`, [uid,uid] , (error, results) => {
                if (error) reject(new Error(`Server Error with conversations Table get my list...`));
                // write a loop for getting getlastmessage, sender details and reciverDetails
                if(results.length !== 0) {
                    _.forEach(results, async (value,key)=>{
                        const senderDetails = await getDetails(value.sender); 
                        const reciverDetails = await getDetails(value.receiver);
                        const getlastmessage = await getLastMessage(value.id);
                        results[key]['senderDetails'] = senderDetails;
                        results[key]['reciverDetails'] = reciverDetails;
                        results[key]['lastmessage'] = getlastmessage;
                        if( key ===  results.length-1){
                            resolve(results)
                        }
                    })
                }
                else{
                    resolve([]);
                }
            });
        })
    }


    function getDetails(uid) {
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT picture, name, id from ${process.env.DB_PREFIX}users WHERE id = ?`, [uid] , (error, results) => {
                if (error) reject(new Error(`Server Error with user Table`));
                
                resolve(results);
            }); 
        }) 
    }

    function getLastMessage(id){
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT message from ${process.env.DB_PREFIX}messages WHERE conversationID = ? ORDER BY id Desc LIMIT 1`, [id] , (error, results) => {
                if (error) reject(new Error(`Server Error with getting message Table`));
                
                resolve(results);
            }); 
        }) 
    }
});
module.exports = getconversationbyuid;