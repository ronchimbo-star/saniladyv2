import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [formType, setFormType] = useState<'general' | 'quote'>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name || !email || !message) {
      setError('Please fill in all required fields');
      return;
    }

    if (formType === 'quote' && !serviceType) {
      setError('Please select a service type');
      return;
    }

    setLoading(true);

    try {
      const { error: submitError } = await supabase
        .from('contact_submissions')
        .insert({
          type: formType,
          name,
          email,
          phone,
          company,
          subject: formType === 'general' ? subject : '',
          message,
          service_type: formType === 'quote' ? serviceType : '',
          status: 'pending',
        });

      if (submitError) throw submitError;

      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setSubject('');
      setMessage('');
      setServiceType('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError('Failed to submit your message. Please try again or email us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-600">
            Have a question or ready to get started? We're here to help.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📧</div>
            <h3 className="font-bold text-gray-800 mb-2">Email Us</h3>
            <p className="text-gray-600">info@sanilady.co.uk</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="font-bold text-gray-800 mb-2">Call Us</h3>
            <p className="text-gray-600">0800 XXX XXXX</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-4xl mb-4">📍</div>
            <h3 className="font-bold text-gray-800 mb-2">Service Area</h3>
            <p className="text-gray-600">Kent, London & Essex</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex gap-4 mb-8 border-b">
            <button
              onClick={() => setFormType('general')}
              className={`pb-4 px-6 font-semibold transition-all ${
                formType === 'general'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              General Enquiry
            </button>
            <button
              onClick={() => setFormType('quote')}
              className={`pb-4 px-6 font-semibold transition-all ${
                formType === 'quote'
                  ? 'text-pink-600 border-b-4 border-pink-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Request a Quote
            </button>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-6">
              Thank you for your message! We'll get back to you as soon as possible.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="07XXX XXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Your Company"
                />
              </div>
            </div>

            {formType === 'general' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="What is your enquiry about?"
                />
              </div>
            )}

            {formType === 'quote' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="">Select a service...</option>
                  <option value="period-dignity">Period Dignity at Work Programme</option>
                  <option value="waste-management">Sanitary Waste Management</option>
                  <option value="both">Both Services</option>
                  <option value="individual">Individual Subscription</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder={
                  formType === 'general'
                    ? 'Tell us how we can help...'
                    : 'Please provide details about your requirements...'
                }
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white py-4 rounded-lg font-bold text-lg hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : formType === 'general' ? 'Send Message' : 'Request Quote'}
            </button>
          </form>
        </div>

        <div className="mt-12 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Why Choose SaniLady?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Expert Service</h3>
                <p className="text-gray-600 text-sm">Years of experience in feminine hygiene solutions</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Flexible Plans</h3>
                <p className="text-gray-600 text-sm">Customized solutions to fit your needs and budget</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Quick Response</h3>
                <p className="text-gray-600 text-sm">We aim to respond to all enquiries within 24 hours</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-pink-600 text-xl">✓</span>
              <div>
                <h3 className="font-semibold text-gray-800">Local Coverage</h3>
                <p className="text-gray-600 text-sm">Serving Kent, London, and Essex with dedication</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
