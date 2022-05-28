const nodemailer = require('nodemailer');
const express = require('express')
const recommend = express.Router();
require('dotenv').config({ path: './.env' });
/**
 * All Celeb Account 
 */

recommend.post('/', (req, res, next) => {
    const _this = res;
    const useremail = req.body.email;
    const recommendName = req.body.nameofFamousPerson;
    const fb = !req.body.facebookFamousPerson ? "N/A": req.body.facebookFamousPerson ;
    const insta = !req.body.instaFamousPerson ? "N/A": req.body.instaFamousPerson;
    const twitter = !req.body.twitterFamousPerson ? "N/A" : req.body.twitterFamousPerson;
    const moreInfo = !req.body.messageDescription ? "N/A" : req.body.messageDescription;

    const emailTxtOnly = `A user with the email: ${useremail} have just recommended
                       ${recommendName} for the platform, facebook: ${fb}, instagram: ${insta} and twitter: ${twitter} with more info: ${moreInfo}`;
    const htmlEmail = `A user with the email: <b>${useremail}</b> have just recommended ${recommendName} for the platform. <br /> <br /> 
    <b>Facebook:</b> ${fb} <br /> <br /> 
    <b>instagram:</b> ${insta} <br /> <br /> 
    <b>Twitter:</b> ${twitter} <br /> <br /> 
    <b>More information:</b> ${moreInfo}`;

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
            subject: 'Fanbies: Famous Face Recommendation ✔', // Subject line
            text: emailTxtOnly, // plain text body
            html: htmlEmail // html body
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) return console.log(error);

            _this.send({'success':true, 'message':'Done'})
            // console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });

});

module.exports = recommend;