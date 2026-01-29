import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CookieConsent from './CookieConsent';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

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
                src="/sanilady-logo-header.png"
                alt="SaniLady"
                className="h-20"
              />
            </Link>

            <div className="hidden lg:flex items-center space-x-6">
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
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="bg-[#2d1b69] text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="/sanilady-logo-footer.png"
                alt="SaniLady"
                className="h-10 mb-4"
              />
              <p className="text-sm opacity-90">
                Comprehensive feminine hygiene solutions for UK businesses and individuals.
              </p>
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
                  <Link to="/contact" className="hover:text-pink-400 transition-colors">
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
              &copy; {new Date().getFullYear()} SaniLady. All rights reserved. | Serving Kent, London & Essex
            </p>
          </div>
        </div>
      </footer>

      <CookieConsent />
    </div>
  );
}
