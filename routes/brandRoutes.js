const express = require('express')
const router = express.Router()
const brandController = require('../controllers/brandController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-brand', isAuth.isAuthenticated, isAuth.isAdmin, brandController.createBrand)
router.put('/update-brand/:id', isAuth.isAuthenticated, isAuth.isAdmin, brandController.updateBrand)
router.delete('/delete-brand/:id', isAuth.isAuthenticated, isAuth.isAdmin, brandController.deleteBrand)
router.get('/get-brand/:id', isAuth.isAuthenticated, brandController.getBrand)
router.get('/get-all-categories', isAuth.isAuthenticated, brandController.getAllBrands)

module.exports = router