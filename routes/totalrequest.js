const connection = require('../middleware/connection');
const express = require('express')
const totalrequest = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get Total Users List
 */

totalrequest.post('/', (req, res) => { 
    const type = req.body.type;
    connection.query(`SELECT COUNT(id) AS count from ${process.env.DB_PREFIX}shoutout WHERE status = ?`, [type] , (error, results) => {
        if (error) return res.status(500).send(error);
        
        res.send({'response':results[0].count,'success':true, 'message':''})
    });
    
});
module.exports = totalrequest;