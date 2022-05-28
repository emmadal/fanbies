const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const dashgetcelebs = express.Router();
const axios = require('axios')
require('dotenv').config({ path: './.env' });


/**
 * All Celeb Account 
 */

dashgetcelebs.post('/', (req, res) => {
    const usertype = '1';
    const columns = ['id','name','picture','username'];
    connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE usertype >= ? ORDER BY RAND() LIMIT 11`, [columns,usertype] , (error, results)=> {
        if (error) return res.status(500).send(error);
        if(results.length !== 0){
            res.send({'response':results,'success':true, 'message':''})
        }else{
            res.send({'response':results,'success':false, 'message':'No User Available at this moment.'})
        }
    });
});

module.exports = dashgetcelebs;