const connection = require('../middleware/connection');
const express = require('express')
const md5 = require('md5')
const updateuserpass = express.Router();

/**
 * Vaidate Reset token
 */
updateuserpass.post('/', (req, res) => {
    const userpassword = md5(req.body.password);
    const hashtoken = req.body.hash;

    connection.query(`SELECT * from ${process.env.DB_PREFIX}rest_password WHERE hash = ?`, [hashtoken] ,(error, results) => {
        if (error) 
        return res.status(500).send(error);
        
        if(results.length !== 0){
            updateProfile(results[0].id,results[0].userid,userpassword);
        }else{
            //invalid
        }

    });

    async function updateProfile(id, uid, upass){
        connection.query(`UPDATE ${process.env.DB_PREFIX}users SET password = ? WHERE id = ?`, [upass,uid] , error => {
            if(!!error){
                return res.status(500).send(error);
            }

            res.send({'success':true, 'message':'Details Successfully Updated, Thank you.'})

        });
        await deleteHash(id);
    }

    function deleteHash(id) {
        connection.query(`DELETE FROM ${process.env.DB_PREFIX}rest_password WHERE id = ?`, [id] , error =>{
            if(!!error){
                return res.status(500).send(error);
            }
        });
    }
});


module.exports = updateuserpass;
