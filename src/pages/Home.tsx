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
            Comprehensive Feminine Hygiene Solutions
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto">
            Supporting UK businesses and individuals with professional sanitary waste management and the innovative Dignity at Work programme
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
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Serving Kent, London, and Essex with integrated feminine hygiene solutions
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-pink-100">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Dignity at Work Programme
            </h3>
            <p className="text-gray-600 mb-4">
              Tax-free employee benefit providing personalised feminine hygiene products. Support workplace wellbeing, enhance DEI initiatives, and reduce turnover.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>HMRC-compliant tax-free benefit</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>Personalised product selection</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>Monthly subscriptions £35-£85 per employee</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow border border-blue-100">
            <div className="text-5xl mb-4">♻️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Sanitary Waste Management
            </h3>
            <p className="text-gray-600 mb-4">
              Professional sanitary bin collection and disposal services ensuring compliance and workplace hygiene standards.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Licensed waste disposal facilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Regular collection schedules</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Full regulatory compliance</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Individual Subscriptions
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sustainable period product subscriptions delivered directly to your home. Choose from eco-friendly options, enjoy discreet delivery, and customize your products.
          </p>
        </div>
      </div>

      <div className="bg-gray-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose SaniLady?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2">DEI Enhancement</h3>
              <p className="text-sm text-gray-300">
                Tangible gender inclusion strategy implementation
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">💷</div>
              <h3 className="text-lg font-bold mb-2">Cost Savings</h3>
              <p className="text-sm text-gray-300">
                Reduced turnover, absenteeism, and recruitment costs
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-2">Fully Managed</h3>
              <p className="text-sm text-gray-300">
                Simplified administration with single invoicing
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-lg font-bold mb-2">Sustainable</h3>
              <p className="text-sm text-gray-300">
                Eco-friendly product options and responsible waste disposal
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your personalized quote for our Dignity at Work programme or waste management services
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
