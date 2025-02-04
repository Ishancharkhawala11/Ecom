const express=require('express')
const {updateOrderStatus,getAllOrderOfAllUser,getOrderDetailsForAdmin}=require('../../controllers/admin/order_controller')
const router=express.Router()
router.get('/get',getAllOrderOfAllUser)
router.get('/details/:id',getOrderDetailsForAdmin)
router.put('/update/:id',updateOrderStatus)
module.exports=router