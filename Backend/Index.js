const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth_routes");
const adminProductsRouter = require("./routes/admin/product_route");
const shopProducts = require("./routes/Shop/products_routes");
const shopCartRouter = require("./routes/Shop/Cart");
const AddressRouter = require("./routes/Shop/Address_routes");
const OrderRouter = require("./routes/Shop/Order");
const AdminOrderRouter = require("./routes/admin/order_route");
const shopSearchRouter = require("./routes/Shop/Seach_routes");
const shopReviewRouter = require("./routes/Shop/Review");
const featureRouter = require("./routes/common/feature_route");
const notification = require("./routes/admin/notification");

const app = express();
const http = require("http");
const { initializeSocket } = require("./controllers/admin/Notification");
require("dotenv").config();
const server = http.createServer(app);
initializeSocket(server);

// ✅ CORS Configuration (Final Fix)
app.use(
  cors({
    origin: "https://ecom-eight-xi.vercel.app", // Your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allows cookies & authentication headers
  })
);

// ✅ Handle Preflight Requests (OPTIONS)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://ecom-eight-xi.vercel.app");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // Preflight request successful
  }

  next();
});

// ✅ Debugging Log for Incoming Requests
app.use((req, res, next) => {
  console.log("Incoming Request Origin:", req.headers.origin);
  next();
});

app.use(cookieParser());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((error) => console.log("❌ MongoDB connection error:", error));

app.use("/api/auth", authRouter);
app.use("/api/admin/product", adminProductsRouter);
app.use("/api/shop/product", shopProducts);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", AddressRouter);
app.use("/api/shop/order", OrderRouter);
app.use("/api/admin/orders", AdminOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/reviews", shopReviewRouter);
app.use("/api/common/feature", featureRouter);
app.use("/api/admin", notification);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
