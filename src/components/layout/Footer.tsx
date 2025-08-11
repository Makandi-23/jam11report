import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-pale border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About & Contact */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">J</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Jamii<span className="text-primary">report</span>
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              Empowering communities to report issues, track progress, and work together for a better neighborhood.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>info@jamiireport.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>Nairobi, Kenya</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/about" className="block text-gray-600 hover:text-primary transition">
                About Us
              </Link>
              <Link to="/how-it-works" className="block text-gray-600 hover:text-primary transition">
                How It Works
              </Link>
              <Link to="/faq" className="block text-gray-600 hover:text-primary transition">
                FAQ
              </Link>
              <Link to="/privacy" className="block text-gray-600 hover:text-primary transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="block text-gray-600 hover:text-primary transition">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Connected</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#" className="text-gray-600 hover:text-primary transition">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition">
                <Instagram className="w-6 h-6" />
              </a>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-r-lg hover:bg-primary/90 transition">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2025 Jamiireport. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;