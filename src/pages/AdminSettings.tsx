import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  id: string;
  google_analytics_id: string;
  header_logo_url: string;
  footer_logo_url: string;
  favicon_url: string;
  contact_phone: string;
  contact_email: string;
  contact_address: string;
}

export default function AdminSettings() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchSettings();
  }, [isAdmin, navigate]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setSettings(data);
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setError('');
    setSuccess(false);
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({
          google_analytics_id: settings.google_analytics_id,
          header_logo_url: settings.header_logo_url,
          footer_logo_url: settings.footer_logo_url,
          favicon_url: settings.favicon_url,
          contact_phone: settings.contact_phone,
          contact_email: settings.contact_email,
          contact_address: settings.contact_address,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof SiteSettings, value: string) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec008c] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load settings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Site Settings</h1>
          <p className="text-gray-600 mb-8">Manage global site configuration and contact information</p>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Google Analytics ID
                </label>
                <input
                  type="text"
                  value={settings.google_analytics_id}
                  onChange={(e) => handleChange('google_analytics_id', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Your Google Analytics tracking ID
                </p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Branding Assets</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Header Logo URL
                  </label>
                  <input
                    type="text"
                    value={settings.header_logo_url}
                    onChange={(e) => handleChange('header_logo_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="/sanilady-logo-header.png"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Path to the logo displayed in the header
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Footer Logo URL
                  </label>
                  <input
                    type="text"
                    value={settings.footer_logo_url}
                    onChange={(e) => handleChange('footer_logo_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="/sanilady-logo-footer.png"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Path to the logo displayed in the footer
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Favicon URL
                  </label>
                  <input
                    type="text"
                    value={settings.favicon_url}
                    onChange={(e) => handleChange('favicon_url', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="/sanilady-favicon-v2.png"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Path to the favicon (browser tab icon)
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={settings.contact_phone}
                    onChange={(e) => handleChange('contact_phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="0800 123 4567"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Main contact phone number displayed site-wide
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={settings.contact_email}
                    onChange={(e) => handleChange('contact_email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="info@sanilady.co.uk"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Main contact email address displayed site-wide
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Address
                  </label>
                  <input
                    type="text"
                    value={settings.contact_address}
                    onChange={(e) => handleChange('contact_address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Serving Kent, London & Essex"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Business address or service area displayed site-wide
                  </p>
                </div>
              </div>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                Settings updated successfully!
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white font-bold py-4 rounded-full hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin')}
                className="px-8 bg-gray-200 text-gray-700 font-bold py-4 rounded-full hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
