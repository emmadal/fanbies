const connection = require('../middleware/connection');
const express = require('express')
const getusershoutout = express.Router();
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
getusershoutout.post('/', (req, res) => {
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
                            if(results[0].id != loggedin.uid) {
                                res.send({'success':false, 'message':'No User Available at this moment.'})
                                reject(new Error('Logged in user is different from query uid'));
                            }
                           
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

            function ownerDetails(uid){
                return new Promise((resolve, reject)=>{
                    const sql=`SELECT name,picture FROM ${process.env.DB_PREFIX}users WHERE id = ?`;
                    connection.query(sql,[uid],function (error, results) {
                            if (error) 
                            return res.status(500).send(error);
                            
                            if(results.length !== 0){
                                resolve(results);
                            }else{
                                reject(new Error(`User doesn't exsit here...`));
                            }
                    });
                })
            }

            function getshoutdetails(uresponseid,usertype){
                console.log("🤯",uresponseid )
                const reqStatus = req.body.reqstatus;
                let restype = 'requestid';
                if(usertype !== 0){
                    restype = 'responseid';
                }
                return new Promise((resolve,reject)=>{
                const column = ['id','mention_name','status','date','message_shoutout','privacy'];
                const sql=`SELECT ?? FROM ${process.env.DB_PREFIX}shoutout WHERE ${restype} = ? AND status = ?`;
                connection.query(sql,[column,uresponseid,reqStatus],(error, results) => {
                    if (error) return reject(new Error(error))
                    if(results.length !== 0){
                        //resolve(results)
                        //console.log("🤔", results);
                        _.forEach(results,(value,key)=>{
                            ownerDetails(value[restype])
                            .then((data)=>{
                                results[key]['name'] = data[0].name;
                                results[key]['picture'] = data[0].picture;
                                results[key]['isVip'] = usertype !== 0;
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
        }
    });
});
module.exports = getusershoutout;
