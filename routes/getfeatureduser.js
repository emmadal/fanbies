const connection = require('../middleware/connection');
const express = require('express')
const getfeatured = express.Router();
require('dotenv').config({ path: './.env' });

/**
 * Get Featured User
 */

getfeatured.post('/', (req, res) => { 
    async function getfeaturedUser() {
        try{
            const userData = await getfeaturedID();
            await getUserbyID(userData);
        } catch(e){
            res.send({'success':false, 'message': e });
        }
    }

    function getfeaturedID(){
        return new Promise((resolve, reject) =>{
            const contextType = 'site_featured';
            connection.query(`SELECT val from ${process.env.DB_PREFIX}console WHERE context = ?`, [contextType] , (error, results) => {
                if (error) reject(new Error(`Server Error with console Table`));

                resolve(results[0].val);
            });
        })
    }

    function getUserbyID(uid) {
        return new Promise((resolve, reject) =>{
            const utype = 1;
            const columns = ['username','name','picture','bio'];

            connection.query(`SELECT ?? from ${process.env.DB_PREFIX}users WHERE usertype = ? AND id = ?`, [columns,utype, uid] , (error, results) => {
                if (error) reject(new Error(`Server Error with user Table`));
                
                res.send({'response':results,'success':true, 'message':''});
                resolve(true);
            }); 
        }) 
    }

    getfeaturedUser()

    
});
module.exports = getfeatured;