const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-product', isAuth.isAuthenticated, isAuth.isAdmin, productController.createProduct)
router.get('/get-product/:id', productController.getProduct)
router.get('/get-all-products', productController.getAllProduct)
router.put('/update-product/:id', isAuth.isAuthenticated, isAuth.isAdmin, productController.updateProduct)
router.delete('/delete-product/:id', isAuth.isAuthenticated, isAuth.isAdmin,  productController.deleteProduct)
router.put('/add-to-wish-list', isAuth.isAuthenticated, productController.addToWidhList)
router.get('/get-wish-list', isAuth.isAuthenticated, productController.getWishList)
router.put('/remove-from-wish-list', isAuth.isAuthenticated, productController.removeFromWishList)
router.put('/give-rating', isAuth.isAuthenticated, productController.giveRating)
router.put('/save-address', isAuth.isAuthenticated, productController.saveAddress)

module.exports = router