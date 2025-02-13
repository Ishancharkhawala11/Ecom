import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";
  const isForgotPage = location.pathname === "/auth/forgot";
  const isOtpPage = location.pathname === "/auth/otp";
  const isResetPasswordPage = location.pathname === "/auth/reset-password"; // New condition

  return (
    <div className="flex min-h-screen w-full relative font-sans bg-[#F7F7F7] text-[#000000]">
  
      {/* Left Section with Floating Animation */}
      <div className="hidden lg:flex items-center justify-center w-1/3 px-12 relative overflow-hidden z-10 left-section">

        <ul className="circles">
          {[...Array(10)].map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>

        {/* Floating Text */}
        <div className="text-container">
          {isLoginPage ? (
            <>
              <h1>Welcome Back!</h1>
              <p>Sign in to continue your shopping journey.</p>
            </>
          ) : isForgotPage ? (
            <>
              <h1>Forgot Your Password?</h1>
              <p>Don't worry! Reset your password and get back in safely.</p>
            </>
          ) : isOtpPage ? (
            <>
              <h1>Verify Your OTP</h1>
              <p>Enter the OTP sent to your email or phone to continue.</p>
            </>
          ) : isResetPasswordPage ? ( // New block for Reset Password Page
            <>
              <h1>Reset Your Password</h1>
              <p>Enter your new password below and confirm it to secure your account.</p>
            </>
          ) : (
            <>
              <h1>Welcome to E-Commerce Shopping</h1>
              <p>Explore thousands of products with exclusive deals.</p>
            </>
          )}
        </div>
      </div>

      {/* Right Section - Form Area */}
      <div className="flex w-2/3 items-center justify-center bg-[#F7F7F7] px-12 py-16 sm:px-16 lg:px-20 z-10 shadow-md frosted-glass">
        <Outlet />
      </div>

    </div>
  );
};

export default Layout;
