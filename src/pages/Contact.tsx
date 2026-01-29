import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  contact_phone: string;
  contact_email: string;
  contact_address: string;
}

export default function Contact() {
  const [formType, setFormType] = useState<'general' | 'quote'>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [binCount, setBinCount] = useState(0);
  const [binCollectionFrequency, setBinCollectionFrequency] = useState('monthly');
  const [needsBinRental, setNeedsBinRental] = useState(false);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SiteSettings>({
    contact_phone: '0800 123 4567',
    contact_email: 'info@sanilady.co.uk',
    contact_address: 'Kent, London & Essex'
  });

  useEffect(() => {
    fetchSettings();
    if (window.location.hash === '#quote') {
      setFormType('quote');
    }
  }, []);

  useEffect(() => {
    if (formType === 'quote') {
      calculateEstimate();
    }
  }, [serviceType, propertySize, employeeCount, binCount, additionalServices, formType]);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('contact_phone, contact_email, contact_address')
        .maybeSingle();

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching site settings:', err);
    }
  };

  const calculateEstimate = () => {
    let base = 0;

    if (serviceType === 'period-dignity') {
      base = employeeCount * 60;
    } else if (serviceType === 'waste-management') {
      if (propertySize === 'small') base = 50;
      else if (propertySize === 'medium') base = 75;
      else if (propertySize === 'large') base = 120;
      else if (propertySize === 'extra-large') base = 180;

      base += binCount * 15;
    } else if (serviceType === 'both') {
      base = employeeCount * 55;
      if (propertySize === 'small') base += 40;
      else if (propertySize === 'medium') base += 60;
      else if (propertySize === 'large') base += 100;
      else if (propertySize === 'extra-large') base += 150;

      base += binCount * 12;
    }

    base += additionalServices.length * 25;

    setEstimatedCost(base);
  };

  const toggleService = (service: string) => {
    setAdditionalServices(prev =>
      prev.includes(service)
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email) {
      setError('Please fill in all required fields');
      return;
    }

    if (formType === 'general' && !message) {
      setError('Please provide a message');
      return;
    }

    if (formType === 'quote' && !serviceType) {
      setError('Please select a service type');
      return;
    }

    if (formType === 'quote' && (serviceType === 'waste-management' || serviceType === 'both') && !propertySize) {
      setError('Please select facility size for waste management services');
      return;
    }

    setLoading(true);

    try {
      if (formType === 'quote') {
        const { data: quoteData, error: quoteError } = await supabase
          .from('quotes')
          .insert({
            user_id: null,
            customer_name: name,
            customer_email: email,
            customer_phone: phone,
            company_name: company,
            property_type: serviceType,
            property_size: propertySize || 'N/A',
            cleaning_frequency: 'monthly',
            bedrooms: employeeCount,
            bathrooms: binCount,
            number_of_bins: binCount,
            bin_collection_frequency: binCollectionFrequency,
            needs_bin_rental: needsBinRental,
            additional_services: additionalServices,
            special_requirements: specialRequirements || message,
            estimated_cost: estimatedCost,
            status: 'pending',
          })
          .select()
          .single();

        if (quoteError) throw quoteError;

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
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                company_name: company,
                service_type: serviceType,
                property_size: propertySize || 'N/A',
                employee_count: employeeCount,
                bin_count: binCount,
                bin_collection_frequency: binCollectionFrequency,
                needs_bin_rental: needsBinRental,
                estimated_cost: estimatedCost,
                special_requirements: specialRequirements || message,
                additional_services: additionalServices,
              }
            }),
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      } else {
        const { data: contactData, error: contactError } = await supabase
          .from('contact_submissions')
          .insert({
            type: formType,
            name,
            email,
            phone,
            company,
            subject,
            message,
            service_type: '',
            status: 'pending',
          })
          .select()
          .single();

        if (contactError) throw contactError;

        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        try {
          await fetch(`${supabaseUrl}/functions/v1/send-contact-notification`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseAnonKey}`,
            },
            body: JSON.stringify({
              contact: {
                id: contactData.id,
                type: formType,
                name,
                email,
                phone,
                company,
                subject,
                message,
                service_type: '',
              }
            }),
          });
        } catch (emailError) {
          console.error('Email notification failed:', emailError);
        }
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSubject('');
      setMessage('');
      setServiceType('');
      setPropertySize('');
      setEmployeeCount(0);
      setBinCount(0);
      setBinCollectionFrequency('monthly');
      setNeedsBinRental(false);
      setAdditionalServices([]);
      setSpecialRequirements('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit your message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have a question or ready to get started? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600">{settings.contact_email}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600">{settings.contact_phone}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-bold text-gray-800 mb-2">Service Area</h3>
            <p className="text-gray-600">{settings.contact_address}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setFormType('general')}
              className={`pb-4 px-6 font-semibold transition-all ${
                formType === 'general'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General Enquiry
            </button>
            <button
              onClick={() => setFormType('quote')}
              className={`pb-4 px-6 font-semibold transition-all ${
                formType === 'quote'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Request a Quote
            </button>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6">
              Thank you for your message! We'll get back to you as soon as possible.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="07XXX XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Your Company"
                />
              </div>
            </div>

            {formType === 'general' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="What is your enquiry about?"
                />
              </div>
            )}

            {formType === 'quote' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select a service...</option>
                    <option value="period-dignity">Period Dignity at Work Programme</option>
                    <option value="waste-management">Sanitary Waste Management</option>
                    <option value="both">Both Services</option>
                    <option value="individual">Individual Subscription</option>
                  </select>
                </div>

                {(serviceType === 'period-dignity' || serviceType === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Female Employees
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="Approximate number"
                    />
                    <p className="text-sm text-gray-500 mt-1">For Dignity at Work programme pricing</p>
                  </div>
                )}

                {(serviceType === 'waste-management' || serviceType === 'both') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Facility Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={propertySize}
                        onChange={(e) => setPropertySize(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                          className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          I need to rent/hire feminine hygiene bins
                        </span>
                      </label>
                      <p className="text-sm text-gray-500 mt-2 ml-8">
                        Check this if you don't already have bins installed and need us to provide them
                      </p>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Additional Services
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {['Sustainable Products', 'Training & Education', 'Policy Development', 'Compliance Audit'].map((service) => (
                      <label key={service} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={additionalServices.includes(service)}
                          onChange={() => toggleService(service)}
                          className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                        />
                        <span className="text-gray-700">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Any specific requirements or preferences..."
                  />
                </div>

                {serviceType && (
                  <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                    <p className="text-sm text-gray-600 mb-2">Estimated Monthly Cost</p>
                    <p className="text-4xl font-bold text-[#ec008c]">£{estimatedCost.toFixed(2)}</p>
                    <p className="text-sm text-purple-600 mt-2">
                      This is an estimate. Final pricing will be confirmed in your quote.
                    </p>
                    {serviceType === 'period-dignity' && employeeCount > 0 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Approximately £{(estimatedCost / employeeCount).toFixed(2)} per employee per month
                      </p>
                    )}
                  </div>
                )}
              </>
            )}

            {formType === 'general' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Tell us how we can help..."
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : formType === 'general' ? 'Send Message' : 'Request Quote'}
            </button>
          </form>
        </div>

        <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose SaniLady?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Expert Service</h3>
                <p className="text-gray-600 text-sm">Years of experience in feminine hygiene solutions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Flexible Plans</h3>
                <p className="text-gray-600 text-sm">Customized solutions to fit your needs and budget</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Quick Response</h3>
                <p className="text-gray-600 text-sm">We aim to respond to all enquiries within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Local Coverage</h3>
                <p className="text-gray-600 text-sm">Serving {settings.contact_address} with dedication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
