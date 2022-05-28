const connection = require('../middleware/connection');
const express = require('express')
const totalcelebs = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get Total Users List
 */

totalcelebs.post('/', (req, res) => { 
    const u = 1;
    connection.query(`SELECT COUNT(id) AS count from ${process.env.DB_PREFIX}users WHERE usertype = ?`, [u] ,function (error, results) {
        if (error) return res.status(500).send(error);
        
        res.send({'response':results[0].count,'success':true, 'message':''})
    });
    
});
module.exports = totalcelebs;