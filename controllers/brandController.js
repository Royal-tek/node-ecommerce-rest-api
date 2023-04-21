const Brand = require('../models/BrandModel')

exports.createBrand = async(req, res)=>{
    try {
        const brand = await Brand.create(req.body)
        res.status(201).json(brand)
    } catch (error) {
        console.log(error);
        res.status(500).json(error)
    }
}

exports.updateBrand = async (req, res)=>{
    try {
        const { id } = req.params
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new : true
        })
        res.status(200).json({
            message : 'Brand has been updated',
            updateBrand
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteBrand = async (req, res)=>{
    try {
        const { id } = req.params
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.status(200).json({
            message : 'Brand has been deleted',
            
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getBrand = async (req, res)=>{
    try {
        const { id } = req.params
        const brand = await Brand.findById(id)
        if(!brand) return res.status(400).json({
            error : 'Brand not found'
        })
        res.status(200).json({
            brand
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllBrands = async (req, res)=>{
    try {
        const brands = await Brand.find()
        if(!brands) return res.status(400).json({
            error : 'No brand found'
        })
        res.status(200).json({
            brands
        })
    } catch (error) {
        res.status(500).json(error)
    }
}