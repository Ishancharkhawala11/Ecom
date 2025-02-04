import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const Product_tile = ({ product,setCurrentEditedId,setopenCreateProductDialouge,setFormData,handleDelete }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative p-4"> {/* Add padding here */}
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[300px] object-fill rounded-t-lg"
        />
      </div>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{product.title}</h2>
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${
              product.salePrice >0 ? "line-through" : ""
            } text-lg font-semibold text-primary`}
          >
            $ {product.price}
          </span>
          {
            product.salePrice>0?<span className="text-lg font-bold"> {product.salePrice}</span>:null
          }
          
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Button onClick={()=>{
            setopenCreateProductDialouge(true)
            setCurrentEditedId(product._id)
            setFormData(product)
        }}>Edit</Button>
        <Button onClick={()=>handleDelete(product._id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
};

export default Product_tile;
