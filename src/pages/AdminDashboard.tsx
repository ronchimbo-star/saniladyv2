import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

interface Quote {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  property_type: string;
  property_size: string;
  cleaning_frequency: string;
  bedrooms: number;
  bathrooms: number;
  additional_services: string[];
  special_requirements: string;
  estimated_cost: number;
  status: string;
  viewed_by_admin: boolean;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [quoteStatus, setQuoteStatus] = useState('');

  useEffect(() => {
    checkAdminRole();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      fetchQuotes();
    }
  }, [isAdmin]);

  const checkAdminRole = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.role === 'admin') {
        setIsAdmin(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      navigate('/dashboard');
    }
  };

  const fetchQuotes = async () => {
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuotes(data || []);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsViewed = async (quoteId: string) => {
    try {
      await supabase
        .from('quotes')
        .update({ viewed_by_admin: true })
        .eq('id', quoteId);

      fetchQuotes();
    } catch (error) {
      console.error('Error marking quote as viewed:', error);
    }
  };

  const handleViewQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setAdminNotes(quote.admin_notes || '');
    setQuoteStatus(quote.status);
    if (!quote.viewed_by_admin) {
      markAsViewed(quote.id);
    }
  };

  const handleUpdateQuote = async () => {
    if (!selectedQuote) return;

    try {
      await supabase
        .from('quotes')
        .update({
          admin_notes: adminNotes,
          status: quoteStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedQuote.id);

      setSelectedQuote(null);
      fetchQuotes();
    } catch (error) {
      console.error('Error updating quote:', error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center space-x-2 mb-8">
            <img src="/sanilady-favicon-v2.png" alt="SaniLady" className="h-8 w-8" />
            <span className="text-xl font-bold text-gray-800">SaniLady</span>
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 px-4 py-3 bg-pink-50 text-pink-600 rounded-lg font-medium">
              <span>📊</span>
              <span>Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📋</span>
              <span>Quote Requests</span>
            </a>
            <Link to="/admin/customers" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>👥</span>
              <span>Customers</span>
            </Link>
            <Link to="/admin/subscriptions" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>🔄</span>
              <span>Subscriptions</span>
            </Link>
            <Link to="/admin/service-visits" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📅</span>
              <span>Service Visits</span>
            </Link>
            <Link to="/admin/waste-transfer-notes" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📝</span>
              <span>Waste Transfer Notes</span>
            </Link>
            <Link to="/admin/news" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>📰</span>
              <span>News Articles</span>
            </Link>
            <Link to="/admin/testimonials" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>💬</span>
              <span>Testimonials</span>
            </Link>
            <Link to="/admin/settings" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg">
              <span>⚙️</span>
              <span>Site Settings</span>
            </Link>
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Quote Requests</h1>
          <p className="text-gray-600">Manage and respond to customer quote requests</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
          </div>
        ) : quotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-gray-600">No quote requests yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <tr key={quote.id} className={!quote.viewed_by_admin ? 'bg-pink-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          quote.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : quote.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.status}
                      </span>
                      {!quote.viewed_by_admin && (
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          New
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.customer_name || 'Not provided'}
                      </div>
                      <div className="text-sm text-gray-500">{quote.customer_email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 capitalize">
                        {quote.property_type.replace(/-/g, ' ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-pink-600">
                        £{Number(quote.estimated_cost).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(quote.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewQuote(quote)}
                        className="text-pink-600 hover:text-pink-900"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">Quote Details</h2>
                  <button
                    onClick={() => setSelectedQuote(null)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-3 text-pink-600">Customer Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{selectedQuote.customer_name || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedQuote.customer_email || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedQuote.customer_phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Company</p>
                        <p className="font-medium">{selectedQuote.company_name || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-b pb-4">
                    <h3 className="font-semibold text-lg mb-3 text-pink-600">Service Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Service Type</p>
                        <p className="font-medium capitalize">{selectedQuote.property_type.replace(/-/g, ' ')}</p>
                      </div>
                      {selectedQuote.property_size !== 'N/A' && (
                        <div>
                          <p className="text-sm text-gray-600">Facility Size</p>
                          <p className="font-medium capitalize">{selectedQuote.property_size}</p>
                        </div>
                      )}
                      {selectedQuote.bedrooms > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Employees</p>
                          <p className="font-medium">{selectedQuote.bedrooms}</p>
                        </div>
                      )}
                      {selectedQuote.bathrooms > 0 && (
                        <div>
                          <p className="text-sm text-gray-600">Bins</p>
                          <p className="font-medium">{selectedQuote.bathrooms}</p>
                        </div>
                      )}
                    </div>
                    {selectedQuote.additional_services.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Additional Services</p>
                        <p className="font-medium">{selectedQuote.additional_services.join(', ')}</p>
                      </div>
                    )}
                    {selectedQuote.special_requirements && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">Special Requirements</p>
                        <p className="font-medium">{selectedQuote.special_requirements}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Estimated Monthly Cost</p>
                    <p className="text-3xl font-bold text-pink-600">
                      £{Number(selectedQuote.estimated_cost).toFixed(2)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={quoteStatus}
                      onChange={(e) => setQuoteStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="contacted">Contacted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Admin Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500"
                      placeholder="Add notes about this quote..."
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleUpdateQuote}
                      className="flex-1 bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white py-3 rounded-lg font-semibold hover:shadow-lg"
                    >
                      Update Quote
                    </button>
                    <button
                      onClick={() => setSelectedQuote(null)}
                      className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
