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
import { fetchAllfillteredProducts, fetcProductdetails } from "@/store/Shop/Product_slice";
import Shopping_Product_tile from "@/components/shopping/Product_tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import { useToast } from "@/hooks/use-toast";
import Product_details_dialog from "@/components/shopping/Product_details";
import { getFeatureImages } from "@/store/common";
const categoriesWithIcon = [
  { id: "men", label: "Men", icon: ShirtIcon },
  { id: "women", label: "Women", icon: CloudLightning },
  { id: "kids", label: "Kids", icon: BabyIcon },
  { id: "accessories", label: "Accessories", icon: WatchIcon },
  { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];
const brandWithIcons = [
  { id: "nike", label: "Nike", icon: Shirt },
  { id: "adidas", label: "Adidas", icon: WashingMachine },
  { id: "puma", label: "Puma", icon: ShoppingBasket },
  { id: "levi", label: "Levi's", icon: Airplay },
  { id: "zara", label: "Zara", icon: Images },
  { id: "h&m", label: "H&M", icon: Heater },
];
const ShoppingHome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const dispatch = useDispatch();
  const { productList,productDetails } = useSelector((state) => state.shopProduct);
  const { user } = useSelector((state) => state.auth);
  const navigate=useNavigate()
  const {toast}=useToast()
  const [openDetailDialog,setOpenDetailsDialoge]=useState(false)
  const {featureImageList}=useSelector(state=>state.commonFeature)
  const slides = featureImageList.map((img) => img.image);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [featureImageList.length]);
  useEffect(()=>{
    if(productDetails!==null){
      setOpenDetailsDialoge(true)
    }
   },[productDetails])
   useEffect(()=>{
         dispatch(getFeatureImages())
       },[dispatch])
  useEffect(() => {
    dispatch(
      fetchAllfillteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, []);
  //  console.log(productList,'Home page')
  const handleProductDetails=(getcurrentProductId)=>{
  console.log(getcurrentProductId,"details")
  dispatch(fetcProductdetails(getcurrentProductId))
  }
   const HandleAddToCart=(getcurrentProductId)=>{
      console.log(getcurrentProductId,'cart');
      dispatch(addToCart({userId:user.id, productId:getcurrentProductId, quantity:1})).then(data=>{
        // console.log(data)
        if(data.payload.success){
          dispatch(fetchToCart(user.id))
          toast({
            title:"Product has been added in cart"
          })
        }
        
      })
    }
  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFiletrs = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFiletrs));
    navigate(`/shop/listing`)
  };
  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Section */}
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length>0?
          featureImageList.map((slide, index) => (
          <img
            src={slide.image}
            key={index}
            className={`${
              index === currentSlide ? "opacity-100" : "opacity-0"
            } absolute top-0 left-0 w-full h-full object-fill md:object-cover transition-opacity duration-1000`}
            alt={`Slide ${index + 1}`}
          />
        )):null}
        <Button
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + slides.length) % slides.length
            )
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
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                key={categoryItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mt-4 text-primary" />
                  <span className="font-bold mt-2">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {brandWithIcons.map((BrandItem) => (
              <Card
               onClick={() =>
                  handleNavigateToListingPage(BrandItem, "brand")
                }
                key={BrandItem.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <BrandItem.icon className="w-12 h-12 mt-4 text-primary" />
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
      <Product_details_dialog open={openDetailDialog} setOpen={setOpenDetailsDialoge} product_Details={productDetails}></Product_details_dialog>
    </div>
  );
};

export default ShoppingHome;
