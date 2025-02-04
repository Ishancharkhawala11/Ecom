const express = require("express");
const {
  searchProducts
} = require("../../controllers/shop/search_controller");
const router = express.Router();
// router.post("/add", addToCart);
router.get("/get/:keyword", searchProducts);

module.exports = router;
