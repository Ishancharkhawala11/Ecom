const Feature=require('../../models/Feature')
const addFeatureImage = async (req, res) => {
   try {
     const { image } = req.body;
 
     // Check if the image is already uploaded by checking the `image` field
     const imageExist = await Feature.findOne({ image });
     if (imageExist) {
       return res.json({
         success: false,
         message: 'Image is already uploaded, cannot upload a second time',
       });
     }
 
     // Save the new image
     const featuresImages = new Feature({
       image,
     });
 
     await featuresImages.save();
 
     res.status(201).json({
       success: true,
       data: featuresImages,
     });
   } catch (error) {
     console.log(error);
     res.status(500).json({
       success: false,
       message: 'Some error occurred',
     });
   }
 };
 
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