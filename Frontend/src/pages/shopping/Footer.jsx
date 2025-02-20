import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 bottom-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold mb-3">ShopEase</h2>
            <p className="text-sm text-gray-400">
              Your one-stop destination for all shopping needs. Best deals, best prices, always!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Returns & Refunds</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Shipping Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </a>
             
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
          © 2025 ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
