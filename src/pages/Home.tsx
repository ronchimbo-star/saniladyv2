import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white">
        <div className="max-w-7xl mx-auto px-4 py-24 text-center">
          <img
            src="/sanilady-logo-header.png"
            alt="SaniLady"
            className="h-20 mx-auto mb-8 filter brightness-0 invert"
          />
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Professional Cleaning Services
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Experience spotless spaces with SaniLady's expert cleaning solutions tailored to your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
                >
                  Go to Dashboard
                </Link>
                <Link
                  to="/quote-request"
                  className="bg-gradient-to-r from-[#ff5722] to-[#ff6f3c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
                >
                  Request a Quote
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-[#ff5722] to-[#ff6f3c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Why Choose SaniLady?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Expert Cleaners
            </h3>
            <p className="text-gray-600">
              Our trained professionals deliver exceptional results every time
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">⏰</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Flexible Scheduling
            </h3>
            <p className="text-gray-600">
              Choose weekly, bi-weekly, or monthly cleaning that fits your lifestyle
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow">
            <div className="text-5xl mb-4">💰</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Transparent Pricing
            </h3>
            <p className="text-gray-600">
              Get instant quotes with no hidden fees or surprises
            </p>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Experience the Difference?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your personalized cleaning quote in minutes
          </p>
          <Link
            to={user ? '/quote-request' : '/signup'}
            className="inline-block bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
          >
            {user ? 'Request a Quote' : 'Get Started Now'}
          </Link>
        </div>
      </div>
    </div>
  );
}
