const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    firstname : {
        type : String,
        required : true
    },
    lastname : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    phone : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    role : {
        type : String,
        default : 'user'
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    wishList : [{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Product'
    }],
    address : [{
        type : String,
    }],
    cart:{
        type : Array,
        default : []
    },
    refreshToken : {
        type :String
    },
    passwordChangedAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date
}, {
    timestamps : true
})


UserSchema.pre('save', async function (next){
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// UserSchema.methods.createPasswordResetToken = async function(){
//     const resetToken =  crypto.randomBytes(32).toString('hex')
//     this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
//     this.passwordResetExpires = Date.now() + 30*60*1000
//     return resetToken
// }

UserSchema.methods.createPasswordResetToken = async function(user){
    const resetToken = jwt.sign({id:user._id}, process.env.RESET_TOKEN, {expiresIn : '30m'})
    this.passwordResetToken = resetToken
    this.passwordResetExpires = Date.now() + 30*60*1000
    return resetToken
}

module.exports = mongoose.model('User', UserSchema)