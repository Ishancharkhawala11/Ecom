import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios';
const initialState={
    isLoading:false,
    reviews:[]
}
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const addReview = createAsyncThunk(
    "/shop/addReview",
    async (data) => {
      const response = await axios.post(
        `${BASEURL}/api/shop/reviews/add`,data
      );
      return response.data;
    }
  );
  export const getReviews = createAsyncThunk(
    "/shop/getReviews",
    async (productId) => {
      const response = await axios.get(
        `${BASEURL}/api/shop/reviews/${productId}`
      );
      return response.data;
    }
  );
const reviewSlice=createSlice({
    name:'reviewSlice',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getReviews.pending,(state)=>{
            state.isLoading=true
        }). addCase(getReviews.fulfilled,(state,action)=>{
            state.isLoading=false,
            state.reviews=action.payload.data
        }). addCase(getReviews.rejected,(state)=>{
            state.isLoading=false
            state.reviews=[]
        })
    }
})
export default reviewSlice.reducer