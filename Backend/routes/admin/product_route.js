const express=require('express')
const {handleImageUpload,addProduct,deleteProduct,fetchAllProduct, editProduct}=require('../../controllers/admin/products_controller')
const {upload}=require('../../helpers/Cloudinary')
const router=express.Router()
router.post('/upload-image',upload.single('my_file'),handleImageUpload)
router.post('/add',addProduct),
router.put('/edit/:id',editProduct),
router.delete('/delete/:id',deleteProduct),
router.get('/get',fetchAllProduct),
module.exports=router