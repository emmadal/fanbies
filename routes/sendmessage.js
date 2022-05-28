const connection = require('../middleware/connection');
const express = require('express')
const sendmessage = express.Router();
const firepush = require('../middleware/firepush');
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Send message to a user
 */

sendmessage.post('/', (req, res) => { 
    const tokenuser = req.body.jtoken;
    const date = req.body.date;
    const message = req.body.message;
    const defaultReceiver = req.body.receiver;
    //const conversationId = req.body.conversationID;
    try{
        jwt.verify(
            tokenuser, 
            process.env.JWT_KEY, async (err, loggedin) => {
                if(err) throw new Error("Invalid Token...");
                if(loggedin.uid !== null) {
                    const insertObj = {
                        sender: loggedin.uid,
                        receiver: defaultReceiver,
                        date,
                        unseenCount: 0
                    };
                    // check existing conversation occurs 
                    const isConvExist = await isConvoExist(loggedin.uid,defaultReceiver); 
                    if(isConvExist.length !== 0) {
                        await insertMessage(isConvExist[0].id,loggedin.uid,date,defaultReceiver,message);
                    } else{
                        const dataId = await insertConvo(insertObj);
                        await insertMessage(dataId,loggedin.uid,date,defaultReceiver,message);
                    }
                    pushnotification(defaultReceiver); //send message to receiver
                    res.send({'response': {}, 'success':true});
                }
            }) 
    }catch(e){
        res.send({'success':false, 'message':'Failed, Invalid Token.'})
    }

    function isConvoExist(id,otherid) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT DISTINCT id from ${process.env.DB_PREFIX}conversations WHERE ( sender = ${id} AND receiver = ${otherid} ) OR ( receiver = ${id} AND  sender = ${otherid} )` , (error, results) => {
                if (error) reject(new Error(`Server Error with conversations Table`));
                
                resolve(results);
            });
        })
    }

    function insertConvo(objval) {
        return new Promise((resolve, reject) => {
            connection.query(`INSERT INTO ${process.env.DB_PREFIX}conversations SET ?`, objval , (error,results) => {
                if (error) reject(new Error(`Server Error with conversations Table`));
                
                resolve(results.insertId);
            });
        })
    }

    function insertMessage(conversationID,sender,date,defaultReceiver, message) {
        return new Promise((resolve, reject) =>{
            const mssgObj = {
                conversationID,
                sender,
                receiver: defaultReceiver,
                date,
                unseen: 0,
                message
            };

            connection.query(`INSERT INTO ${process.env.DB_PREFIX}messages SET ?`, mssgObj , (error, results) => {
                if (error) reject(new Error(`Server Error with messages Table`));
                
                resolve(results);
            });
        })
    }

    /**
     * 
     * @param {the expo reg id of device of celeb} value 
    */
    async function pushnotification(ownerid){
      const regId = await getOwnerRegID(ownerid);
      if(regId != null) pushMessage(regId[0].reg_id);
    }

    function getOwnerRegID(uid){
       return new Promise((resolve, reject)=>{
        const sql=`SELECT reg_id FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
            connection.query(sql,[uid], (error, results) => {
                if (error) 
                reject(new Error(`No Can not get Reg ID for user`));
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error(`No User detail at the moment`));
                }
            });
        })
    }

    /**
     * 
     * @param {the firebase reg id of device of celeb} value
     */

    function pushMessage(id) {
      const payload = {
          notification: {
            title: 'Message',
            body: `You have a Fanbies message`,
            sound: 'default'
          },
          data: { page: 'ConversationList' }
        };

        const options = {
            priority: 'high',
            contentAvailable: true,
            timeToLive: 60 * 60 * 24
        };

        firepush(id,payload,options);

    }
    

});
module.exports = sendmessage;