import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { invoiceService, Invoice, InvoiceLineItem, InvoiceWithItems } from '../lib/invoiceService';
import { supabase } from '../lib/supabase';
import InvoicePreview from '../components/InvoicePreview';

interface Customer {
  id: string;
  company_name: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  postcode: string;
}

export default function AdminInvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewInvoice, setPreviewInvoice] = useState<InvoiceWithItems | null>(null);

  const [formData, setFormData] = useState<Invoice>({
    invoice_type: 'proforma',
    customer_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    due_date: '',
    valid_until: '',
    reference: '',
    billing_company_name: '',
    billing_address_line_1: '',
    billing_address_line_2: '',
    billing_city: '',
    billing_postcode: '',
    billing_country: 'United Kingdom',
    service_location_name: '',
    service_address_line_1: '',
    service_address_line_2: '',
    service_city: '',
    service_postcode: '',
    service_country: 'United Kingdom',
    subtotal: 0,
    vat_rate: 20,
    vat_amount: 0,
    total_amount: 0,
    status: 'draft',
    payment_terms: '',
    notes: ''
  });

  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    {
      description: '',
      quantity: 1,
      unit_price: 0,
      line_total: 0,
      sort_order: 0,
      term_multiplier: 1
    }
  ]);

  useEffect(() => {
    loadCustomers();
    if (id) {
      loadInvoice();
    }
  }, [id]);

  useEffect(() => {
    if (selectedCustomer) {
      setFormData(prev => ({
        ...prev,
        customer_id: selectedCustomer.id,
        billing_company_name: selectedCustomer.company_name,
        billing_address_line_1: selectedCustomer.address_line_1,
        billing_address_line_2: selectedCustomer.address_line_2 || '',
        billing_city: selectedCustomer.city,
        billing_postcode: selectedCustomer.postcode
      }));
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    const { data } = await supabase
      .from('customers')
      .select('id, company_name, address_line_1, address_line_2, city, postcode')
      .eq('status', 'active')
      .order('company_name');

    if (data) setCustomers(data);
  };

  const loadInvoice = async () => {
    if (!id) return;

    try {
      const invoice = await invoiceService.getInvoice(id);
      if (invoice) {
        setFormData(invoice);
        setLineItems(invoice.line_items.length > 0 ? invoice.line_items : [{
          description: '',
          quantity: 1,
          unit_price: 0,
          line_total: 0,
          sort_order: 0,
          term_multiplier: 1
        }]);
      }
    } catch (error) {
      console.error('Error loading invoice:', error);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer || null);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, {
      description: '',
      quantity: 1,
      unit_price: 0,
      line_total: 0,
      sort_order: lineItems.length,
      term_multiplier: 1
    }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof InvoiceLineItem, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'quantity' || field === 'unit_price' || field === 'term_multiplier') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : updated[index].quantity;
      const unitPrice = field === 'unit_price' ? parseFloat(value) || 0 : updated[index].unit_price;
      const termMultiplier = field === 'term_multiplier' ? parseFloat(value) || 1 : (updated[index].term_multiplier || 1);
      updated[index].line_total = quantity * unitPrice * termMultiplier;
    }

    setLineItems(updated);
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.line_total, 0);
    const vatAmount = invoiceService.calculateVAT(subtotal, formData.vat_rate);
    const total = invoiceService.calculateTotal(subtotal, vatAmount);

    return { subtotal, vatAmount, total };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { subtotal, vatAmount, total } = calculateTotals();

      const invoiceData = {
        ...formData,
        due_date: formData.due_date || undefined,
        valid_until: formData.valid_until || undefined,
        paid_date: formData.paid_date || undefined,
        subtotal,
        vat_amount: vatAmount,
        total_amount: total
      };

      if (id) {
        await invoiceService.updateInvoice(id, invoiceData);
        await invoiceService.updateLineItems(id, lineItems);
      } else {
        await invoiceService.createInvoice(invoiceData, lineItems);
      }

      navigate('/admin/invoices');
    } catch (error: any) {
      console.error('Error saving invoice:', error);
      const errorMessage = error?.message || error?.toString() || 'Unknown error';
      alert(`Failed to save invoice: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    const { subtotal, vatAmount, total } = calculateTotals();

    const preview: InvoiceWithItems = {
      ...formData,
      vat_rate: typeof formData.vat_rate === 'string' ? parseFloat(formData.vat_rate) : formData.vat_rate,
      id: id || 'preview',
      invoice_number: formData.invoice_number || 'PREVIEW',
      subtotal,
      vat_amount: vatAmount,
      total_amount: total,
      line_items: lineItems,
      created_at: formData.created_at || new Date().toISOString(),
      updated_at: formData.updated_at || new Date().toISOString()
    };

    setPreviewInvoice(preview);
    setShowPreview(true);
  };

  const handleDownloadPDF = () => {
    if (previewInvoice) {
      const originalTitle = document.title;
      document.title = `${previewInvoice.invoice_number} - ${previewInvoice.billing_company_name}`;

      window.print();

      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }
  };

  const { subtotal, vatAmount, total } = calculateTotals();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {id ? 'Edit Invoice' : 'Create Invoice'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Invoice Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.invoice_type}
                onChange={(e) => setFormData({ ...formData, invoice_type: e.target.value as 'proforma' | 'invoice' })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="proforma">Proforma Invoice</option>
                <option value="invoice">Invoice</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.customer_id}
                onChange={(e) => handleCustomerChange(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">Select customer...</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference
              </label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Customer reference"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {formData.invoice_type === 'invoice' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Billing Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billing_company_name}
                onChange={(e) => setFormData({ ...formData, billing_company_name: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billing_address_line_1}
                onChange={(e) => setFormData({ ...formData, billing_address_line_1: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.billing_address_line_2}
                onChange={(e) => setFormData({ ...formData, billing_address_line_2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billing_city}
                onChange={(e) => setFormData({ ...formData, billing_city: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.billing_postcode}
                onChange={(e) => setFormData({ ...formData, billing_postcode: e.target.value })}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Service Location (Optional)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location Name
              </label>
              <input
                type="text"
                value={formData.service_location_name}
                onChange={(e) => setFormData({ ...formData, service_location_name: e.target.value })}
                placeholder="e.g., BYD Lakeside"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1
              </label>
              <input
                type="text"
                value={formData.service_address_line_1}
                onChange={(e) => setFormData({ ...formData, service_address_line_1: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2
              </label>
              <input
                type="text"
                value={formData.service_address_line_2}
                onChange={(e) => setFormData({ ...formData, service_address_line_2: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.service_city}
                onChange={(e) => setFormData({ ...formData, service_city: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postcode
              </label>
              <input
                type="text"
                value={formData.service_postcode}
                onChange={(e) => setFormData({ ...formData, service_postcode: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Line Items</h2>
            <button
              type="button"
              onClick={addLineItem}
              className="px-3 py-1 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {lineItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-12 md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateLineItem(index, 'description', e.target.value)}
                      required
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                      placeholder="Item description"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Qty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateLineItem(index, 'quantity', e.target.value)}
                      required
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency / Term
                    </label>
                    <input
                      type="text"
                      value={item.frequency_term || ''}
                      onChange={(e) => updateLineItem(index, 'frequency_term', e.target.value)}
                      placeholder="e.g., 12 months"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Term Multiplier
                    </label>
                    <input
                      type="number"
                      value={item.term_multiplier || 1}
                      onChange={(e) => updateLineItem(index, 'term_multiplier', e.target.value)}
                      min="1"
                      step="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={(e) => updateLineItem(index, 'unit_price', e.target.value)}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="col-span-6 md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total
                    </label>
                    <input
                      type="text"
                      value={invoiceService.formatCurrency(item.line_total)}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                    />
                  </div>

                  <div className="col-span-12 md:col-span-1 flex items-end">
                    {lineItems.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLineItem(index)}
                        className="w-full px-2 py-2 text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">{invoiceService.formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT ({formData.vat_rate}%):</span>
                  <span className="font-medium">{invoiceService.formatCurrency(vatAmount)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span>{invoiceService.formatCurrency(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Terms
              </label>
              <textarea
                value={formData.payment_terms}
                onChange={(e) => setFormData({ ...formData, payment_terms: e.target.value })}
                rows={3}
                placeholder="e.g., Payment due within 30 days"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                placeholder="Additional notes or terms"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/invoices')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePreview}
            className="px-6 py-2 bg-[#ec008c] text-white rounded-md hover:bg-[#d0007a]"
          >
            Preview
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : id ? 'Update Invoice' : 'Create Invoice'}
          </button>
        </div>
      </form>

      {showPreview && previewInvoice && (
        <InvoicePreview
          invoice={previewInvoice}
          onClose={() => setShowPreview(false)}
          onDownload={handleDownloadPDF}
        />
      )}
    </div>
  );
}
