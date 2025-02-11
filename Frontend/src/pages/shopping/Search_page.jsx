import Product_details_dialog from "@/components/shopping/Product_details";
import Product_Not_Found from "@/components/shopping/Product_Not_Found";
import Shopping_Product_tile from "@/components/shopping/Product_tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import { fetcProductdetails } from "@/store/Shop/Product_slice";
import { getSearchResults, resetResults } from "@/store/Shop/search_slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

const Search_Product = () => {
  const [keyword, setKeyword] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
   const { cartItems } = useSelector((state) => state.shopCart);
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const dispatch = useDispatch();
  const [openDetailDialog, setOpenDetailsDialoge] = useState(false);
 const {productDetails } = useSelector(
    (state) => state.shopProduct
  );
  const handleProductDetails = (getcurrentProductId) => {
      console.log(getcurrentProductId);
      dispatch(fetcProductdetails(getcurrentProductId));
    };
   useEffect(() => {
      if (productDetails !== null) {
        setOpenDetailsDialoge(true);
      }
    }, [productDetails]);
  useEffect(() => {
    setSearchParams(new URLSearchParams(`?keyword=${keyword}`));

    if (keyword.trim().length > 3) {
      const delaySearch = setTimeout(() => {
        dispatch(getSearchResults(keyword));
      }, 1000); 

      return () => clearTimeout(delaySearch); 
    } else {
      dispatch(resetResults());
    }
  }, [keyword, dispatch, setSearchParams]);
  const HandleAddToCart = (getcurrentProductId, getTotalStock) => {
      // console.log(getcurrentProductId);
      let getCartItems = cartItems.items || [];
      if (getCartItems.length) {
        const indexOfCurrentItem = getCartItems.findIndex(
          (item) => item.productId === getcurrentProductId
        );
        // if(indexOfCurrentItem)
        if (indexOfCurrentItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added`,
              variant: "destructive",
            });
            return
          }
        }
      }
      dispatch(
        addToCart({
          userId: user.id,
          productId: getcurrentProductId,
          quantity: 1,
        })
      ).then((data) => {
        // console.log(data)
        if (data.payload.success) {
          dispatch(fetchToCart(user.id));
          toast({
            title: "Product has been added in cart",
          });
        }
      });
    };

  return (
    <div className="container mx-auto md:px-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="items-center w-full flex">
          <Input
            value={keyword}
            name="keyword"
            onChange={(e) => setKeyword(e.target.value)}
            className="py-6"
            placeholder="Search Products ..."
          />
        </div>
      </div>
      
      {!searchResults.length && (
        <div className="w-full text-2xl font-bold flex items-center justify-center">
          <Product_Not_Found  Item={'Products'}/>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <Shopping_Product_tile key={item._id} HandleAddToCart={HandleAddToCart} product={item} handleProductDetails={handleProductDetails}/>
        ))}
      </div>
      <Product_details_dialog
        open={openDetailDialog}
        setOpen={setOpenDetailsDialoge}
        product_Details={productDetails}
      ></Product_details_dialog>
    </div>
  );
};

export default Search_Product;
