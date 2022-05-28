const connection = require('../middleware/connection');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const express = require('express')
const requestinvoice = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Save and Send Notification of Notify users 
 */

requestinvoice.post('/', (req, res) => {
    const shoutoutid = req.body.shoutoutid;
    
    //call a promised based function to get details
    shoutoutDetail(shoutoutid)
    .then(res => notifyAdmin(res[0]))
    .catch(e=> {
        console.log("😂", e);
        res.send({'success':false, 'message':'Shout out Request Error.'})
    });

    // Return a promise of user id and email of the celeb 
    function shoutoutDetail(id){
        return new Promise((resolve, reject)=>{
            const columns = ['recorder_id','shoutout_id'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}video_request WHERE shoutout_id = ? AND invoiced = ?`, [columns,id,'0'] ,function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    ownerDetails(results[0][`recorder_id`])
                    .then((data)=>{
                        results[0]['name'] = data[0].name;
                        results[0]['username'] = data[0].username;
                        resolve(results);
                    })
                }else{
                    reject(new Error('Request not found.'))
                }

            });
        })
    }
    function ownerDetails(uid){
        return new Promise((resolve, reject)=>{
        const sql=`SELECT name,username FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
            connection.query(sql,[uid],function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error(`User doesn't exsit`));
                }
            });
        })
    }
    //send notification to admin
    function notifyAdmin(data){
        const emailTxtOnly = `A Fanbies Celeb user: ${data.name} has just requested to be invoiced for shoutout id ${data.shoutout_id}`;
        const htmlEmail = `A Fanbies Celeb user: <b>${data.name}</b>  with username ${data.username} has just requested to be invoiced for shoutout id #FBN-19-${data.shoutout_id}. <br />`;

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: process.env.SMTP,
                port: process.env.SMPT_PORT,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.SMPT_USR, // generated ethereal user
                    pass: process.env.SMPT_PASS // generated ethereal password
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: process.env.SMPT_USR, // sender address
                to: process.env.Admin_EMAIL, // list of receivers
                subject: 'Fanbies: User Wants Invoice ✔', // Subject line
                text: emailTxtOnly, // plain text body
                html: htmlEmail // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) return console.log(error);

                res.send({'success':true, 'message':`Invoice Request For #FBN-19-${data.shoutout_id} as been sent to Admin, Please give max 24 hours for response. Thanks Fanbies Managment`});
            });
        });

    }
});

module.exports = requestinvoice;