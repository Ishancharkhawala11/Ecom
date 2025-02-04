import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { brandOptionsMap, categoryOptionsMap } from "../config";

const Shopping_Product_tile = ({
  product,
  handleProductDetails,
  HandleAddToCart,
}) => {
  return (
    <Card className="w-full max-w-sm lg:max-w-xl mx-auto">
      <div onClick={() => handleProductDetails(product._id)}>
        <div className="relative">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-[300px] object-fill rounded-t-lg p-4"
          />
          {product.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              out of stock
            </Badge>
          ) : product.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              {product.totalStock} items left
            </Badge>
          ) : product.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 ml-2">
              Sale
            </Badge>
          ) : null}
        </div>
        <CardContent className="p-4">
          <h2 className="text-xl font-bold mb-2">{product.title}</h2>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[16px] text-muted-foreground">
              {/* {product.category} */}
              {categoryOptionsMap[product.category]}
            </span>
            <span className="text-[16px] text-muted-foreground">
              {brandOptionsMap[product.brand]}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span
              className={`${
                product.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              {product.price}
            </span>
            {product.salePrice > 0 ? (
              <span className="text-lg font-semibold text-primary">
                {product.salePrice}
              </span>
            ) : null}
          </div>
        </CardContent>
      </div>
      <CardFooter>
        {product.totalStock === 0 ? (
          <Button
            // onClick={() => HandleAddToCart(product._id)}
            className="w-full opacity-65 cursor-not-allowed"
          >
            Out of stock
          </Button>
        ) : (
          <Button
            onClick={() => HandleAddToCart(product._id,product.totalStock)}
            className="w-full"
          >
            Add to cart
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default Shopping_Product_tile;
