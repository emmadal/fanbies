const connection = require('../middleware/connection');
const express = require('express')
const consoledetails = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * Console Details for Open page
 */

consoledetails.post('/', (req, res) => {
    const contextType = 'section_list';
    connection.query(`SELECT * from ${process.env.DB_PREFIX}console WHERE context = ?`, [contextType] , (error, results) => {
        if(error) return res.status(500).send(error);
       
        res.send({'response':results,'success':true, 'message':''})
    });
});

module.exports = consoledetails;