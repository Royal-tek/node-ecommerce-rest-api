const { default: mongoose } = require('mongoose')
const User = require('../models/UserModel')
const Product = require('../models/ProductModel')
const Cart = require('../models/CartModel')

exports.getAllUsers = async(req, res)=>{
    try {
        const allUsers = await User.find()
        if(!allUsers) return res.status(404).json({
            error : 'No users found'
        })
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getUser = async(req, res)=>{
    try {
    const {id} = req.params
    const user = await User.findById(id)
    if(!user) return res.status(400).json({
        error : 'User not found'
    })
    res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteUser = async(req, res)=>{
    try {
    const {_id} = req.user
    const user = await User.findByIdAndDelete(_id)
    if(!user) return res.status(400).json({
        error : 'User not found'
    })
    res.status(200).json({
        message : 'User Deleted Successfully'
    })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateUser = async (req, res)=>{
    try {
        const {_id} = req.user
        const updatedUser = await User.findByIdAndUpdate(_id, {
            firstname : req?.body?.firstname, 
            lastname : req?.body?.lastname, 
            email : req?.body?.email, 
            phone : req?.body?.phone 
        }, {
            new:true
        })
        res.status(200).json({
            message : 'User updated successfully',
            updatedUser
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.blockUser = async(req, res)=>{
    try {
        const { id } = req.params
        const blockUser = await User.findByIdAndUpdate({_id:id}, {
            isBlocked : true
        },
        {
            new:true
        }
        )
        res.status(200).json({
            message : 'User has been blocked'
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.unBlockUser = async(req, res)=>{
    try {
        const { id } = req.params
        const unBlockUser = await User.findByIdAndUpdate({_id:id}, {
            isBlocked : false
        },
        {
            new:true
        }
        )
        res.status(200).json({
            message : 'User has been unblocked'
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.createCart = async(req, res)=>{
    const { prodId, quantity } = req.body
    const { _id } = req.user
    try {
        const user = await User.findById(_id)
        const product = await Product.findById(prodId).select('price').exec()
        // console.log(product);
    
        if(!user) return res.status(400).json({
            error : 'User not found'
        })
        if(!product) return res.status(400).json({
            error : 'Product not found'
        })
        // FIND THE CART OF THE USER
        let cart = await Cart.findOne({ orderBy : user._id})
        // IF THE CART DOESNT EXIST, CREATE A NEW CART FOR THE USER
        if(!cart){
            cart = new Cart({ orderBy : user._id})
        }
        // CHECK IF THE PRODUCT IS IN THE CART ALREADY
        const checkProductExists = cart.products.findIndex((p)=> p.product.toString() === prodId)
        // IF PRODUCT EXIST RETURN PRODUCT EXISTS IN CART ALREADY
        if(checkProductExists !== -1) return res.status(200).json({
            error : 'Product is already in cart'
        })
        else{
            cart.products.push({product:prodId, quantity:quantity, price:product.price})
        }
        let cartTotal = 0
        cartTotal = cart.products.map((item)=> item.price * item.quantity).reduce((a,b)=> a+b, 0)
        cart.cartTotal = cartTotal
        await cart.save()
        res.json(cart)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.getUserCart = async(req, res)=>{
    const {_id} = req.user
    try {
        const user = await User.findById(_id)
        if(!user) return res.status(400).json({
            error : 'User not found'
        })
        const cart = await Cart.findOne({ orderBy : user._id}).populate('products.product').populate({
            path: 'orderBy',
            select : 'firstname lastname email'
        })
        if(!cart) return res.status(200).json({
            error : 'User has no cart'
        })

        res.status(200).json(cart)
    } catch (error) {
        
    }
}