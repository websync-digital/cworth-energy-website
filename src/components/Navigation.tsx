import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import cworthLogo from '@/assets/cworth-logo.png';


const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
    { name: 'Product', path: '/product' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src={cworthLogo}
              alt="Cworth Solar Energy Logo"
              className="h-10 lg:h-14 w-auto transform group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 lg:px-4 py-2 rounded-md text-sm lg:text-base font-medium transition-colors ${isActive(link.path)
                  ? 'text-sky-900 bg-sky-50 font-bold'
                  : 'text-slate-600 hover:text-sky-900 hover:bg-sky-50/50'
                  }`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://wa.me/2349017813274"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="whatsapp" size="default" className="ml-2 lg:ml-4 gap-2">
                <MessageCircle size={18} />
                WhatsApp Us
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-foreground hover:text-primary hover:bg-primary/5 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in bg-background border-b border-border shadow-lg">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://wa.me/2349017813274"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
                onClick={() => setIsOpen(false)}
              >
                <Button variant="whatsapp" size="default" className="w-full mt-2 gap-2">
                  <MessageCircle size={18} />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
