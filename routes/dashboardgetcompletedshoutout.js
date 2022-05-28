const connection = require('../middleware/connection');
const express = require('express')
const getcompletedrequestadmin = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Get shoutout by username 
 */
getcompletedrequestadmin.post('/', (req, res) => {
    const token = req.body.jtoken;
    const uname = req.body.username;

    jwt.verify(token, process.env.JWT_KEY, (err, loggedin) => {
        if (err){
            return res.send({'success':false, 'message':'Error with server token'});
        }
        //check the uid from jwt is not empty 
        if(loggedin.uid !== null){
            const getuseridbyname = ()=>{
                return new Promise((resolve, reject) =>{
                    connection.query(`SELECT id, usertype from ${process.env.DB_PREFIX}users WHERE username = ?`, [uname] ,function (error, results) {
                        if (error) 
                        return res.status(500).send(error);
                        
                        if(results.length !== 0){
                            // if(results[0].id != loggedin.uid) {
                            //     res.send({'success':false, 'message':'Query not Available.'})
                            //     reject(new Error('Logged in user is different from query uid'));
                            // }
                           
                            resolve(results)
                            
                        }else{
                            res.send({'success':false, 'message':`User doesn't exsit`})
                            reject(new Error(`User doesn't exsit`))
                        }

                    }); 
                })
            };

            getuseridbyname()
            .then(userid => getshoutdetails(userid[0].id, userid[0].usertype))
            .then(data =>{
                res.send({'response':data,'success':true})
            }).catch((e)=>{
                //sentry
                console.log("😂", e);
            });

            function getshoutdetails(id,usertype){
                let type = 'owner_id';
                let displayName = 'recorder_id';
                if(usertype !== 0){
                    type = 'recorder_id';
                    displayName = 'owner_id';
                }
                return new Promise((resolve,reject)=>{
                    const tableA = `${process.env.DB_PREFIX}video_request`;
                    const tableB = `${process.env.DB_PREFIX}shoutout`;

                    const sql=`SELECT DISTINCT ${tableA}.owner_id,${tableA}.recorder_id,${tableA}.date,${tableA}.link,${tableA}.shoutout_id,${tableA}.thumbnail,${tableA}.privacy,${tableA}.invoiced,${tableB}.date AS requested_date,${tableB}.mention_name,${tableB}.charge,${tableB}.message_shoutout FROM ${tableA} INNER JOIN ${tableB} ON ${tableA}.shoutout_id=${tableB}.id  WHERE ${tableA}.${type} = ? AND ${tableB}.status = ? `;
                    
                    connection.query(sql,[id, 'completed'],(error, results) => {
                        if (error) return reject(new Error(error))
                        if(results.length !== 0){
                            _.forEach(results,(value,key)=>{
                                ownerDetails(value[`${displayName}`])
                                .then((data)=>{
                                    results[key]['name'] = data[0].name;
                                    results[key]['picture'] = data[0].picture;
                                    if( key ===  results.length-1){
                                        resolve(results)
                                    }
                                })
                            })
                        }else{
                            resolve([]);
                        }
                    });
                })
            }

            function ownerDetails(uid){
                return new Promise((resolve, reject)=>{
                    const sql=`SELECT name,picture FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
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
        }
    });
});
module.exports = getcompletedrequestadmin;
