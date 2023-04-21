const Coupon = require('../models/CouponModel')


exports.createCoupon = async(req, res)=>{
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.getAllCoupons = async(req, res)=>{
    try {
        const allCoupons = await Coupon.find()
        res.json(allCoupons)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.updateCoupon = async(req, res)=>{
    const {id} = req.params
    try {
        const updateCoupon = await Coupon.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateCoupon)
    } catch (error) {
        res.status(500).json(error)
    }
}

exports.deleteCoupon = async(req, res)=>{
    const {id} = req.params
    try {
        const deleteCoupon = await Coupon.findOneAndDelete(id)
        res.json({
            message : 'Coupon has been deleted'
        })
    } catch (error) {
        res.status(500).json(error)
    }
}