import Product_details_dialog from "@/components/shopping/Product_details";
import { sortOptions } from "@/components/config";
import FilterProduct from "@/components/shopping/Filter";
import Shopping_Product_tile from "@/components/shopping/Product_tile";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuRadioGroup,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import {
  fetchAllfillteredProducts,
  fetcProductdetails,
} from "@/store/Shop/Product_slice.js";
import { ArrowUpDownIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSearchParams, useSearchParams } from "react-router-dom";
import Product_Not_Found from "@/components/shopping/Product_Not_Found";
import Footer from "../../components/shopping/Footer";
import './shopping.css'
const ShoppingListing = () => {
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(
    (state) => state.shopProduct
  );
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const [filter, setFilter] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailDialog, setOpenDetailsDialoge] = useState(false);
  const categorySearchParams = searchParams.get("category");
  const { toast } = useToast();
  const [animatedProducts, setAnimatedProducts] = useState([]);

  useEffect(() => {
    if (filter !== null && sort !== null)
      dispatch(
        fetchAllfillteredProducts({ filterParams: filter, sortParams: sort })
      );
  }, [dispatch, sort, filter]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilter(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParams]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialoge(true);
    }
  }, [productDetails]);

  useEffect(() => {
    if (filter && Object.keys(filter).length > 0) {
      const createQueryString = createSearchParamsHelper(filter);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filter]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setAnimatedProducts((prev) => [...prev, entry.target.dataset.id]);
            observer.unobserve(entry.target); // Animate only once
          }
        });
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
      }
    );

    const productElements = document.querySelectorAll(".product-item");
    productElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      productElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [productList]);

  const createSearchParamsHelper = (filterparams) => {
    const queryParam = [];
    for (const [key, value] of Object.entries(filterparams)) {
      if (Array.isArray(value) && value.length > 0) {
        const paramValue = value.join(",");
        console.log(paramValue, "params");
        queryParam.push(`${key}=${encodeURIComponent(paramValue)}`);
      }
    }
    return queryParam.join("&");
  };

  const HandleAddToCart = (getcurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getcurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        console.log(getQuantity, "getQuantity");
        console.log(getTotalStock, "totalStock");

        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added`,
            variant: "destructive",
          });
          return;
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
      if (data.payload.success) {
        dispatch(fetchToCart(user.id));
        toast({
          title: "Product has been added in cart",
        });
      }
    });
  };

  const handleSort = (value) => {
    setSort(value);
  };

  const handleFilter = (getSectionId, getCurrentOption) => {
    console.log(getCurrentOption);
    let cpyFilters = { ...filter };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilter(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  };

  const handleProductDetails = (getcurrentProductId) => {
    dispatch(fetcProductdetails(getcurrentProductId));
  };

  return (
  <div className="flex flex-col min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <FilterProduct filter={filter} handleFilter={handleFilter} />
        <div className="bg-background w-full rounded-lg shadow-sm">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-extrabold">All Products</h2>
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground">
                {productList?.length || 0} Products
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup
                    value={sort}
                    onValueChange={handleSort}
                  >
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
            {productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <div
                  key={productItem.id}
                  data-id={productItem.id}
                  className={`product-item ${
                    animatedProducts.includes(productItem.id) ? "slide-in" : ""
                  }`}
                >
                  <Shopping_Product_tile
                    handleProductDetails={handleProductDetails}
                    product={productItem}
                    HandleAddToCart={HandleAddToCart}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-muted-foreground">
                <Product_Not_Found Item={"Products"}></Product_Not_Found>
              </div>
            )}
          </div>
        </div>
        <Product_details_dialog
          open={openDetailDialog}
          setOpen={setOpenDetailsDialoge}
          product_Details={productDetails}
        ></Product_details_dialog>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ShoppingListing;
