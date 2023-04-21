const express = require('express')
const router = express.Router()
const couponController = require('../controllers/couponController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-coupon', isAuth.isAuthenticated, isAuth.isAdmin, couponController.createCoupon)
router.get('/get-all-coupons', isAuth.isAuthenticated, isAuth.isAdmin, couponController.getAllCoupons)
router.put('/update-coupon/:id', isAuth.isAuthenticated, isAuth.isAdmin, couponController.updateCoupon)
router.put('/delete-coupon/:id', isAuth.isAuthenticated, isAuth.isAdmin, couponController.deleteCoupon)

module.exports = router