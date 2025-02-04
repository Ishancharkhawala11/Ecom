import { configureStore } from "@reduxjs/toolkit"; // Use ES6 import
import authReducer from "./auth-slice"; // Ensure this matches the export in 'auth-slice.js'
import AdmiproductSlice from './admin/product-slice'
import ShopProductSlice from './Shop/Product_slice'
import ShopCartSlice from './Shop/Cartslice/index'
import ShopAddressSlice from './Shop/Address_slice/Index'
import ShopOrderSlice from './Shop/order/index'
import AdminOrderSlice from './admin/order-slice/index'
import ShopSearchSlice from './Shop/search_slice/index'
import ShopReviewSlice from './Shop/Review_slice/index'
import commonFeatureSlice from './common/index'
const store = configureStore({
  reducer: {
    auth: authReducer, 
    adminProduct:AdmiproductSlice,
    shopProduct:ShopProductSlice,
    shopCart:ShopCartSlice,
    shopAddress:ShopAddressSlice,
    shopOrder:ShopOrderSlice,
    adminOrder:AdminOrderSlice,
    shopSearch:ShopSearchSlice,
    shopReview:ShopReviewSlice,
    commonFeature:commonFeatureSlice
  },
});

export default store; // Export the store for use in your application
