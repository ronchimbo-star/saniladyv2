import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Settings {
  contact_email: string;
  contact_phone: string;
  company_name: string;
}

export default function Privacy() {
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
      <div className="bg-gradient-to-br from-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy Policy
          </h1>
          <p className="text-lg opacity-90">Last updated: 07 February 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
          <div className="prose prose-lg max-w-none">
          <h2 className="text-2xl font-bold text-gray-800 mt-0 mb-4">1. Introduction</h2>
          <p>
            SaniLady ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your personal information when you use our website and
            services.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <p>We collect information you voluntarily provide when you:</p>
          <ul>
            <li>Register for an account</li>
            <li>Request quotes or information</li>
            <li>Sign up for services</li>
            <li>Contact us</li>
            <li>Participate in surveys or promotions</li>
          </ul>
          <p>This may include your name, email address, phone number, company name, and other contact details.</p>

          <h3>2.2 Information Automatically Collected</h3>
          <p>When you visit our website, we automatically collect:</p>
          <ul>
            <li>Device and browser information</li>
            <li>IP address</li>
            <li>Pages visited and time spent</li>
            <li>Referring website</li>
            <li>Cookies and similar technologies (see our Cookie Policy)</li>
          </ul>

          <h3>2.3 Service-Related Information</h3>
          <p>For clients using our services, we collect:</p>
          <ul>
            <li>Service location and facility details</li>
            <li>Collection schedules and service history</li>
            <li>Billing and payment information</li>
            <li>Employee enrollment data (for Period Dignity programme)</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">3. How We Use Your Information</h2>
          <p>We use collected information to:</p>
          <ul>
            <li>Provide and manage our services</li>
            <li>Process quotes and service requests</li>
            <li>Communicate about services, updates, and offers</li>
            <li>Improve our website and services</li>
            <li>Ensure security and prevent fraud</li>
            <li>Comply with legal obligations</li>
            <li>Analyze usage and conduct market research</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">4. Legal Basis for Processing (UK GDPR)</h2>
          <p>We process your personal data based on:</p>
          <ul>
            <li><strong>Contract Performance:</strong> To provide services you've requested</li>
            <li><strong>Legitimate Interests:</strong> To improve services and prevent fraud</li>
            <li><strong>Consent:</strong> For marketing communications (you can opt out anytime)</li>
            <li><strong>Legal Obligation:</strong> To comply with regulatory requirements</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">5. Information Sharing and Disclosure</h2>
          <p>We may share your information with:</p>
          <h3>5.1 Service Providers</h3>
          <p>
            Third-party vendors who help us deliver services (payment processors, delivery partners, IT support).
            These providers are contractually obligated to protect your data.
          </p>
          <h3>5.2 Business Transfers</h3>
          <p>
            If we merge with or are acquired by another entity, your information may be transferred to the new
            owners.
          </p>
          <h3>5.3 Legal Requirements</h3>
          <p>
            When required by law, regulation, legal process, or governmental request.
          </p>
          <h3>5.4 With Your Consent</h3>
          <p>
            We may share information for other purposes with your explicit consent.
          </p>
          <p>
            <strong>We never sell your personal information to third parties.</strong>
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information,
            including:
          </p>
          <ul>
            <li>Encryption of data in transit and at rest</li>
            <li>Regular security assessments</li>
            <li>Access controls and authentication</li>
            <li>Employee training on data protection</li>
            <li>Secure backup systems</li>
          </ul>
          <p>
            However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute
            security.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">7. Data Retention</h2>
          <p>
            We retain personal information for as long as necessary to fulfill the purposes outlined in this
            policy, unless a longer retention period is required by law. Specifically:
          </p>
          <ul>
            <li>Active client data: Duration of service plus 7 years (for accounting/legal purposes)</li>
            <li>Quote requests: 2 years from last contact</li>
            <li>Marketing data: Until you opt out or request deletion</li>
            <li>Website analytics: 26 months</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">8. Your Rights</h2>
          <p>Under UK data protection law, you have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request copies of your personal information</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Erasure:</strong> Request deletion of your data (subject to legal requirements)</li>
            <li><strong>Restriction:</strong> Request limitation of processing</li>
            <li><strong>Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Object:</strong> Object to processing based on legitimate interests</li>
            <li><strong>Withdraw Consent:</strong> Opt out of marketing communications anytime</li>
          </ul>
          <p>
            To exercise these rights, contact us at{' '}
            <a href={`mailto:${settings.contact_email}`} className="text-blue-600 hover:underline">
              {settings.contact_email}
            </a>
            .
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">9. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to enhance your experience. See our Cookie Policy for
            detailed information about the cookies we use and how to manage them.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">10. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. We are not responsible for the privacy
            practices of these sites. We encourage you to review their privacy policies.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">11. Children's Privacy</h2>
          <p>
            Our services are not directed to individuals under 16. We do not knowingly collect personal
            information from children. If you believe we have collected information from a child, please contact
            us immediately.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">12. International Data Transfers</h2>
          <p>
            Your information is primarily processed in the United Kingdom. If we transfer data outside the UK, we
            ensure appropriate safeguards are in place as required by UK data protection laws.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">13. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of significant changes by
            posting the new policy on our website with the revision date. Your continued use of our services
            constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">14. Contact Us</h2>
          <p className="mb-4">
            For questions about this Privacy Policy or to exercise your rights, contact:
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <p className="mb-2">
              <strong className="text-gray-800">{settings.company_name} Data Protection</strong>
            </p>
            <p className="mb-1">
              <span className="font-medium text-gray-700">Email:</span>{' '}
              <a href={`mailto:${settings.contact_email}`} className="text-blue-600 hover:underline">
                {settings.contact_email}
              </a>
            </p>
            <p className="mb-0">
              <span className="font-medium text-gray-700">Phone:</span>{' '}
              <a href={`tel:${settings.contact_phone}`} className="text-blue-600 hover:underline">
                {settings.contact_phone}
              </a>
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">15. Complaints</h2>
          <p>
            If you believe we have not handled your personal information properly, you have the right to lodge a
            complaint with the Information Commissioner's Office (ICO):
          </p>
          <p>
            Website: www.ico.org.uk<br />
            Helpline: 0303 123 1113
          </p>

          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-l-4 border-blue-800">
            <p className="text-sm text-gray-700 mb-0">
              <strong className="text-gray-800">Your Privacy Matters:</strong> We are committed to transparency in how we handle your data.
              If you have any questions or concerns, please don't hesitate to contact us.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
