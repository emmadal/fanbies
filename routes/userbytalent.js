const connection = require('../middleware/connection');
const _ = require('lodash');
const express = require('express')
const getuserbytalent = express.Router();
const axios = require('axios')
require('dotenv').config({ path: './.env' });


/**
 * Get User Account 
 */

getuserbytalent.post('/', (req, res) => { 
    const talentid = req.body.talentId;
    const limitBy = req.body.talentPag !== undefined ? req.body.talentPag : 4;
    const returnValues = ['username', 'name','picture'];
    const featuredValue = 1;
    connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE primary_talent = ? AND featured = ? LIMIT ${limitBy}`, [returnValues,talentid,featuredValue] , (error, results) => {
        if (error) 
        return res.status(500).send(error);
        
        if(results.length !== 0){
            res.send({'response':results,'success':true, 'message':''})
        }else{
            res.send({'success':false, 'message':'No User Available at this moment.'})
        }
    });
});



module.exports = getuserbytalent;