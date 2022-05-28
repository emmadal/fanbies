const connection = require('../middleware/connection');
const express = require('express')
const getactiveusers = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get Featured User
 */

getactiveusers.post('/', (req, res) => { 
      const utype = 1;
      const activestatus = 3;
      const columns = ['username','name','id'];

      connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE usertype = ? AND active = ?`, [columns,utype, activestatus] , (error, results) => {
          if (error) return res.status(500).send(error);
          
          res.send({'response':results,'success':true, 'message':''});
      }); 

});
module.exports = getactiveusers;