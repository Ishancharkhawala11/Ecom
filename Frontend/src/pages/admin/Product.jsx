import Product_image_upload from "@/components/admin/image-upload";
import Product_tile from "@/components/admin/Product_tile";
import CommonForm from "@/components/common/Form";
import { addProductFormElements } from "@/components/config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import {
  addNewProduct,
  EditProduct,
  fetchAllProducts,
  DeleteProduct
} from "@/store/admin/product-slice";
import React, { useEffect, useState } from "react";
import { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";

const intialFormData = {
  image: null,
  title: "",
  category: "",
  description: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};
const AdminProduct = () => {
  const [openCreateProductDialouge, setopenCreateProductDialouge] =
    useState(false);
  const [formData, setFormData] = useState(intialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setuploadedImageUrl] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const dispetch = useDispatch();
  const { productList } = useSelector((state) => state.adminProduct);
  const { toast } = useToast();
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const onSubmit = (e) => {
    e.preventDefault();

    currentEditedId !== null
      ? (console.log(currentEditedId),
        dispetch(
          EditProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edited");
          console.log(data.payload.success, "payload");
          if (data.payload.success) {
            dispetch(fetchAllProducts());
            setFormData(intialFormData);
            setopenCreateProductDialouge(false);
            setCurrentEditedId(null);
          }
        }))
      : dispetch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          console.log(data);
          console.log(data.payload.success);
          if (data.payload.success) {
            dispetch(fetchAllProducts());
            setopenCreateProductDialouge(false);
            setImageFile(null);
            setFormData(intialFormData);
            toast({
              title: "Product added successfully",
              position: "top",
            });
          }
        });
  };
  useEffect(() => {
    dispetch(fetchAllProducts());
  }, [dispetch]);
  console.log(productList, uploadedImageUrl, "productList");
  const isFormValid = () => {
    return Object.keys(formData)
      .map((key) => formData[key] !== '')
      .every(item => item);
  };
  const deleteproduct = (getCurrentProductId) => {
// console.log(getCurrentProductId)
dispetch(DeleteProduct(getCurrentProductId)).then((data)=>{
   if(data.payload.success){
    dispetch(fetchAllProducts())
   }
})
  };
  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setopenCreateProductDialouge(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <Product_tile
                setCurrentEditedId={setCurrentEditedId}
                setopenCreateProductDialouge={setopenCreateProductDialouge}
                setFormData={setFormData}
                product={productItem}
                handleDelete={deleteproduct}
              ></Product_tile>
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductDialouge}
        onOpenChange={() => {
          setopenCreateProductDialouge(false), setCurrentEditedId(null);
          setFormData(intialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{`${
              currentEditedId != null ? "Edit product" : "Add new product"
            }`}</SheetTitle>
          </SheetHeader>
          <Product_image_upload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setuploadedImageUrl={setuploadedImageUrl}
            setImageLoading={setImageLoading}
            imageLoading={imageLoading}
            isEditMode={currentEditedId !== null}
          ></Product_image_upload>
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={`${currentEditedId !== null ? "Edit" : "Add"}`}
              formControlers={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            ></CommonForm>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
};

export default AdminProduct;
