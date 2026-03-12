# SaniLady - SEO Pre-rendering Guide

## Quick Start

### For Production Deployment (SEO-Optimized)
```bash
npm run build:seo
```

This command:
1. Builds your React application
2. Automatically starts a preview server
3. Pre-renders all routes (static pages + dynamic blog articles)
4. Generates SEO-friendly HTML files
5. Stops the preview server

The `dist` folder will contain fully pre-rendered HTML files ready for deployment.

### For Development
```bash
npm run dev
```

Standard development server without pre-rendering.

### For Standard Build (No Pre-rendering)
```bash
npm run build
```

Standard production build without SEO pre-rendering.

## Why Pre-rendering?

Your SaniLady website is a Single Page Application (SPA) built with React. While SPAs provide great user experiences, search engines struggle to index them because:

1. **JavaScript Dependency** - Search engine crawlers may not execute JavaScript properly
2. **Dynamic Content** - Content rendered client-side isn't visible in the initial HTML
3. **Meta Tags** - SEO meta tags added dynamically may not be detected
4. **Social Sharing** - Preview cards on Facebook/Twitter need meta tags in HTML

### Solution: Pre-rendering

Pre-rendering solves these issues by:
- Generating static HTML files for each route at build time
- Including all meta tags, structured data, and content in the HTML
- Ensuring search engines can read everything without JavaScript
- Providing instant content display for users

## What Gets Pre-rendered

### Static Pages
- Home page
- About
- Contact
- FAQ
- Period Dignity
- Waste Services
- Service Coverage
- Service Area pages (Kent, London, Essex)
- Terms & Conditions
- Privacy Policy
- Cookie Policy
- News listing page
- Login & Signup pages

### Dynamic Content
- **All Published News Articles** - Automatically fetched from Supabase database

New articles are automatically included in pre-rendering when you run `npm run build:seo`.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Build Application (npm run build)                        │
│    - Compiles TypeScript                                    │
│    - Bundles React components                               │
│    - Generates dist/ folder                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Start Preview Server (localhost:4173)                    │
│    - Serves the built application                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Fetch Dynamic Routes from Supabase                       │
│    - Connects to database                                   │
│    - Gets all published news article slugs                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Launch Headless Browser (Puppeteer)                      │
│    - Opens Chrome in headless mode                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Visit Each Route                                         │
│    - Navigates to each page                                 │
│    - Waits for content to load                              │
│    - Captures fully-rendered HTML                           │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 6. Save Pre-rendered HTML Files                             │
│    - Creates .html files in dist/                           │
│    - Preserves all meta tags and structured data            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ 7. Stop Preview Server                                      │
│    - Cleanup and completion                                 │
└─────────────────────────────────────────────────────────────┘
```

## Output Structure

After running `npm run build:seo`, your `dist` folder will look like:

```
dist/
├── index.html                    ← Pre-rendered home page
├── about.html                    ← Pre-rendered about page
├── contact.html
├── faq.html
├── period-dignity.html
├── waste-services.html
├── service-coverage.html
├── terms.html
├── privacy.html
├── cookie-policy.html
├── news.html
├── news/
│   ├── article-slug-1.html      ← Pre-rendered news articles
│   ├── article-slug-2.html
│   └── article-slug-3.html
├── service-area/
│   ├── kent.html
│   ├── london.html
│   └── essex.html
├── login.html
├── signup.html
└── assets/                       ← JS, CSS, images
    ├── index-[hash].js
    ├── index-[hash].css
    └── ...
```

## Deployment

### Recommended: Use Pre-rendered Build

Always use `npm run build:seo` for production deployments:

```bash
# Build with pre-rendering
npm run build:seo

# Deploy dist folder to your hosting platform
```

### Hosting Platforms

The pre-rendered build works with all hosting platforms:

- **Netlify** - Just deploy the dist folder
- **Vercel** - Automatically detects and serves pre-rendered pages
- **AWS S3 + CloudFront** - Upload dist folder
- **Any static host** - Pre-rendered HTML works everywhere

### Routing Configuration

Your `public/_redirects` file ensures proper SPA routing:

```
/*    /index.html   200
```

This means:
1. If a pre-rendered HTML file exists for a route, it's served first
2. Otherwise, fallback to index.html for client-side routing
3. React Router takes over after initial page load

## SEO Benefits

### Before Pre-rendering
```html
<!DOCTYPE html>
<html>
  <head>
    <title>Loading...</title>
  </head>
  <body>
    <div id="root"></div>
    <script src="/assets/index.js"></script>
  </body>
</html>
```
Search engines see almost nothing!

### After Pre-rendering
```html
<!DOCTYPE html>
<html>
  <head>
    <title>SaniLady - Feminine Hygiene Solutions</title>
    <meta name="description" content="...">
    <meta property="og:title" content="...">
    <meta property="og:description" content="...">
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      ...
    }
    </script>
  </head>
  <body>
    <div id="root">
      <main>
        <h1>Welcome to SaniLady</h1>
        <p>Complete content here...</p>
      </main>
    </div>
    <script src="/assets/index.js"></script>
  </body>
</html>
```
Search engines see everything!

## Maintenance

### Adding New Static Pages

1. Add the route to your React Router
2. Edit `scripts/prerender.mjs`
3. Add the route to the `staticRoutes` array:

```javascript
const staticRoutes = [
  '/',
  '/about',
  '/your-new-page',  // Add here
  // ...
];
```

4. Run `npm run build:seo`

### Dynamic Content

News articles are automatically discovered and pre-rendered. No manual configuration needed!

To add other dynamic content types:

1. Edit `scripts/prerender.mjs`
2. Modify the `getDynamicRoutes()` function
3. Add database queries to fetch your content

Example:
```javascript
async function getDynamicRoutes() {
  const routes = [];

  // Existing: News articles
  const { data: articles } = await supabase
    .from('news_articles')
    .select('slug')
    .eq('published', true);

  articles.forEach(article => {
    routes.push(`/news/${article.slug}`);
  });

  // New: Service pages
  const { data: services } = await supabase
    .from('services')
    .select('slug');

  services.forEach(service => {
    routes.push(`/services/${service.slug}`);
  });

  return routes;
}
```

## Performance

### Build Time
- **Standard build**: ~7-10 seconds
- **Pre-rendered build**: ~2-5 minutes (depending on content volume)

The extra time is worth it for SEO benefits!

### User Experience
- **First Load**: Faster (HTML content visible immediately)
- **Subsequent Navigation**: Same speed (React Router handles it)
- **SEO**: Dramatically improved

### When to Pre-render
- **Production deployments**: Always
- **Development**: Never (use `npm run dev`)
- **Testing builds**: Use standard `npm run build` for speed

## Troubleshooting

### "Preview server failed to start"
- Ensure port 4173 is available
- Check for any build errors first
- Try running `npm run preview` manually to debug

### "Pre-rendering failed for route X"
- Check browser console for JavaScript errors on that page
- Ensure the route exists in your React Router
- Verify data is loading correctly from Supabase

### Missing News Articles
- Confirm articles are published in the database (`published = true`)
- Check Supabase credentials in `.env` file
- Verify the `news_articles` table exists and has data

### Slow Pre-rendering
Normal! Pre-rendering visits each page with a real browser. More pages = more time.

To speed up:
- Reduce timeout in `scripts/prerender.mjs` (may cause issues)
- Remove rarely-visited pages from pre-rendering
- Run pre-rendering less frequently

## Advanced Configuration

### Adjust Timeout

Edit `scripts/prerender.mjs`:

```javascript
await page.goto(url, {
  waitUntil: 'networkidle0',
  timeout: 30000  // Increase if pages are slow to load
});
```

### Custom Wait Conditions

Wait for specific elements:

```javascript
await page.waitForSelector('.your-content-class', { timeout: 10000 });
```

### Skip Certain Routes

Remove from `staticRoutes` array or add exclusion logic:

```javascript
const staticRoutes = [
  '/',
  '/about',
  // Don't pre-render login/signup if you prefer
];
```

## Testing Pre-rendered Output

1. Build with pre-rendering:
```bash
npm run build:seo
```

2. Start preview server:
```bash
npm run preview
```

3. View page source in browser (Ctrl+U or Cmd+U)
   - Should see full HTML content
   - Should see all meta tags
   - Should see structured data

4. Test with SEO tools:
   - Google Search Console URL Inspection
   - Facebook Sharing Debugger
   - Twitter Card Validator

## Support

For issues with pre-rendering:

1. Check that the standard build works: `npm run build`
2. Verify environment variables in `.env`
3. Test the preview server: `npm run preview`
4. Review error messages in the console

See `SEO_PRERENDERING.md` for detailed technical documentation.
