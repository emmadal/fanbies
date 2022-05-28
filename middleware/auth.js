const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './.env' });

function auth(req, res, next){
    const token = req.header('x-auth-token')
    if(!token) return res.status(401).send('Access denied, No token provided')
    
    try{
        const decodeToken = jwt.verify(token, process.env.JWT_KEY)
        req.jsontoken = decodeToken;
        next()
    }
    catch (ex) {
        // req.error = { 'status': 400, 'message': 'Invalid token.' }
        // next()
        res.status(400).send('Invalid token.')
    }
}

module.exports = auth;