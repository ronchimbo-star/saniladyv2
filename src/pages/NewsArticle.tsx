import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  featured_image_url: string;
  featured_image_alt: string;
  meta_title: string;
  meta_description: string;
  published_at: string;
  author_id: string;
}

export default function NewsArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchArticle();
    }
  }, [slug]);

  const fetchArticle = async () => {
    try {
      const { data, error } = await supabase
        .from('news_articles')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setError(true);
      } else {
        setArticle(data);
        document.title = data.meta_title || data.title;
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      setError(true);
    } finally {
      setLoading(false);
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

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = article?.title || '';

  const socialLinks = [
    {
      name: 'Facebook',
      icon: '📘',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-600'
    },
    {
      name: 'Twitter',
      icon: '🐦',
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'hover:text-blue-400'
    },
    {
      name: 'LinkedIn',
      icon: '💼',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-blue-700'
    },
    {
      name: 'Email',
      icon: '✉️',
      url: `mailto:?subject=${encodeURIComponent(shareTitle)}&body=${encodeURIComponent(shareUrl)}`,
      color: 'hover:text-gray-700'
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-3/4"></div>
            <div className="h-96 bg-gray-300 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">
            Sorry, we couldn't find the article you're looking for.
          </p>
          <Link
            to="/news"
            className="inline-block bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white py-8 border-b">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            to="/news"
            className="inline-flex items-center text-pink-600 hover:text-pink-700 font-semibold mb-6"
          >
            ← Back to News
          </Link>

          {article.category && (
            <span className="inline-block bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-semibold mb-4">
              {article.category}
            </span>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center text-gray-600 space-x-4">
            <span>{formatDate(article.published_at)}</span>
          </div>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 py-12">
        {article.featured_image_url && (
          <img
            src={article.featured_image_url}
            alt={article.featured_image_alt || article.title}
            className="w-full rounded-2xl shadow-lg mb-8"
          />
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8 pb-8 border-b">
            <h3 className="text-lg font-bold text-gray-800">Share this article</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl ${social.color} transition-colors`}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="flex items-center justify-between mt-12 pt-8 border-t">
            <h3 className="text-lg font-bold text-gray-800">Share this article</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl ${social.color} transition-colors`}
                  title={`Share on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Transform Your Workplace?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Discover how SaniLady can support your team with our Period Dignity at Work programme
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-gradient-to-r from-[#ec008c] to-[#e91e8c] text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Get a Quote
            </Link>
            <Link
              to="/period-dignity"
              className="bg-white text-pink-600 border-2 border-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg transform hover:scale-105 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
