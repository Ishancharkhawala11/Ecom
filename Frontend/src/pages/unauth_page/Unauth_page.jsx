import React, { useState, useEffect } from "react"; // Added useEffect import
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Unauth_page = () => {
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth < 1024); // Initial check

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth < 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
      <AlertTriangle className="w-32 h-32 text-gray-500" /> {/* Large Icon */}
      <h1 className="mt-6 text-4xl font-bold">404 - Page Not Found</h1>
      <p className={`mt-2 text-lg text-gray-600 ${isLargeScreen ? "pl-3" : ""}`}>
        Oops! You are not admin.
      </p>
      <Button
        onClick={() => navigate("/shop/home")}
        className="mt-6 px-6 py-3 bg-black text-white text-lg font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
      >
        Go to Home
      </Button>
    </div>)
}

export default Unauth_page