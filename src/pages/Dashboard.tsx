import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

interface Customer {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  address_line_1: string;
  city: string;
  postcode: string;
  status: string;
}

interface Subscription {
  id: string;
  bin_count: number;
  frequency: string;
  monthly_price: number;
  status: string;
  services: {
    name: string;
  } | null;
}

interface ServiceVisit {
  id: string;
  scheduled_date: string;
  status: string;
  bin_count: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  issue_date: string;
  due_date: string;
  total_amount: number;
  status: string;
}

export default function Dashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [upcomingVisits, setUpcomingVisits] = useState<ServiceVisit[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    if (isAdmin) {
      navigate('/admin/dashboard');
      return;
    }
    if (user) {
      fetchCustomerData();
    } else {
      setLoading(false);
    }
  }, [user, isAdmin, authLoading, navigate]);

  async function fetchCustomerData() {
    try {
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (customerError) throw customerError;

      if (customerData) {
        setCustomer(customerData);

        const [subscriptionsRes, visitsRes, invoicesRes] = await Promise.all([
          supabase
            .from('subscriptions')
            .select('*, services(name)')
            .eq('customer_id', customerData.id)
            .eq('status', 'active'),
          supabase
            .from('service_visits')
            .select('*')
            .eq('customer_id', customerData.id)
            .gte('scheduled_date', new Date().toISOString())
            .order('scheduled_date', { ascending: true })
            .limit(5),
          supabase
            .from('invoices')
            .select('*')
            .eq('customer_id', customerData.id)
            .order('issue_date', { ascending: false })
            .limit(5),
        ]);

        const formattedSubs = (subscriptionsRes.data || []).map(sub => ({
          ...sub,
          services: Array.isArray(sub.services) && sub.services.length > 0 ? sub.services[0] : sub.services
        }));

        setSubscriptions(formattedSubs as Subscription[]);
        setUpcomingVisits(visitsRes.data || []);
        setRecentInvoices(invoicesRes.data || []);
      }
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to SaniLady</h2>
            <p className="text-gray-600 mb-6">
              Your account is being set up. Please contact us to complete your customer profile.
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {customer.company_name}</h1>
          <p className="text-gray-600 mt-2">Manage your services and view account information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                <p className="text-3xl font-bold text-pink-600 mt-2">{subscriptions.length}</p>
              </div>
              <div className="text-4xl">🔄</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Upcoming Visits</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{upcomingVisits.length}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="text-lg font-bold text-green-600 mt-2 capitalize">{customer.status}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Profile</h2>
              <Link to="/dashboard/profile" className="text-sm text-pink-600 hover:text-pink-700">
                Edit
              </Link>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-gray-500">Contact Person</p>
                <p className="font-medium text-gray-900">{customer.contact_person || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{customer.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {customer.address_line_1}<br />
                  {customer.city}, {customer.postcode}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/dashboard/book-service"
                className="block w-full bg-pink-600 text-white text-center px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Book Ad-hoc Service
              </Link>
              <Link
                to="/dashboard/subscriptions"
                className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Subscriptions
              </Link>
              <Link
                to="/dashboard/documents"
                className="block w-full bg-green-600 text-white text-center px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Download Documents
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Active Subscriptions</h2>
              <Link to="/dashboard/subscriptions" className="text-sm text-pink-600 hover:text-pink-700">
                View All
              </Link>
            </div>
            {subscriptions.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No active subscriptions
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{sub.services?.name || 'Service'}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {sub.bin_count} bins • {sub.frequency}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">£{Number(sub.monthly_price).toFixed(2)}/mo</p>
                        <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getStatusBadgeClass(sub.status)}`}>
                          {sub.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Service Visits</h2>
            </div>
            {upcomingVisits.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No upcoming visits scheduled
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {upcomingVisits.map((visit) => (
                  <div key={visit.id} className="p-6 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">
                        {new Date(visit.scheduled_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {visit.bin_count} bins • {new Date(visit.scheduled_date).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${getStatusBadgeClass(visit.status)}`}>
                      {visit.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
              <Link to="/dashboard/invoices" className="text-sm text-pink-600 hover:text-pink-700">
                View All
              </Link>
            </div>
            {recentInvoices.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No invoices yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Invoice #</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          £{Number(invoice.total_amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadgeClass(invoice.status)}`}>
                            {invoice.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
