import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Testimonial {
  id: string;
  company_name: string;
  contact_name: string;
  contact_role: string;
  testimonial_text: string;
  rating: number;
  image_url: string;
}

export default function PeriodDignity() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data } = await supabase
        .from('testimonials')
        .select('*')
        .eq('service_type', 'period-dignity')
        .eq('is_published', true)
        .order('display_order');

      if (data) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error('Error fetching testimonials:', err);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-[#ec008c] via-[#e91e8c] to-[#8b5fbf] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Period Dignity at Work Programme
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            A revolutionary employee benefit supporting workplace wellbeing and gender equality
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-pink-50 border border-pink-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">What is the Programme?</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            The Period Dignity at Work Programme is an innovative, HMRC-compliant employee benefit that provides
            personalised feminine hygiene products directly to your team members. More than just period products,
            this is a comprehensive wellbeing initiative that demonstrates your commitment to gender equality and
            workplace dignity.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By offering this tax-free benefit, employers can support their workforce while making a tangible
            statement about their Diversity, Equity, and Inclusion (DEI) values.
          </p>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">How It Works</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Employee Enrollment</h3>
                <p className="text-gray-600">
                  Your employees sign up for the programme and create their personal preferences profile,
                  selecting from a wide range of products including tampons, pads, menstrual cups, period
                  underwear, and eco-friendly options.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Personalized Selection</h3>
                <p className="text-gray-600">
                  Each participant customizes their monthly box based on their individual needs, cycle patterns,
                  and product preferences. No two boxes are the same.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Discreet Delivery</h3>
                <p className="text-gray-600">
                  Products are delivered directly to employees' homes or workplace in discreet packaging on a
                  monthly schedule, ensuring privacy and convenience.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                4
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Simple Administration</h3>
                <p className="text-gray-600">
                  Employers receive a single monthly invoice covering all enrolled employees. No complex
                  administration or individual reimbursements required.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">Programme Benefits</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">For Employers</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Tax-free employee benefit (HMRC compliant)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Enhanced DEI credentials and employer brand</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Reduced absenteeism and improved productivity</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Lower employee turnover and recruitment costs</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Demonstrates tangible commitment to gender equality</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Simple administration with single monthly invoice</span>
                </li>
              </ul>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-bold mb-3">For Employees</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Free access to premium period products</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Fully personalized product selection</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Choice of eco-friendly and sustainable options</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Discreet home or workplace delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Reduced financial burden of period care</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Workplace validation and support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pricing Tiers</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pink-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Essential</h3>
              <div className="text-3xl font-bold text-pink-600 mb-4">£35/month</div>
              <p className="text-gray-600 mb-4">Perfect for basic needs</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Standard product selection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Monthly delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Basic customization</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-xl p-6 transform scale-105 shadow-xl">
              <div className="bg-white text-pink-600 inline-block px-3 py-1 rounded-full text-sm font-bold mb-2">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <div className="text-3xl font-bold mb-4">£55/month</div>
              <p className="mb-4 opacity-90">Comprehensive coverage</p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Wide product range</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Eco-friendly options</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Full customization</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-pink-500 transition-colors">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Deluxe</h3>
              <div className="text-3xl font-bold text-pink-600 mb-4">£85/month</div>
              <p className="text-gray-600 mb-4">Ultimate care package</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Premium products</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Luxury brands included</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Wellness extras</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">✓</span>
                  <span>Dedicated support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Period Dignity Matters</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              <strong>Period poverty is a real issue in UK workplaces.</strong> Studies show that 1 in 10 women
              struggle to afford period products, leading to missed workdays, reduced productivity, and workplace
              stress.
            </p>
            <p>
              <strong>This programme makes a statement.</strong> By offering the Period Dignity at Work benefit,
              you're telling your team that their wellbeing matters and that your organization values gender
              equality beyond just words.
            </p>
            <p>
              <strong>The business case is clear.</strong> Organizations that implement this programme report
              improved employee satisfaction, reduced turnover, better productivity, and enhanced employer
              branding that helps attract top talent.
            </p>
            <p>
              <strong>It's 100% compliant.</strong> Our programme is fully HMRC-compliant as a tax-free employee
              benefit, meaning there are no additional tax implications for your organization or your employees.
            </p>
          </div>
        </div>

        {testimonials.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Success Stories</h2>
            <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
              See how organizations are transforming workplace culture with Period Dignity
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-pink-500 hover:shadow-xl transition-all"
                >
                  <div className="h-64 overflow-hidden">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.company_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">★</span>
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.testimonial_text}"
                    </p>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="font-bold text-gray-800 text-lg">{testimonial.contact_name}</p>
                      {testimonial.contact_role && (
                        <p className="text-gray-600">{testimonial.contact_role}</p>
                      )}
                      <p className="text-[#ec008c] font-semibold mt-1">{testimonial.company_name}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join forward-thinking organizations across Kent, London, and Essex in supporting workplace dignity
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact#quote"
              className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Request a Quote
            </Link>
            <Link
              to="/contact"
              className="bg-white text-pink-600 border-2 border-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
