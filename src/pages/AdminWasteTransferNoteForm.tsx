import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface WasteTransferNoteForm {
  customer_id: string;
  reference_number: string;
  issue_date: string;
  waste_description: string;
  waste_quantity: string;
  waste_classification: string;
  collection_address: string;
  disposal_site: string;
  carrier_details: string;
}

interface Customer {
  id: string;
  company_name: string;
  address_line_1: string;
  address_line_2: string | null;
  city: string;
  postcode: string;
}

export default function AdminWasteTransferNoteForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState<WasteTransferNoteForm>({
    customer_id: '',
    reference_number: `WTN-${Date.now()}`,
    issue_date: new Date().toISOString().split('T')[0],
    waste_description: '',
    waste_quantity: '',
    waste_classification: 'sanitary_waste',
    collection_address: '',
    disposal_site: '',
    carrier_details: 'SaniLady Waste Services',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  async function fetchCustomers() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, company_name, address_line_1, address_line_2, city, postcode')
        .eq('status', 'active')
        .order('company_name');

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  }

  function handleCustomerChange(customerId: string) {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      const address = [
        customer.address_line_1,
        customer.address_line_2,
        customer.city,
        customer.postcode
      ].filter(Boolean).join(', ');

      setFormData({
        ...formData,
        customer_id: customerId,
        collection_address: address,
      });
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.from('documents').insert({
        customer_id: formData.customer_id,
        document_type: 'waste_carrier_note',
        document_path: `/waste-transfer-notes/${formData.reference_number}.pdf`,
        reference_number: formData.reference_number,
        issue_date: formData.issue_date,
      });

      if (error) throw error;

      navigate('/admin/waste-transfer-notes');
    } catch (error: any) {
      console.error('Error creating waste transfer note:', error);
      setError(error.message || 'Failed to create waste transfer note');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin/waste-transfer-notes" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Waste Transfer Notes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Generate Waste Transfer Note</h1>
          <p className="mt-2 text-gray-600">Create a new waste carrier compliance document</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700 mb-2">
                Customer *
              </label>
              <select
                id="customer_id"
                required
                value={formData.customer_id}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="reference_number" className="block text-sm font-medium text-gray-700 mb-2">
                Reference Number *
              </label>
              <input
                type="text"
                id="reference_number"
                required
                value={formData.reference_number}
                onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-2">
                Issue Date *
              </label>
              <input
                type="date"
                id="issue_date"
                required
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="collection_address" className="block text-sm font-medium text-gray-700 mb-2">
                Collection Address *
              </label>
              <textarea
                id="collection_address"
                required
                rows={3}
                value={formData.collection_address}
                onChange={(e) => setFormData({ ...formData, collection_address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="waste_classification" className="block text-sm font-medium text-gray-700 mb-2">
                Waste Classification *
              </label>
              <select
                id="waste_classification"
                required
                value={formData.waste_classification}
                onChange={(e) => setFormData({ ...formData, waste_classification: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="sanitary_waste">Sanitary Waste</option>
                <option value="general_waste">General Waste</option>
                <option value="recyclable">Recyclable Materials</option>
                <option value="hazardous">Hazardous Waste</option>
                <option value="clinical">Clinical Waste</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="waste_description" className="block text-sm font-medium text-gray-700 mb-2">
                Waste Description *
              </label>
              <textarea
                id="waste_description"
                required
                rows={3}
                value={formData.waste_description}
                onChange={(e) => setFormData({ ...formData, waste_description: e.target.value })}
                placeholder="Describe the type of waste collected..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="waste_quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="text"
                id="waste_quantity"
                required
                value={formData.waste_quantity}
                onChange={(e) => setFormData({ ...formData, waste_quantity: e.target.value })}
                placeholder="e.g., 5 bins, 20kg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="carrier_details" className="block text-sm font-medium text-gray-700 mb-2">
                Carrier Details *
              </label>
              <input
                type="text"
                id="carrier_details"
                required
                value={formData.carrier_details}
                onChange={(e) => setFormData({ ...formData, carrier_details: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="disposal_site" className="block text-sm font-medium text-gray-700 mb-2">
                Disposal Site *
              </label>
              <input
                type="text"
                id="disposal_site"
                required
                value={formData.disposal_site}
                onChange={(e) => setFormData({ ...formData, disposal_site: e.target.value })}
                placeholder="Address of disposal/treatment facility"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">Compliance Notice</h3>
            <p className="text-sm text-yellow-700">
              This waste transfer note is a legal document. Ensure all information is accurate
              and complete. The note must be retained for a minimum of 2 years as required by
              waste management regulations.
            </p>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/admin/waste-transfer-notes"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate Waste Transfer Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
