const express=require('express')
const {getFillterProduct,getProductDetails}=require('../../controllers/shop/Product_controoler')
const router=express.Router()
router.get('/get',getFillterProduct)
router.get('/get/:id',getProductDetails)
module.exports=router