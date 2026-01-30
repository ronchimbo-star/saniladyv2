import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  bin_count: number;
  frequency: string;
  contract_length: string;
  start_date: string;
  end_date: string | null;
  monthly_price: number;
  status: string;
  created_at: string;
  services: {
    name: string;
    description: string | null;
  } | null;
}

export default function CustomerSubscriptions() {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, [user]);

  async function fetchSubscriptions() {
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (customerData) {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('*, services(name, description)')
          .eq('customer_id', customerData.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const formattedSubs = (data || []).map(sub => ({
          ...sub,
          services: Array.isArray(sub.services) && sub.services.length > 0 ? sub.services[0] : sub.services
        }));

        setSubscriptions(formattedSubs as Subscription[]);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly';
      case 'biweekly':
        return 'Bi-weekly';
      case 'monthly':
        return 'Monthly';
      default:
        return frequency;
    }
  };

  const getContractLabel = (contract: string) => {
    switch (contract) {
      case 'monthly':
        return 'Monthly Rolling';
      case '6month':
        return '6 Month Contract';
      case 'annual':
        return 'Annual Contract';
      default:
        return contract;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading subscriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link to="/dashboard" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Subscriptions</h1>
              <p className="text-gray-600 mt-2">View and manage your active service subscriptions</p>
            </div>
          </div>
        </div>

        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Subscriptions Yet</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active subscriptions. Contact us to get started!
            </p>
            <Link
              to="/contact"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {subscriptions.map((subscription) => (
              <div key={subscription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-pink-50 to-blue-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {subscription.services?.name || 'Service'}
                      </h2>
                      <p className="text-gray-600 mt-1">{subscription.services?.description}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                      {subscription.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Service Frequency</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getFrequencyLabel(subscription.frequency)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Number of Bins</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subscription.bin_count} bins
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Contract Type</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {getContractLabel(subscription.contract_length)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Monthly Price</p>
                      <p className="text-2xl font-bold text-pink-600">
                        £{Number(subscription.monthly_price).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-1">Start Date</p>
                      <p className="text-gray-900">
                        {new Date(subscription.start_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {subscription.end_date && (
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">End Date</p>
                        <p className="text-gray-900">
                          {new Date(subscription.end_date).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-medium text-blue-900 mb-2">Need to make changes?</h3>
                    <p className="text-sm text-blue-800 mb-3">
                      To modify your subscription, change frequency, or adjust bin count, please contact our support team.
                    </p>
                    <Link
                      to="/contact"
                      className="inline-block bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Contact Support
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
