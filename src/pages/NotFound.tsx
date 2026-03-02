import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <SEO
        title="Page Not Found | SaniLady"
        description="The page you are looking for does not exist."
        canonical="/404"
        noindex={true}
      />
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-pink-600 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Go to Homepage
          </Link>
          <Link
            to="/contact"
            className="border-2 border-pink-600 text-pink-600 px-8 py-3 rounded-full font-bold hover:bg-pink-50 transition-all"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
