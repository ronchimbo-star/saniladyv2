import { Link } from 'react-router-dom';

const kentLocations = [
  'Maidstone', 'Canterbury', 'Ashford', 'Dartford', 'Gravesend',
  'Tunbridge Wells', 'Sevenoaks', 'Folkestone', 'Dover', 'Margate',
  'Ramsgate', 'Gillingham', 'Chatham', 'Rochester', 'Sittingbourne',
  'Faversham', 'Whitstable', 'Herne Bay', 'Deal', 'Sandwich',
  'Tonbridge', 'Cranbrook', 'Tenterden', 'Hythe', 'New Romney'
];

export default function ServiceAreaKent() {
  return (
    <div className="min-h-screen">
      <title>Feminine Hygiene Services Kent | Sanitary Bins Maidstone Canterbury | SaniLady</title>
      <meta name="description" content="Professional feminine hygiene and sanitary waste management services across Kent. Serving Maidstone, Canterbury, Ashford, Dartford, Tunbridge Wells, and all Kent towns. Period dignity solutions for Kent businesses." />
      <meta name="keywords" content="sanitary bins Kent, feminine hygiene Kent, period dignity Maidstone, sanitary waste Canterbury, sanitary bins Ashford, feminine hygiene Dartford, sanitary waste management Kent, period products Kent, workplace hygiene Kent" />

      <div className="bg-gradient-to-br from-blue-600 to-teal-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Feminine Hygiene Services in Kent
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Professional sanitary waste management and period dignity solutions across Kent
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
            SaniLady Kent: Your Local Feminine Hygiene Partner
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            SaniLady is proud to serve businesses and organizations throughout Kent with comprehensive
            feminine hygiene and sanitary waste management services. From the historic streets of Canterbury
            to the bustling town of Maidstone, we provide reliable, compliant, and professional services
            tailored to your needs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our Kent service covers everything from sanitary bin supply and installation to regular
            waste collection, period dignity programmes, and compliance documentation.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Services We Provide in Kent</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Waste Management</h3>
              <p className="text-gray-700">
                Licensed waste collection and disposal services for businesses across Kent, ensuring
                full compliance with UK regulations.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Period Dignity at Work</h3>
              <p className="text-gray-700">
                Free period product provision for Kent workplaces, supporting employee wellbeing and
                promoting inclusive workplace cultures.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Bin Installation</h3>
              <p className="text-gray-700">
                Professional supply and installation of high-quality, discreet sanitary bins throughout
                Kent facilities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Compliance & Documentation</h3>
              <p className="text-gray-700">
                Complete waste transfer notes and compliance certificates for Kent businesses, maintaining
                full audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Kent Locations We Serve</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 mb-6">
              SaniLady provides feminine hygiene services to businesses and organizations in all major
              Kent towns and surrounding areas, including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {kentLocations.map((location) => (
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
              Don't see your location? We serve many more areas across Kent. Contact us to confirm coverage.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-teal-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Kent Businesses Choose SaniLady</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xl mb-2">Local Knowledge</h3>
              <p className="opacity-90">
                We understand the specific needs of Kent businesses, from small offices in Canterbury
                to large facilities in Dartford.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Flexible Scheduling</h3>
              <p className="opacity-90">
                Collection schedules designed around your Kent business operations, whether weekly,
                fortnightly, or monthly.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Professional Team</h3>
              <p className="opacity-90">
                Experienced, trained staff providing discreet and reliable service across Kent.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Competitive Pricing</h3>
              <p className="opacity-90">
                Transparent pricing with no hidden costs for Kent businesses of all sizes.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get a Quote for Kent Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Request a free quote or site assessment for your Kent business. We'll provide customized
            recommendations and competitive pricing.
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
