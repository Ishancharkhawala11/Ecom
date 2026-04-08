const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

function validateProductPayload(body) {
  const errors = [];
  let price = null;
  let compareAtPrice = null;
  if (body.price != null) {
    price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) errors.push("Price must be a non-negative number");
  }
  if (body.compareAtPrice != null && body.compareAtPrice !== "") {
    compareAtPrice = Number(body.compareAtPrice);
    if (!Number.isFinite(compareAtPrice) || compareAtPrice < 0) {
      errors.push("Compare-at price must be a non-negative number");
    }
  }
  if (Number.isFinite(price) && Number.isFinite(compareAtPrice) && price >= compareAtPrice) {
    errors.push("Sale price must be less than compare-at price");
  }
  if (body.stock != null) {
    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 0) errors.push("Stock must be a non-negative number");
  }
  return errors;
}

router.get("/", async (_req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const errors = validateProductPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(". ") });
    const created = await Product.create(req.body);
    return res.status(201).json(created);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid product data" });
  }
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const errors = validateProductPayload(req.body);
    if (errors.length) return res.status(400).json({ message: errors.join(". ") });
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) return res.status(404).json({ message: "Product not found" });
    return res.json(updated);
  } catch (error) {
    return res.status(400).json({ message: error.message || "Invalid product data" });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted" });
});

module.exports = router;
