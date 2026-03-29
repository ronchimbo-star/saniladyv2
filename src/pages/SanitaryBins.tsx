import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

interface ProductVariant {
  id: string;
  sku: string;
  variant_name: string;
  color: string | null;
  capacity: string | null;
  price: number;
  image_url: string;
  additional_images: string[];
  stock_status: string;
  is_default: boolean;
}

interface BaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  category: string;
  brand: string;
  variants: ProductVariant[];
}

export default function SanitaryBins() {
  const [products, setProducts] = useState<BaseProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data: baseProducts, error: baseError } = await supabase
        .from('sanitary_bin_base_products')
        .select('*')
        .order('created_at', { ascending: true });

      if (baseError) throw baseError;

      const productsWithVariants = await Promise.all(
        (baseProducts || []).map(async (product) => {
          const { data: variants, error: variantsError } = await supabase
            .from('sanitary_bin_variants')
            .select('*')
            .eq('base_product_id', product.id)
            .order('is_default', { ascending: false });

          if (variantsError) {
            console.error('Error fetching variants:', variantsError);
            return { ...product, variants: [] };
          }

          return { ...product, variants: variants || [] };
        })
      );

      setProducts(productsWithVariants);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const accessories = [
    {
      name: 'Sanitary Bin Liners',
      description: 'Biodegradable liners designed to fit all bin sizes. Pack of 100.',
      image: 'https://images.pexels.com/photos/7656746/pexels-photo-7656746.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '£12.99'
    },
    {
      name: 'Disposal Bags',
      description: 'Hygienic disposal bags with easy-seal closure. Pack of 200.',
      image: 'https://images.pexels.com/photos/7656746/pexels-photo-7656746.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '£8.99'
    },
    {
      name: 'Odour Control Sachets',
      description: 'Bio-enzymatic sachets that neutralise odours. Pack of 12.',
      image: 'https://images.pexels.com/photos/7656746/pexels-photo-7656746.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '£15.99'
    },
    {
      name: 'Bag Dispenser',
      description: 'Wall-mounted dispenser for disposal bags. Holds up to 50 bags.',
      image: 'https://images.pexels.com/photos/7656746/pexels-photo-7656746.jpeg?auto=compress&cs=tinysrgb&w=400',
      price: '£22.99'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Sanitary Bins | SaniLady - Washroom Hygiene Solutions"
        description="Explore SaniLady's complete range of sanitary bins including pedal, automatic sensor, and stainless steel models. Professional washroom solutions for all premises."
        canonical="/sanitary-bins"
      />

      <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm mb-6 opacity-90">
            <Link to="/" className="hover:underline">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/waste-services" className="hover:underline">Waste Services</Link>
            <span className="mx-2">/</span>
            <span>Sanitary Bins</span>
          </nav>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Sanitary Bins</h1>
          <p className="text-xl md:text-2xl max-w-3xl opacity-95">
            Professional sanitary waste solutions for modern washroom facilities across Kent, London, and Essex
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Sanitary Bins Are Essential</h2>
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-4">
              Providing appropriate sanitary waste disposal facilities is not just good practice—it's a legal requirement for all premises with female washroom facilities. Quality sanitary bins protect your plumbing infrastructure, enhance user experience, and demonstrate your commitment to hygiene and compliance.
            </p>
            <p>
              At SaniLady, we offer a comprehensive range of sanitary bins designed to meet the needs of every facility type, from compact units for smaller spaces to premium stainless steel options for high-end installations.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Our Sanitary Bin Range</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Choose from pedal-operated, automatic sensor, or premium stainless steel bins. All models include installation support and are available with our servicing package.
          </p>

          {products.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No products available at this time.
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const defaultVariant = product.variants.find(v => v.is_default) || product.variants[0];
                const minPrice = Math.min(...product.variants.map(v => v.price));

                return (
                  <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow group relative">
                    {product.category === 'Automatic Bins' && (
                      <div className="absolute top-4 right-4 bg-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                        Premium
                      </div>
                    )}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      <img
                        src={defaultVariant?.image_url || '/placeholder-bin.jpg'}
                        alt={product.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                        <span className="text-sm font-semibold text-pink-600 whitespace-nowrap ml-2">
                          {product.specifications.capacity || ''}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4 text-sm">{product.description}</p>

                      {product.variants.length > 1 && (
                        <div className="mb-4">
                          <p className="text-xs font-semibold text-gray-500 mb-2">Available in:</p>
                          <div className="flex gap-2 flex-wrap">
                            {product.variants.map((variant) => (
                              <span key={variant.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {variant.color}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <ul className="space-y-2 mb-6">
                        {product.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-600">
                            <span className="text-pink-600 mr-2">✓</span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-lg font-bold text-gray-800">
                          {product.variants.length > 1 ? `From £${minPrice.toFixed(2)}` : `£${minPrice.toFixed(2)}`}
                        </span>
                        <Link
                          to="/contact#quote"
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm font-semibold"
                        >
                          Get Quote
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Choosing the Right Bin</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">🦶</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Pedal Operated Bins</h3>
              <p className="text-gray-600 mb-4">
                The most popular choice for general facilities. Hands-free operation via foot pedal, available in 12-25L capacities. Ideal for standard washroom cubicles.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Cost-effective solution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Soft-close mechanism</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Easy to maintain</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-pink-500">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Automatic Sensor Bins</h3>
              <p className="text-gray-600 mb-4">
                Premium touchless experience with infrared sensor technology. Perfect for hygiene-focused environments. Available in compact 15L and standard 20L sizes.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Zero contact operation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Enhanced hygiene</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Modern appearance</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Stainless Steel Bins</h3>
              <p className="text-gray-600 mb-4">
                Premium grade 304 stainless steel construction. Ideal for high-end facilities where aesthetics matter. British manufactured for superior quality.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Elegant appearance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Highly durable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-600 mr-2">•</span>
                  <span>Matches premium fittings</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 text-center">Essential Accessories</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Complete your sanitary waste solution with our range of hygienic accessories
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accessories.map((accessory, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="h-48 overflow-hidden bg-gray-100">
                  <img
                    src={accessory.image}
                    alt={accessory.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{accessory.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{accessory.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-pink-600">{accessory.price}</span>
                    <Link
                      to="/contact#quote"
                      className="text-pink-600 hover:text-pink-700 font-semibold text-sm"
                    >
                      Add to Quote →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-2xl p-12 text-white text-center">
          <h2 className="text-4xl font-bold mb-6">Complete Sanitary Waste Service</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto opacity-95">
            Purchase your bins outright or include them as part of our comprehensive sanitary waste collection service. We'll supply, install, and service your bins with regular collections and full compliance documentation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact#quote"
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all"
            >
              Request a Quote
            </Link>
            <Link
              to="/waste-services"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-pink-600 transition-all"
            >
              View Services
            </Link>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why Choose SaniLady Bins?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Legal Compliance</h3>
              <p className="text-gray-600 mb-6">
                All our bins meet UK regulations for sanitary waste disposal. We provide full documentation and support to ensure your premises remains compliant with environmental health standards.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quality Construction</h3>
              <p className="text-gray-600">
                Every bin in our range is manufactured from high-quality materials designed for commercial use. We offer warranties on all products and provide replacement parts for long-term reliability.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Expert Installation</h3>
              <p className="text-gray-600 mb-6">
                Our trained technicians will install your bins correctly, whether wall-mounted or freestanding. We ensure proper positioning for optimal user experience and ease of servicing.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-4">Ongoing Support</h3>
              <p className="text-gray-600">
                Choose our collection service for hassle-free waste management. Regular scheduled visits, emergency callouts, and full waste transfer documentation included as standard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
