import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Customer {
  id: string;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
  location_tier: string;
  status: string;
  created_at: string;
  users?: {
    email: string;
  };
}

interface Subscription {
  id: string;
  service_id: string;
  bin_count: number;
  frequency: string;
  start_date: string;
  end_date: string | null;
  monthly_price: number;
  status: string;
  services: {
    name: string;
  };
}

interface ServiceVisit {
  id: string;
  scheduled_date: string;
  completed_date: string | null;
  status: string;
  notes: string | null;
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

export default function AdminCustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [serviceVisits, setServiceVisits] = useState<ServiceVisit[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  async function fetchCustomerData() {
    try {
      const [customerRes, subscriptionsRes, visitsRes, invoicesRes] = await Promise.all([
        supabase
          .from('customers')
          .select('*, users:user_id(email)')
          .eq('id', id)
          .single(),
        supabase
          .from('subscriptions')
          .select('*, services(name)')
          .eq('customer_id', id)
          .order('created_at', { ascending: false }),
        supabase
          .from('service_visits')
          .select('*')
          .eq('customer_id', id)
          .order('scheduled_date', { ascending: false })
          .limit(10),
        supabase
          .from('invoices')
          .select('*')
          .eq('customer_id', id)
          .order('issue_date', { ascending: false })
          .limit(10),
      ]);

      if (customerRes.error) throw customerRes.error;
      setCustomer(customerRes.data);
      setSubscriptions(subscriptionsRes.data || []);
      setServiceVisits(visitsRes.data || []);
      setInvoices(invoicesRes.data || []);
    } catch (error) {
      console.error('Error fetching customer data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading customer details...</div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Not Found</h2>
          <Link to="/admin/customers" className="text-pink-600 hover:text-pink-700">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin/customers" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Customers
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{customer.company_name}</h1>
              <p className="mt-2 text-gray-600">{customer.users?.email}</p>
            </div>
            <div className="flex gap-3">
              <Link
                to={`/admin/customers/${id}/edit`}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Customer
              </Link>
              <span className={`px-4 py-3 inline-flex text-sm font-semibold rounded-lg ${getStatusBadgeClass(customer.status)}`}>
                {customer.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Contact Person</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.contact_person || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.phone || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.users?.email}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
            <address className="not-italic text-sm text-gray-900">
              {customer.address_line_1}<br />
              {customer.address_line_2 && <>{customer.address_line_2}<br /></>}
              {customer.city}<br />
              {customer.postcode}
            </address>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Location Tier</dt>
                <dd className="mt-1 text-sm text-gray-900">{customer.location_tier}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Customer Since</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(customer.created_at).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Active Subscriptions</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {subscriptions.filter(s => s.status === 'active').length}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Subscriptions</h2>
              <Link
                to={`/admin/subscriptions/new?customer_id=${id}`}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                Add Subscription
              </Link>
            </div>
            {subscriptions.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No subscriptions yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bins</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {subscriptions.map((sub) => (
                      <tr key={sub.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.services.name}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.frequency}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{sub.bin_count}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">£{Number(sub.monthly_price).toFixed(2)}/mo</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(sub.status)}`}>
                            {sub.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Service Visits</h2>
            </div>
            {serviceVisits.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                No service visits yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bins</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {serviceVisits.map((visit) => (
                      <tr key={visit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(visit.scheduled_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(visit.status)}`}>
                            {visit.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{visit.bin_count}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">{visit.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
            </div>
            {invoices.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
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
                    {invoices.map((invoice) => (
                      <tr key={invoice.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.invoice_number}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(invoice.issue_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(invoice.due_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">£{Number(invoice.total_amount).toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(invoice.status)}`}>
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
