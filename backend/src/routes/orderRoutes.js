const express = require("express");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/auth");
const { finalizeShopOrder } = require("../services/orderService");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { items, shippingAddress, addressId } = req.body;
    const order = await finalizeShopOrder(req.user._id, items, {
      shippingAddress,
      addressId
    });
    return res.status(201).json(order);
  } catch (error) {
    const code = error.statusCode || 500;
    return res.status(code).json({ message: error.message });
  }
});

router.get("/my-orders", protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("items.product", "name imageUrl")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.delete("/my-orders", protect, async (req, res) => {
  const result = await Order.deleteMany({ user: req.user._id });
  res.json({ deletedCount: result.deletedCount });
});

router.get("/", protect, adminOnly, async (_req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .populate("items.product", "name")
    .sort({ createdAt: -1 });
  res.json(orders);
});

router.patch("/:id/status", protect, adminOnly, async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return res.status(404).json({ message: "Order not found" });

  await Notification.create({
    user: order.user,
    title: "Order update",
    message: `Your order ${order._id} is now ${status}.`,
    type: "order"
  });

  res.json(order);
});

module.exports = router;
