const connection = require('../middleware/connection');
const express = require('express')
const updateconsole = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './.env' });

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}

/**
 * Console Setting / Updateing Api for Features settings on landing page
 */

updateconsole.post('/', (req, res) => {
    const jtoken = req.body.jtoken;
    const val = req.body.settings;
    const valToString =  val.toString();
    const contextType = 'section_list';
    try{
        jwt.verify(
        jtoken, 
        process.env.JWT_KEY, (err) => {
            if(err) res.status(500).send(error);
            
            updateConsole();
        })
    }catch(e){
        res.send({'success':false, 'message':'Update Failed, Invalid Token.'})
    }
   
    function updateConsole() {
        connection.query(`UPDATE ${process.env.DB_PREFIX}console SET val = ? WHERE context = ?`, [valToString,contextType] , error => {
            if(!!error) return res.status(500).send(error);
        
            res.send({'success':true, 'message':'Console Successfully Updated'})
        });
    }

});

module.exports = updateconsole;