import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
const initialState={
    isLoading:false,
    productList:[],
}
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const addNewProduct=createAsyncThunk('/product/addnewproduct',async(formData)=>{
    const response=await  fetch(`${BASEURL}/api/admin/product/add`,{
       method:'POST',
       body:JSON.stringify(formData),
       headers:{
        "Content-Type":"application/json"
       }
    })
    const result=await response.json()
    return result;
})
export const fetchAllProducts=createAsyncThunk('/product/fetchAllProducts',async(formData)=>{
    const response=await  fetch(`${BASEURL}/api/admin/product/get`,{
       method:'GET',
    //    body:JSON.stringify(formData),
    //    headers:{
    //     "Content-Type":"application/json"
    //    }
    })
    const result=await response.json()
    return result.data;
})
export const EditProduct=createAsyncThunk('/product/EditProduct',async({id,formData})=>{
    const response=await  fetch(`${BASEURL}/api/admin/product/edit/${id}`,{
       method:'PUT',
       body:JSON.stringify(formData),
       headers:{
        "Content-Type":"application/json"
       }
    })
    const result=await response.json()
    return result;
})
export const DeleteProduct=createAsyncThunk('/product/deleteProduct',async(id)=>{
    const response=await  fetch(`${BASEURL}/api/admin/product/delete/${id}`,{
       method:'DELETE',
    //    body:JSON.stringify(formData),
    //    headers:{
    //     "Content-Type":"application/json"
    //    }
    })
    const result=await response.json()
    return result;
})
const AdmiproductSlice=createSlice({
    name:'adminProducts',
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(fetchAllProducts.pending,(state)=>{
            state.isLoading=true
        }).addCase(fetchAllProducts.fulfilled,(state,action)=>{
           console.log(action.payload)
            state.isLoading=false
            state.productList=action.payload
        }).addCase(fetchAllProducts.rejected,(state)=>{
            // console.log(action.payload)
             state.isLoading=false
             state.productList=[]
         })
    }

})
export default AdmiproductSlice.reducer