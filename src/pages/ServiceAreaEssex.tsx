import { Link } from 'react-router-dom';

const essexLocations = [
  'Chelmsford', 'Colchester', 'Basildon', 'Southend-on-Sea', 'Harlow',
  'Braintree', 'Brentwood', 'Clacton-on-Sea', 'Grays', 'Witham',
  'Billericay', 'Wickford', 'Rayleigh', 'Rochford', 'Canvey Island',
  'Leigh-on-Sea', 'Westcliff-on-Sea', 'Saffron Walden', 'Halstead', 'Maldon',
  'Burnham-on-Crouch', 'Tilbury', 'Stanford-le-Hope', 'Corringham', 'Loughton',
  'Chigwell', 'Epping', 'Waltham Abbey', 'Chipping Ongar', 'Great Dunmow'
];

export default function ServiceAreaEssex() {
  return (
    <div className="min-h-screen">
      <title>Feminine Hygiene Services Essex | Sanitary Bins Chelmsford Colchester | SaniLady</title>
      <meta name="description" content="Professional feminine hygiene and sanitary waste management services across Essex. Serving Chelmsford, Colchester, Basildon, Southend-on-Sea, and all Essex towns. Period dignity solutions for Essex businesses." />
      <meta name="keywords" content="sanitary bins Essex, feminine hygiene Essex, period dignity Chelmsford, sanitary waste Colchester, sanitary bins Basildon, feminine hygiene Southend, sanitary waste management Essex, period products Essex, workplace hygiene Essex" />

      <div className="bg-gradient-to-br from-green-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Feminine Hygiene Services in Essex
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Professional sanitary waste management and period dignity solutions across Essex
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="mb-12">
          <Link
            to="/service-coverage"
            className="inline-flex items-center text-[#ec008c] hover:underline mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Service Coverage
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            SaniLady Essex: Your Local Feminine Hygiene Partner
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            SaniLady is committed to serving businesses and organizations throughout Essex with comprehensive
            feminine hygiene and sanitary waste management services. From the county town of Chelmsford to
            the coastal resorts of Southend-on-Sea and Clacton, we provide reliable, compliant, and
            professional services designed for your needs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our Essex service covers everything from sanitary bin supply and installation to regular
            waste collection, period dignity programmes, and full compliance support for businesses
            of all sizes.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Services We Provide in Essex</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Waste Management</h3>
              <p className="text-gray-700">
                Licensed waste collection and disposal services for Essex businesses, ensuring full
                compliance with UK waste management regulations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Period Dignity at Work</h3>
              <p className="text-gray-700">
                Free period product provision for Essex workplaces, promoting employee wellbeing and
                creating inclusive work environments.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Bin Installation</h3>
              <p className="text-gray-700">
                Professional supply and installation of high-quality sanitary bins throughout Essex
                facilities and workplaces.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Compliance & Documentation</h3>
              <p className="text-gray-700">
                Complete waste transfer notes and compliance certificates for Essex businesses,
                maintaining full audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Essex Locations We Serve</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 mb-6">
              SaniLady provides feminine hygiene services to businesses and organizations across all
              major Essex towns and surrounding areas, including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {essexLocations.map((location) => (
                <div
                  key={location}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <svg className="w-5 h-5 text-[#ec008c] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{location}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              Don't see your location? We serve many more areas across Essex. Contact us to confirm coverage.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Essex Businesses Choose SaniLady</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xl mb-2">Local Service</h3>
              <p className="opacity-90">
                We understand the specific needs of Essex businesses, from coastal enterprises to
                inland offices and facilities.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Flexible Scheduling</h3>
              <p className="opacity-90">
                Collection schedules designed around your Essex business operations, with weekly,
                fortnightly, or monthly options.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Experienced Team</h3>
              <p className="opacity-90">
                Professional, trained staff providing discreet and reliable service throughout Essex.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Transparent Pricing</h3>
              <p className="opacity-90">
                Competitive pricing with no hidden fees for Essex businesses of all sizes.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get a Quote for Essex Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Request a free quote or site assessment for your Essex business. We'll provide customized
            recommendations and competitive pricing tailored to your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact#quote"
              className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Request a Quote
            </Link>
            <Link
              to="/contact"
              className="bg-white text-[#ec008c] border-2 border-[#ec008c] px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
