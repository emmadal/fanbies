const connection = require('../middleware/connection');
const express = require('express')
const shoutoutbyid = express.Router();
const _ = require('lodash');

/**
 * Get shoutout by username 
 */
shoutoutbyid.post('/', (req, res) => {
    const id = req.body.id;
    const getshoutoutbyid = ()=>{
        return new Promise((resolve, reject) =>{
            const column = ['mention_name','responseid','status','date','message_shoutout','requestid','privacy','id'];
            const sql=`SELECT ?? FROM ${process.env.DB_PREFIX}shoutout WHERE id = ?`;
            connection.query(sql,[column,id],function (error, results) {
                if (error) return reject(new Error(error))
                if(results.length !== 0){
                    ownerDetails(results[0].requestid)
                    .then((data)=>{
                        results[0]['name'] = data[0].name;
                        results[0]['picture'] = data[0].picture;
                        results[0]['email'] = data[0].email;
                        results[0]['owners_name'] = data[0].username
                        resolve(results);
                    })
                }else{
                     reject(new Error(`No shout out request`));
                }

            });
        })
    };

    // Promise
    getshoutoutbyid()
    .then(data =>{
        res.send({'response':data,'success':true, 'message':''})
    }).catch(e => {
        res.send({'success':false, 'message':''})
        console.log("🤓",e)
    });

    function ownerDetails(uid){
       return new Promise((resolve, reject)=>{
        const sql=`SELECT username,name,picture,email FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
            connection.query(sql,[uid],function (error, results) {
                if (error) 
                return res.status(500).send(error);
                
                if(results.length !== 0){
                    resolve(results);
                }else{
                    reject(new Error(`No User detail at the moment`));
                }
            });
        })
    }
});
module.exports = shoutoutbyid;
