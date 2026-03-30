import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { invoiceService, InvoiceWithItems } from '../lib/invoiceService';

export default function AdminInvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
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
            className="text-[#ec008c] hover:text-[#d0007a]"
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
              className="px-4 py-2 bg-[#ec008c] text-white rounded hover:bg-[#d0007a]"
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

      <div className="bg-white shadow-lg rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        <div className="p-8 print:p-12">
          <div className="flex justify-between items-start mb-8">
            <div className="flex-1">
              <div className="mb-6">
                <img
                  src="/sanilady-logo-header.png"
                  alt="SaniLady"
                  className="h-12 mb-4"
                />
              </div>
              <div className="space-y-4">
                <div className="text-sm text-gray-600 space-y-0.5">
                  <p className="font-medium">To</p>
                  <p className="font-semibold text-gray-900">{invoice.billing_company_name}</p>
                  <p>{invoice.billing_address_line_1}</p>
                  {invoice.billing_address_line_2 && <p>{invoice.billing_address_line_2}</p>}
                  <p>{invoice.billing_city}</p>
                  <p>{invoice.billing_postcode}</p>
                </div>

                {invoice.service_location_name && (
                  <div className="text-sm text-gray-600 space-y-0.5 pt-2 border-t border-gray-200">
                    <p className="font-medium">Service Address</p>
                    <p className="font-semibold text-gray-900">{invoice.service_location_name}</p>
                    {invoice.service_address_line_1 && <p>{invoice.service_address_line_1}</p>}
                    {invoice.service_address_line_2 && <p>{invoice.service_address_line_2}</p>}
                    {invoice.service_city && <p>{invoice.service_city}</p>}
                    {invoice.service_postcode && <p>{invoice.service_postcode}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="text-right">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {invoice.invoice_type === 'proforma' ? 'Proforma Invoice' : 'Invoice'}
              </h1>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-8">
                  <span className="font-medium">From</span>
                  <span className="text-right">CIRCULAR HORIZONS INTERNATIONAL<br/>LTD t/a SaniLady</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="font-medium">Invoice number</span>
                  <span>{invoice.invoice_number}</span>
                </div>
                <div className="flex justify-between gap-8">
                  <span className="font-medium">Invoice date</span>
                  <span>
                    {new Date(invoice.issue_date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                {invoice.reference && (
                  <div className="flex justify-between gap-8">
                    <span className="font-medium">PO / Reference</span>
                    <span>{invoice.reference}</span>
                  </div>
                )}
                <div className="flex justify-between gap-8">
                  <span className="font-medium">Payment terms</span>
                  <span>7 days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <table className="w-full border-t border-b border-gray-300">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-3 text-sm font-semibold text-gray-900">
                    Item
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-24">
                    Rate
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-20">
                    Qty
                  </th>
                  <th className="text-right py-3 text-sm font-semibold text-gray-900 w-32">
                    Gross
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-3 text-sm text-gray-700">
                      <div className="whitespace-pre-line">{item.description}</div>
                    </td>
                    <td className="py-3 text-sm text-gray-700 text-right">
                      {invoiceService.formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-3 text-sm text-gray-700 text-right">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-sm text-gray-700 text-right">
                      {invoiceService.formatCurrency(item.line_total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border-t-2 border-gray-900 pt-4 mb-8">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between text-2xl font-bold mb-1">
                  <span>Total</span>
                  <span>{invoiceService.formatCurrency(invoice.total_amount)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment due</span>
                  <span>
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                      : new Date(new Date(invoice.issue_date).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Invoice note</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              SaniLady is a tradename of Circular Horizons International LTD. Co Reg. 15821509. All prices include VAT at the standard rate of 20%. VAT No. 232 8003 02.
            </p>
          </div>

          <div className="border-t border-gray-300 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">How to pay this invoice</h3>
            <div className="space-y-1 text-sm text-gray-700">
              <p><span className="font-medium">Account name:</span> CIRCULAR HORIZONS INTERNATIONAL LTD</p>
              <p><span className="font-medium">Payment reference:</span> {invoice.invoice_number}</p>
              <p className="font-medium mt-3">Details for UK payments:</p>
              <p><span className="font-medium">Account number:</span> 93187193</p>
              <p><span className="font-medium">Sort code:</span> 23-11-85</p>
              <p><span className="font-medium">Payment method:</span> BACS or FPS payments only</p>
            </div>
          </div>

          {invoice.invoice_type === 'proforma' && (
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded print:bg-gray-50">
              <p className="text-sm text-gray-700">
                <strong>Note:</strong> This is a proforma invoice only. This is not a VAT invoice for
                payment already made. Payment must be received in full before any services commence.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-300 text-xs text-gray-600">
            <p>Trading address: SaniLady, Unit A 82 James Carter Road, Mildenhall, IP28 7DE</p>
            <p>Registered company no. 15821509</p>
          </div>
        </div>
      </div>
    </div>
  );
}
