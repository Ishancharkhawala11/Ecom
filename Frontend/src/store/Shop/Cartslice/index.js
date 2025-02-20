import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import { build } from "vite";
const initialState = {
  cartItems: [],
  isLoading: false,
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const addToCart = createAsyncThunk(
  "cart/addtoCart",
  async ({ userId, productId, quantity }) => {
    const response = await fetch(`${BASEURL}/api/shop/cart/add`, {
      method: "POST",
      body: JSON.stringify({ userId, productId, quantity }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    // console.log(response.json());
    const result = await response.json();
    return result || [];
  }
);
export const fetchToCart = createAsyncThunk(
  "cart/fetchtoCart",
  async (userId) => {
    const response = await fetch(
      `${BASEURL}/api/shop/cart/get/${userId}`,
      {
        method: "GET",
      }
    );
    // console.log(response.json());
    const result = await response.json();
    return result.data || [];
  }
);
export const deleteCart = createAsyncThunk(
  "cart/deletCart",
  async ({ userId, productId }) => {
    const response = await fetch(
      `${BASEURL}/api/shop/cart/${userId}/${productId}`,
      {
        method: "DELETE",
      }
    );
    // console.log(response.json());
    const result = await response.json();
    return result.data || [];
  }
);
export const updateCartQuantity = createAsyncThunk(
    "cart/updatetoCart",
    async ({userId,productId,quantity}) => {
      const response = await fetch(
        `${BASEURL}/api/shop/cart/update-cart`,
        {
          method: "PUT",
          body: JSON.stringify({userId, productId, quantity} ),
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      // console.log(response.json());
      const result = await response.json();
      return result.data|| [];
    }
  );
const shopCartSlice = createSlice({
  name: "shopCartSlice",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = []; 
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addToCart.pending,(state)=>{
        state.isLoading=true
    }).addCase(addToCart.fulfilled,(state,action)=>{
        state.isLoading=false
        state.cartItems=action.payload.data
        // console.log(action.payload,'addcase')
    }).addCase(addToCart.rejected,(state)=>{
        state.isLoading=false
        state.cartItems=[]
    }).addCase(fetchToCart.pending,(state)=>{
        state.isLoading=true
    }).addCase(fetchToCart.fulfilled,(state,action)=>{
        state.isLoading=false
        state.cartItems=action.payload
        // console.log(action.payload,'addcase')
    }).addCase(fetchToCart.rejected,(state)=>{
        state.isLoading=false
        state.cartItems=[]
    }).addCase(deleteCart.pending,(state)=>{
        state.isLoading=true
    }).addCase(deleteCart.fulfilled,(state,action)=>{
        state.isLoading=false
        state.cartItems=action.payload
        console.log(action.payload,'addcase')
    }).addCase(deleteCart.rejected,(state)=>{
        state.isLoading=false
        state.cartItems=[]
    }).addCase(updateCartQuantity.pending,(state)=>{
        state.isLoading=true
    }).addCase(updateCartQuantity.fulfilled,(state,action)=>{
        state.isLoading=false
        state.cartItems=action.payload
        console.log(action.payload,'addcase')
    }).addCase(updateCartQuantity.rejected,(state)=>{
        state.isLoading=false
        state.cartItems=[]
    });
}

});
export const { clearCart } = shopCartSlice.actions;
export default shopCartSlice.reducer