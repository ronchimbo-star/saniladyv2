import { useState } from 'react';
import { Link } from 'react-router-dom';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What services does SaniLady offer?',
      answer: 'We offer two main services: the Period Dignity at Work Programme (a tax-free employee benefit providing feminine hygiene products) and professional Sanitary Waste Management services (bin supply, collection, and disposal).',
    },
    {
      category: 'general',
      question: 'Which areas do you cover?',
      answer: 'We currently serve businesses across Kent, London, and Essex. If you\'re outside these areas, please contact us as we may be able to accommodate your needs.',
    },
    {
      category: 'period-dignity',
      question: 'How does the Period Dignity at Work Programme work?',
      answer: 'Employers enroll in the programme and employees sign up to receive personalized feminine hygiene products delivered monthly. The employer pays a fixed monthly fee per employee, and we handle all administration and delivery.',
    },
    {
      category: 'period-dignity',
      question: 'Is the Period Dignity programme really tax-free?',
      answer: 'Yes, it\'s 100% HMRC-compliant as a tax-free employee benefit. There are no additional tax implications for your organization or participating employees.',
    },
    {
      category: 'period-dignity',
      question: 'What products are available in the programme?',
      answer: 'We offer a wide range including tampons, pads, menstrual cups, period underwear, and eco-friendly options. Employees can fully customize their monthly selection.',
    },
    {
      category: 'period-dignity',
      question: 'How much does the Period Dignity programme cost?',
      answer: 'Our programme has three tiers: Essential (£35/month per employee), Premium (£55/month), and Deluxe (£85/month). The cost depends on the level of products and customization chosen.',
    },
    {
      category: 'waste',
      question: 'What is included in your waste management service?',
      answer: 'Our service includes bin supply and installation, regular collection (weekly, fortnightly, or monthly), cleaning and sanitization, licensed disposal, maintenance and repairs, and full compliance documentation.',
    },
    {
      category: 'waste',
      question: 'How often are bins collected?',
      answer: 'Collection frequency depends on your needs and the package you choose. We offer weekly, fortnightly, and monthly collection schedules.',
    },
    {
      category: 'waste',
      question: 'Do you provide the bins?',
      answer: 'Yes, we supply and install all sanitary bins as part of our service. The bins are modern, hygienic, and designed for discreet washroom placement.',
    },
    {
      category: 'waste',
      question: 'Are you licensed for waste disposal?',
      answer: 'Yes, we are fully licensed waste carriers and all waste is disposed of at licensed facilities in compliance with UK environmental regulations.',
    },
    {
      category: 'waste',
      question: 'What happens if a bin is damaged?',
      answer: 'We provide free maintenance and repairs. If a bin is damaged or malfunctioning, we\'ll repair or replace it at no additional cost.',
    },
    {
      category: 'pricing',
      question: 'Do you offer contracts or flexible terms?',
      answer: 'We offer both contract and rolling monthly options. Contact us to discuss which arrangement works best for your organization.',
    },
    {
      category: 'pricing',
      question: 'Are there any setup fees?',
      answer: 'Setup fees vary depending on your requirements. For waste management, bin installation is typically included. Contact us for a detailed quote.',
    },
    {
      category: 'pricing',
      question: 'Can we combine both services?',
      answer: 'Absolutely! Many of our clients use both the Period Dignity programme and waste management services. We offer package pricing for combined services.',
    },
    {
      category: 'getting-started',
      question: 'How do I get started?',
      answer: 'Simply request a quote through our website or contact us directly. We\'ll discuss your needs, provide a detailed proposal, and can typically start service within 1-2 weeks.',
    },
    {
      category: 'getting-started',
      question: 'How long does setup take?',
      answer: 'For waste management, we can typically install bins and start service within 1-2 weeks. For the Period Dignity programme, employee enrollment can begin immediately once your organization is set up.',
    },
    {
      category: 'getting-started',
      question: 'Can I get a site assessment?',
      answer: 'Yes! We offer free site assessments for waste management services. We\'ll visit your facility and provide customized recommendations.',
    },
  ];

  const categories = [
    { id: 'all', name: 'All Questions' },
    { id: 'general', name: 'General' },
    { id: 'period-dignity', name: 'Period Dignity Programme' },
    { id: 'waste', name: 'Waste Management' },
    { id: 'pricing', name: 'Pricing & Contracts' },
    { id: 'getting-started', name: 'Getting Started' },
  ];

  const filteredFaqs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Find answers to common questions about our services
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="flex flex-wrap gap-3 mb-12 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-800 pr-8">{faq.question}</span>
                <span className="text-2xl text-pink-600 flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 text-gray-700 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
