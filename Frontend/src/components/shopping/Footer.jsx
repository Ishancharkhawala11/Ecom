import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const linkdinLink = import.meta.env.VITE_LINKDIN;
  const instagramLink = import.meta.env.VITE_INSTAGRAM;
  const facebookLink = import.meta.env.VITE_FACEBOOK;
  const gmail = import.meta.env.VITE_GMAIL;

  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center md:text-left">
          {/* Company Info */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold">ShopEase</h2>
            <p className="text-sm text-gray-400">
              Your one-stop shop for the best deals and prices.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/shop/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/shop/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/shop/policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Get in Touch</h3>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-400 hover:text-white">
              <Mail className="w-5 h-5" />
              <Link to={gmail} target="_blank" rel="noopener noreferrer">
                support@shopease.com
              </Link>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3 text-gray-400 mt-2">
              <Phone className="w-5 h-5" />
              <span>+1 234 567 890</span>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-5">
              <Link to={facebookLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link to={instagramLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link to={linkdinLink} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 mt-6 pt-3 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} ShopEase. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;