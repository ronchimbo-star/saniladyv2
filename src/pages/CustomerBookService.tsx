import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  company_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
}

export default function CustomerBookService() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    service_type: 'ad_hoc_collection',
    preferred_date: '',
    preferred_time: 'morning',
    bin_count: 1,
    special_instructions: '',
  });

  useEffect(() => {
    fetchCustomerData();
  }, [user]);

  async function fetchCustomerData() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setCustomer(data);
    } catch (error: any) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer data');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!customer) return;

    setSubmitting(true);
    setError('');

    try {
      const scheduledDate = new Date(`${formData.preferred_date}T${formData.preferred_time === 'morning' ? '09:00:00' : '14:00:00'}`);

      const { error } = await supabase.from('service_visits').insert({
        customer_id: customer.id,
        scheduled_date: scheduledDate.toISOString(),
        status: 'scheduled',
        bin_count: formData.bin_count,
        notes: `Ad-hoc service request. Time preference: ${formData.preferred_time}. ${formData.special_instructions}`,
      });

      if (error) throw error;

      navigate('/dashboard', {
        state: { message: 'Service booking request submitted successfully! We will confirm your appointment soon.' }
      });
    } catch (error: any) {
      console.error('Error booking service:', error);
      setError(error.message || 'Failed to book service');
    } finally {
      setSubmitting(false);
    }
  }

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Required</h2>
            <p className="text-gray-600 mb-6">
              Please contact us to set up your customer profile before booking services.
            </p>
            <Link
              to="/contact"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <Link to="/dashboard" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Book Ad-hoc Service</h1>
          <p className="text-gray-600 mt-2">Request an additional service visit outside your regular schedule</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Address</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="font-medium text-gray-900">{customer.company_name}</p>
            <p className="text-gray-600 mt-1">
              {customer.address_line_1}
              {customer.address_line_2 && <>, {customer.address_line_2}</>}
            </p>
            <p className="text-gray-600">
              {customer.city}, {customer.postcode}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Service Details</h2>

          <div>
            <label htmlFor="service_type" className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              id="service_type"
              value={formData.service_type}
              onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="ad_hoc_collection">Ad-hoc Bin Collection</option>
              <option value="emergency_service">Emergency Service</option>
              <option value="additional_bins">Additional Bin Service</option>
            </select>
          </div>

          <div>
            <label htmlFor="bin_count" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Bins *
            </label>
            <input
              type="number"
              id="bin_count"
              required
              min="1"
              max="20"
              value={formData.bin_count}
              onChange={(e) => setFormData({ ...formData, bin_count: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date *
              </label>
              <input
                type="date"
                id="preferred_date"
                required
                min={getMinDate()}
                max={getMaxDate()}
                value={formData.preferred_date}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Minimum 24 hours notice required</p>
            </div>

            <div>
              <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time *
              </label>
              <select
                id="preferred_time"
                required
                value={formData.preferred_time}
                onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="morning">Morning (9AM - 12PM)</option>
                <option value="afternoon">Afternoon (2PM - 5PM)</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="special_instructions" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions
            </label>
            <textarea
              id="special_instructions"
              rows={4}
              value={formData.special_instructions}
              onChange={(e) => setFormData({ ...formData, special_instructions: e.target.value })}
              placeholder="Any special requirements or access instructions..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Booking Information</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Minimum 24 hours notice required for all bookings</li>
              <li>We will confirm your appointment within 4 business hours</li>
              <li>Standard ad-hoc service rates apply</li>
              <li>Emergency services may incur additional charges</li>
            </ul>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/dashboard"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Booking Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
