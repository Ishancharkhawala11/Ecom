const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");

dotenv.config();
const app = express();
const server = http.createServer(app);
const { initializeSocket } = require("./controllers/admin/Notification");
initializeSocket(server);

const allowedOrigins = [
  "https://ecom-beta-taupe.vercel.app",
  "https://ecom-ishans-projects-75140e8b.vercel.app",
  "https://ecom-git-main-ishans-projects-75140e8b.vercel.app",
  "http://localhost:5173",
];

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("Incoming Request Origin:", req.headers.origin);
  next();
});

// CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      console.log("CORS Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        console.log("CORS Allowed:", origin);
        callback(null, true);
      } else {
        console.warn("CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control"
  })
);

// Properly handle OPTIONS preflight requests
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    return res.sendStatus(204);
  }
  res.status(403).json({ message: "CORS Policy Violation" });
});

// Middleware
app.use(cookieParser());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is running..."));

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

// Using Routes
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

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
