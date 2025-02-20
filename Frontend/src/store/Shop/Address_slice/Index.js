import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { act } from "react";
const initialState = {
  isLoading: false,
  addressList: [],
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const addNewAddress = createAsyncThunk(
  "/address/addNewAddress",
  async (formData) => {
    const response = await axios.post(
      `${BASEURL}/api/shop/address/add`,
      formData
    );
    return response.data;
  }
);
export const fetchAllAddress = createAsyncThunk(
    "/address/fetchAllAddress",
    async (userId) => {
      const response = await axios.get(
       `${BASEURL}/api/shop/address/get/${userId}`,
      );
      return response.data;
    }
  );
  export const editAddress = createAsyncThunk(
    "/address/editAddress",
    async ({userId,addressId,formData}) => {
      const response = await axios.put(
        `${BASEURL}/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
      return response.data;
    }
  );
  export const deleteAddress = createAsyncThunk(
    "/address/deleteAddress",
    async ({userId,addressId}) => {
      const response = await axios.delete(
        `${BASEURL}/api/shop/address/delete/${userId}/${addressId}`,
      );
      return response.data;
    }
  );
const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: () => {},
  extraReducers: (builder) => {
    builder.addCase(addNewAddress.pending,(state)=>{
        state.isLoading=true
    }).addCase(addNewAddress.fulfilled,(state,action)=>{
        state.isLoading=false
        // state.addressList=action.payload.data
    }).addCase(addNewAddress.rejected,(state)=>{
        state.isLoading=false
        // state.addressList=[]
    }).addCase(fetchAllAddress.pending,(state)=>{
        state.isLoading=true
    }).addCase(fetchAllAddress.fulfilled,(state,action)=>{
        state.isLoading=false,
        state.addressList=action.payload.data
    }).addCase(fetchAllAddress.rejected,(state)=>{
        state.isLoading=false,
        state.addressList=[]
    })
  },
});
export default addressSlice.reducer