import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { invoiceService, InvoiceWithItems } from '../lib/invoiceService';
import { supabase } from '../lib/supabase';

export default function AdminInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (!id) return;

      const invoiceData = await invoiceService.getInvoice(id);
      setInvoice(invoiceData);

      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      setSiteSettings(settings);
    } catch (error) {
      console.error('Error loading invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleMarkAsPaid = async () => {
    if (!id || !confirm('Mark this invoice as paid?')) return;

    try {
      await invoiceService.markAsPaid(id, new Date().toISOString());
      await loadData();
    } catch (error) {
      console.error('Error marking as paid:', error);
      alert('Failed to mark as paid');
    }
  };

  const handleMarkAsSent = async () => {
    if (!id || !confirm('Mark this invoice as sent?')) return;

    try {
      await invoiceService.markAsSent(id);
      await loadData();
    } catch (error) {
      console.error('Error marking as sent:', error);
      alert('Failed to mark as sent');
    }
  };

  const handleDelete = async () => {
    if (!id || !confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) return;

    try {
      await invoiceService.deleteInvoice(id);
      navigate('/admin/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Invoice not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 print:hidden">
        <div className="flex justify-between items-center">
          <Link
            to="/admin/invoices"
            className="text-emerald-600 hover:text-emerald-800"
          >
            ← Back to Invoices
          </Link>
          <div className="space-x-2">
            {invoice.status === 'draft' && (
              <button
                onClick={handleMarkAsSent}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Mark as Sent
              </button>
            )}
            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
              <button
                onClick={handleMarkAsPaid}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Paid
              </button>
            )}
            <Link
              to={`/admin/invoices/${id}/edit`}
              className="inline-block px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Edit
            </Link>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Print / PDF
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 print:shadow-none">
        <div className="border-b pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {invoice.invoice_type === 'proforma' ? 'PROFORMA INVOICE' : 'INVOICE'}
              </h1>
              <div className="mt-4 space-y-1">
                <p className="text-sm text-gray-600">
                  <strong>SaniLady</strong>
                </p>
                <p className="text-sm text-gray-600">Dartford, Kent, UK</p>
                {siteSettings?.phone_number && (
                  <p className="text-sm text-gray-600">Tel: {siteSettings.phone_number}</p>
                )}
                {siteSettings?.contact_email && (
                  <p className="text-sm text-gray-600">Email: {siteSettings.contact_email}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Invoice No:</span> {invoice.invoice_number}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Date:</span>{' '}
                  {new Date(invoice.issue_date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                {invoice.valid_until && (
                  <p className="text-sm">
                    <span className="font-medium">Valid Until:</span>{' '}
                    {new Date(invoice.valid_until).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {invoice.due_date && (
                  <p className="text-sm">
                    <span className="font-medium">Due Date:</span>{' '}
                    {new Date(invoice.due_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                )}
                {invoice.reference && (
                  <p className="text-sm">
                    <span className="font-medium">Reference:</span> {invoice.reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
            <div className="text-sm text-gray-700">
              <p className="font-medium">{invoice.billing_company_name}</p>
              <p>{invoice.billing_address_line_1}</p>
              {invoice.billing_address_line_2 && <p>{invoice.billing_address_line_2}</p>}
              <p>
                {invoice.billing_city}, {invoice.billing_postcode}
              </p>
              <p>{invoice.billing_country}</p>
            </div>
          </div>

          {invoice.service_location_name && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Service Location:</h3>
              <div className="text-sm text-gray-700">
                <p className="font-medium">{invoice.service_location_name}</p>
                {invoice.service_address_line_1 && <p>{invoice.service_address_line_1}</p>}
                {invoice.service_address_line_2 && <p>{invoice.service_address_line_2}</p>}
                {invoice.service_city && invoice.service_postcode && (
                  <p>
                    {invoice.service_city}, {invoice.service_postcode}
                  </p>
                )}
                {invoice.service_country && <p>{invoice.service_country}</p>}
              </div>
            </div>
          )}
        </div>

        <div className="mb-8">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">
                  Description
                </th>
                <th className="text-center py-3 px-4 text-sm font-semibold text-gray-900 w-24">
                  Qty
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 w-32">
                  Unit Price
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 w-32">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-700 whitespace-pre-line">
                    {item.description}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-center">
                    {item.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {invoiceService.formatCurrency(item.unit_price)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700 text-right">
                    {invoiceService.formatCurrency(item.line_total)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td colSpan={3} className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                  Subtotal (ex. VAT):
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                  {invoiceService.formatCurrency(invoice.subtotal)}
                </td>
              </tr>
              <tr>
                <td colSpan={3} className="py-3 px-4 text-sm font-medium text-gray-900 text-right">
                  VAT ({invoice.vat_rate}%):
                </td>
                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                  {invoiceService.formatCurrency(invoice.vat_amount)}
                </td>
              </tr>
              <tr className="border-t-2 border-gray-300">
                <td colSpan={3} className="py-3 px-4 text-base font-bold text-gray-900 text-right">
                  Total Due (inc. VAT):
                </td>
                <td className="py-3 px-4 text-base font-bold text-gray-900 text-right">
                  {invoiceService.formatCurrency(invoice.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {invoice.payment_terms && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Payment Terms</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.payment_terms}</p>
          </div>
        )}

        {invoice.notes && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{invoice.notes}</p>
          </div>
        )}

        {invoice.invoice_type === 'proforma' && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> This is a proforma invoice only. This is not a VAT invoice for
              payment already made. Payment must be received in full before any services commence.
            </p>
          </div>
        )}

        <div className="mt-12 pt-6 border-t text-center text-sm text-gray-600">
          <p>Thank you for your business</p>
        </div>
      </div>
    </div>
  );
}
