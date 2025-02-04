const express=require('express')
const {captureOrder,createOrder,getAllOrderByUser,getOrderDetails}=require('../../controllers/shop/Order_controller')
const router=express.Router()
router.post('/create',createOrder)
router.post('/capture',captureOrder)
router.get('/list/:userId',getAllOrderByUser)
router.get('/details/:id',getOrderDetails)

module.exports=router