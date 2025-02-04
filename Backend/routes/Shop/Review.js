const express = require("express");
const {
  addProductReview,getProductReviews
} = require("../../controllers/shop/Review_controller");
const router = express.Router();
// router.post("/add", addToCart);
router.get("/:productId", getProductReviews);
router.post('/add',addProductReview)

module.exports = router;
