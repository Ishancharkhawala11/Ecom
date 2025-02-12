const express=require('express')
const {updateOrderStatus,getAllOrderOfAllUser,getOrderDetailsForAdmin,changePaymentStatus}=require('../../controllers/admin/order_controller')
const router=express.Router()
router.get('/get',getAllOrderOfAllUser)
router.get('/details/:id',getOrderDetailsForAdmin)
router.put('/update/:id',updateOrderStatus)
router.put('/status',changePaymentStatus)
module.exports=router