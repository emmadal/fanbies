const connection = require('../middleware/connection');
const express = require('express')
const getappitem = express.Router();
require('dotenv').config({ path: './.env' });


/**
 * Get App Item by type
 */

getappitem.post('/', (req, res) => {
    const item = req.body.value;

    connection.query(`SELECT ios_item from ${process.env.DB_PREFIX}appitems WHERE fanbies_item = ?`, item , (error, results) => {
    if(!!error)
        return res.status(500).send(error);

        if(results.length !== 0) {
            res.send({'response':results, 'message':'','success':true})
        } else{ 
            res.send({'response':[], 'message':'No item available','success':false})
        }
    });
    

});

module.exports = getappitem;