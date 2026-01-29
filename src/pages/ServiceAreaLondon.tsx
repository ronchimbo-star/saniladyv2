import { Link } from 'react-router-dom';

const londonAreas = [
  'Central London', 'Westminster', 'City of London', 'Camden', 'Islington',
  'Hackney', 'Tower Hamlets', 'Greenwich', 'Lewisham', 'Southwark',
  'Lambeth', 'Wandsworth', 'Hammersmith', 'Kensington', 'Chelsea',
  'Fulham', 'Ealing', 'Brent', 'Barnet', 'Enfield',
  'Haringey', 'Newham', 'Waltham Forest', 'Redbridge', 'Havering',
  'Barking', 'Dagenham', 'Bexley', 'Bromley', 'Croydon'
];

export default function ServiceAreaLondon() {
  return (
    <div className="min-h-screen">
      <title>Feminine Hygiene Services London | Sanitary Bins Central London | SaniLady</title>
      <meta name="description" content="Professional feminine hygiene and sanitary waste management services across Greater London. Serving Central London, Westminster, Camden, and all London boroughs. Period dignity solutions for London businesses." />
      <meta name="keywords" content="sanitary bins London, feminine hygiene London, period dignity Central London, sanitary waste Westminster, sanitary bins Camden, feminine hygiene City of London, sanitary waste management London, period products London, workplace hygiene London" />

      <div className="bg-gradient-to-br from-[#ec008c] to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Feminine Hygiene Services in London
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Professional sanitary waste management and period dignity solutions across Greater London
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
            SaniLady London: Capital City Feminine Hygiene Solutions
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            SaniLady delivers comprehensive feminine hygiene and sanitary waste management services
            throughout Greater London. From the financial district of the City of London to the vibrant
            boroughs across the capital, we provide professional, reliable services that meet the highest
            standards.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our London service includes sanitary bin provision, regular waste collection, period dignity
            programmes, and full compliance support for businesses across all 32 boroughs and the City of London.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Services We Provide in London</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Waste Management</h3>
              <p className="text-gray-700">
                Licensed waste collection and disposal services for London businesses, offices, and
                facilities, ensuring full UK regulatory compliance.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Period Dignity at Work</h3>
              <p className="text-gray-700">
                Free period product provision for London workplaces, supporting employee wellbeing in
                the capital's diverse business community.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Bin Installation</h3>
              <p className="text-gray-700">
                Professional supply and installation of premium sanitary bins in London offices,
                retail spaces, and public facilities.
              </p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">Compliance & Documentation</h3>
              <p className="text-gray-700">
                Complete waste transfer documentation and compliance certificates for London businesses,
                maintaining full audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">London Areas We Serve</h2>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 mb-6">
              SaniLady provides feminine hygiene services to businesses and organizations across all
              London boroughs and the City of London, including:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {londonAreas.map((area) => (
                <div
                  key={area}
                  className="flex items-center space-x-2 text-gray-700"
                >
                  <svg className="w-5 h-5 text-[#ec008c] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6 text-sm">
              Serving all 32 London boroughs plus the City of London. Contact us for specific location confirmation.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#ec008c] to-purple-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-4">Why London Businesses Choose SaniLady</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-xl mb-2">Capital City Experience</h3>
              <p className="opacity-90">
                Extensive experience serving London's diverse business landscape, from corporate offices
                to retail and hospitality.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Flexible Service</h3>
              <p className="opacity-90">
                Adaptable collection schedules that work around London's 24/7 business operations and
                varied requirements.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Professional Standards</h3>
              <p className="opacity-90">
                Meeting the high standards expected by London businesses with discreet, reliable service.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2">Competitive London Pricing</h3>
              <p className="opacity-90">
                Value-focused pricing designed for London businesses, with transparent costs and no surprises.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Get a Quote for London Today
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Request a free quote or site assessment for your London business. We'll provide customized
            recommendations and competitive pricing tailored to your needs.
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
