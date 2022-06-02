const connection = require('../middleware/connection');
const express = require('express')
const updateuserlink = express.Router();
require('dotenv').config({ path: './.env' });

const jwt = require('jsonwebtoken')

//Ensure Enviroment Variale for JWT is set
if (!process.env.JWT_KEY){
	console.log('FATAL ERROR: JWT enviroment variable is not defined.')
	process.exit(1);
}
/**
 * Update User Link by Id
 */

updateuserlink.post('/', (req, res) => { 
    const jtoken = req.body.jtoken;
    const itemObj = req.body.item;

    try{
        jwt.verify(jtoken, process.env.JWT_KEY, (err,loggin) => {
			if(err) throw new Error("Invalid Token...");

			if(loggin.uid == null) throw new Error("Invalid UID...");
            updateLink(loggin.uid);
		})
    } catch(e){
        console.log("😱", e);
        res.send({'success':false, 'message':'Link Not Updated.'})
    };

    function updateLink(uid){
        return new Promise((resolve,reject) => {
            connection.query(`UPDATE ${process.env.DB_PREFIX}links SET title = ?, link_ref = ?, visible = ?, link_order = ?, icon = ?, clicks = ? WHERE id = ? AND owner_id = ?`, [itemObj.title,itemObj.link_ref, itemObj.visible, itemObj.link_order, itemObj.icon, itemObj.clicks, itemObj.id, uid] , error => {
                    if(error) return reject(error);
                    
                    resolve(true);
                    res.send({'success':true, 'message':'updated'})
                });
        });
    }
});
module.exports = updateuserlink;