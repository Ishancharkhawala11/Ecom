const Order = require("../../models/Order");
const Product = require("../../models/product");
const Review = require("../../models/Review");
const addProductReview = async (req, res) => {
  try {
    const { productId, userId, userName, reviewmessage, reviewValue } =
      req.body;
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      orderStatus: "confirmed",
    });
    if (!order) {
      return res.json({
        success: false,
        message: "You need to purchase product first to review it",
      });
    }
    const checkExistingReview = await Review.findOne({
      productId,
      userId,
    });
    if (checkExistingReview) {
      return res.json({
        success: false,
        message: "You already reviewed this product! ",
      });
    }
    const newReview = new Review({
      productId,
      userId,
      userName,
      reviewmessage,
      reviewValue,
    });
    await newReview.save();
    const reviews = await Review.find({ productId });
    const totalReviewsLength = reviews.length;
    const averageReview =
      reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
      totalReviewsLength;
    await Product.findByIdAndUpdate(productId, { averageReview });
    res.status(201).json({
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId });
    res.status(200).json({
      success: true,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "error",
    });
  }
};
// const deleteUserReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;
//     const existReview = Review.findById(id);
//     if (!existReview) {
//       return res.json({
//         success: false,
//         message: "Review have not been available",
//       });
//     }
//     if(existReview.userId.toString()!==userId){
//       return res.json({
//         success:false,
//         message:"You can delete only your own reviews only"
//       })
//     }
//     await existReview.findByIdAndDelete(id)
//     const remainReviews=await Review.findById({productId:existReview.productId})
//     const totalReviews=remainReviews.length
//     const averageReviews=totalReviews>0?remainReviews.reduce((sum,review)=>sum-review.value,0):0
//     await Product.findByIdAndUpdate(existReview.productId,{averageReviews})
//     res.status(200).json({
//       success: true,
//       message: "Review deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the review",
//     });
//   }
// };
module.exports = { addProductReview, getProductReviews };
