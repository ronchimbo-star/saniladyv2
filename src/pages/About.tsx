import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About SaniLady
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Leading the way in workplace feminine hygiene solutions
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            SaniLady was founded with a simple but powerful mission: to make workplaces more inclusive and
            dignified for all. We recognized that period poverty and inadequate feminine hygiene facilities
            were significant but often overlooked workplace issues affecting productivity, wellbeing, and
            equality.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Starting as a traditional sanitary waste management company serving businesses across Kent, London,
            and Essex, we evolved to meet the changing needs of modern workplaces. Today, we're proud to offer
            not just waste management services, but also the innovative Period Dignity at Work programme – a
            first-of-its-kind employee benefit that's transforming how organizations support their teams.
          </p>

          <div className="bg-pink-50 border border-pink-200 rounded-xl p-8 my-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h3>
            <p className="text-gray-700 text-lg">
              To eliminate period poverty in UK workplaces while providing professional sanitary waste management
              services that ensure dignity, compliance, and environmental responsibility.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-600 mb-3">Dignity First</h3>
              <p className="text-gray-700">
                We believe everyone deserves access to proper feminine hygiene facilities and products. Dignity
                shouldn't be a luxury.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-600 mb-3">Equality & Inclusion</h3>
              <p className="text-gray-700">
                Our services support workplace DEI initiatives with tangible, meaningful benefits that make a
                real difference.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-600 mb-3">Environmental Responsibility</h3>
              <p className="text-gray-700">
                We're committed to sustainable practices, from eco-friendly product options to responsible waste
                disposal methods.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-pink-600 mb-3">Excellence in Service</h3>
              <p className="text-gray-700">
                We take pride in delivering reliable, professional service that exceeds expectations and builds
                lasting partnerships.
              </p>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose Us?</h2>
          <div className="space-y-4 mb-12">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Local Expertise</h3>
                <p className="text-gray-700">
                  Deep knowledge of Kent, London, and Essex markets with fast, reliable service throughout our
                  coverage area.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Comprehensive Solutions</h3>
                <p className="text-gray-700">
                  From waste management to employee benefits, we provide integrated feminine hygiene solutions
                  under one roof.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Proven Track Record</h3>
                <p className="text-gray-700">
                  Years of experience serving businesses across industries with consistently high customer
                  satisfaction ratings.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600 font-bold text-xl">
                ✓
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Compliance Guaranteed</h3>
                <p className="text-gray-700">
                  Full regulatory compliance with UK waste regulations and HMRC requirements for employee
                  benefits.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Service Area</h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            We proudly serve businesses across Kent, London, and Essex. Whether you're in the heart of London,
            the Kent countryside, or anywhere in Essex, our team provides the same high standard of service with
            reliable collection schedules and responsive support.
          </p>
          <p className="text-gray-700 leading-relaxed mb-12">
            Our local presence means faster response times, better understanding of regional needs, and a
            personal touch that national providers can't match.
          </p>

          <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Partner with Us?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join the growing number of organizations transforming their workplace culture
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
