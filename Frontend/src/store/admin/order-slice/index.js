import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// import { build } from "vite";
const initialState={
    isLoading:false,
    orderList:[],
    orderDetails:null
}
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const getAllOrdersForAdmin = createAsyncThunk(
    "/Order/getAllOrdersForAdmin",
    async () => {
      const response = await axios.get(
      `${BASEURL}/api/admin/orders/get`
      );
      return response.data;
    }
  );
  export const updateOrderStatus = createAsyncThunk(
    "/Order/updateOrderStatus",
    async ({id,orderStatus}) => {
      const response = await axios.put(
      `${BASEURL}/api/admin/orders/update/${id}`,{orderStatus}
      );
      return response.data;
    }
  );
  export const getAllOrderDetailsForAdmin = createAsyncThunk(
    "/Order/getAllOrderDetailsForAdmin",
    async (id) => {
      const response = await axios.get(
        `${BASEURL}/api/admin/orders/details/${id}`
      );
      return response.data;
    }
  );
  export const changeOrderStatus=createAsyncThunk('/Order/changOrderStatus',async(orderId)=>{
    const response=await axios.put(`${BASEURL}/api/admin/orders/status`,{orderId})
    return response.data
  })
  const adminOrderSlice = createSlice({
    name: 'adminOrderSlice',
    initialState,
    reducers: {
      resetOrderDetails:(state)=>{
        state.orderDetails=null
      }
    },
    extraReducers: (builder) => {
      builder
        .addCase(getAllOrdersForAdmin.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
          state.isLoading = false;
            // Check if the 'success' field is true
            state.orderList = action.payload.data;  // Use the 'data' from the response
         
        })
        .addCase(getAllOrdersForAdmin.rejected, (state) => {
          state.isLoading = false;
          state.orderList = [];
        })
        .addCase(getAllOrderDetailsForAdmin.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(getAllOrderDetailsForAdmin.fulfilled, (state, action) => {
          state.isLoading = false;
        
            state.orderDetails = action.payload.data;
          
        })
        .addCase(getAllOrderDetailsForAdmin.rejected, (state) => {
          state.isLoading = false;
          state.orderDetails = null;
        })
        .addCase(changeOrderStatus.pending, (state) => {
          state.isLoading = true;
        })
        .addCase(changeOrderStatus.fulfilled, (state, action) => {
          state.isLoading = false;
        
          if (action.payload.success) {
            state.orderDetails = action.payload.data; 
          }
          
        })
        .addCase(changeOrderStatus.rejected, (state) => {
          state.isLoading = false;
          state.orderDetails = null;
        });
    },
  });
  export const {resetOrderDetails}=adminOrderSlice.actions
export default adminOrderSlice.reducer