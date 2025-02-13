import React from 'react';
// import pageNotFound from '../../assets/pageNotFound.png'
import { AlertTriangle } from 'lucide-react';
import { useNavigate } from "react-router-dom"; 
import { Button } from '@/components/ui/button';
const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-800">
    <AlertTriangle className="w-32 h-32 text-gray-500" /> {/* Large Icon */}
    <h1 className="mt-6 text-4xl font-bold">404 - Page Not Found</h1>
    <p className="mt-2 text-lg text-gray-600">
      Oops! The page you are looking for does not exist.
    </p>
    <Button
        onClick={() => navigate("/shop/home")}
        className="mt-6 px-6 py-3 bg-black text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        Go to Home
      </Button>
  </div>

  );
};

export default NotFound