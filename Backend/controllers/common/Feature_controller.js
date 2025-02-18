const Feature=require('../../models/Feature')
const addFeatureImage=async(req,res)=>{
   try {
    const {image}=req.body
   //  console.log(image);
    
    const image_exist=await Feature.findOne({image})
    console.log(image_exist);
    
    if(image_exist){
     return res.json({
          success:false,
          message:'Image is already uploaded,cannot upload second time'
      })
    }

    const featuresImages=new Feature({
        image
    })
    await featuresImages.save()
    res.status(201).json({
        success:true,
        data:featuresImages
    })
   } catch (error) {
    console.log(error);
     res.status(500).json({
        success:false,
        message:'some error occured'
     })
   }
}
const getFeatureImage=async(req,res)=>{
    try {
     const images=await Feature.find({})
     res.status(201).json({
        success:true,
        data:images
    })
    } catch (error) {
     console.log(error);
      res.status(500).json({
         success:false,
         message:'some error occured'
      })
    }
 }
 const deleteFeatureImage=async(req,res)=>{
   try {
      const {id}=req.params
      await Feature.findByIdAndDelete(id)
      res.status(200).json({
         success:true,
         message:"Image deleted successfully"
      })
   } catch (error) {
      console.log(error);
      res.status(500).json({
         success:false,
         message:'some error occured'
      })
   }
 }
 module.exports={addFeatureImage,getFeatureImage,deleteFeatureImage}