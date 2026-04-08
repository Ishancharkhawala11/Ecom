const express = require("express");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const Notification = require("../models/Notification");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, adminOnly, async (_req, res) => {
  const [userCount, productCount, orderCount, revenueData, unreadNotifications] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
    Notification.countDocuments({ read: false })
  ]);

  res.json({
    userCount,
    productCount,
    orderCount,
    totalRevenue: revenueData[0]?.total || 0,
    unreadNotifications
  });
});

module.exports = router;
