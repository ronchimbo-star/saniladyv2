import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <Link to={user ? '/dashboard' : '/'}>
              <img
                src="/sanilady-logo-header.png"
                alt="SaniLady"
                className="h-10"
              />
            </Link>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/quote-request"
                    className="text-gray-700 hover:text-pink-600 font-medium transition-colors"
                  >
                    Request Quote
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
                    Sign Up
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
          <div className="grid md:grid-cols-3 gap-8 mb-8">
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
                <li>Dignity at Work Programme</li>
                <li>Sanitary Waste Management</li>
                <li>Individual Subscriptions</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-3">Service Areas</h3>
              <p className="text-sm opacity-90">Kent, London, and Essex</p>
              <p className="text-sm opacity-90 mt-2">UK-wide Dignity at Work Programme</p>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6 text-center">
            <p className="text-sm opacity-90">
              &copy; {new Date().getFullYear()} SaniLady. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
