import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

const Product_image_upload = ({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setuploadedImageUrl,
  setImageLoading,
  imageLoading,
  isEditMode,
  isCustomStyling = false,
}) => {
  const inputRef = useRef(null);

  const handleImageFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setImageFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleOnDrop = (e) => {
    e.preventDefault();
    const dropFile = e.dataTransfer.files?.[0];
    if (dropFile) {
      setImageFile(dropFile);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setuploadedImageUrl(''); // Clear the uploadedImageUrl state when image is removed
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const uploadImageToCloudinary = async () => {
    setImageLoading(true);
    setuploadedImageUrl(''); // Clear uploaded image URL before uploading a new one

    const data = new FormData();
    data.append('my_file', imageFile);

    const response = await fetch("http://localhost:5000/api/admin/product/upload-image", {
      method: 'POST',
      body: data,
    });

    const result = await response.json();
    if (result.success) {
      setuploadedImageUrl(result.data.url); // Set the new uploaded image URL
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  useEffect(() => {
    // Reset the image preview when the uploadedImageUrl changes (when the image is uploaded)
    if (uploadedImageUrl === '') {
      setImageFile(null); // Reset the file input as well
    }
  }, [uploadedImageUrl]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleOnDrop}
        className={`${isEditMode ? 'opacity-60' : ''} border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          ref={inputRef}
          onChange={handleImageFileChange}
          disabled={isEditMode}
        />
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode ? 'cursor-not-allowed' : 'cursor-pointer'} flex flex-col items-center justify-center h-32`}
          >
            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to</span>
          </Label>
        ) : (
          imageLoading ? (
            <Skeleton className="h-10 bg-gray-100" />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-7 text-primary mr-2 h-8" />
              </div>
              <p className="text-sm font-medium">{imageFile.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4">
                  <span className="sr-only">remove file</span>
                </XIcon>
              </Button>
            </div>
          )
        )}
      </div>

      {/* Display image preview if uploadedImageUrl is set */}
      {uploadedImageUrl && !imageLoading && (
        <div className="mt-4">
          <img
            src={uploadedImageUrl}
            alt="Uploaded"
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
};

export default Product_image_upload;
