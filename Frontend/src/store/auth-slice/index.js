import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  OtpSent:false,
};
const BASEURL=import.meta.env.VITE_BACKEND_APIS_ROUTE;

export const registerUser = createAsyncThunk(
  "/auth/register",

  async (formData) => {
    const response = await fetch(`${BASEURL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include", // Equivalent to 'withCredentials: true' in axios
    });

    if (!response.ok) {
      throw new Error("Failed to register");
    }

    return response.json();
  }
);

export const loginUser = createAsyncThunk(
  "/auth/login",

  async (formData) => {
    const response = await fetch(`${BASEURL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include", // Equivalent to 'withCredentials: true' in axios
    });

    if (!response.ok) {
      console.log(response.json())
      throw new Error("Failed to login");
    }

    return response.json();
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",

  async () => {
    const response = await fetch(`${BASEURL}/api/auth/logout`, {
      method: "POST",
      
      credentials: "include", // Equivalent to 'withCredentials: true' in axios
    });

    if (!response.ok) {
      throw new Error("Failed to logout");
    }

    return response.json();
  }
);

export const checkAuth = createAsyncThunk(
  "/auth/checkauth",

  async () => {
    const response = await fetch(`${BASEURL}/api/auth/check-auth`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json" // Avoid unnecessary headers
      },
      credentials: "include", // Equivalent to 'withCredentials: true' in axios
    });

    if (!response.ok) {
      throw new Error("Failed to check authentication");
    }

    return response.json();
  }
);
export const forgotPassword=createAsyncThunk('auth/forgot',async(email)=>{
  const response=await axios.post(`${BASEURL}/api/auth/forgot`,email)
  return response.data;
})
export const verifyOtp=createAsyncThunk('auth/verify',async({formData})=>{
  const response=await axios.post(`${BASEURL}/api/auth/verify`,formData)
  return response.data
})
export const resetPass=createAsyncThunk('auth/resetPass',async(formData)=>{
  const response=await axios.post(`${BASEURL}/api/auth/reset`,formData)
  return response.data
})
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {},
    clearOtpState: (state) => {
      state.OtpSent = false;
      // state.otpError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      }).addCase(forgotPassword.pending, (state, action) => {
        state.isLoading = true;
       state.OtpSent=false;
       state.isAuthenticated=false
       state.OtpSent=false
      //  state.OtpData=null
       
      })
      .addCase(forgotPassword.rejected, (state) => {
        state.isLoading = false;
        state.OtpSent=false;
        state.isAuthenticated=false;
        state.OtpSent=false

        // state.user = null;
        // state.isAuthenticated = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.OtpSent = true;
        state.isAuthenticated = false;
        state.OtpSent=true
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated=false
      })
      .addCase(verifyOtp.fulfilled, (state, ) => {
      state.isLoading=false;
      state.isAuthenticated=false
        
      })
      .addCase(verifyOtp.rejected, (state) => {
      state.isLoading=false
      state.isAuthenticated=false
      })
      .addCase(resetPass.pending, (state) => {
        state.isLoading = true;
        state.isAuthenticated=false
      })
      .addCase(resetPass.fulfilled, (state, ) => {
      state.isLoading=false;
      state.isAuthenticated=false
        
      })
      .addCase(resetPass.rejected, (state) => {
      state.isLoading=false
      state.isAuthenticated=false
      })
  },
});

export const { setUser,clearOtpState } = authSlice.actions;
export default authSlice.reducer;
