const connection = require('../middleware/connection');
const express = require('express')
const updatefeatured = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Update Featured User
 */

updatefeatured.post('/', (req, res) => { 
    const contextType = 'site_featured';
    const val = req.body.uid;
    connection.query(`UPDATE ${process.env.DB_PREFIX}console SET val = ? WHERE context = ?`, [val,contextType] , error => {
        if(!!error) return res.status(500).send(error);

        res.send({'success':true, 'message':'Console Successfully Updated'})
    });
});
module.exports = updatefeatured;