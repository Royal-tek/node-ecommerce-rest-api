const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const isAuth = require('../middlewares/isAuth')

router.post('/register', authController.register)
router.post('/login', authController.login)
router.get('/refresh', authController.handleRefreshToken)
router.get('/logout', authController.logout)
router.put('/update-password', isAuth.isAuthenticated ,authController.updatePassword)
router.put('/forgot-password' ,authController.forgotPasswordToken)
router.put('/reset-password/:token',authController.resetPassword)



module.exports = router