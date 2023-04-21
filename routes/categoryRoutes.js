const express = require('express')
const router = express.Router()
const categoryController = require('../controllers/categoryController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-category', isAuth.isAuthenticated, isAuth.isAdmin, categoryController.createCategory)
router.put('/update-category/:id', isAuth.isAuthenticated, isAuth.isAdmin, categoryController.updateCategory)
router.delete('/delete-category/:id', isAuth.isAuthenticated, isAuth.isAdmin, categoryController.deleteCategory)
router.get('/get-category/:id', isAuth.isAuthenticated, categoryController.getCategory)
router.get('/get-all-categories', isAuth.isAuthenticated, categoryController.getAllCategories)

module.exports = router