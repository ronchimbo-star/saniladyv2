import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ServiceVisitForm {
  customer_id: string;
  subscription_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
  notes: string;
  bin_count: number;
}

interface Customer {
  id: string;
  company_name: string;
}

interface Subscription {
  id: string;
  bin_count: number;
  services: {
    name: string;
  } | null;
}

export default function AdminServiceVisitForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [formData, setFormData] = useState<ServiceVisitForm>({
    customer_id: '',
    subscription_id: '',
    scheduled_date: new Date().toISOString().split('T')[0],
    scheduled_time: '09:00',
    status: 'scheduled',
    notes: '',
    bin_count: 1,
  });

  const isEditMode = id !== 'new';

  useEffect(() => {
    fetchCustomers();
    if (isEditMode) {
      fetchServiceVisit();
    }
  }, [id]);

  useEffect(() => {
    if (formData.customer_id) {
      fetchSubscriptions(formData.customer_id);
    }
  }, [formData.customer_id]);

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name')
        .eq('status', 'active')
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  async function fetchSubscriptions(customerId: string) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, bin_count, services!inner(name)')
        .eq('customer_id', customerId)
        .eq('status', 'active');

      if (error) throw error;
      const formattedData = (data || []).map(sub => ({
        ...sub,
        services: Array.isArray(sub.services) && sub.services.length > 0 ? sub.services[0] : sub.services
      }));
      setSubscriptions(formattedData as Subscription[]);

      if (data && data.length > 0 && !formData.subscription_id) {
        setFormData(prev => ({
          ...prev,
          subscription_id: data[0].id,
          bin_count: data[0].bin_count,
        }));
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    }
  }

  async function fetchServiceVisit() {
    try {
      const { data, error } = await supabase
        .from('service_visits')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        const scheduledDate = new Date(data.scheduled_date);
        setFormData({
          customer_id: data.customer_id,
          subscription_id: data.subscription_id || '',
          scheduled_date: scheduledDate.toISOString().split('T')[0],
          scheduled_time: scheduledDate.toTimeString().slice(0, 5),
          status: data.status,
          notes: data.notes || '',
          bin_count: data.bin_count,
        });
      }
    } catch (error) {
      console.error('Error fetching service visit:', error);
      setError('Failed to load service visit data');
    }
  }

  function handleSubscriptionChange(subscriptionId: string) {
    const subscription = subscriptions.find(s => s.id === subscriptionId);
    setFormData({
      ...formData,
      subscription_id: subscriptionId,
      bin_count: subscription ? subscription.bin_count : 1,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const scheduledDateTime = new Date(`${formData.scheduled_date}T${formData.scheduled_time}`);

      const visitData = {
        customer_id: formData.customer_id,
        subscription_id: formData.subscription_id || null,
        scheduled_date: scheduledDateTime.toISOString(),
        status: formData.status,
        notes: formData.notes || null,
        bin_count: formData.bin_count,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('service_visits')
          .update(visitData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('service_visits')
          .insert(visitData);

        if (error) throw error;
      }

      navigate('/admin/service-visits');
    } catch (error: any) {
      console.error('Error saving service visit:', error);
      setError(error.message || 'Failed to save service visit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin/service-visits" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Service Visits
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Service Visit' : 'Schedule Service Visit'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                id="customer_id"
                required
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value, subscription_id: '' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            {formData.customer_id && subscriptions.length > 0 && (
              <div className="md:col-span-2">
                <label htmlFor="subscription_id" className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription (Optional)
                </label>
                <select
                  id="subscription_id"
                  value={formData.subscription_id}
                  onChange={(e) => handleSubscriptionChange(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select a subscription (or leave blank for ad-hoc)</option>
                  {subscriptions.map((subscription) => (
                    <option key={subscription.id} value={subscription.id}>
                      {subscription.services?.name || 'Service'} - {subscription.bin_count} bins
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label htmlFor="scheduled_date" className="block text-sm font-medium text-gray-700 mb-2">
                Service Date *
              </label>
              <input
                type="date"
                id="scheduled_date"
                required
                value={formData.scheduled_date}
                onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="scheduled_time" className="block text-sm font-medium text-gray-700 mb-2">
                Service Time *
              </label>
              <input
                type="time"
                id="scheduled_time"
                required
                value={formData.scheduled_time}
                onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
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
                value={formData.bin_count}
                onChange={(e) => setFormData({ ...formData, bin_count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                rows={4}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Add any special instructions or notes for this service visit..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/admin/service-visits"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Service Visit' : 'Schedule Service Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
