import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const initialState={
    isLoading:false,
    searchResults:[]
}
export const getSearchResults = createAsyncThunk(
    "/shop/getSearchResults",
    async (keyword) => {
      const response = await axios.get(
        `http://localhost:5000/api/shop/search/get/${keyword}`
      );
      return response.data;
    }
  );
const searchSlice=createSlice({
    name:'searchSlice',
    initialState,
    reducers:{
        resetResults:(state)=>{
            state.searchResults=[]
        }
    },
    extraReducers:(builder)=>{
        builder.addCase(getSearchResults.pending,(state)=>{
            state.isLoading=true
        }).addCase(getSearchResults.fulfilled,(state,action)=>{
            state.isLoading=false
            state.searchResults=action.payload.message
        }).addCase(getSearchResults.rejected,(state)=>{
            state.isLoading=true
            state.isLoading=[]
        })
    }
})
export const {resetResults}=searchSlice.actions
export default searchSlice.reducer