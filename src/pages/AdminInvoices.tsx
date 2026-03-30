import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { invoiceService, Invoice } from '../lib/invoiceService';

export default function AdminInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<{
    status?: string;
    type?: string;
    search?: string;
  }>({});

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);

      const invoicesData = await invoiceService.listInvoices({
        status: filter.status,
        invoice_type: filter.type
      });

      let filtered = invoicesData;
      if (filter.search) {
        const searchLower = filter.search.toLowerCase();
        filtered = filtered.filter(inv =>
          inv.invoice_number?.toLowerCase().includes(searchLower) ||
          inv.billing_company_name?.toLowerCase().includes(searchLower) ||
          inv.reference?.toLowerCase().includes(searchLower)
        );
      }

      setInvoices(filtered);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      paid: 'bg-green-100 text-green-800',
      overdue: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-500'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status as keyof typeof styles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    return type === 'proforma' ? (
      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
        Proforma
      </span>
    ) : (
      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
        Invoice
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading invoices...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage proforma invoices and regular invoices
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/admin/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Create Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg mb-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              placeholder="Invoice number, company..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filter.type || ''}
              onChange={(e) => setFilter({ ...filter, type: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Types</option>
              <option value="proforma">Proforma</option>
              <option value="invoice">Invoice</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilter({})}
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">No invoices found</p>
          <Link
            to="/admin/invoices/new"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
          >
            Create First Invoice
          </Link>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getTypeBadge(invoice.invoice_type)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {invoice.billing_company_name}
                    </div>
                    {invoice.reference && (
                      <div className="text-sm text-gray-500">
                        Ref: {invoice.reference}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(invoice.issue_date).toLocaleDateString('en-GB')}
                    </div>
                    {invoice.due_date && (
                      <div className="text-sm text-gray-500">
                        Due: {new Date(invoice.due_date).toLocaleDateString('en-GB')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {invoiceService.formatCurrency(invoice.total_amount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {invoiceService.formatCurrency(invoice.subtotal)} + VAT
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(invoice.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      to={`/admin/invoices/${invoice.id}`}
                      className="text-emerald-600 hover:text-emerald-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/admin/invoices/${invoice.id}/edit`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
