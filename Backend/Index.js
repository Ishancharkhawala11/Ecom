const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const http = require("http");
const { initializeSocket } = require("./controllers/admin/Notification");
const server = http.createServer(app);
initializeSocket(server);

// Allowed origins for CORS
const allowedOrigins = [
  "https://ecom-one-liart.vercel.app", // Production frontend domain
  "http://localhost:3000",
  "http://localhost:5173"
];

// Middleware to log incoming requests
app.use((req, res, next) => {
  console.log("Incoming Request Origin:", req.headers.origin);
  next();
});

// CORS Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      console.log("CORS Request Origin:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn("CORS Blocked:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);

// Handle Preflight Requests (OPTIONS)
app.options("*", (req, res) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Cache-Control");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(204);
  } else {
    res.status(403).json({ message: "CORS Policy Violation" });
  }
});

app.use(cookieParser());
app.use(express.json());

// Simple route to check if the API is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Importing Routes
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
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log("MongoDB error:", error));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
