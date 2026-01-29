import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  service_type: string;
  company_name: string;
  contact_name: string;
  contact_role: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
  is_published: boolean;
  display_order: number;
}

export default function AdminTestimonials() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    service_type: 'period-dignity',
    company_name: '',
    contact_name: '',
    contact_role: '',
    testimonial_text: '',
    rating: 5,
    image_url: '',
    is_published: true,
    display_order: 0
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchTestimonials();
  }, [isAdmin, navigate]);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('service_type')
        .order('display_order');

      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        const { error: updateError } = await supabase
          .from('testimonials')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId);

        if (updateError) throw updateError;
        setSuccess('Testimonial updated successfully!');
      } else {
        const { error: insertError } = await supabase
          .from('testimonials')
          .insert([formData]);

        if (insertError) throw insertError;
        setSuccess('Testimonial created successfully!');
      }

      resetForm();
      fetchTestimonials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving testimonial:', err);
      setError('Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      service_type: testimonial.service_type,
      company_name: testimonial.company_name,
      contact_name: testimonial.contact_name,
      contact_role: testimonial.contact_role,
      testimonial_text: testimonial.testimonial_text,
      rating: testimonial.rating,
      image_url: testimonial.image_url,
      is_published: testimonial.is_published,
      display_order: testimonial.display_order
    });
    setEditingId(testimonial.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccess('Testimonial deleted successfully!');
      fetchTestimonials();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      setError('Failed to delete testimonial');
    }
  };

  const resetForm = () => {
    setFormData({
      service_type: 'period-dignity',
      company_name: '',
      contact_name: '',
      contact_role: '',
      testimonial_text: '',
      rating: 5,
      image_url: '',
      is_published: true,
      display_order: 0
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec008c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/admin" className="text-[#ec008c] hover:underline">
            ← Back to Admin Dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Testimonials Management</h1>
              <p className="text-gray-600">Manage case studies and testimonials for both services</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
              >
                Add New Testimonial
              </button>
            )}
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {editingId ? 'Edit Testimonial' : 'New Testimonial'}
              </h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.service_type}
                      onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="period-dignity">Period Dignity</option>
                      <option value="waste-services">Waste Services</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rating <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="5">5 Stars</option>
                      <option value="4">4 Stars</option>
                      <option value="3">3 Stars</option>
                      <option value="2">2 Stars</option>
                      <option value="1">1 Star</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.company_name}
                      onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="e.g., TechCorp Solutions"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="e.g., Sarah Matthews"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Role
                    </label>
                    <input
                      type="text"
                      value={formData.contact_role}
                      onChange={(e) => setFormData({ ...formData, contact_role: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="e.g., HR Director"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://images.pexels.com/..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Use Pexels or other stock photo URLs
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Testimonial Text <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.testimonial_text}
                    onChange={(e) => setFormData({ ...formData, testimonial_text: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none"
                    placeholder="Enter the testimonial content..."
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_published}
                      onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                      className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Publish on website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white font-bold py-3 rounded-full hover:shadow-lg transition-all"
                >
                  {editingId ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 bg-gray-200 text-gray-700 font-bold py-3 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Period Dignity Testimonials</h2>
            {testimonials.filter(t => t.service_type === 'period-dignity').length === 0 ? (
              <p className="text-gray-500">No testimonials yet for Period Dignity</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.filter(t => t.service_type === 'period-dignity').map((testimonial) => (
                  <div key={testimonial.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    {testimonial.image_url && (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.company_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{testimonial.company_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {testimonial.contact_name} {testimonial.contact_role && `- ${testimonial.contact_role}`}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.testimonial_text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    {!testimonial.is_published && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm">
                        Not Published
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            <h2 className="text-xl font-bold text-gray-800 mt-12">Waste Services Testimonials</h2>
            {testimonials.filter(t => t.service_type === 'waste-services').length === 0 ? (
              <p className="text-gray-500">No testimonials yet for Waste Services</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {testimonials.filter(t => t.service_type === 'waste-services').map((testimonial) => (
                  <div key={testimonial.id} className="bg-white border-2 border-gray-200 rounded-xl p-6">
                    {testimonial.image_url && (
                      <img
                        src={testimonial.image_url}
                        alt={testimonial.company_name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <div className="flex items-center mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-xl">★</span>
                      ))}
                    </div>
                    <h3 className="font-bold text-gray-800 mb-2">{testimonial.company_name}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {testimonial.contact_name} {testimonial.contact_role && `- ${testimonial.contact_role}`}
                    </p>
                    <p className="text-gray-700 mb-4 line-clamp-3">{testimonial.testimonial_text}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial.id)}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    {!testimonial.is_published && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded text-sm">
                        Not Published
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
