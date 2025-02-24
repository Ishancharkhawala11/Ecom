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
    setuploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const uploadImageToCloudinary = async () => {
    setImageLoading(true);
    setuploadedImageUrl("");

    const data = new FormData();
    data.append("my_file", imageFile);

    const response = await fetch("http://localhost:5000/api/admin/product/upload-image", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    if (result.success) {
      setuploadedImageUrl(result.data.url);
      setImageLoading(false);
    }
  };

  useEffect(() => {
    if (imageFile !== null) {
      uploadImageToCloudinary();
    }
  }, [imageFile]);

  useEffect(() => {
    if (uploadedImageUrl === "") {
      setImageFile(null);
    }
  }, [uploadedImageUrl]);

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? "" : "max-w-md mx-auto"}`}>
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleOnDrop}
        className={`${
          isEditMode ? "opacity-60" : ""
        } border-2 border-dashed rounded-md p-2 h-20 flex flex-col items-center justify-center text-center`}
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
            className={`${
              isEditMode ? "cursor-not-allowed" : "cursor-pointer"
            } flex flex-col items-center justify-center text-xs text-gray-600`}
          >
            <UploadCloudIcon className="w-6 h-6 text-muted-foreground mb-1" />
            <span className="block">Drag & drop or click to upload</span>
          </Label>
        ) : imageLoading ? (
          <Skeleton className="h-10 w-full bg-gray-200 rounded-md mx-auto p-2" />
        ) : (
          <div className="flex items-center justify-between w-full p-3">
            <div className="flex items-center">
              <FileIcon className="w-5 text-primary mr-1 h-5" />
            </div>
            <p className="text-base font-medium truncate max-w-[150px]">{imageFile.name}</p>
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
        )}
      </div>

      {uploadedImageUrl && !imageLoading && (
        <div className="mt-2">
          <img src={uploadedImageUrl} alt="Uploaded" className="w-full h-[300px] object-fill rounded-md" />
        </div>
      )}
    </div>
  );
};

export default Product_image_upload;
