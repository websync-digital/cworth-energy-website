import { Link } from 'react-router-dom';
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo & About */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold">Cworth Energy</span>
            </div>
            <p className="text-primary-foreground/90 text-sm leading-relaxed">
              Powering a cleaner future with affordable and reliable solar solutions for homes and businesses.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <a href="tel:+2349017813274" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">
                  +234 901 781 3274
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <a href="mailto:cworthsolarworldwide@gmail.com" className="text-primary-foreground/90 hover:text-background transition-colors text-sm">cworthsolarworldwide@gmail.com</a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0" />
                <div className="text-primary-foreground/90 text-sm">
                  <p>Opposite Living Faith Church</p>
                  <p>Nyanya, FCT Abuja</p>
                  <p>Nigeria</p>
                </div>
              </li>
              <li className="mt-2">
                <p className="text-primary-foreground/90 text-sm font-semibold">RC: 8588929</p>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              <a
                href="https://www.facebook.com/share/1ZzDNjVjGd/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-background rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Facebook"
              >
                <Facebook size={20} className="group-hover:text-primary" />
              </a>
              <a
                href="https://vm.tiktok.com/ZSHcNQwwXamxp-wJ5bG/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-background rounded-lg flex items-center justify-center transition-colors group"
                aria-label="TikTok"
              >
                <FaTiktok size={20} className="group-hover:text-primary" />
              </a>
              <a
                href="https://www.instagram.com/cworth_solar_energy/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-background rounded-lg flex items-center justify-center transition-colors group"
                aria-label="Instagram"
              >
                <Instagram size={20} className="group-hover:text-primary" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center">
          <p className="text-primary-foreground/80 text-sm">
            &copy; {currentYear} Cworth Energy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
