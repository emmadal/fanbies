const connection = require('../middleware/connection');
const express = require('express')
const talentlist = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * All Available Talent 
 */

talentlist.post('/', (req, res) => {
    connection.query(`SELECT * from ${process.env.DB_PREFIX}talent`, (error, results) => {
        if(!!error) return res.status(500).send(error);
           
        res.send({'response':results,'success':true, 'message':''})
    });
    

});

module.exports = talentlist;