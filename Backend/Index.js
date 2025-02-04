const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth_routes"); 
const adminProductsRouter=require('./routes/admin/product_route')
const shopProducts=require('./routes/Shop/products_routes')
const shopCartRouter=require('./routes/Shop/Cart')
const AddressRouter=require('./routes/Shop/Address_routes')
const OrderRouter=require('./routes/Shop/Order')
const AdminOrderRouter=require('./routes/admin/order_route')
const shopSearchRouter=require('./routes/Shop/Seach_routes')
const shopReviewRouter=require('./routes/Shop/Review')
const featureRouter=require('./routes/common/feature_route')
const app = express();


app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Expires', 'Pragma'],
    credentials: true,
}));


app.use(cookieParser());
app.use(express.json()); 

mongoose
  .connect("mongodb+srv://ishan11012003:OVhgSt7FGum5rl1F@cluster0.jso1t.mongodb.net/")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

app.use('/api/auth', authRouter);
app.use('/api/admin/product',adminProductsRouter)
app.use('/api/shop/product',shopProducts)
app.use('/api/shop/cart',shopCartRouter)
app.use('/api/shop/address',AddressRouter)
app.use('/api/shop/order',OrderRouter)
app.use('/api/admin/orders',AdminOrderRouter)
app.use('/api/shop/search',shopSearchRouter)
app.use('/api/shop/reviews',shopReviewRouter)
app.use('/api/common/feature',featureRouter)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
