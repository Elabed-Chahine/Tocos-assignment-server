const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const UserModel = require('../models/UserModel');
const protect = asyncHandler(async (req, res, next) => {
    let token
    const authHeader = req.get('Authorization');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1]
    
    }
    if (!token) { res.status(403); throw new Error("Not authorized")}
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.uid =decoded.id
        next()
    } catch (error) {
        res.status(401)
        throw new Error(error)
    }


   

})

module.exports = protect