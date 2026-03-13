import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  thumbnail_url: string;
  thumbnail_alt: string;
  meta_description: string;
  published_at: string;
}

interface Testimonial {
  id: string;
  company_name: string;
  contact_name: string;
  contact_role: string;
  testimonial_text: string;
  rating: number;
  service_type: string;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function Home() {
  const { user } = useAuth();
  const [latestNews, setLatestNews] = useState<NewsArticle[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  useEffect(() => {
    fetchLatestNews();
    fetchTestimonials();
  }, []);

  const fetchLatestNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('id, title, slug, excerpt, category, thumbnail_url, thumbnail_alt, meta_description, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(3);

      if (error) throw error;
      setLatestNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('id, company_name, contact_name, contact_role, testimonial_text, rating, service_type')
        .eq('is_published', true)
        .order('display_order', { ascending: true })
        .limit(3);

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const toggleFaq = (question: string) => {
    setOpenFaq(openFaq === question ? null : question);
  };

  const faqs: FAQ[] = [
    {
      category: 'Legal & Compliance',
      question: 'Are sanitary bins a legal requirement in the UK?',
      answer: 'Yes, UK regulations require businesses to provide hygienic sanitary waste disposal in women\'s washrooms. Under the Workplace (Health, Safety and Welfare) Regulations 1992, employers must provide "suitable means" for disposing of sanitary dressings in toilets used by women. Sanitary waste is also classified as offensive waste under the Environmental Protection Act 1990 and must be disposed of by a licensed waste carrier. Failure to comply can result in fines and legal penalties.'
    },
    {
      category: 'Legal & Compliance',
      question: 'Is sanitary waste classified as hazardous?',
      answer: 'Generally, no. Sanitary waste is usually classified as offensive waste rather than hazardous, meaning it\'s non-infectious but can be unpleasant. However, it must still be handled by a licensed waste carrier under duty of care regulations.'
    },
    {
      category: 'Legal & Compliance',
      question: 'Can my cleaning staff handle sanitary waste disposal?',
      answer: 'No. Under the Environmental Protection Act 1990, only registered waste carriers licensed by the Environment Agency can legally collect and dispose of sanitary waste. Your regular cleaning staff cannot be made responsible for offensive waste disposal, and doing so could breach regulations.'
    },
    {
      category: 'Service Details',
      question: 'How often should sanitary bins be emptied?',
      answer: 'The frequency depends on your footfall and number of female employees or visitors. Most businesses choose fortnightly or monthly services. For busy locations such as hospitality venues, retail stores, or offices with high footfall, weekly collection is recommended to maintain hygiene and prevent odours. We\'ll advise on the right schedule based on your specific needs.'
    },
    {
      category: 'Service Details',
      question: 'How do SaniLady\'s sanitary bin services work?',
      answer: 'It\'s simple and discreet. We provide the sanitary bins, and on each scheduled visit, our team removes and disposes of the waste safely, replaces bin liners, cleans and disinfects each unit, refreshes the bins to maintain hygiene, and replaces bins if damaged. We handle everything so you remain compliant without any hassle.'
    },
    {
      category: 'Service Details',
      question: 'What should I do before a service visit?',
      answer: 'Simply leave your bins in the agreed collection point. Our team will handle the rest—removing waste, cleaning, and returning fresh bins ready for use. No preparation is needed on your part.'
    },
    {
      category: 'Service Details',
      question: 'Do you offer sanitary bag dispensers?',
      answer: 'Yes. We recommend adding a sanitary bag dispenser (£2.50 per month) alongside each bin. These are wall-mounted and topped up every month during your regular service, ensuring users always have access to disposal bags. This helps with odour control and keeps washrooms tidy.'
    },
    {
      category: 'Environmental & Safety',
      question: 'What happens to sanitary waste after collection?',
      answer: 'Sanitary waste is typically disposed of through incineration at licensed facilities, which removes health risks, or sent to landfill. As an environmentally conscious provider, we work with licensed partners to ensure all waste is handled safely and in compliance with UK regulations.'
    },
    {
      category: 'Environmental & Safety',
      question: 'Can I put sanitary products down the toilet?',
      answer: 'Absolutely not. Sanitary towels, tampons, wipes, and pads should never be flushed. Even products labelled as "flush-friendly" can cause expensive sewer blockages, toilet overflows, and environmental pollution in waterways. Always provide sufficient sanitary bins to prevent flushing.'
    },
    {
      category: 'Coverage & Pricing',
      question: 'What areas do you cover?',
      answer: 'SaniLady proudly serves businesses across Kent, London, Essex, Hertfordshire, Surrey, and Sussex. Contact us to check availability in your postcode.'
    },
    {
      category: 'Coverage & Pricing',
      question: 'How do I get a quote?',
      answer: 'Simply contact us via our online form or email. We\'ll discuss your requirements and provide a tailored quote based on your bin quantity and preferred service frequency.'
    },
    {
      category: 'Additional Services',
      question: 'Do you service male washrooms too?',
      answer: 'Yes, increasingly. Awareness around male incontinence is growing, and many workplaces now offer disposal bins in men\'s toilets. From younger men with medical conditions to older individuals managing prostate health, we provide discreet disposal solutions for male washrooms too.'
    }
  ];

  const faqCategories = Array.from(new Set(faqs.map(faq => faq.category)));

  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'SaniLady',
      image: 'https://sanilady.co.uk/sanilady-hero.png',
      description: 'Professional feminine hygiene and sanitary waste management services across Kent, London and Essex. Fully licensed waste carrier providing compliant disposal services.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Kent',
        addressRegion: 'England',
        addressCountry: 'GB',
      },
      telephone: '+44-1322-879-713',
      email: 'hello@sanilady.co.uk',
      url: 'https://sanilady.co.uk',
      areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'State', name: 'Kent' },
        { '@type': 'State', name: 'Essex' },
        { '@type': 'State', name: 'Hertfordshire' },
        { '@type': 'State', name: 'Surrey' },
        { '@type': 'State', name: 'Sussex' }
      ],
      priceRange: '££',
      openingHours: 'Mo-Fr 09:00-17:00',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'SaniLady',
      url: 'https://sanilady.co.uk',
      logo: 'https://sanilady.co.uk/sanilady-logo-header.png',
      sameAs: [
        'https://www.linkedin.com/company/sanilady',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+44-1322-879-713',
        email: 'hello@sanilady.co.uk',
        contactType: 'Customer Service',
        areaServed: 'GB',
        availableLanguage: 'English',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Sanitary Waste Disposal',
      provider: {
        '@type': 'LocalBusiness',
        name: 'SaniLady',
      },
      areaServed: [
        { '@type': 'City', name: 'London' },
        { '@type': 'State', name: 'Kent' },
        { '@type': 'State', name: 'Essex' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Sanitary Waste Management Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dignity at Work Programme',
              description: 'Tax-free employee benefit providing personalized feminine hygiene products',
            }
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Sanitary Waste Collection',
              description: 'Licensed sanitary bin collection and disposal services',
            }
          }
        ]
      }
    },
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="SaniLady | Feminine Hygiene & Sanitary Waste Services | Kent, London & Essex"
        description="SaniLady provides sanitary waste management and period dignity employee benefits across Kent, London and Essex. Get your free quote today."
        canonical="/"
        schema={schema}
      />
      <div className="relative bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Your Partner in Feminine Hygiene & Period Dignity
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                From reliable sanitary waste disposal to our innovative Dignity at Work programme, we provide comprehensive solutions that support employee wellbeing and simplify facility management for UK organisations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Go to Dashboard
                    </Link>
                    <Link
                      to="/quote-request"
                      className="bg-gradient-to-r from-[#ff5722] to-[#ff6f3c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Request a Quote
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/contact#quote"
                      className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center"
                    >
                      Get a Quote
                    </Link>
                    <Link
                      to="/about"
                      className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all text-center border-2 border-white"
                    >
                      Learn More
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="relative flex justify-center items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute inset-0 bg-white opacity-5 rounded-full blur-2xl transform scale-90 animate-pulse" style={{animationDelay: '1s'}}></div>
              <picture>
                <source srcSet="/sanilady-sanitary-waste.webp" type="image/webp" />
                <img
                  src="/sanilady-sanitary-waste.png"
                  alt="SaniLady Period Dignity"
                  className="relative w-full max-w-2xl drop-shadow-2xl transform hover:scale-110 transition-transform duration-700 animate-float"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
          Our Services
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Serving Kent, London, and Essex with integrated feminine hygiene solutions
        </p>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Link to="/period-dignity" className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-pink-100 transform hover:scale-[1.02] group">
            <div className="text-5xl mb-4">💼</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors">
              Dignity at Work Programme
            </h3>
            <p className="text-gray-600 mb-4">
              Tax-free employee benefit providing personalised feminine hygiene products. Support workplace wellbeing, enhance DEI initiatives, and reduce turnover.
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>HMRC-compliant tax-free benefit</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>Personalised product selection</span>
              </li>
              <li className="flex items-start">
                <span className="text-pink-600 mr-2">✓</span>
                <span>Monthly subscriptions £35-£85 per employee</span>
              </li>
            </ul>
            <div className="text-pink-600 font-semibold group-hover:underline">
              Learn More →
            </div>
          </Link>

          <Link to="/waste-services" className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all border border-blue-100 transform hover:scale-[1.02] group">
            <div className="text-5xl mb-4">♻️</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              Sanitary Waste Management
            </h3>
            <p className="text-gray-600 mb-4">
              Professional sanitary bin collection and disposal services ensuring compliance and workplace hygiene standards.
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Licensed waste disposal facilities</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Regular collection schedules</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Full regulatory compliance</span>
              </li>
            </ul>
            <div className="text-blue-600 font-semibold group-hover:underline">
              Learn More →
            </div>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">
            Individual Subscriptions
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sustainable period product subscriptions delivered directly to your home. Choose from eco-friendly options, enjoy discreet delivery, and customize your products.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#d81b8b] text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Why Choose SaniLady?
          </h2>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold mb-2">DEI Enhancement</h3>
              <p className="text-sm opacity-90">
                Tangible gender inclusion strategy implementation
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">💷</div>
              <h3 className="text-lg font-bold mb-2">Cost Savings</h3>
              <p className="text-sm opacity-90">
                Reduced turnover, absenteeism, and recruitment costs
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-2">Fully Managed</h3>
              <p className="text-sm opacity-90">
                Simplified administration with single invoicing
              </p>
            </div>

            <div className="text-center bg-white bg-opacity-10 backdrop-blur-sm p-6 rounded-xl hover:bg-opacity-20 transition-all">
              <div className="text-4xl mb-3">🌱</div>
              <h3 className="text-lg font-bold mb-2">Sustainable</h3>
              <p className="text-sm opacity-90">
                Eco-friendly product options and responsible waste disposal
              </p>
            </div>
          </div>
        </div>
      </div>

      {latestNews.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Latest News & Insights
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Stay informed with our latest articles on workplace wellbeing and period dignity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {latestNews.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.slug}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.thumbnail_url || 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={article.thumbnail_alt || article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {article.category && (
                    <span className="absolute top-4 left-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {article.category}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">
                    {formatDate(article.published_at)}
                  </p>
                  <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-pink-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-3">
                    {article.meta_description || article.excerpt}
                  </p>
                  <div className="mt-4 text-pink-600 font-semibold group-hover:underline">
                    Read More →
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/news"
              className="inline-block bg-white text-pink-600 border-2 border-pink-600 px-8 py-3 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              View All News
            </Link>
          </div>
        </div>
      )}

      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Fully Licensed & Compliant
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Your trusted partner in regulated waste management and workplace safety
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-8 text-center border border-blue-100">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Licensed Waste Carrier
              </h3>
              <p className="text-gray-600">
                Fully registered and licensed for commercial sanitary waste collection and disposal across the UK
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 text-center border border-green-100">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Full Compliance
              </h3>
              <p className="text-gray-600">
                Waste transfer notes, duty of care documentation, and complete regulatory compliance guaranteed
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 text-center border border-purple-100">
              <div className="text-5xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                HMRC Approved
              </h3>
              <p className="text-gray-600">
                Our Dignity at Work programme is HMRC-compliant as a tax-free employee benefit
              </p>
            </div>
          </div>
        </div>
      </div>

      {testimonials.length > 0 && (
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                What Our Clients Say
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Trusted by organizations across the UK
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                >
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.testimonial_text}"
                  </p>
                  <div className="border-t pt-4">
                    <p className="font-bold text-gray-800">{testimonial.contact_name}</p>
                    <p className="text-sm text-gray-600">{testimonial.contact_role}</p>
                    <p className="text-sm text-pink-600 font-semibold">{testimonial.company_name}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {testimonial.service_type === 'waste' ? 'Waste Management' : 'Period Dignity Programme'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-purple-400/10 blur-3xl"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Everything you need to know about our sanitary waste services
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqCategories.map((category) => (
              <div key={category} className="space-y-4">
                <h3 className="text-xl font-bold mb-4 pb-2 border-b border-white/30">
                  {category}
                </h3>
                {faqs
                  .filter((faq) => faq.category === category)
                  .map((faq, index) => (
                    <div
                      key={index}
                      className="bg-white/10 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:bg-white/15 transition-all"
                    >
                      <button
                        onClick={() => toggleFaq(faq.question)}
                        className="w-full text-left px-6 py-4 flex justify-between items-start gap-4"
                      >
                        <span className="font-semibold text-white">
                          {faq.question}
                        </span>
                        <svg
                          className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            openFaq === faq.question ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {openFaq === faq.question && (
                        <div className="px-6 pb-4 text-white/90 leading-relaxed">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg opacity-90 mb-4">
              Still have questions?
            </p>
            <Link
              to="/faq"
              className="inline-block bg-white text-pink-600 px-8 py-3 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
            >
              View Full FAQ
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-pink-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your personalized quote for our Dignity at Work programme or waste management services
          </p>
          <Link
            to="/contact#quote"
            className="inline-block bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-12 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-[1.05] transition-all"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
