const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')

exports.isAuthenticated = async(req, res, next)=>{
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    try {
        if(token == null){
            return res.status(403).json({
                error : 'You are not authenticated'
            })
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await User.findById(decoded.userId)
        req.user = user
        // console.log(user);
        next()
    } catch (error) {
        console.log(error);
    }
}

exports.isAdmin = async(req, res, next)=>{
    const {email} = req.user
    try {
        const adminUser = await User.findOne({email})
        if(adminUser.role !== 'admin'){
            return res.status(404).json("You are not an admin user")
        }
        next()
    } catch (error) {
        res.status(500).json(error)
    }
}