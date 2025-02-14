import React from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "../config";

const Shopping_Product_tile = ({ product, handleProductDetails, HandleAddToCart }) => {
  return (
    <Card className="w-full max-w-sm lg:max-w-xl mx-auto flex flex-col justify-between h-[520px]">
      <div onClick={() => handleProductDetails(product._id)} className="flex flex-col flex-grow">
        {/* Image Container with Zoom-in Effect */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-cover rounded-3xl p-4 transition-transform duration-300 ease-in-out transform hover:scale-110 "
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              Out of stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              {product.totalStock} left
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              Sale
            </Badge>
          ) : null}
        </div>
        {/* Product Info */}
        <CardContent className="p-4 flex-grow flex flex-col justify-start">
          <h2 className="text-xl font-bold mb-1 line-clamp-2 h-[50px]">
            {product.title}
          </h2>
          <div className="flex justify-between items-center mb-1">
            <span className="text-[16px] text-muted-foreground">
              {categoryOptionsMap[product.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product.brand]}
            </span>
          </div>
          {/* Price Section */}
          <div className="flex justify-between items-center mb-1">
            <span className={`${product.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>
              ${product.price}
            </span>
            {product.salePrice > 0 && (
              <span className="text-lg font-semibold text-primary">
               ${product.salePrice}
              </span>
            )}
          </div>
        </CardContent>
      </div>
      {/* Button Section */}
      <CardFooter className="p-4 pt-2 flex items-center">
        {product.totalStock === 0 ? (
          <Button className="w-full opacity-65 cursor-not-allowed">
            Out of stock
          </Button>
        ) : (
          <Button onClick={() => HandleAddToCart(product._id, product.totalStock)} className="w-full">
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Shopping_Product_tile;
