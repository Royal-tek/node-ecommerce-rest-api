const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const isAuth = require('../middlewares/isAuth')

router.get('/get-all-users', isAuth.isAuthenticated, isAuth.isAdmin, userController.getAllUsers)
router.get('/get-user/:id', userController.getUser)
router.delete('/delete-user',isAuth.isAuthenticated, userController.deleteUser)
router.put('/update-user',  isAuth.isAuthenticated, userController.updateUser)
router.put('/block-user/:id',  isAuth.isAuthenticated, userController.blockUser)
router.put('/unblock-user/:id',  isAuth.isAuthenticated, userController.unBlockUser)
router.post('/add-to-cart',  isAuth.isAuthenticated, userController.createCart)
router.get('/get-user-cart',  isAuth.isAuthenticated, userController.getUserCart)



module.exports = router