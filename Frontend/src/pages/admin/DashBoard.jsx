import Product_image_upload from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { addFeatureImage, getFeatureImages, deleteFeatureImage } from '@/store/common';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { toast, useToast } from '@/hooks/use-toast';

const AdminDashBoard = () => {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const { featureImageList } = useSelector(state => state.commonFeature);
  const dispatch = useDispatch();
  const toast=useToast()
  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  const handleUploadFeatureImage = () => {
    dispatch(addFeatureImage(uploadedImageUrl)).then(data => {
      if (data.payload.success) {
        dispatch(getFeatureImages());
      }
      else{
        toast({
          title:data.payload.message
        })
        // dispatch(getFeatureImages());
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
      <Button disabled={uploadedImageUrl===null || uploadedImageUrl===''} onClick={handleUploadFeatureImage} className='mt-5 w-full'>
        Upload
      </Button>

      <div className='flex flex-col gap-5 mt-10'>
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map(featureImage => (
              <div key={featureImage._id} className='border border-red-500 relative rounded-lg overflow-hidden'>
                <img src={featureImage.image} className='w-full h-[300px] object-cover rounded-t-lg' />
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
