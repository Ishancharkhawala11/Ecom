import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    productList: [],
    productDetails:null
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;
export const fetchAllfillteredProducts = createAsyncThunk(
    '/shop/fetchAllProduct',
    async ({filterParams,sortParams}) => {
        const query=new URLSearchParams(
            {
                ...filterParams,
                sortBy:sortParams
            }
        )
        console.log('Query string:', query.toString());

        console.log('Filter Params:', filterParams);
console.log('Sort Params:', sortParams);

        const response = await fetch(`${BASEURL}/api/shop/product/get?${query}`, {
            method: 'GET',
        });
        const result = await response.json();
       
        return result.data || []; 
    }
);
export const  fetcProductdetails= createAsyncThunk(
    '/shop/fetchProductDetails',
    async (id) => {
        
      
        const response = await fetch(`${BASEURL}/api/shop/product/get/${id}`, {
            method: 'GET',
        });
        const result = await response.json();
       
        return result.data || []; 
    }
);

const shoppingProductsSlice = createSlice({
    name: 'shoppingProducts',
    initialState,
    reducers: {
        setproductDetails:(state)=>{
            state.productDetails=null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllfillteredProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllfillteredProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.productList = action.payload; // Ensure this matches API data
                // console.log('Fulfilled payload:', action.payload);
            })
            .addCase(fetchAllfillteredProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.productList = [];
                // console.error('Fetch failed:', action.error.message);
            }).addCase(fetcProductdetails.pending,(state)=>{
                state.isLoading=true

            }).addCase(fetcProductdetails.fulfilled,(state,action)=>{
                state.isLoading=false,
                // console.log(action.payload,"redux")
                state.productDetails=action.payload
            }).addCase(fetcProductdetails.rejected,(state)=>{
                state.isLoading=false
                state.productList=null
            })
    },
});
export const {setproductDetails}=shoppingProductsSlice.actions
export default shoppingProductsSlice.reducer;
