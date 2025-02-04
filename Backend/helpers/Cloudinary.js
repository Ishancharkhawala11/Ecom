const cloudinary=require("cloudinary").v2
const multer=require("multer")
cloudinary.config({
    cloud_name:'dml08upkg',
    api_key:'695178539642361',
    api_secret:'LS1K0uyY4_RrJLrm7MFazk0KSVQ'
})
const storage=new multer.memoryStorage()
const ImageUploadUtils=async(file)=>{
  const result=await cloudinary.uploader.upload(file,{
    resource_type:'auto'
  })
  return result
}
const upload=multer({storage})
module.exports={ImageUploadUtils,upload}