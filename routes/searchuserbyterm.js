const connection = require('../middleware/connection');
const express = require('express')
const searchuserbyterm = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * Search For User Account 
 */

searchuserbyterm.post('/', (req, res) => { 
    const name = `%${req.body.searchterm}%`;
    const reqType = req.body.usertype;
    const usertype = reqType !== undefined ? reqType : '1';
    const returnValues = ['id','username', 'name','picture','usertype'];

    connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE name LIKE ? AND usertype = ?`, [returnValues,name,usertype] ,function (error, results, fields) {
        if (error) 
        return res.status(500).send(error);
        if(results.length !== 0){
            res.send({'response':results,'success':true, 'message':''})
        }else{
            res.send({'response':results,'success':false, 'message':'No User Available at this moment.'})
        }
    });

});



module.exports = searchuserbyterm;