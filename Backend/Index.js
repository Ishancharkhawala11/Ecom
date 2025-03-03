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

// Allowed origins for CORS
const allowedOrigins = [
  "https://ecom-eight-xi.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle Preflight Requests
app.options("*", cors());

// Global CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", allowedOrigins[0]); // Set to your frontend URL
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(cookieParser());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

// Define Routes
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

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
