import Product_image_upload from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from '@/store/common';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { Loader } from "lucide-react";

const AdminDashBoard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { featureImageList } = useSelector(state => state.commonFeature);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const handleUploadFeatureImage = () => {
    setIsUploading(true);
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data.payload.success) {
        dispatch(getFeatureImages());
        setuploadedImageUrl('');
        setIsUploading(false);
      }
    });
  };

  const handleDeleteImage = (id) => {
    dispatch(deleteFeatureImage(id));
  };

  return (
    <div>
      <Product_image_upload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setuploadedImageUrl={setuploadedImageUrl}
        setImageLoading={setImageLoading}
        imageLoading={imageLoading}
        isCustomStyling={true}
      />
      <Button 
        disabled={!uploadedImageUrl || isUploading} 
        onClick={handleUploadFeatureImage} 
        className='mt-5 w-full'
      >
        {isUploading ? (
          <div className="flex items-center justify-center space-x-2">
            <Loader className="animate-spin text-gray-700" size={20} />
            <span>Uploading...</span>
          </div>
        ) : (
          'Upload'
        )}
      </Button>

      <div className='flex flex-col gap-5 mt-10'>
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map(featureImage => (
              <div key={featureImage._id} className='border relative rounded-lg overflow-hidden'>
                <img src={featureImage.image} className='w-full h-[500px] object-cover rounded-t-lg' />
                <Button
                  className='absolute top-2 right-2 bg-black text-white'
                  onClick={() => handleDeleteImage(featureImage._id)}
                >
                  <FaTrash />
                </Button>
              </div>
            ))
          : <p className="text-center text-gray-500">No feature images found.</p>
        }
      </div>
    </div>
  );
};

export default AdminDashBoard;
