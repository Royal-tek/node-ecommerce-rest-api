const express = require('express')
const app = express()
const dotenv = require('dotenv').config()
const dbConnect = require('./config/dbConnect')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 4000
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const cookieParser = require('cookie-parser')
const productRoutes = require('./routes/productRoutes')
const categoryRoutes = require('./routes/CategoryRoutes')
const brandRoutes = require('./routes/brandRoutes')
const couponRoutes = require('./routes/couponRoutes')
const morgan = require('morgan')

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended : false}))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/product', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/brands', brandRoutes)
app.use('/api/coupon', couponRoutes)

dbConnect()
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})