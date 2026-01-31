import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import CookieConsent from './CookieConsent';

interface SiteSettings {
  header_logo_url: string;
  footer_logo_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    header_logo_url: '/sanilady-logo-header.png',
    footer_logo_url: '/sanilady-logo-footer.png',
    contact_phone: '0800 123 4567',
    contact_email: 'info@sanilady.co.uk',
    contact_address: 'Serving Kent, London & Essex'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('header_logo_url, footer_logo_url, contact_phone, contact_email, contact_address')
        .maybeSingle();

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-24">
            <Link to={user ? '/dashboard' : '/'}>
              <img
                src={settings.header_logo_url}
                alt="SaniLady"
                className="h-20"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
              <Link
                to="/"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/period-dignity"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Period Dignity
              </Link>
              <Link
                to="/waste-services"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Waste Services
              </Link>
              <Link
                to="/news"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                News
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
              >
                Contact
              </Link>
              {user ? (
                <>
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  ) : (
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/contact#quote"
                  className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Get a Quote
                </Link>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-pink-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-3">
                <Link
                  to="/"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/period-dignity"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Period Dignity
                </Link>
                <Link
                  to="/waste-services"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Waste Services
                </Link>
                <Link
                  to="/news"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  News
                </Link>
                <Link
                  to="/about"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                {user ? (
                  <>
                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin
                      </Link>
                    ) : (
                      <Link
                        to="/dashboard"
                        className="text-gray-700 hover:text-pink-600 font-medium transition-colors py-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/contact#quote"
                    className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get a Quote
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-[#2d1b69] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src={settings.footer_logo_url}
                alt="SaniLady"
                className="h-10 mb-4"
              />
              <p className="text-sm opacity-90">
                Comprehensive feminine hygiene solutions for UK businesses and individuals.
              </p>
              {settings.contact_phone && (
                <p className="text-sm mt-3">
                  <strong>Phone:</strong> {settings.contact_phone}
                </p>
              )}
              {settings.contact_email && (
                <p className="text-sm mt-1">
                  <strong>Email:</strong> {settings.contact_email}
                </p>
              )}
            </div>
            <div>
              <h3 className="font-bold mb-3">Services</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link to="/period-dignity" className="hover:text-pink-400 transition-colors">
                    Period Dignity at Work
                  </Link>
                </li>
                <li>
                  <Link to="/waste-services" className="hover:text-pink-400 transition-colors">
                    Sanitary Waste Management
                  </Link>
                </li>
                <li>
                  <Link to="/contact#quote" className="hover:text-pink-400 transition-colors">
                    Request a Quote
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Company</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link to="/about" className="hover:text-pink-400 transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/service-coverage" className="hover:text-pink-400 transition-colors">
                    Service Coverage
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-pink-400 transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-pink-400 transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm opacity-90">
                <li>
                  <Link to="/terms" className="hover:text-pink-400 transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-pink-400 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/cookie-policy" className="hover:text-pink-400 transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-90">
              &copy; {new Date().getFullYear()} SaniLady. All rights reserved. | {settings.contact_address}
            </p>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}
