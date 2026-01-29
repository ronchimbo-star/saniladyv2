import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [binCount, setBinCount] = useState(0);
  const [binCollectionFrequency, setBinCollectionFrequency] = useState('monthly');
  const [needsBinRental, setNeedsBinRental] = useState(false);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!customerName || !customerEmail || !propertySize) {
      setError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setError('Please sign up or log in to request a quote');
      return;
    }

    setLoading(true);

    try {
      const estimatedCost = calculateEstimate();

      const { data: quoteData, error: submitError } = await supabase
        .from('quotes')
        .insert({
          user_id: user.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          company_name: companyName,
          property_type: 'waste-management',
          property_size: propertySize,
          cleaning_frequency: binCollectionFrequency,
          bedrooms: 0,
          bathrooms: binCount,
          number_of_bins: binCount,
          bin_collection_frequency: binCollectionFrequency,
          needs_bin_rental: needsBinRental,
          additional_services: [],
          special_requirements: specialRequirements,
          estimated_cost: estimatedCost,
          status: 'pending',
        })
        .select()
        .single();

      if (submitError) throw submitError;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      try {
        await fetch(`${supabaseUrl}/functions/v1/send-quote-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
          },
          body: JSON.stringify({
            quote: {
              id: quoteData.id,
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: customerPhone,
              company_name: companyName,
              service_type: 'waste-management',
              property_size: propertySize,
              employee_count: 0,
              bin_count: binCount,
              bin_collection_frequency: binCollectionFrequency,
              needs_bin_rental: needsBinRental,
              estimated_cost: estimatedCost,
              special_requirements: specialRequirements,
              additional_services: [],
            }
          }),
        });
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
      }

      setSuccess(true);
      setError('');

      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setCompanyName('');
      setPropertySize('');
      setBinCount(0);
      setBinCollectionFrequency('monthly');
      setNeedsBinRental(false);
      setSpecialRequirements('');
    } catch (err) {
      setError('Failed to submit quote request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEstimate = () => {
    let base = 0;

    if (propertySize === 'small') base = 50;
    else if (propertySize === 'medium') base = 75;
    else if (propertySize === 'large') base = 120;
    else if (propertySize === 'extra-large') base = 180;

    base += binCount * 15;

    if (needsBinRental) {
      base += binCount * 10;
    }

    if (binCollectionFrequency === 'weekly') {
      base *= 1.5;
    } else if (binCollectionFrequency === 'fortnightly') {
      base *= 1.2;
    }

    return Math.round(base);
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
          <a
            href="#quote-form"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Get Your Free Quote
          </a>
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

        <div id="quote-form" className="bg-white rounded-2xl shadow-xl p-8 mb-12 scroll-mt-20">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Request Your Free Quote</h2>
          <p className="text-gray-600 mb-8">Get an instant estimate for sanitary waste management services</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="07XXX XXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facility Size <span className="text-red-500">*</span>
              </label>
              <select
                value={propertySize}
                onChange={(e) => setPropertySize(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select facility size</option>
                <option value="small">Small (1-10 employees)</option>
                <option value="medium">Medium (11-50 employees)</option>
                <option value="large">Large (51-200 employees)</option>
                <option value="extra-large">Extra Large (200+ employees)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Sanitary Bins Required
              </label>
              <input
                type="number"
                min="0"
                value={binCount}
                onChange={(e) => setBinCount(parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Estimated number of bins"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bin Collection Frequency
              </label>
              <select
                value={binCollectionFrequency}
                onChange={(e) => setBinCollectionFrequency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="fortnightly">Fortnightly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={needsBinRental}
                  onChange={(e) => setNeedsBinRental(e.target.checked)}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  I need to rent/hire feminine hygiene bins
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2 ml-8">
                Check this if you don't already have bins installed and need us to provide them
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Requirements
              </label>
              <textarea
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any specific requirements or preferences..."
              />
            </div>

            {propertySize && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Estimated Monthly Cost</p>
                <p className="text-4xl font-bold text-blue-600">£{calculateEstimate()}</p>
                <p className="text-sm text-gray-600 mt-2">
                  This is an estimate. Final pricing will be confirmed in your quote.
                </p>
              </div>
            )}

            {!user && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                Please <Link to="/signup" className="underline font-semibold">sign up</Link> or <Link to="/login" className="underline font-semibold">log in</Link> to request a quote.
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Quote request submitted successfully! We'll contact you shortly.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !user}
              className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white font-bold py-4 rounded-full hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Quote'}
            </button>
          </form>
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
