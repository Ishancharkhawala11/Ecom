const express=require('express')
const {getNotificationList}=require('../../controllers/admin/Notification')
const router=express.Router()
router.get('/notifications',getNotificationList)
module.exports=router