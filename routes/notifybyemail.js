const connection = require('../middleware/connection');
const _ = require('lodash');
const nodemailer = require('nodemailer');
const express = require('express')
const updatenotifytable = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Save and Send Notification of Notify users 
 */

updatenotifytable.post('/', (req, res) => {
    const username = req.body.username;
    
    //call a promised based function to get details
    celebDetails(username)
    .then(res => notifyAdmin(res[0].id, res[0].email))
    .catch(e=> console.log("😂", e));

    // Return a promise of user id and email of the celeb 
    function celebDetails(username){
        return new Promise((resolve, reject)=>{
            const columns = ['id','email'];
            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE username = ?`, [columns,username] ,function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error('No User Available at this moment.'))
                }

            });
        })
    }
    //send notification to admin
    function notifyAdmin(cid,celebemail){
        const useremail = req.body.email; //form submitter email addess
         const uname = req.body.name;
         const data = {
            email: celebemail,
            username,
            uid: cid
        }
        connection.query(`INSERT INTO ${process.env.DB_PREFIX}emailnotify SET ?`, data , (error, results) =>{
            if(error){
                return res.status(500).send(error);
            } 
            else{
                res.send({
                    'response':results,
                    'success':true, 
                    'message':`Thanks you, we will inform when ${uname} is back available. You might find similar famous faces on Fanbies for booking from Talent search page.`
                });
                
                const emailTxtOnly = `A user with the email: ${useremail} has just requested to be notified when
                                ${uname} is back on platform`;
                const htmlEmail = `A user with the email: <b>${useremail}</b> have just requested to be notified when ${uname} is back on the platform. <br />`;

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
                        subject: 'Fanbies: User Wants Notify ✔', // Subject line
                        text: emailTxtOnly, // plain text body
                        html: htmlEmail // html body
                    };

                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) return console.log(error);

                        res.send({'success':true, 'message':'Done'});
                    });
                });

            }
        });
    }
});

module.exports = updatenotifytable;