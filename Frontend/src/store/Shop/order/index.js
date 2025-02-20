import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  mailSending:true,
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const createNewOrder = createAsyncThunk(
  "/Order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `${BASEURL}/api/shop/order/create`,
      orderData
    );
    return response.data;
  }
);
export const capturePayment = createAsyncThunk(
  "/Order/capturePayment",
  async ({orderId, paymentId, payerId }) => {
    const response = await axios.post(
      `${BASEURL}/api/shop/order/capture`,
      { orderId, paymentId, payerId }
    );
    return response.data;
  }
);
export const sendEmail = createAsyncThunk(
  "/Order/sendEmail",
  async ({orderId,email}) => {
    const response = await axios.post(
      `${BASEURL}/api/shop/order/mail`,
      { email,orderId }
    );
    return response.data;
  }
);
export const getAllOrdersByUserId = createAsyncThunk(
  "/Order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `${BASEURL}/api/shop/order/list/${userId}`
    );
    return response.data;
  }
);
export const getAllOrderDetails = createAsyncThunk(
  "/Order/getAllOrderDetails",
  async (id) => {
    const response = await axios.get(
      `${BASEURL}/api/shop/order/details/${id}`
    );
    return response.data;
  }
);
const shopping_order_slice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetSetOrderDetails:(state)=>{
        state.orderDetails=null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem(
          "current_order_id",
          JSON.stringify(action.payload.orderId)
        );
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      }).addCase(capturePayment.fulfilled)
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      }).addCase(getAllOrdersByUserId.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderList=action.payload.data
      }).addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList=[]
      }) .addCase(getAllOrderDetails.pending, (state) => {
        state.isLoading = true;
      }).addCase(getAllOrderDetails.fulfilled, (state,action) => {
        state.isLoading = false;
        state.orderDetails=action.payload.data
      }).addCase(getAllOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails=null
      }).addCase(sendEmail.fulfilled, (state,action) => {
        // state.isLoading = false;
        state.mailSending=false,
        state.orderDetails=action.payload.data
      }).addCase(sendEmail.rejected, (state) => {
        // state.isLoading = false;
        // state.orderDetails=null
        state.mailSending=false
      })
  },
});
export const {resetSetOrderDetails}=shopping_order_slice.actions
export default shopping_order_slice.reducer;
