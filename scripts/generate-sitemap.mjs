import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

config({ path: join(projectRoot, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase credentials in .env file');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const baseUrl = 'https://sanilady.co.uk';

const staticPages = [
  { url: '/', changefreq: 'weekly', priority: '1.0' },
  { url: '/about', changefreq: 'monthly', priority: '0.8' },
  { url: '/contact', changefreq: 'monthly', priority: '0.8' },
  { url: '/faq', changefreq: 'monthly', priority: '0.7' },
  { url: '/period-dignity', changefreq: 'weekly', priority: '0.9' },
  { url: '/waste-services', changefreq: 'weekly', priority: '0.9' },
  { url: '/service-coverage', changefreq: 'monthly', priority: '0.8' },
  { url: '/service-area/kent', changefreq: 'monthly', priority: '0.8' },
  { url: '/service-area/london', changefreq: 'monthly', priority: '0.8' },
  { url: '/service-area/essex', changefreq: 'monthly', priority: '0.8' },
  { url: '/news', changefreq: 'weekly', priority: '0.8' },
  { url: '/terms', changefreq: 'yearly', priority: '0.3' },
  { url: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { url: '/cookie-policy', changefreq: 'yearly', priority: '0.3' },
];

async function getDynamicPages() {
  const pages = [];

  try {
    const { data: articles } = await supabase
      .from('news_articles')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (articles) {
      articles.forEach(article => {
        pages.push({
          url: `/news/${article.slug}`,
          changefreq: 'monthly',
          priority: '0.7',
          lastmod: article.updated_at || article.published_at
        });
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic pages:', error);
  }

  return pages;
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  return new Date(date).toISOString().split('T')[0];
}

async function generateSitemap() {
  console.log('Generating sitemap...\n');

  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPages, ...dynamicPages];

  console.log(`Found ${allPages.length} pages:`);
  console.log(`  - ${staticPages.length} static pages`);
  console.log(`  - ${dynamicPages.length} dynamic pages\n`);

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  allPages.forEach(page => {
    xml += '  <url>\n';
    xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
    if (page.lastmod) {
      xml += `    <lastmod>${formatDate(page.lastmod)}</lastmod>\n`;
    }
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += '  </url>\n';
  });

  xml += '</urlset>';

  const sitemapPath = join(projectRoot, 'public', 'sitemap.xml');
  writeFileSync(sitemapPath, xml);

  console.log(`✓ Sitemap generated: ${sitemapPath}`);
  console.log(`✓ Total URLs: ${allPages.length}\n`);
}

generateSitemap().catch(error => {
  console.error('Sitemap generation failed:', error);
  process.exit(1);
});
