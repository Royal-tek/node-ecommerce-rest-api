const User = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
        port : 465,
        secure : true,
        auth:{
            user: process.env.MAIL_ID,
            pass: process.env.MAIL_PASS
        }
})

exports.register = async (req, res) => {
    try {
        const email = req.body.email
        const findUser = await User.findOne({
            email
        })
        if (findUser) return res.status(400).json({
            error: 'User already exists'
        })
        const newUser = await User.create(req.body)
        const {
            password,
            ...others
        } = newUser._doc
        res.status(201).json({
            message: 'User Created Successfully',
            others
        })
    } catch (error) {
        res.status(500).json(error)
        console.log(error);
    }

}

exports.login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body
        const findUser = await User.findOne({
            email
        })
        if (!findUser) return res.status(400).json({
            error: 'User account does not exisit'
        })
        const checkPassword = await bcrypt.compare(password, findUser.password)
        if (!checkPassword) return res.status(400).json({
            error: 'Email or password incorrect'
        })
        const refreshToken = jwt.sign({
            userId: findUser ?.id
        }, process.env.SECRET_KEY, {
            expiresIn: '3d'
        })
        const updateUser = await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const token = jwt.sign({
            userId: findUser._id
        }, process.env.SECRET_KEY, {
            expiresIn: '24h'
        })
        res.status(200).json({
            message: 'Login Success',
            firstname: findUser ?.firstname,
            lastname: findUser ?.lastname,
            email: findUser ?.email,
            role: findUser ?.role,
            token
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

// handle refresh token
exports.handleRefreshToken = async (req, res) => {
    const cookie = req.cookies
    if (!cookie ?.refreshToken) return res.status(500).json({
        error: 'No refresh token in cookies'
    })
    const refreshToken = cookie.refreshToken
    // console.log(refreshToken);
    const user = await User.findOne({
        refreshToken
    })
    if (!user) return res.status(400).json({
        error: 'Invalid refresh token'
    })
    jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
        if (err || user.id !== decoded.userId) return res.status(500).json({
            error: "An error occured"
        })
        const accessToken = jwt.sign({
            userId: decoded.userId
        }, process.env.SECRET_KEY)
        res.status(200).json({
            accessToken: accessToken
        })
    })

}

exports.logout = async (req, res) => {
    const cookie = req.cookies
    if (!cookie ?.refreshToken) return res.status(400).json({
        error: 'No refresh token in cookies'
    })
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({
        refreshToken
    })
    if (!user) {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secured: true
        })
        return res.sendStatus(204)
    }
    await User.findOneAndUpdate({
        refreshToken
    }, {
        refreshToken: ''
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secured: true
    })
    return res.sendStatus(204)

}

exports.updatePassword = async (req, res) => {
    const {
        _id
    } = req.user
    const {
        password
    } = req.body
    const user = await User.findById(_id)
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.status(200).json(updatedPassword)
    } else {
        res.json(user)
    }
}

exports.forgotPasswordToken = async (req, res) => {
    const {email} = req.body
    try {
        const user = await User.findOne({
            email
        })
        if (!user) return res.status(400).json({
            error: 'User not found'
        })
        const token = await user.createPasswordResetToken(user)
        await user.save()
        const resetUrl = `Hi please follow this link to reset your password. This link is valid till 10 minutes from now.<a href="http://localhost:9000/api/auth/reset-password/${token}">Click Here</a>`
        const data = {
            from : 'protekfantasy@gmail.com',
            to : email,
            subject : 'Forgot Password Link',
            html : resetUrl
        }
        transporter.sendMail(data, (err, sent)=>{
            if(err){
                console.log(err);
                return
            }
            res.status(200).json({
                message : 'Please kindly follow the instructions that have been sent to your mail'
            })
            console.log(sent.response);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }

}

exports.resetPassword = async (req, res)=>{
    const {token} = req.params
    const {password} = req.body
    if(!password) return res.status(400).json({
        error : 'Password cannot be left blank'
    })
    
    try {
        const verifyToken = jwt.verify(token, process.env.RESET_TOKEN)
        if(!verifyToken) return res.status(400).json({
            error : 'Invalid token'
        })
        const user = await User.findOne({
            passwordResetToken : token,
            passwordResetExpires : {$gt : Date.now()}
        })
        if(!user) return res.status(400).json({
            error : 'Token Invalid or Expired'
        })

        const furtherCheck = await bcrypt.compare(password, user.password)
        if(furtherCheck) return res.status(400).json({
            error : 'Password cannot be the same as last password'
        })

        user.password = password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        user.passwordChangedAt = Date.now()
        await user.save()
        res.status(200).json({
            message : 'Password changed successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

