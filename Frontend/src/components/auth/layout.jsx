import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";
  const isForgotPage = location.pathname === "/auth/forgot";
  const isOtpPage = location.pathname === "/auth/otp";

  return (
    <div className="flex min-h-screen w-full relative font-sans bg-black text-gray-900">
      {/* Left Side - Fixed Glass Readability */}
      <div className=" hidden lg:flex items-center justify-center w-3/5 px-16 relative overflow-hidden z-10 pure-black-bg">
        <div className={`deep-dark-glass text-center text-soft-white leading-relaxed shadow-lg rounded-lg p-10 
          ${isLoginPage ? "slide-in" : isForgotPage ? "fade-pop" : isOtpPage ? "fade-pop" : "flip-in"}`}>
          
          {isLoginPage ? (
            <>
              <h1 className="text-5xl font-extrabold tracking-wider">Welcome Back!</h1>
              <p className="mt-5 text-2xl animate-fadeIn delay-200 deep-shadow opacity-95">
                Sign in to continue your shopping journey.
              </p>
            </>
          ) : isForgotPage ? (
            <>
              <h1 className="text-5xl font-extrabold tracking-wider text-green-400">Forgot Your Password?</h1>
              <p className="mt-5 text-2xl opacity-95 animate-fadeIn delay-300 deep-shadow">
                Don't worry! Reset your password and get back in safely.
              </p>
            </>
          ) : isOtpPage ? (
            <>
              <h1 className="text-5xl font-extrabold tracking-wider text-green-400">Verify Your OTP</h1>
              <p className="mt-5 text-2xl opacity-95 animate-fadeIn delay-300 deep-shadow">
                Enter the OTP sent to your email or phone to continue.
              </p>
            </>
          ) : (
            <>
            <h1 className="text-5xl font-extrabold tracking-wider">
  Welcome to <span className="text-cyan-400 whitespace-nowrap">E-Commerce Shopping</span>
</h1>

              <p className="mt-5 text-2xl opacity-95 animate-fadeIn delay-300 deep-shadow">
                Explore thousands of products with exclusive deals.
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Stays White */}
      <div className="flex flex-1 items-center justify-center bg-white px-8 py-16 sm:px-10 lg:px-12 z-10 shadow-md rounded-l-3xl">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;