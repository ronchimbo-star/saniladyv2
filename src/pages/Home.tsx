import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <img
                src="/sanilady-logo-header.png"
                alt="SaniLady"
                className="h-16 md:h-20 filter brightness-0 invert mb-8"
              />
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Comprehensive Feminine Hygiene Solutions
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Supporting UK businesses and individuals with professional sanitary waste management and the innovative Dignity at Work programme
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Go to Dashboard
                    </Link>
                    <Link
                      to="/quote-request"
                      className="bg-gradient-to-r from-[#ff5722] to-[#ff6f3c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Request a Quote
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/contact"
                      className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Get a Quote
                    </Link>
                    <Link
                      to="/about"
                      className="bg-gradient-to-r from-[#ff5722] to-[#ff6f3c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-white opacity-5 rounded-full blur-2xl transform scale-90 animate-pulse" style={{animationDelay: '1s'}}></div>
              <img
                src="/sanilady-hero.png"
                alt="SaniLady Period Dignity"
                className="relative w-full max-w-2xl drop-shadow-2xl transform hover:scale-110 transition-transform duration-700 animate-float"
              />
            </div>
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
          <Link to="/period-dignity" className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-pink-100 transform hover:scale-[1.02] group">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
              Dignity at Work Programme
            </h3>
            <p className="text-gray-600 mb-4">
              Tax-free employee benefit providing personalised feminine hygiene products. Support workplace wellbeing, enhance DEI initiatives, and reduce turnover.
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
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
            <div className="text-pink-600 font-semibold group-hover:underline">
              Learn More →
            </div>
          </Link>

          <Link to="/waste-services" className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-blue-100 transform hover:scale-[1.02] group">
            <div className="text-5xl mb-4">♻️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              Sanitary Waste Management
            </h3>
            <p className="text-gray-600 mb-4">
              Professional sanitary bin collection and disposal services ensuring compliance and workplace hygiene standards.
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
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
            <div className="text-blue-600 font-semibold group-hover:underline">
              Learn More →
            </div>
          </Link>
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

      <div className="bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#d81b8b] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose SaniLady?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2">DEI Enhancement</h3>
              <p className="text-sm opacity-90">
                Tangible gender inclusion strategy implementation
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">💷</div>
              <h3 className="text-lg font-bold mb-2">Cost Savings</h3>
              <p className="text-sm opacity-90">
                Reduced turnover, absenteeism, and recruitment costs
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-2">Fully Managed</h3>
              <p className="text-sm opacity-90">
                Simplified administration with single invoicing
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-lg font-bold mb-2">Sustainable</h3>
              <p className="text-sm opacity-90">
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
