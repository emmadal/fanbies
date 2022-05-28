const connection = require('../middleware/connection');
const express = require('express')
const updateuser = express.Router();
const jwt = require('jsonwebtoken')
const md5 = require('md5')
require('dotenv').config({ path: './.env' });


/**
 * Get User Account 
 */

updateuser.post('/', (req, res) => { 
    const uid = req.body.uid;
    const uname = req.body.uname;
    const email = req.body.useremail;
    const password = md5(req.body.password);
    const jtoken = req.body.jtoken;
    const bio = req.body.bio; 
    const twittertag = req.body.twittertag; 
    const igtag = req.body.igtag;
    const fbtag = req.body.fbtag;
    const availability = req.body.availableSlot; 
    const userstatus = req.body.userstatus;
    const requestRate = req.body.requestRate; 
    const charity = req.body.profession;
    const callrate = req.body.callrate;

    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err, loggedin) => {
             emailExist(email, loggedin.utype)
        })
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }


    //Check if the email value is unique before registation
   
    function emailExist(email,tokenUsertype) {
        connection.query(`SELECT email, id from ${process.env.DB_PREFIX}users WHERE email = ?`, email , (error, results) => {
            if (error) return res.status(500).send(error);
            let sql;
            let data;
            if(tokenUsertype >= 1) {
                sql = `UPDATE ${process.env.DB_PREFIX}users SET name = ?, bio = ?,twitter_id = ?, ig_id = ?, fb_id = ?, available_slot = ?, active = ?, password = ?, shoutrate = ?, email = ?, profession = ?, callrate = ? WHERE id = ?`;
                data = [uname,bio,twittertag,igtag,fbtag,availability,userstatus,password,requestRate,email,charity,callrate,uid];
            } else {
             sql=`UPDATE ${process.env.DB_PREFIX}users SET name = ?, email = ?, password = ? WHERE id = ?`;
             data = [uname,email,password,uid];
            }
            if(results.length === 0){
                //Insert to DB
                updateProfile(sql,data);
            }else{
                //check if the user id is same for the change user id
                if(results[0].id == uid) {
                    updateProfile(sql,data);
                }else{
                    res.send({'response':results,'success':false, 'message':'Email Already Exist.'})
                }
                
            }
        });
    }

    function updateProfile(sql,insertArr){

        connection.query(sql, insertArr, (error, results) => {
            if(!!error) return res.status(500).send(error);

            res.send({'response':results,'success':true, 'message':'Details Updates.'})
        });
    }


});


module.exports = updateuser;