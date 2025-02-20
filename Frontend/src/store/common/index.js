
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  featureImageList: [],
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const getFeatureImages = createAsyncThunk(
  "/order/getFeatureImages",
  async () => {
    const response = await axios.get(
      `${BASEURL}/api/common/feature/get`
    );

    return response.data;
  }
);
export const deleteFeatureImage = createAsyncThunk(
  "/order/deleteFeatureImage",
  async (id) => {
    const response = await axios.delete(`${BASEURL}/api/common/feature/delete/${id}`);
    return response.data;
  }
);
export const addFeatureImage = createAsyncThunk(
  "/order/addFeatureImage",
  async (image) => {
    const response = await axios.post(
      `${BASEURL}/api/common/feature/add`,
      { image }
    );

    return response.data;
  }
);

const commonSlice = createSlice({
  name: "commonSlice",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(deleteFeatureImage.fulfilled, (state, action) => {
        state.featureImageList = state.featureImageList.filter(
          (image) => image._id !== action.meta.arg
        );
      });
  },
});

export default commonSlice.reducer;
