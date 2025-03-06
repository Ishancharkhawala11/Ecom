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
  "https://ecomshopease.netlify.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control",
  })
);

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.status(200).send();
});

app.use((req, res, next) => {
  console.log("Incoming Request:", req.method, req.url);
  console.log("Origin:", req.headers.origin);
  next();
});

app.use(cookieParser());
app.use(express.json());

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

mongoose
  .connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log("MongoDB Error:", error));

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
