import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { StarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import { useToast } from "@/hooks/use-toast";
import { setproductDetails } from "@/store/Shop/Product_slice";
import { Label } from "../ui/label";
import Star_ratting from "../common/Star_ratting";
import { addReview, getReviews } from "@/store/Shop/Review_slice";

const Product_details_dialog = ({ open, setOpen, product_Details }) => {
  const dispatch = useDispatch();
  // console.log(product_Details)
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [reviewMsg,setReviewMsg]=useState('')
  const [ratting ,setRatting]=useState(0)
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  // console.log(reviews,"reviews");
  
  const handleRatingChange=(getRatting)=>{
    setRatting(getRatting)
  }
  const handleAddReview=()=>{
    dispatch(addReview({
    productId:product_Details._id,
    userId:user.id,
    userName:user.userName,
    reviewmessage:reviewMsg,
    reviewValue:ratting})).then(data=>{
      if(data.payload.success){
        setRatting(0)
        setReviewMsg('')
       dispatch(getReviews(product_Details._id))
       toast({
        title:'Review Added successfully'
       })
      }else{
        toast({
          title:data.payload.message,
          variant:'destructive'
        })
      }
      // console.log(data);
      
    })
  }
  const HandleAddToCart = (getcurrentProductId,getTotalStock) => {
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
  const handleDialougeClose = () => {
    setOpen(false);
    dispatch(setproductDetails());
    setRatting(0)
    setReviewMsg('')
  };
  // console.log(product_Details, 'shopping User');
   useEffect(()=>{
      if(product_Details!=null){
        dispatch(getReviews(product_Details._id))
      }
   },[product_Details])
  //  console.log(reviews,'reviews');
  const averageReview= reviews && reviews.length>0?
  reviews.reduce((sum,reviewItem)=>sum+reviewItem.reviewValue,0)/reviews.length:0
  return (
    <Dialog open={open} onOpenChange={handleDialougeClose} className='rounded-3xl'>
   <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[80vw] h-[80vh] sm:h-auto max-h-screen overflow-y-auto rounded-3xl">

  
        <div className="relative overflow-hidden ">
          <img
            src={product_Details?.image}
            alt={product_Details?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-contain rounded-lg"
          ></img>
        </div>
        <div className="">
          <div>
            <h1 className="text-3xl font-extrabold">
              {product_Details?.title}
            </h1>
            <p className="text-muted-foreground lg:text-1xl  text-xl mb-5 mt-3">
              {product_Details?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                product_Details?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${product_Details?.price}
            </p>
            {product_Details?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                ${product_Details?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
            <Star_ratting rating={averageReview}/>
              
            </div>
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
          </div>
          <div className="mt-5 mb-5 w-full">
            {product_Details?.totalStock === 0 ? (
              <Button
                // onClick={() => HandleAddToCart(product_Details._id)}
                className="w-full opacity-60 cursor-not-allowed"
              >
                Out of stock
              </Button>
            ) : (
              <Button
                onClick={() => HandleAddToCart(product_Details._id,product_Details.totalStock)}
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
            {/* <Button onClick={()=>HandleAddToCart(product_Details._id)} className="w-full">Add to Cart</Button> */}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
            {
              reviews && reviews.length ?reviews.map(reviewItem=><div className="flex gap-4">
                <Avatar className="w-10 h-10 border text-white">
                  <AvatarFallback className=' bg-black'>{reviewItem.userName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{reviewItem.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                   <Star_ratting rating={reviewItem.reviewValue}></Star_ratting>
                  </div>
                  <p className="text-muted-foreground">
                    {reviewItem.
                      reviewmessage}
                  </p>
                </div>
              </div>):<h1>No reviews</h1>
            }
              
            </div>
            
            <div className="mt-10 flex gap-2 flex-col">
            <Label>Write a review</Label>
            <div className="flex gap-1">
            <Star_ratting rating={ratting} handleRatingChange={handleRatingChange}/>
            </div>
            
              <Input name='reviewMsg' value={reviewMsg} onChange={(event)=>setReviewMsg(event.target.value)} placeholder="write review" />
              <Button onClick={handleAddReview} disabled={reviewMsg.trim()===''}>submit</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Product_details_dialog;
