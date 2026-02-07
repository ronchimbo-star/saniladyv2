import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  contact_email: string;
  contact_phone: string;
  company_name: string;
}

export default function CookiePolicy() {
  const [settings, setSettings] = useState<Settings>({
    contact_email: 'hello@sanilady.co.uk',
    contact_phone: '+447757664788',
    company_name: 'SaniLady'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('contact_email, contact_phone, company_name')
        .eq('id', 'default')
        .maybeSingle();

      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-green-700 to-green-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg opacity-90">Last updated: 07 February 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-800 mt-0 mb-4">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit a website. They help websites
            remember your preferences, analyze how you use the site, and improve your browsing experience.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. How We Use Cookies</h2>
          <p>
            SaniLady uses cookies to:
          </p>
          <ul>
            <li>Remember your preferences and settings</li>
            <li>Understand how visitors use our website</li>
            <li>Improve website functionality and performance</li>
            <li>Provide personalized content and advertising</li>
            <li>Ensure security and prevent fraud</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. Types of Cookies We Use</h2>

          <h3>3.1 Strictly Necessary Cookies</h3>
          <p>
            These cookies are essential for the website to function properly. They enable core functionality such
            as security, authentication, and basic website operations. You cannot opt out of these cookies as the
            website won't work without them.
          </p>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Cookie Name</th>
                <th className="border px-4 py-2">Purpose</th>
                <th className="border px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">session_id</td>
                <td className="border px-4 py-2">Maintains your login session</td>
                <td className="border px-4 py-2">Session</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">cookie_consent</td>
                <td className="border px-4 py-2">Remembers your cookie preferences</td>
                <td className="border px-4 py-2">1 year</td>
              </tr>
            </tbody>
          </table>

          <h3>3.2 Performance Cookies</h3>
          <p>
            These cookies collect information about how visitors use our website, such as which pages are visited
            most often. This helps us improve how our website works.
          </p>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Cookie Name</th>
                <th className="border px-4 py-2">Purpose</th>
                <th className="border px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">_ga</td>
                <td className="border px-4 py-2">Google Analytics - tracks visitor behavior</td>
                <td className="border px-4 py-2">2 years</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">_gid</td>
                <td className="border px-4 py-2">Google Analytics - distinguishes users</td>
                <td className="border px-4 py-2">24 hours</td>
              </tr>
            </tbody>
          </table>

          <h3>3.3 Functional Cookies</h3>
          <p>
            These cookies allow the website to remember choices you make (such as your language or region) and
            provide enhanced, personalized features.
          </p>
          <table className="min-w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Cookie Name</th>
                <th className="border px-4 py-2">Purpose</th>
                <th className="border px-4 py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">user_preferences</td>
                <td className="border px-4 py-2">Stores your site preferences</td>
                <td className="border px-4 py-2">6 months</td>
              </tr>
            </tbody>
          </table>

          <h3>3.4 Targeting/Advertising Cookies</h3>
          <p>
            These cookies are used to deliver advertisements relevant to you and your interests. They also help
            limit the number of times you see an advertisement and measure campaign effectiveness.
          </p>
          <p>
            <em>We currently do not use advertising cookies, but may do so in the future with your consent.</em>
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Third-Party Cookies</h2>
          <p>
            Some cookies are placed by third-party services that appear on our pages. We use the following
            third-party services:
          </p>
          <ul>
            <li>
              <strong>Google Analytics:</strong> To analyze website traffic and user behavior
            </li>
            <li>
              <strong>Supabase:</strong> For authentication and database services
            </li>
          </ul>
          <p>
            These third parties have their own privacy policies. We recommend reviewing them:
          </p>
          <ul>
            <li>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
                Google Privacy Policy
              </a>
            </li>
            <li>
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                Supabase Privacy Policy
              </a>
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Managing Cookies</h2>
          <h3>5.1 Cookie Consent Banner</h3>
          <p>
            When you first visit our website, you'll see a cookie consent banner allowing you to accept or
            decline non-essential cookies.
          </p>

          <h3>5.2 Browser Settings</h3>
          <p>
            Most web browsers allow you to control cookies through their settings. You can:
          </p>
          <ul>
            <li>Block all cookies</li>
            <li>Delete existing cookies</li>
            <li>Allow cookies only from specific websites</li>
            <li>Set browsers to notify you when a cookie is sent</li>
          </ul>
          <p>
            Learn how to manage cookies in popular browsers:
          </p>
          <ul>
            <li>
              <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
                Google Chrome
              </a>
            </li>
            <li>
              <a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">
                Mozilla Firefox
              </a>
            </li>
            <li>
              <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
                Safari
              </a>
            </li>
            <li>
              <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">
                Microsoft Edge
              </a>
            </li>
          </ul>

          <h3>5.3 Impact of Blocking Cookies</h3>
          <p>
            Blocking or deleting cookies may impact your experience on our website. Some features may not work
            properly, and you may need to re-enter information on subsequent visits.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Do Not Track Signals</h2>
          <p>
            Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to
            be tracked. We do not currently respond to DNT signals, but we respect your privacy choices made
            through our cookie consent banner.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">7. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy to reflect changes in our practices or for legal, operational, or
            regulatory reasons. The "Last Updated" date at the top indicates when this policy was last revised.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have questions about our use of cookies, please contact us:
          </p>
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <p className="mb-2">
              <strong className="text-gray-800">{settings.company_name}</strong>
            </p>
            <p className="mb-1">
              <span className="font-medium text-gray-700">Email:</span>{' '}
              <a href={`mailto:${settings.contact_email}`} className="text-green-700 hover:underline">
                {settings.contact_email}
              </a>
            </p>
            <p className="mb-0">
              <span className="font-medium text-gray-700">Phone:</span>{' '}
              <a href={`tel:${settings.contact_phone}`} className="text-green-700 hover:underline">
                {settings.contact_phone}
              </a>
            </p>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border-l-4 border-green-700">
            <p className="text-sm text-gray-700 mb-0">
              <strong className="text-gray-800">Your Control:</strong> You're always in control of how cookies are used on your device.
              Adjust your preferences through our cookie banner or your browser settings at any time.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
