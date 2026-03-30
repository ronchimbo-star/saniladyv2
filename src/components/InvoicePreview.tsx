import { InvoiceWithItems, invoiceService } from '../lib/invoiceService';

interface InvoicePreviewProps {
  invoice: InvoiceWithItems;
  onClose: () => void;
  onDownload: () => void;
}

export default function InvoicePreview({ invoice, onClose, onDownload }: InvoicePreviewProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 print:bg-transparent print:static print:p-0">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:rounded-none print:max-h-none">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Invoice Preview</h2>
          <div className="flex gap-2">
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-[#ec008c] text-white rounded hover:bg-[#d0007a]"
            >
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-white border border-gray-200 rounded-lg p-8">
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
                    <span className="text-right">CIRCULAR HORIZONS INTERNATIONAL LTD t/a SaniLady</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="font-medium">Invoice Number</span>
                    <span>{invoice.invoice_number || 'PREVIEW'}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="font-medium">Invoice Date</span>
                    <span>{new Date(invoice.issue_date).toLocaleDateString('en-GB')}</span>
                  </div>
                  {invoice.invoice_type === 'proforma' && invoice.valid_until && (
                    <div className="flex justify-between gap-8">
                      <span className="font-medium">Valid Until</span>
                      <span>{new Date(invoice.valid_until).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  {invoice.invoice_type === 'invoice' && invoice.due_date && (
                    <div className="flex justify-between gap-8">
                      <span className="font-medium">Due Date</span>
                      <span>{new Date(invoice.due_date).toLocaleDateString('en-GB')}</span>
                    </div>
                  )}
                  {invoice.reference && (
                    <div className="flex justify-between gap-8">
                      <span className="font-medium">Reference</span>
                      <span>{invoice.reference}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Qty</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Unit Price</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {invoice.line_items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm text-gray-900 whitespace-pre-line">{item.description}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right">
                        {invoiceService.formatCurrency(item.unit_price)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                        {invoiceService.formatCurrency(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{invoiceService.formatCurrency(invoice.subtotal)}</span>
                  </div>
                  <div className="flex justify-between pb-2">
                    <span className="text-gray-600">VAT ({invoice.vat_rate}%):</span>
                    <span className="font-medium">{invoiceService.formatCurrency(invoice.vat_amount)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-gray-300 text-lg font-bold">
                    <span>Total:</span>
                    <span>{invoiceService.formatCurrency(invoice.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {(invoice.payment_terms || invoice.notes) && (
              <div className="border-t border-gray-200 pt-6 space-y-4">
                {invoice.payment_terms && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment Terms</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.payment_terms}</p>
                  </div>
                )}
                {invoice.notes && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-sm text-gray-600 whitespace-pre-line">{invoice.notes}</p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200 text-xs text-gray-500 text-center space-y-1">
              <p>CIRCULAR HORIZONS INTERNATIONAL LTD t/a SaniLady</p>
              <p>Company Registration: 15474713 | VAT: 460067173 | Registered Address: 128 City Road, London, EC1V 2NX | Email: info@sanilady.co.uk | Phone: 0800 652 8668</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
