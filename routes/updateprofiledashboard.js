const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const updatedashboarduser = express.Router();
const md5 = require('md5')
const jwt = require('jsonwebtoken')

require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Dashboard User Update 
 */

updatedashboarduser.post('/', (req, res, next) => { 
    const jtoken = req.body.jtoken;
    const name = req.body.name;
    const bio = req.body.bio;
    const twittertag = req.body.twittertag;
    const igtag = req.body.igtag;
    const fbtag = req.body.fbtag;
    const primary_talent = req.body.primary_talent;
    const secondary_talent = req.body.secondary_talent;
    const extra_talent = req.body.extra_talent;
    const password = md5(req.body.password);
    const availability = req.body.availableSlot;
    const userstatus = req.body.userstatus;
    const requestRate = req.body.requestRate;
    const useremail = req.body.useremail;
    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err, loggedin) => updateProfile(loggedin.uid))
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }

    function updateProfile(uid){
        connection.query(`UPDATE ${process.env.DB_PREFIX}users SET name = ?, bio = ?,twitter_id = ?, ig_id = ?, fb_id = ?, primary_talent = ?,secondary_talent = ?,extra_talent = ?, available_slot = ?, active = ?, password = ?, shoutrate = ?, email = ? WHERE id = ?`, [name,bio,twittertag,igtag,fbtag,primary_talent,secondary_talent,extra_talent,availability,userstatus,password,requestRate,useremail,uid] , (error, results) => {
            if(!!error){
                return res.status(500).send(error);
            }

            res.send({'response':results,'success':true, 'message':'Details Updates.'})

        });
    }


});


module.exports = updatedashboarduser;