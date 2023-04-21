const Product = require('../models/ProductModel')
const slugify = require('slugify')
const User = require('../models/UserModel')

exports.createProduct = async(req, res)=>{
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getProduct = async(req, res)=>{
    const {id} = req.params
    try {
        const findProduct = await Product.findById(id)
        if(!findProduct) return res.status(400).json({
            error : 'Product not found'
        })
        res.status(200).json(findProduct)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllProduct = async(req, res)=>{
    try {
        
        const findProducts = await Product.find()
        if(!findProducts) return res.status(400).json({
            error : 'No productsfound'
        })
        res.status(200).json(findProducts)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateProduct = async(req, res)=>{
    const {id} = req.params
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate(id, req.body, {
            new:true
        })
        res.status(200).json({
            message :'Product updated successfully',
            updateProduct
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteProduct = async(req, res)=>{
    const {id} = req.params
    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.status(200).json({
            message :'Product deleted successfully',
            
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.addToWidhList = async (req, res)=>{
    const { _id } = req.user
    const { product } = req.body
    try {
        const user = await User.findById(_id)
        const alreadyAdded = user.wishList.find((id)=> id.toString() === product)
        if(alreadyAdded) return res.status(400).json({
            error : 'Product is already in your wishlist'
        })
        let addProduct = await User.findByIdAndUpdate(_id, {
            $push : { wishList : product}
        },
        {
            new : true
        })
        res.status(200).json({
            message : 'Product has been added to wishlist',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.getWishList = async(req, res)=>{
    const {_id} = req.user
    try {
        const findUser = await User.findById(_id).populate('wishList')
        res.status(200).json(findUser)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.removeFromWishList = async (req, res)=>{
    const { _id } = req.user
    const { product } = req.body
    try {
        const user = await User.findById(_id)
        const notAdded = user.wishList.find((id)=> id.toString() === product)
        if(!notAdded) return res.status(400).json({
            error : 'Product is not in your wishlist'
        })
        let removeProduct = await User.findByIdAndUpdate(_id, {
            $pull : { wishList : product}
        },
        {
            new : true 
        })
        res.status(200).json({
            message : 'Product has been removed from wishlist',
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.giveRating = async(req, res)=>{
    const {_id} = req.user
    const {stars, prodId} = req.body
    try {
        const product = await Product.findById(prodId)
        let alreadyRated = product.ratings.find((userId)=> userId.postedBy.toString() === _id.toString())
        if(alreadyRated){
            const updateRating = await Product.updateOne({
                ratings: {$elemMatch: alreadyRated},                
            },
            {$set:{"ratings.$.star":stars}}
            ,{new : true})
            

        }else{
            const rateProduct = await Product.findByIdAndUpdate(prodId, {
                $push : {
                    ratings : {
                        star : stars,
                        postedBy : _id
                    }
                }
            },
            {
                new : true
            })
        
        }
        const getallratings = await Product.findById(prodId)
        let totalRating = getallratings.ratings.length
        let ratingSum = getallratings.ratings.map((item)=> item.star).reduce((prev, curr)=> prev+curr, 0) 
        let actualRating = Math.round(ratingSum / totalRating)
        let finalProduct = await Product.findByIdAndUpdate(prodId, {
            totalRating : actualRating
        }, {
            new:true
        })
        res.status(200).json(finalProduct)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }


}

exports.saveAddress = async (req, res)=>{
    const {_id} = req.user
    try {
        const saveAddress = await User.findByIdAndUpdate(_id, {
            $push:{
                address : req.body.address
            }
        }, {
            new:true
        })
        res.json(saveAddress)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}