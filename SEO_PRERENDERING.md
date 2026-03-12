# SEO Pre-rendering Documentation

## Overview

This project implements a comprehensive pre-rendering solution to ensure search engines can properly crawl and index all content, including dynamically generated pages like news articles.

## How It Works

The pre-rendering system:

1. **Builds the application** - Compiles the React SPA into static assets
2. **Starts a local preview server** - Serves the built application
3. **Crawls all routes** - Uses Puppeteer to visit each page
4. **Generates static HTML** - Captures fully-rendered HTML with all meta tags, structured data, and content
5. **Saves pre-rendered files** - Creates static HTML files for each route

## Routes Pre-rendered

### Static Routes
- Home page (`/`)
- About (`/about`)
- Contact (`/contact`)
- FAQ (`/faq`)
- Period Dignity (`/period-dignity`)
- Waste Services (`/waste-services`)
- Service Coverage (`/service-coverage`)
- Service Area pages (Kent, London, Essex)
- Terms & Conditions (`/terms`)
- Privacy Policy (`/privacy`)
- Cookie Policy (`/cookie-policy`)
- News listing (`/news`)
- Login (`/login`)
- Signup (`/signup`)

### Dynamic Routes
- **News Articles** - Automatically fetches all published articles from Supabase and pre-renders each article page (`/news/[slug]`)

## Usage

### Standard Build (No Pre-rendering)
```bash
npm run build
```
This creates a standard SPA build without pre-rendered HTML.

### SEO-Optimized Build (With Pre-rendering)
```bash
npm run build:seo
```
This:
1. Builds the application
2. Starts a preview server
3. Pre-renders all routes (static + dynamic)
4. Stops the preview server
5. Creates SEO-friendly static HTML files

### Manual Pre-rendering (After Build)
```bash
# First, build the app
npm run build

# Start the preview server in one terminal
npm run preview

# In another terminal, run pre-rendering
npm run prerender
```

## Benefits for SEO

1. **Search Engine Crawlers** - Can read fully-rendered HTML without executing JavaScript
2. **Meta Tags** - All SEO meta tags, Open Graph, and Twitter Card data are in the HTML
3. **Structured Data** - JSON-LD structured data is present in pre-rendered HTML
4. **Content Visibility** - All text content, headings, and links are accessible to crawlers
5. **Fast First Paint** - Users see content immediately, even before JavaScript loads
6. **Social Media Previews** - Proper meta tags ensure correct previews on Facebook, Twitter, LinkedIn

## Files Generated

Pre-rendered HTML files are created in the `dist` folder:

```
dist/
├── index.html              (Home page)
├── about.html
├── contact.html
├── news.html
├── news/
│   ├── article-slug-1.html
│   ├── article-slug-2.html
│   └── ...
└── ...
```

## Deployment

When deploying to production:

1. **Use `npm run build:seo`** instead of `npm run build`
2. Deploy the entire `dist` folder as usual
3. Ensure your hosting platform serves the correct HTML files for each route

### Hosting Configuration

Most hosting platforms (Netlify, Vercel, etc.) automatically handle SPA routing. The pre-rendered HTML files will be served first, then React Router takes over for client-side navigation.

## Maintenance

### Adding New Static Routes

Edit `scripts/prerender.mjs` and add the route to the `staticRoutes` array:

```javascript
const staticRoutes = [
  '/',
  '/about',
  '/your-new-route',  // Add here
  // ...
];
```

### Dynamic Routes

The system automatically fetches and pre-renders:
- All published news articles from the `news_articles` table

To add new dynamic content types, modify the `getDynamicRoutes()` function in `scripts/prerender.mjs`.

## Troubleshooting

### Pre-rendering Fails

1. Ensure the build completed successfully first
2. Check that the preview server starts on `http://localhost:4173`
3. Verify Supabase credentials in `.env` file
4. Check for JavaScript errors in the application

### Missing Routes

If a route isn't being pre-rendered:
1. Add it to `staticRoutes` in `scripts/prerender.mjs`
2. Ensure dynamic routes are being fetched from the database

### Slow Pre-rendering

Pre-rendering can take several minutes depending on:
- Number of routes
- Network speed (for fetching data)
- Server response times

This is normal and only happens during build time, not during user visits.

## Technical Details

### Technologies Used
- **Puppeteer** - Headless Chrome browser for rendering
- **Supabase Client** - Fetches dynamic routes from database
- **Node.js** - Orchestrates the pre-rendering process

### Process Flow
1. Script connects to Supabase to fetch dynamic routes
2. Launches headless Chrome browser
3. Visits each route and waits for content to load
4. Captures fully-rendered HTML
5. Saves HTML files to dist folder
6. Updates main index.html with pre-rendered content

## Performance Impact

- **Build Time**: Increased by 2-5 minutes depending on content
- **Runtime Performance**: No impact (pre-rendering happens at build time)
- **User Experience**: Improved (faster initial content display)
- **SEO**: Significantly improved (search engines can read all content)
