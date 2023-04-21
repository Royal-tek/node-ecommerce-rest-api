const Category = require('../models/CategoryModel')

exports.createCategory = async(req, res)=>{
    try {
        const Category = await Category.create(req.body)
        res.status(201).json(Category)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateCategory = async (req, res)=>{
    try {
        const { id } = req.params
        const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
            new : true
        })
        res.status(200).json({
            message : 'Category has been updated',
            updateCategory
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteCategory = async (req, res)=>{
    try {
        const { id } = req.params
        const deleteCategory = await Category.findByIdAndDelete(id)
        res.status(200).json({
            message : 'Category has been deleted',
            
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getCategory = async (req, res)=>{
    try {
        const { id } = req.params
        const Category = await Category.findById(id)
        if(!Category) return res.status(400).json({
            error : 'Category not found'
        })
        res.status(200).json({
            Category
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllCategories = async (req, res)=>{
    try {
        const categories = await Category.find()
        if(!categories) return res.status(400).json({
            error : 'No Category found'
        })
        res.status(200).json({
            categories
        })
    } catch (error) {
        res.status(500).json(error)
    }
}