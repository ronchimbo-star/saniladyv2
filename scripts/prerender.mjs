import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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

const staticRoutes = [
  '/',
  '/about',
  '/contact',
  '/faq',
  '/period-dignity',
  '/waste-services',
  '/service-coverage',
  '/service-area/kent',
  '/service-area/london',
  '/service-area/essex',
  '/terms',
  '/privacy',
  '/cookie-policy',
  '/news',
  '/login',
  '/signup',
];

async function getDynamicRoutes() {
  const routes = [];

  try {
    const { data: articles } = await supabase
      .from('news_articles')
      .select('slug')
      .eq('published', true)
      .order('published_at', { ascending: false });

    if (articles) {
      articles.forEach(article => {
        routes.push(`/news/${article.slug}`);
      });
    }
  } catch (error) {
    console.error('Error fetching dynamic routes:', error);
  }

  return routes;
}

async function prerenderRoute(browser, route, baseUrl, distPath) {
  const page = await browser.newPage();

  try {
    console.log(`Pre-rendering: ${route}`);

    const url = `${baseUrl}${route}`;
    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    await page.waitForSelector('main', { timeout: 10000 });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const html = await page.content();

    const routePath = route === '/' ? '/index' : route;
    const filePath = join(distPath, `${routePath}.html`);
    const fileDir = dirname(filePath);

    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, { recursive: true });
    }

    writeFileSync(filePath, html);
    console.log(`✓ Created: ${filePath}`);

    return true;
  } catch (error) {
    console.error(`✗ Failed to pre-render ${route}:`, error.message);
    return false;
  } finally {
    await page.close();
  }
}

async function updateIndexHtml(distPath) {
  const indexPath = join(distPath, 'index.html');
  const prerenderedPath = join(distPath, 'index.html');

  if (existsSync(prerenderedPath)) {
    const content = readFileSync(prerenderedPath, 'utf-8');
    writeFileSync(indexPath, content);
    console.log('✓ Updated main index.html with pre-rendered content');
  }
}

async function main() {
  console.log('Starting pre-rendering process...\n');

  const distPath = join(projectRoot, 'dist');

  if (!existsSync(distPath)) {
    throw new Error('dist folder not found. Run "npm run build" first.');
  }

  const dynamicRoutes = await getDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  console.log(`Found ${allRoutes.length} routes to pre-render:`);
  console.log(`  - ${staticRoutes.length} static routes`);
  console.log(`  - ${dynamicRoutes.length} dynamic routes\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const baseUrl = 'http://localhost:4173';

  console.log('Starting preview server...');
  console.log('Make sure to run "npm run preview" in another terminal\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  let successCount = 0;
  let failCount = 0;

  for (const route of allRoutes) {
    const success = await prerenderRoute(browser, route, baseUrl, distPath);
    if (success) {
      successCount++;
    } else {
      failCount++;
    }
  }

  await browser.close();

  await updateIndexHtml(distPath);

  console.log('\n=================================');
  console.log('Pre-rendering complete!');
  console.log(`✓ Success: ${successCount}`);
  console.log(`✗ Failed: ${failCount}`);
  console.log('=================================\n');
}

main().catch(error => {
  console.error('Pre-rendering failed:', error);
  process.exit(1);
});
