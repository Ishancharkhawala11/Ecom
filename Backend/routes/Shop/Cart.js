const express=require('express')
const {addToCart,deleteCartItem,fetchCartItems,updateCartitemQuantity}=require('../../controllers/shop/Cart_Controller')
const router=express.Router()
router.post('/add',addToCart)
router.get('/get/:userId',fetchCartItems)
router.put('/update-cart',updateCartitemQuantity)
router.delete('/:userId/:productId',deleteCartItem)
module.exports=router