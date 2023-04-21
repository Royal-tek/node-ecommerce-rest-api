const mongoose = require('mongoose')
const dbConnect = ()=>{
    try {
        const conn = mongoose.connect(process.env.DB_URI)
        console.log('Database connected successfully');
    } catch (error) {
        console.log(error);
    }
}

module.exports = dbConnect