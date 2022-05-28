const connection = require('../middleware/connection');
const express = require('express')
const getuserbyclaimhash = express.Router();
require('dotenv').config({ path: './.env' });


//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Get User Claim Status
 */

getuserbyclaimhash.post('/', (req, res) => { 

    const hash = req.body.hash;
    function validateToken() {
        connection.query(`SELECT * from ${process.env.DB_PREFIX}account_claim WHERE hash = ?`, [hash] , (error, results) => {
            if (error) res.status(500).send(error);
                
            if(results.length !== 0 && results[0].status === "create") {
                userDetails(results[0].uid);
                return;
            }

            res.send({'success':false, 'message':' Invalid token or status type'})
        });
    }

    function userDetails(uid){
        const columns = ['id','email','username','name','picture','extra_talent','active','primary_talent','secondary_talent','bio','shoutrate','available_slot','twitter_id','fb_id','ig_id','usertype'];

        connection.query(`SELECT DISTINCT ?? from ${process.env.DB_PREFIX}users WHERE id = ?`, [columns,uid], (error, results) => {
            if (error) return res.status(500).send(error);
             
            if(results.length !== 0) { 
                res.send({'response':results,'success':true, 'message':''})
            }else{
                res.send({'response':results,'success':false, 'message':'No User Available at this moment.'})
            }

        });
    }
    validateToken();
});
module.exports = getuserbyclaimhash;