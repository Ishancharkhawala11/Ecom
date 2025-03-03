import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  ShirtIcon,
  BabyIcon,
  UmbrellaIcon,
  WatchIcon,
  Codepen,
  Shirt,
  WashingMachine,
  ShoppingBasket,
  Airplay,
  Images,
  Heater,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllfillteredProducts,
  fetcProductdetails,
} from "@/store/Shop/Product_slice";
import Shopping_Product_tile from "@/components/shopping/Product_tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import { useToast } from "@/hooks/use-toast";
import Product_details_dialog from "@/components/shopping/Product_details";
import { getFeatureImages } from "@/store/common";
import Footer from "../../components/shopping/Footer";
import { CgAdidas } from "react-icons/cg";
import { SiNike, SiPuma, SiZara } from "react-icons/si";
import Hm from '../../assets/hm.png'
import levis from '../../assets/levis.png'
import Shoes from '../../assets/shoes.png'
import Women from '../../assets/women.png'

const categoriesWithIcon = [
  { id: "men", label: "Men", icon: <ShirtIcon className="w-12 h-12 text-primary" />},
  { id: "women", label: "Women", icon: <img src={Women} alt="Women" className="w-12 h-12" />},
  { id: "kids", label: "Kids", icon: <BabyIcon className="w-12 h-12 text-primary" />},
  { id: "accessories", label: "Accessories", icon: <WatchIcon className="w-12 h-12 text-primary" />},
  { id: "footwear", label: "Footwear", icon: <img src={Shoes} alt="Footwear" className="w-12 h-12" /> },
];

const brandWithIcons = [
  { id: "nike", label: "Nike", icon: <SiNike className="w-12 h-12 text-primary" /> },
  { id: "adidas", label: "Adidas", icon: <CgAdidas className="w-12 h-12 text-primary" /> },
  { id: "puma", label: "Puma", icon: <SiPuma className="w-12 h-12 text-primary" /> },
  { id: "levi", label: "Levi's", icon: <img src={levis} alt="Levi's" className="w-12 h-12" /> },
  { id: "zara", label: "Zara", icon: <SiZara className="w-12 h-12 text-primary" /> },
  { id: "h&m", label: "H&M", icon: <img src={Hm} alt="H&M" className="w-12 h-12" /> },
];

const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector((state) => state.shopProduct);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [openDetailDialog, setOpenDetailsDialoge] = useState(false);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const slides = featureImageList.map((img) => img.image);
  const { cartItems } = useSelector((state) => state.shopCart);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [featureImageList.length]);

  useEffect(() => {
    if (productDetails !== null) {
      setOpenDetailsDialoge(true);
    }
  }, [productDetails]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllfillteredProducts({
      filterParams: {},
      sortParams: "price-lowtohigh",
    }));
  }, []);

  const handleProductDetails = (getcurrentProductId) => {
    dispatch(fetcProductdetails(getcurrentProductId));
  };

  const HandleAddToCart = (getcurrentProductId, getTotalStock) => {
    let getCartItems = cartItems.items || [];
    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getcurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    dispatch(addToCart({
      userId: user.id,
      productId: getcurrentProductId,
      quantity: 1,
    })).then((data) => {
      if (data.payload.success) {
        dispatch(fetchToCart(user.id));
        toast({
          title: "Product has been added in cart",
        });
      }
    });
  };

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFiletrs = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFiletrs));
    navigate(`/shop/listing`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0 ? (
          featureImageList.map((slide, index) => (
            <img
              src={slide.image}
              key={index}
              className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-fill md:object-cover transition-opacity duration-1000`}
              alt={`Slide ${index + 1}`}
            />
          ))
        ) : null}
        <Button
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length)
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
          }
          variant="outline"
          size="icon"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                {categoryItem.icon}
                  <span className="font-bold mt-2">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandWithIcons.map((BrandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(BrandItem, "brand")}
                key={BrandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  {BrandItem.icon}
                  <span className="font-bold mt-2">{BrandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

     
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Feature</h2>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((product, index) =>
                  index <= 3 ? (
                    <Shopping_Product_tile
                      product={product}
                      handleProductDetails={handleProductDetails}
                      HandleAddToCart={HandleAddToCart}
                      key={product.id}
                    />
                  ) : null
                )
              : null}
          </div>
        </div>
      </section>

      <Product_details_dialog
        open={openDetailDialog}
        setOpen={setOpenDetailsDialoge}
        product_Details={productDetails}
      />

      <Footer />
    </div>
  );
};

export default ShoppingHome;
