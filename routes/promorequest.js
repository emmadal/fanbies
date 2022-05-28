const connection = require('../middleware/connection');
const express = require('express')
const promorequestlist = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * Console Details for Open page
 */

promorequestlist.post('/', (req, res) => {
    const qname = req.body.username;

    const getuseridbyname = ()=>{
        return new Promise((resolve, reject) =>{
            connection.query(`SELECT id from ${process.env.DB_PREFIX}users WHERE username = ?`, [qname] ,function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results)
                }else{
                    reject(new Error(`No User Available at this moment.`))
                }

            }); 
        })
    };

    // async function getuseridbyname(){
    getuseridbyname()
    .then(userid => getshoutdetails(userid[0].id))
    .then(result => res.send({'response':result,'success':true, 'message':''}))
    .catch(e => console.log("😱", e));

    function getshoutdetails(uresponseid){
        return new Promise((resolve,reject)=>{
            const qType = 0; //public is 0
            connection.query(`SELECT link,thumbnail from ${process.env.DB_PREFIX}video_request WHERE recorder_id = ? AND privacy = ? LIMIT 2`, [uresponseid,qType],function (error, results) {
            if (error) return reject(new Error(error))
             
            resolve(results)
                
            });
        });
    }

    
    

});

module.exports = promorequestlist;