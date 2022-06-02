const connection = require('../middleware/connection');
const express = require('express')
const getlinksbyusername = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get User Links by username
 */

getlinksbyusername.post('/', (req, res) => { 
    const username = req.body.username;

    function getUserIdbyUsername(){
      return new Promise((resolve, reject) =>{
          connection.query(`SELECT id from ${process.env.DB_PREFIX}users WHERE username = ?`, [username] ,function (error, results) {
            if (error) reject(new Error(`Server Error`));
            
            if(results.length !== 0){
                resolve(results[0].id)
            }else{
                reject(new Error(`User doesn't exsit`))
            }

        }); 
      })
    }
    function getUserLinks(id){
      connection.query(`SELECT * from ${process.env.DB_PREFIX}links WHERE owner_id = ?`, id , async (error,results) => {
        if (error) 
            return res.status(500).send(error);

        res.send({'response':results,'success':true, 'message':''})
      })
    }
    getUserIdbyUsername()
    .then(data =>{
      getUserLinks(data)
    })
    .catch(e =>{
      res.send({'response':'','success':false, 'message':''})
    })


});
module.exports = getlinksbyusername;