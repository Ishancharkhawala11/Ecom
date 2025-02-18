import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";

const ProductTile = ({ product, setCurrentEditedId, setopenCreateProductDialouge, setFormData, handleDelete }) => {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <div className="relative p-4">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-[300px] object-cover rounded-t-lg"
        />
      </div>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-2">{product.title}</h2>
        <div className="flex justify-between items-center gap-2 mb-4">
          {product.salePrice > 0 ? (
            <>
              <span className="text-lg font-semibold text-gray-500 line-through">
                ${product.price}
              </span>
              <span className="text-lg font-bold text-primary">${product.salePrice}</span>
            </>
          ) : (
            <span className="text-lg font-semibold text-primary">${product.price}</span>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4">
        <Button
          onClick={() => {
            setopenCreateProductDialouge(true);
            setCurrentEditedId(product._id);
            setFormData(product);
          }}
          className="w-1/2 mx-1"
        >
          Edit
        </Button>
        <Button onClick={() => handleDelete(product._id)} className="w-1/2 mx-1">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductTile;
