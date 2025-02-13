import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import "./layout.css";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/auth/login";
  const isForgotPage = location.pathname === "/auth/forgot";
  const isOtpPage = location.pathname === "/auth/otp";
  const isResetPasswordPage = location.pathname === "/auth/reset-password";

 
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);


  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen w-full relative font-sans bg-[#F7F7F7] text-[#000000]">
     
      {isLargeScreen && (
        <div className="flex items-center justify-center w-1/2 px-12 relative overflow-hidden z-10 left-section">
          <ul className="circles">
            {[...Array(10)].map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
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
            ) : isResetPasswordPage ? (
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
      )}
      <div
        className={`flex items-center justify-center bg-[#F7F7F7] px-12 py-16 sm:px-16 lg:px-20 z-10 shadow-md frosted-glass ${
          isLargeScreen ? "w-2/3" : "w-full"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
