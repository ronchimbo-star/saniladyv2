import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function QuoteRequest() {
  const { user } = useAuth();
  const [propertyType, setPropertyType] = useState('');
  const [propertySize, setPropertySize] = useState('');
  const [cleaningFrequency, setCleaningFrequency] = useState('');
  const [bedrooms, setBedrooms] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [additionalServices, setAdditionalServices] = useState<string[]>([]);
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    calculateEstimate();
  }, [propertyType, propertySize, cleaningFrequency, bedrooms, bathrooms, additionalServices]);

  const calculateEstimate = () => {
    let base = 0;

    if (propertySize === 'small') base = 40;
    else if (propertySize === 'medium') base = 60;
    else if (propertySize === 'large') base = 90;
    else if (propertySize === 'extra-large') base = 120;

    if (cleaningFrequency === 'weekly') base *= 4;
    else if (cleaningFrequency === 'bi-weekly') base *= 2;
    else if (cleaningFrequency === 'monthly') base *= 1;

    base += bedrooms * 10 + bathrooms * 15;
    base += additionalServices.length * 20;

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

    if (!propertyType || !propertySize || !cleaningFrequency) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const { error: submitError } = await supabase
        .from('quotes')
        .insert({
          user_id: user!.id,
          property_type: propertyType,
          property_size: propertySize,
          cleaning_frequency: cleaningFrequency,
          bedrooms,
          bathrooms,
          additional_services: additionalServices,
          special_requirements: specialRequirements,
          estimated_cost: estimatedCost,
          status: 'pending',
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setError('');

      setPropertyType('');
      setPropertySize('');
      setCleaningFrequency('');
      setBedrooms(0);
      setBathrooms(0);
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
          <p className="text-gray-600 mb-8">Get an instant estimate for your cleaning needs</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select property type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="office">Office</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Size <span className="text-red-500">*</span>
                </label>
                <select
                  value={propertySize}
                  onChange={(e) => setPropertySize(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select size</option>
                  <option value="small">Small (up to 1000 sq ft)</option>
                  <option value="medium">Medium (1000-2000 sq ft)</option>
                  <option value="large">Large (2000-3000 sq ft)</option>
                  <option value="extra-large">Extra Large (3000+ sq ft)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cleaning Frequency <span className="text-red-500">*</span>
                </label>
                <select
                  value={cleaningFrequency}
                  onChange={(e) => setCleaningFrequency(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select frequency</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi-weekly">Bi-Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="one-time">One-Time</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bedrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Bathrooms
                </label>
                <input
                  type="number"
                  min="0"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Additional Services
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {['Deep Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Laundry Service'].map((service) => (
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

            <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
              <p className="text-sm text-gray-600 mb-2">Estimated Monthly Cost</p>
              <p className="text-4xl font-bold text-[#ec008c]">£{estimatedCost.toFixed(2)}</p>
              <p className="text-sm text-purple-600 mt-2">
                This is an estimate. Final pricing will be confirmed in your quote.
              </p>
            </div>

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
