import Product_image_upload from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages } from '@/store/common';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const AdminDashBoard = () => {
 
   const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setuploadedImageUrl] = useState("");
    const [imageLoading, setImageLoading] = useState(false);
    const {featureImageList}=useSelector(state=>state.commonFeature)
    // console.log(uploadedImageUrl,'url')
    const dispatch=useDispatch()
    const handleUploadFeatureImage=()=>{
      dispatch(addFeatureImage(uploadedImageUrl)).then(data=>{
        // console.log(data);
        if(data.payload.success){
          dispatch(getFeatureImages())
        }
        
      })
    }
    useEffect(()=>{
      dispatch(getFeatureImages())
    },[dispatch])
    console.log(featureImageList,'image');
    
  return (
    <div>
    {/* <h1>Upload feature images</h1> */}
    <Product_image_upload
    imageFile={imageFile}
    setImageFile={setImageFile}
    uploadedImageUrl={uploadedImageUrl}
    setuploadedImageUrl={setuploadedImageUrl}
    setImageLoading={setImageLoading}
    imageLoading={imageLoading}
    // isEditMode={currentEditedId !== null}
    isCustomStyling={true}
  ></Product_image_upload>
<Button onClick={handleUploadFeatureImage} className='mt-5 w-full'>
  upload
</Button>
<div className= "flex flex-col gap-5 mt-10 ">
  {
    featureImageList && featureImageList.length >0 ? featureImageList.map(featureImage=><div className='border-red-500 border'>
    <img src={featureImage.image} className="w-full h-[300px] object-fill rounded-t-lg "/>
    </div>):null
  }
</div>
  </div>
  )
}

export default AdminDashBoard