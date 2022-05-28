const connection = require('../middleware/connection');
const express = require('express')
const getrequestbystatus = express.Router();
const _ = require('lodash');
const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}


/**
 * Get request by username and status 
 */
getrequestbystatus.post('/', (req, res) => {
    const token = req.body.jtoken;
    const uname = req.body.username;
    const status = req.body.status;
    

    jwt.verify(token, process.env.JWT_KEY, (err, loggedin) => {
        if (err){
            return res.send({'success':false, 'message':'Error with server token'});
        }
        //check the uid from jwt is not empty 
        if(loggedin.uid !== null){
            const getuseridbyname = ()=>{
                return new Promise((resolve, reject) =>{
                    connection.query(`SELECT id, usertype from ${process.env.DB_PREFIX}users WHERE username = ?`, [uname] , (error, results) => {
                        if (error) return reject(new Error(error));
                        
                        if(results.length !== 0){
                            resolve(results);
                        }else{
                            res.send({'success':false, 'message':`User doesn't exsit`})
                            reject(new Error(`User doesn't exsit`))
                        }
                    }); 
                })
            };

            getuseridbyname()
            .then(user => getshoutdetails(user[0].id))
            .then(data =>{
                res.send({'response':data,'success':true})
            }).catch((e)=>{
                //sentry
                console.log("😂", e);
            });

            function getshoutdetails(uid){
                return new Promise((resolve,reject) => {
                    const col = ['id','mention_name','charge','date','message_shoutout','requestid','responseid','privacy'];
                    const sql =`SELECT ?? FROM ${process.env.DB_PREFIX}shoutout WHERE status = ? AND responseid = ?`;
                    
                    connection.query(sql,[col, status, uid],(error, results) => {
                        if (error) return reject(new Error(error))
                        if(results.length !== 0){
                            _.forEach(results,(value,key) => {
                                ownerDetails(value[`requestid`])
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
module.exports = getrequestbystatus;
