import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Input } from "../ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchToCart } from "@/store/Shop/Cartslice";
import { useToast } from "@/hooks/use-toast";
import { setproductDetails } from "@/store/Shop/Product_slice";
import { Label } from "../ui/label";
import Star_ratting from "../common/Star_ratting";
import { addReview, getReviews } from "@/store/Shop/Review_slice";
import './ScrollBar.css';

const ProductDetailsDialog = ({ open, setOpen, product_Details }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [reviewMsg, setReviewMsg] = useState('');
  const [rating, setRating] = useState(0);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);

  useEffect(() => {
    if (product_Details) {
      dispatch(getReviews(product_Details._id));
    }
  }, [product_Details]);

  const handleRatingChange = (newRating) => setRating(newRating);

  const handleAddReview = () => {
    dispatch(addReview({
      productId: product_Details._id,
      userId: user.id,
      userName: user.userName,
      reviewmessage: reviewMsg,
      reviewValue: rating
    })).then(data => {
      if (data.payload.success) {
        setRating(0);
        setReviewMsg('');
        dispatch(getReviews(product_Details._id));
        toast({ title: 'Review Added Successfully' });
      } else {
        toast({ title: data.payload.message, variant: 'destructive' });
      }
    });
  };

  const handleAddToCart = (productId, totalStock) => {
    const getCartItems = cartItems.items || [];
    if (getCartItems.some(item => item.productId === productId && item.quantity + 1 > totalStock)) {
      toast({ title: "Cannot add more than available stock", variant: "destructive" });
      return;
    }
    dispatch(addToCart({ userId: user.id, productId, quantity: 1 }))
      .then((data) => {
        if (data.payload.success) {
          dispatch(fetchToCart(user.id));
          toast({ title: "Product added to cart" });
        }
      });
  };

  const handleDialogClose = () => {
    setOpen(false);
    dispatch(setproductDetails());
    setRating(0);
    setReviewMsg('');
  };

  const averageReview = reviews.length ? 
    reviews.reduce((sum, review) => sum + review.reviewValue, 0) / reviews.length 
    : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 sm:p-10 max-w-[70vw] h-auto max-h-[90vh] overflow-y-auto rounded-2xl">
        {/* Left - Product Image */}
        <div className="flex justify-center">
          <img src={product_Details?.image} alt={product_Details?.title} className="w-full lg:h-[580px] md:h-[400px]  max-w-md rounded-lg  shadow-lg" />
        </div>

        {/* Right - Product Details */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">{product_Details?.title}</h1>
          <p className="text-gray-600">{product_Details?.description}</p>
          <div className="flex items-center gap-3 text-2xl font-semibold text-red-600 justify-between">
            ${product_Details?.salePrice || product_Details?.price}
            {product_Details?.salePrice && (
              <p className="text-gray-500 line-through text-lg">${product_Details?.price}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Star_ratting rating={averageReview} />
            <span className="text-muted-foreground">({averageReview.toFixed(1)})</span>
          </div>

          {/* Add to Cart Button */}
          <Button className="w-full bg-black" onClick={() => handleAddToCart(product_Details._id, product_Details.totalStock)} disabled={product_Details?.totalStock <= 0}>
            {product_Details?.totalStock === 0 ? "Out of Stock" : "Add to Cart"}
          </Button>

          <Separator />

          {/* Reviews Section */}
          <div className="max-h-[250px] overflow-auto scrollbar-hide custom-scrollbar bg-slate-200 p-4">
            <h2 className="text-lg font-bold">Reviews</h2>
            <div className="space-y-3 mt-3">
              {reviews.length ? (
                reviews.map(review => (
                  <div key={review.id} className="p-3 border rounded-lg shadow-sm bg-gray-50 flex gap-3 m-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gray-800 text-white">
                        {review.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-bold text-sm">{review.userName}</h3>
                      <Star_ratting rating={review.reviewValue} />
                      <p className="text-gray-600 text-sm">{review.reviewmessage}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </div>

          {/* Add Review */}
          <div className="mt-4">
            <Label className="text-lg font-semibold">Write a Review</Label>
            <div className="mt-2"> <Star_ratting rating={rating} handleRatingChange={handleRatingChange} /></div>
           
            <Input value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} placeholder="Write your review..." className="mt-2 w-full" />
            <Button onClick={handleAddReview} disabled={!reviewMsg.trim()} className="mt-2 bg-green-600">Submit</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailsDialog;
