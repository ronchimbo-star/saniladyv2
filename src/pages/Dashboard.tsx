import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

interface Quote {
  id: string;
  property_type: string;
  property_size: string;
  cleaning_frequency: string;
  estimated_cost: number;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.email}
          </h1>
          <p className="text-gray-600">Manage your cleaning service quotes</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Quotes</h2>
            <Link
              to="/quote-request"
              className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
            >
              Request New Quote
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your quotes...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <p className="text-gray-600 mb-4">You haven't requested any quotes yet</p>
              <Link
                to="/quote-request"
                className="text-[#ec008c] font-semibold hover:underline"
              >
                Request your first quote
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {quotes.map((quote) => (
                <div
                  key={quote.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 capitalize">
                        {quote.property_type} - {quote.property_size}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {quote.cleaning_frequency} Cleaning
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#ec008c]">
                        £{Number(quote.estimated_cost).toFixed(2)}
                      </p>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 ${
                          quote.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : quote.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {quote.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Requested on {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
