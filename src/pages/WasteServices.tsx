import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  company_name: string;
  contact_name: string;
  contact_role: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
}

export default function WasteServices() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('service_type', 'waste-services')
        .eq('is_published', true)
        .order('display_order');

      if (data) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-blue-600 via-teal-500 to-green-500 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sanitary Waste Management Services
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Professional, compliant, and discreet sanitary bin collection and disposal
          </p>
          <Link
            to="/contact#quote"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Get Your Free Quote
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Waste Management Service</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            SaniLady provides comprehensive sanitary waste management services to businesses across Kent, London,
            and Essex. We ensure full regulatory compliance, maintain the highest hygiene standards, and offer
            flexible collection schedules to meet your workplace needs.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our service goes beyond simple collection – we're your partner in creating a clean, safe, and
            welcoming workplace environment for all employees and visitors.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">🗑️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Sanitary Bin Supply & Installation</h3>
              <p className="text-gray-600">
                We provide and install high-quality, discreet sanitary bins in your washrooms. Our bins are
                designed for maximum hygiene with hands-free operation and odor control features.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">📅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Regular Collection Services</h3>
              <p className="text-gray-600">
                Choose from weekly, fortnightly, or monthly collection schedules based on your facility's needs.
                Our reliable service ensures your bins are always emptied on time.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Licensed Waste Disposal</h3>
              <p className="text-gray-600">
                All waste is disposed of at licensed facilities in full compliance with UK waste regulations.
                We provide complete waste transfer documentation for your records.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">🧼</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Bin Cleaning & Sanitization</h3>
              <p className="text-gray-600">
                Every collection includes thorough cleaning and sanitization of your bins. We use
                professional-grade disinfectants to ensure maximum hygiene.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Maintenance & Repairs</h3>
              <p className="text-gray-600">
                Free maintenance and repairs of all supplied bins. If a bin is damaged or malfunctioning, we'll
                repair or replace it at no additional cost.
              </p>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-blue-500 transition-colors">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Compliance Documentation</h3>
              <p className="text-gray-600">
                Complete audit trail with waste transfer notes and compliance certificates. We help you meet
                your legal obligations effortlessly.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-teal-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Why Professional Sanitary Waste Management Matters</h2>
          <div className="space-y-4 leading-relaxed">
            <p>
              <strong>It's a legal requirement.</strong> Under the UK's Environmental Protection Act and Duty of
              Care regulations, businesses must dispose of sanitary waste through licensed waste carriers. Failure
              to comply can result in fines up to £5,000.
            </p>
            <p>
              <strong>It protects health and safety.</strong> Improper sanitary waste disposal poses health risks
              including bacterial infections and disease transmission. Professional management ensures safe
              handling and disposal.
            </p>
            <p>
              <strong>It matters to your team.</strong> Clean, well-maintained washrooms with proper sanitary
              facilities are essential for employee wellbeing and demonstrate respect for all staff members.
            </p>
            <p>
              <strong>It enhances your reputation.</strong> Visitors and clients notice washroom standards.
              Professional sanitary waste management reflects positively on your business.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Service Plans</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Small Business</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">From £45/month</div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>1-3 bins</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Monthly collection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Bin supply & installation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Cleaning & sanitization</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Compliance documentation</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 transform scale-105 shadow-xl">
              <div className="bg-white text-blue-600 inline-block px-3 py-1 rounded-full text-sm font-bold mb-2">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Standard Business</h3>
              <div className="text-3xl font-bold mb-4">From £90/month</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>4-8 bins</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Fortnightly collection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Premium bins included</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority service</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Dedicated account manager</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-blue-600 mb-4">Custom Pricing</div>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>9+ bins or multiple sites</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Weekly or custom schedule</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Tailored service package</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>Multi-site management</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">✓</span>
                  <span>24/7 support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-pink-50 py-16 text-center rounded-2xl mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto px-4">
            Get your personalized quote for our sanitary waste management services
          </p>
          <Link
            to="/contact#quote"
            className="inline-block bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
          >
            Get a Quote
          </Link>
        </div>

        {testimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Client Success Stories</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover how businesses trust SaniLady for professional waste management
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-blue-500 hover:shadow-xl transition-all"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.testimonial_text}"
                    </p>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-bold text-gray-800 text-lg">{testimonial.contact_name}</p>
                      {testimonial.contact_role && (
                        <p className="text-gray-600">{testimonial.contact_role}</p>
                      )}
                      <p className="text-blue-600 font-semibold mt-1">{testimonial.company_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Environmental Commitment</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At SaniLady, we're committed to environmental responsibility. While sanitary waste cannot be recycled,
            we ensure all waste is disposed of using the most environmentally friendly methods available:
          </p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                <strong>Energy Recovery:</strong> Where possible, sanitary waste is processed at energy-from-waste
                facilities, converting waste into electricity
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                <strong>Efficient Logistics:</strong> Optimized collection routes minimize fuel consumption and
                carbon emissions
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                <strong>Modern Fleet:</strong> Our vehicles meet the latest emissions standards
              </span>
            </li>
            <li className="flex items-start">
              <span className="text-green-600 mr-2">✓</span>
              <span>
                <strong>Digital Documentation:</strong> Paperless waste tracking reduces administrative waste
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
