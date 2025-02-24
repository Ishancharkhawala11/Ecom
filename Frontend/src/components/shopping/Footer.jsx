import { Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-6 lg:px-12 text-center">
        
        {/* Social Icons in a Horizontal Bar */}
        <div className="flex justify-center space-x-8 border-b border-gray-700 pb-6">
          <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
            <Facebook className="w-6 h-6" />
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
            <Instagram className="w-6 h-6" />
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition">
            <Linkedin className="w-6 h-6" />
          </a>
        </div>

        {/* Content Below */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-bold">ShopEase</h2>
            <p className="text-sm text-gray-400 mt-2">
              Your one-stop destination for the best shopping experience.
            </p>
          </div>

          {/* Quick Links - 2x2 Grid */}
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <a href="#" className="text-gray-500 hover:text-white transition">About Us</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Contact</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Help Center</a>
              <a href="#" className="text-gray-500 hover:text-white transition">Shipping Policy</a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-gray-500 text-sm mt-4 md:mt-0">
            <p>© 2025 ShopEase. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
