import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const Check_auth = ({ isAuthenticated, user, children }) => {
  const location = useLocation();
  const { OtpSent } = useSelector((state) => state.auth);
if(
 location. pathname.includes("/otp") || 
 location. pathname.includes("/reset-password")
) {
  console.log(OtpSent,'otp');
  
  if (!OtpSent) {
    return <Navigate to="/auth/login" />;
  }
}

  if (!isAuthenticated && !(location.pathname.includes("/login") || location.pathname.includes("/register") ||location.pathname.includes('/forgot') ||location.pathname.includes("/otp")|| location.pathname.includes('/reset-password')) ) {
    return <Navigate to="/auth/login" />;
  }

  if (isAuthenticated && (location.pathname.includes("/login") || location.pathname.includes("/register") ||location.pathname.includes('/forgot')||location.pathname.includes("/otp")|| location.pathname.includes('/reset-password'))) {
    if (user?.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else {
      return <Navigate to="/shop/home" />;
    }
  }

  if (isAuthenticated && user?.role !== "admin" && location.pathname.includes("admin") || location.pathname==='/shop') {
    return <Navigate to="/unauth-page" />;
  }

  if (isAuthenticated && user?.role === "admin" && location.pathname.includes("shop")) {
    return <Navigate to="/admin/dashboard" />;
  }

  return <>{children}</>;
};

export default Check_auth;
