import React from 'react';
import { Link } from 'react-router-dom';
import { Flag, Mail, Phone, MapPin, Facebook, Twitter, Instagram, HelpCircle } from 'lucide-react';
import { useI18n } from '../../contexts/I18nContext';

interface FooterProps {
  variant: 'landing' | 'dashboard';
}

const Footer: React.FC<FooterProps> = ({ variant }) => {
  const { language } = useI18n();

  if (variant === 'dashboard') {
    return (
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span>© 2025 JamiiReport.</span>
              <span className="hidden md:inline">
                {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'}
              </span>
            </div>
            <Link
              to="/help"
              className="flex items-center gap-1 text-teal-600 hover:text-teal-700 transition-colors font-medium"
            >
              <HelpCircle className="h-4 w-4" />
              {language === 'en' ? 'Help Center' : 'Kituo cha Msaada'}
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 bg-gradient-to-br from-teal-500 to-teal-700 rounded-xl flex items-center justify-center">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">JamiiReport</span>
            </div>
            <p className="text-sm leading-relaxed">
              {language === 'en'
                ? 'Empowering communities to report, track, and resolve local issues together. Building better neighborhoods through civic engagement.'
                : 'Kuwapa nguvu jamii kuripoti, kufuatilia, na kutatua masuala ya kijiamii pamoja. Kujenga mitaa bora kupitia ushiriki wa raia.'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="h-9 w-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-teal-600 transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5 group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              {language === 'en' ? 'Quick Links' : 'Viungo vya Haraka'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'About Us' : 'Kuhusu Sisi'}
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'How It Works' : 'Jinsi Inavyofanya Kazi'}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'Contact' : 'Mawasiliano'}
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'FAQ' : 'Maswali'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              {language === 'en' ? 'Legal' : 'Kisheria'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/privacy"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'Privacy Policy' : 'Sera ya Faragha'}
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'Terms of Service' : 'Masharti ya Huduma'}
                </Link>
              </li>
              <li>
                <Link
                  to="/cookies"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'Cookie Policy' : 'Sera ya Vidakuzi'}
                </Link>
              </li>
              <li>
                <Link
                  to="/accessibility"
                  className="text-sm hover:text-teal-400 transition-colors inline-block hover:translate-x-1 duration-200"
                >
                  {language === 'en' ? 'Accessibility' : 'Upatikanaji'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-lg">
              {language === 'en' ? 'Contact Info' : 'Taarifa za Mawasiliano'}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  {language === 'en'
                    ? 'Mombasa County Office, Kilindini Road'
                    : 'Ofisi ya Kaunti ya Mombasa, Barabara ya Kilindini'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <a
                  href="tel:+254700123456"
                  className="text-sm hover:text-teal-400 transition-colors"
                >
                  +254 700 123 456
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-teal-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:support@jamiireport.co.ke"
                  className="text-sm hover:text-teal-400 transition-colors"
                >
                  support@jamiireport.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-center md:text-left">
              © 2025 JamiiReport.{' '}
              {language === 'en' ? 'All rights reserved.' : 'Haki zote zimehifadhiwa.'}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
              <button className="hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1">
                {language === 'en' ? 'Cookie Preferences' : 'Mapendeleo ya Vidakuzi'}
              </button>
              <span className="text-gray-600">|</span>
              <button className="hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1">
                {language === 'en' ? 'Report a Bug' : 'Ripoti Hitilafu'}
              </button>
              <span className="text-gray-600">|</span>
              <Link
                to="/sitemap"
                className="hover:text-teal-400 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
              >
                {language === 'en' ? 'Sitemap' : 'Ramani ya Tovuti'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;