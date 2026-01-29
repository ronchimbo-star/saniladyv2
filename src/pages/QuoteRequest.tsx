import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function QuoteRequest() {
  const { user } = useAuth();
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [cleaningFrequency, setCleaningFrequency] = useState('');
  const [employeeCount, setEmployeeCount] = useState(0);
  const [binCount, setBinCount] = useState(0);
  const [binCollectionFrequency, setBinCollectionFrequency] = useState('monthly');
  const [needsBinRental, setNeedsBinRental] = useState(false);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateEstimate();
  }, [serviceType, propertySize, cleaningFrequency, employeeCount, binCount, additionalServices]);

  const calculateEstimate = () => {
    let base = 0;

    if (serviceType === 'dignity-at-work') {
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

    if (!customerName || !customerEmail) {
      setError('Please provide your name and email');
      return;
    }

    if (!serviceType) {
      setError('Please select a service type');
      return;
    }

    if ((serviceType === 'waste-management' || serviceType === 'both') && !propertySize) {
      setError('Please select facility size for waste management services');
      return;
    }

    setLoading(true);

    try {
      const { error: submitError } = await supabase
        .from('quotes')
        .insert({
          user_id: user!.id,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          company_name: companyName,
          property_type: serviceType,
          property_size: propertySize || 'N/A',
          cleaning_frequency: cleaningFrequency || 'monthly',
          bedrooms: employeeCount,
          bathrooms: binCount,
          number_of_bins: binCount,
          bin_collection_frequency: binCollectionFrequency,
          needs_bin_rental: needsBinRental,
          additional_services: additionalServices,
          special_requirements: specialRequirements,
          estimated_cost: estimatedCost,
          status: 'pending',
        });

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
              customer_name: customerName,
              customer_email: customerEmail,
              customer_phone: customerPhone,
              company_name: companyName,
              service_type: serviceType,
              property_size: propertySize || 'N/A',
              employee_count: employeeCount,
              bin_count: binCount,
              bin_collection_frequency: binCollectionFrequency,
              needs_bin_rental: needsBinRental,
              estimated_cost: estimatedCost,
              special_requirements: specialRequirements,
              additional_services: additionalServices,
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
      setServiceType('');
      setPropertySize('');
      setCleaningFrequency('');
      setEmployeeCount(0);
      setBinCount(0);
      setBinCollectionFrequency('monthly');
      setNeedsBinRental(false);
      setAdditionalServices([]);
      setSpecialRequirements('');
    } catch (err) {
      setError('Failed to submit quote request. Please try again or contact us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Request a Quote</h1>
          <p className="text-gray-600 mb-8">Get an instant estimate for your feminine hygiene solutions</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Your company name"
                  />
                </div>
              </div>
            </div>

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
                <option value="">Select service type</option>
                <option value="dignity-at-work">Dignity at Work Programme</option>
                <option value="waste-management">Sanitary Waste Management</option>
                <option value="both">Both Services (Combined)</option>
                <option value="individual-subscription">Individual Subscription</option>
              </select>
            </div>

            {(serviceType === 'dignity-at-work' || serviceType === 'both') && (
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
                placeholder="Any specific cleaning requirements or preferences..."
              />
            </div>

            {serviceType && (
              <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
                <p className="text-sm text-gray-600 mb-2">Estimated Monthly Cost</p>
                <p className="text-4xl font-bold text-[#ec008c]">£{estimatedCost.toFixed(2)}</p>
                <p className="text-sm text-purple-600 mt-2">
                  This is an estimate. Final pricing will be confirmed in your quote.
                </p>
                {serviceType === 'dignity-at-work' && employeeCount > 0 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Approximately £{(estimatedCost / employeeCount).toFixed(2)} per employee per month
                  </p>
                )}
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
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white font-bold py-4 rounded-full hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Request Quote'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
