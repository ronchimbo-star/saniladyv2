import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CustomerForm {
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postcode: string;
  location_tier: string;
  status: string;
}

export default function AdminCustomerForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CustomerForm>({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    postcode: '',
    location_tier: 'tier_1',
    status: 'active',
  });

  const isEditMode = id !== 'new';

  useEffect(() => {
    if (isEditMode) {
      fetchCustomer();
    }
  }, [id]);

  async function fetchCustomer() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*, users:user_id(email)')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (data) {
        setFormData({
          company_name: data.company_name,
          contact_person: data.contact_person || '',
          phone: data.phone || '',
          email: data.users?.email || '',
          address_line_1: data.address_line_1,
          address_line_2: data.address_line_2 || '',
          city: data.city,
          postcode: data.postcode,
          location_tier: data.location_tier,
          status: data.status,
        });
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setError('Failed to load customer data');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditMode) {
        await updateCustomer();
      } else {
        await createCustomer();
      }
      navigate('/admin/customers');
    } catch (error: any) {
      console.error('Error saving customer:', error);
      setError(error.message || 'Failed to save customer');
    } finally {
      setLoading(false);
    }
  }

  async function createCustomer() {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', formData.email)
      .eq('role', 'customer')
      .maybeSingle();

    let userId = existingUser?.id;

    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: Math.random().toString(36).slice(-16),
        options: {
          data: {
            role: 'customer',
          },
        },
      });

      if (authError) throw authError;
      userId = authData.user?.id;

      if (userId) {
        const { error: userError } = await supabase.from('users').insert({
          id: userId,
          email: formData.email,
          role: 'customer',
        });

        if (userError) throw userError;
      }
    }

    if (!userId) {
      throw new Error('Failed to create user account');
    }

    const { error: customerError } = await supabase.from('customers').insert({
      user_id: userId,
      company_name: formData.company_name,
      contact_person: formData.contact_person || null,
      phone: formData.phone || null,
      address_line_1: formData.address_line_1,
      address_line_2: formData.address_line_2 || null,
      city: formData.city,
      postcode: formData.postcode,
      location_tier: formData.location_tier,
      status: formData.status,
    });

    if (customerError) throw customerError;
  }

  async function updateCustomer() {
    const { error } = await supabase
      .from('customers')
      .update({
        company_name: formData.company_name,
        contact_person: formData.contact_person || null,
        phone: formData.phone || null,
        address_line_1: formData.address_line_1,
        address_line_2: formData.address_line_2 || null,
        city: formData.city,
        postcode: formData.postcode,
        location_tier: formData.location_tier,
        status: formData.status,
      })
      .eq('id', id);

    if (error) throw error;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/admin/customers" className="text-pink-600 hover:text-pink-700 mb-4 inline-block">
            ← Back to Customers
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Customer' : 'Add New Customer'}
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="company_name"
                required
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="contact_person" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person
              </label>
              <input
                type="text"
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                id="email"
                required
                disabled={isEditMode}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-100"
              />
              {isEditMode && (
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed for existing customers</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address_line_1" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address_line_1"
                required
                value={formData.address_line_1}
                onChange={(e) => setFormData({ ...formData, address_line_1: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address_line_2" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                id="address_line_2"
                value={formData.address_line_2}
                onChange={(e) => setFormData({ ...formData, address_line_2: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                id="city"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-2">
                Postcode *
              </label>
              <input
                type="text"
                id="postcode"
                required
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="location_tier" className="block text-sm font-medium text-gray-700 mb-2">
                Location Tier *
              </label>
              <select
                id="location_tier"
                required
                value={formData.location_tier}
                onChange={(e) => setFormData({ ...formData, location_tier: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="tier_1">Tier 1</option>
                <option value="tier_2">Tier 2</option>
                <option value="tier_3">Tier 3</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <Link
              to="/admin/customers"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
