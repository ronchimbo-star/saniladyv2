import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface SubscriptionForm {
  customer_id: string;
  service_id: string;
  bin_count: number;
  frequency: string;
  contract_length: string;
  start_date: string;
  end_date: string;
  monthly_price: number;
  status: string;
}

interface Customer {
  id: string;
  company_name: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  base_price: number;
}

export default function AdminSubscriptionForm() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState<SubscriptionForm>({
    customer_id: searchParams.get('customer_id') || '',
    service_id: '',
    bin_count: 1,
    frequency: 'weekly',
    contract_length: 'monthly',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    monthly_price: 0,
    status: 'active',
  });

  const isEditMode = id !== 'new';

  useEffect(() => {
    fetchCustomersAndServices();
    if (isEditMode) {
      fetchSubscription();
    }
  }, [id]);

  async function fetchCustomersAndServices() {
    try {
      const [customersRes, servicesRes] = await Promise.all([
        supabase.from('customers').select('id, company_name').eq('status', 'active').order('company_name'),
        supabase.from('services').select('*').order('name'),
      ]);

      if (customersRes.error) throw customersRes.error;
      if (servicesRes.error) throw servicesRes.error;

      setCustomers(customersRes.data || []);
      setServices(servicesRes.data || []);

      if (servicesRes.data && servicesRes.data.length > 0 && !formData.service_id) {
        const firstService = servicesRes.data[0];
        setFormData(prev => ({
          ...prev,
          service_id: firstService.id,
          monthly_price: Number(firstService.base_price),
        }));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load form data');
    }
  }

  async function fetchSubscription() {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          customer_id: data.customer_id,
          service_id: data.service_id,
          bin_count: data.bin_count,
          frequency: data.frequency,
          contract_length: data.contract_length,
          start_date: data.start_date.split('T')[0],
          end_date: data.end_date ? data.end_date.split('T')[0] : '',
          monthly_price: Number(data.monthly_price),
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      setError('Failed to load subscription data');
    }
  }

  function handleServiceChange(serviceId: string) {
    const service = services.find(s => s.id === serviceId);
    setFormData({
      ...formData,
      service_id: serviceId,
      monthly_price: service ? Number(service.base_price) : 0,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const subscriptionData = {
        customer_id: formData.customer_id,
        service_id: formData.service_id,
        bin_count: formData.bin_count,
        frequency: formData.frequency,
        contract_length: formData.contract_length,
        start_date: formData.start_date,
        end_date: formData.end_date || null,
        monthly_price: formData.monthly_price,
        status: formData.status,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from('subscriptions')
          .update(subscriptionData)
          .eq('id', id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('subscriptions')
          .insert(subscriptionData);

        if (error) throw error;
      }

      navigate('/admin/subscriptions');
    } catch (error: any) {
      console.error('Error saving subscription:', error);
      setError(error.message || 'Failed to save subscription');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin/subscriptions" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Subscriptions
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Subscription' : 'Add New Subscription'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {services.length === 0 && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            No services available. Please create services first before adding subscriptions.
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
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
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

            <div className="md:col-span-2">
              <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-2">
                Service *
              </label>
              <select
                id="service_id"
                required
                value={formData.service_id}
                onChange={(e) => handleServiceChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name} - £{Number(service.base_price).toFixed(2)}
                  </option>
                ))}
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
                value={formData.bin_count}
                onChange={(e) => setFormData({ ...formData, bin_count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="frequency" className="block text-sm font-medium text-gray-700 mb-2">
                Service Frequency *
              </label>
              <select
                id="frequency"
                required
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div>
              <label htmlFor="contract_length" className="block text-sm font-medium text-gray-700 mb-2">
                Contract Length *
              </label>
              <select
                id="contract_length"
                required
                value={formData.contract_length}
                onChange={(e) => setFormData({ ...formData, contract_length: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="monthly">Monthly</option>
                <option value="6month">6 Months</option>
                <option value="annual">Annual</option>
              </select>
            </div>

            <div>
              <label htmlFor="monthly_price" className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Price (£) *
              </label>
              <input
                type="number"
                id="monthly_price"
                required
                min="0"
                step="0.01"
                value={formData.monthly_price}
                onChange={(e) => setFormData({ ...formData, monthly_price: parseFloat(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                id="start_date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="end_date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/admin/subscriptions"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || services.length === 0}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Subscription' : 'Create Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
