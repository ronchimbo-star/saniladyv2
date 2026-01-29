import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const counties = [
  {
    name: 'Kent',
    slug: 'kent',
    description: 'Comprehensive feminine hygiene services across Kent',
    topTowns: ['Maidstone', 'Canterbury', 'Ashford', 'Dartford', 'Gravesend']
  },
  {
    name: 'Greater London',
    slug: 'london',
    description: 'Professional sanitary waste solutions throughout London',
    topTowns: ['Central London', 'South London', 'East London', 'North London', 'West London']
  },
  {
    name: 'Essex',
    slug: 'essex',
    description: 'Reliable period dignity services across Essex',
    topTowns: ['Chelmsford', 'Colchester', 'Basildon', 'Southend-on-Sea', 'Harlow']
  }
];

export default function ServiceCoverage() {
  return (
    <>
      <Helmet>
        <title>Service Coverage | SaniLady - Kent, London & Essex</title>
        <meta name="description" content="SaniLady provides professional feminine hygiene and sanitary waste management services across Kent, Greater London, and Essex. Find your local service area." />
        <meta name="keywords" content="sanitary bins Kent, feminine hygiene London, period dignity Essex, sanitary waste management Kent London Essex" />
      </Helmet>

      <div className="min-h-screen">
        <div className="bg-gradient-to-br from-[#ec008c] to-[#e91e8c] text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Our Service Coverage
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              Professional feminine hygiene solutions across Kent, London, and Essex
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Service Coverage Map
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              SaniLady provides comprehensive feminine hygiene and sanitary waste management
              services across three major regions in the South East of England.
            </p>
          </div>

          <div className="mb-16 flex justify-center">
            <div className="w-full md:w-3/4 lg:w-1/2">
              <div className="bg-white rounded-2xl shadow-2xl p-6 border-4 border-pink-200">
                <img
                  src="/service-map.png"
                  alt="SaniLady Service Coverage Map - Kent, London, Essex"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Areas We Serve
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              SaniLady is proud to provide comprehensive feminine hygiene and sanitary waste management
              services across three major regions in the South East of England.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {counties.map((county) => (
              <Link
                key={county.slug}
                to={`/service-areas/${county.slug}`}
                className="group bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl hover:border-[#ec008c] border-2 border-transparent transition-all transform hover:scale-105"
              >
                <div className="text-center">
                  <div className="text-5xl mb-4">📍</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-[#ec008c] transition-colors">
                    {county.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {county.description}
                  </p>
                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-500 mb-2">Top Locations:</p>
                    <ul className="space-y-1">
                      {county.topTowns.map((town) => (
                        <li key={town} className="text-sm text-gray-700">
                          {town}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="inline-flex items-center text-[#ec008c] font-semibold group-hover:underline">
                    View All Locations
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Why Choose SaniLady?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="text-3xl mr-4">✓</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Local Expertise</h3>
                  <p className="text-gray-600">
                    We understand the unique needs of businesses across the South East
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">✓</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Reliable Service</h3>
                  <p className="text-gray-600">
                    Regular, dependable collections and servicing across all areas
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">✓</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Full Compliance</h3>
                  <p className="text-gray-600">
                    Meeting all UK regulations for sanitary waste management
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="text-3xl mr-4">✓</div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-2">Competitive Pricing</h3>
                  <p className="text-gray-600">
                    Transparent pricing with no hidden fees across all service areas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Don't See Your Area Listed?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We're always expanding our service coverage. Get in touch to discuss your requirements,
              and we'll do our best to accommodate you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact#quote"
                className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
              >
                Get a Quote
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
    </>
  );
}
