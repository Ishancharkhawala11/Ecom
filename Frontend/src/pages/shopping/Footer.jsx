import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          
          {/* Company Info */}
          <div>
            <h2 className="text-xl font-bold mb-2">ShopEase</h2>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the best deals and prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Get in Touch</h3>
            <p className="flex items-center justify-center md:justify-start text-gray-400">
              <Mail className="w-5 h-5 mr-2" /> support@shopease.com
            </p>
            <p className="flex items-center justify-center md:justify-start text-gray-400 mt-1">
              <Phone className="w-5 h-5 mr-2" /> +1 234 567 890
            </p>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
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
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
