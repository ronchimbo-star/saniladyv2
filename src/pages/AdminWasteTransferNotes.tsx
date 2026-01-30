import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface WasteTransferNote {
  id: string;
  customer_id: string;
  reference_number: string;
  issue_date: string;
  collection_address: string;
  waste_classification: string;
  waste_description: string;
  waste_quantity: string;
  ewc_code: string;
  notes: string | null;
  document_path: string;
  created_at: string;
  customers: {
    company_name: string;
    postcode: string;
  };
}

export default function AdminWasteTransferNotes() {
  const [documents, setDocuments] = useState<WasteTransferNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<string>('all');

  useEffect(() => {
    fetchDocuments();
  }, []);

  async function fetchDocuments() {
    try {
      const { data, error } = await supabase
        .from('waste_transfer_notes')
        .select(`
          *,
          customers(company_name, postcode)
        `)
        .order('issue_date', { ascending: false });

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching waste transfer notes:', error);
    } finally {
      setLoading(false);
    }
  }

  const getFilteredDocuments = () => {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const currentYear = new Date(now.getFullYear(), 0, 1);

    return documents.filter(doc => {
      const matchesSearch =
        doc.customers.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.reference_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.customers.postcode.toLowerCase().includes(searchTerm.toLowerCase());

      const issueDate = new Date(doc.issue_date);
      let matchesDate = true;

      if (dateFilter === 'this_month') {
        matchesDate = issueDate >= currentMonth;
      } else if (dateFilter === 'last_month') {
        matchesDate = issueDate >= lastMonth && issueDate < currentMonth;
      } else if (dateFilter === 'this_year') {
        matchesDate = issueDate >= currentYear;
      }

      return matchesSearch && matchesDate;
    });
  };

  const filteredDocuments = getFilteredDocuments();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading waste transfer notes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Waste Transfer Notes</h1>
              <p className="mt-2 text-gray-600">Manage compliance documentation and waste carrier notes</p>
            </div>
            <Link
              to="/admin/waste-transfer-notes/new"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
            >
              Generate New Note
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Notes</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="mt-2 text-3xl font-bold text-pink-600">
                  {documents.filter(wtn => {
                    const issueDate = new Date(wtn.issue_date);
                    const now = new Date();
                    return issueDate.getMonth() === now.getMonth() &&
                           issueDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">This Year</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">
                  {documents.filter(wtn => {
                    const issueDate = new Date(wtn.issue_date);
                    const now = new Date();
                    return issueDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by customer, reference, or postcode..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date Filter
              </label>
              <select
                id="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="all">All Time</option>
                <option value="this_month">This Month</option>
                <option value="last_month">Last Month</option>
                <option value="this_year">This Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Waste Transfer Notes ({filteredDocuments.length})
            </h2>
          </div>

          {filteredDocuments.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              {searchTerm || dateFilter !== 'all'
                ? 'No waste transfer notes found matching your search criteria.'
                : 'No waste transfer notes generated yet.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{doc.reference_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          to={`/admin/customers/${doc.customer_id}`}
                          className="text-sm font-medium text-pink-600 hover:text-pink-900"
                        >
                          {doc.customers.company_name}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(doc.issue_date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{doc.customers.postcode}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => alert('Download functionality will be implemented')}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => alert('Email functionality will be implemented')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Compliance Information</h3>
          <p className="text-sm text-blue-700">
            Waste Transfer Notes are legal documents required for waste disposal compliance.
            They must be retained for a minimum of 2 years. All notes are automatically linked
            to customer records and can be exported for regulatory audits.
          </p>
        </div>
      </div>
    </div>
  );
}
