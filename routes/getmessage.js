const connection = require('../middleware/connection');
const express = require('express')
const getmessage = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get Message By Conversation logs Id
 */

getmessage.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken;
    //const convoid = req.body.convoid;
    const otherid = req.body.otherid;
    try{
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, async (err, loggedin) => {
                if(err) throw new Error("Invalid Token...");
                if(loggedin.uid !== null) {
                      const isConvoExit = await getConversationID(loggedin.uid,otherid);
                      if(isConvoExit.length !== 0) {
                        const messageDetails = await getMessageByConvoID(isConvoExit[0].id);
                        if(messageDetails.length !== 0) { 
                            res.send({'response': { message: messageDetails }, 'success':true}) 
                        } else{
                            res.send({'response': [], 'success':false, "message": "Start a Conversation..."})
                        }
                      }else{
                          res.send({'response': [], 'success':false, "message": "Start a Conversation..."})
                      }
                }
            }) 
    }catch(e){
        res.send({'success':true, 'message': e})
    }

    function getConversationID(uid,otherid) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT id from ${process.env.DB_PREFIX}conversations WHERE ( sender = ${uid} AND receiver = ${otherid} ) OR ( receiver = ${uid} AND  sender = ${otherid} )`, (error, results) => {
                if (error) reject(new Error(error));
                
                resolve(results);
                
            });
        })
    }

    function getMessageByConvoID(id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * from ${process.env.DB_PREFIX}messages WHERE conversationID = ? ORDER BY id Desc`, [id] , (error, results) => {
                if (error) reject(new Error(`Server Error with messages Table`));
                
                resolve(results);
            });
        })
    }
});
module.exports = getmessage;