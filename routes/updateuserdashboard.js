const connection = require('../middleware/connection');
const express = require('express')
const dashboardupdateuser = express.Router();

require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Dashboard User Update 
 */

dashboardupdateuser.post('/', (req, res) => { 
    const uid = req.body.uid;
    const name = req.body.name;
    const bio = req.body.bio;
    const twittertag = req.body.twittertag;
    const linkedintag = req.body.linkedintag;
    const tiktag = req.body.tiktag;
    const igtag = req.body.igtag;
    const fbtag = req.body.fbtag;
    const primary_talent = req.body.primary_talent;
    const secondary_talent = req.body.secondary_talent;
    const extra_talent = req.body.extra_talent;
    const availability = req.body.availableSlot;
    const userstatus = req.body.userstatus;
    const rate = req.body.requestRate;
    const email = req.body.useremail;
    const isFeatured = req.body.featured;
    const profession = req.body.profession;
    const callrate = req.body.callrate;

    try{
         updateProfile(uid)
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }

    function updateProfile(uid) {
        connection.query(`UPDATE ${process.env.DB_PREFIX}users SET name = ?, bio = ?,twitter_id = ?, ig_id = ?, fb_id = ?, primary_talent = ?,secondary_talent = ?,extra_talent = ?, available_slot = ?, active = ?, email = ?, shoutrate = ?, featured = ?, profession = ?, callrate = ?, linkedin_id = ?, tik_id = ? WHERE id = ?`, [name,bio,twittertag,igtag,fbtag,primary_talent,secondary_talent,extra_talent,availability,userstatus,email,rate,isFeatured,profession,callrate,linkedintag,tiktag,uid] , (error, results) => {
            if(error) return res.status(500).send(error);

            // Only return the req since its updated on the db successfully
            const data = [{
                id: req.body.uid,
                name: req.body.name,
                bio: req.body.bio,
                twittertag: req.body.twittertag,
                linkedintag: req.body.linkedintag,
                tiktag: req.body.tiktag,
                igtag: req.body.igtag,
                fbtag: req.body.fbtag,
                primary_talent: req.body.primary_talent,
                secondary_talent: req.body.secondary_talent,
                extra_talent: req.body.extra_talent,
                availability: req.body.availableSlot,
                userstatus: req.body.userstatus,
                rate: req.body.requestRate,
                email: req.body.useremail,
                featured: req.body.featured,
                profession: req.body.profession,
                callrate: req.body.callrate
            }]
            res.send({'response':data,'success':true, 'message':'Details Updates.'})

        });
    }


});


module.exports = dashboardupdateuser;