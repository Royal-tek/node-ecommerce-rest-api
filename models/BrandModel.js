const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BrandSchema = new Schema({
    title:{
        type : String,
        required : true,
        unique : true
    }
}, {
    timestamps : true
})

module.exports = mongoose.model('Brand', BrandSchema)