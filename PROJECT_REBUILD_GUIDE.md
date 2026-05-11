# SaniLady - Complete Project Rebuild Guide

## Overview

**App Name:** SaniLady
**Domain:** https://sanilady.co.uk
**Purpose:** Feminine hygiene solutions and sanitary waste management services platform for UK businesses
**Legal Entity:** Circular Horizons International Ltd (trading as SaniLady)
**Company Number:** 15821509 (England & Wales)
**Registered Office:** Unit A 82 James Carter Road, Mildenhall, United Kingdom, IP28 7DE
**VAT Number:** 232 8003 02 (invoices) / 460067173 (footer)
**Service Areas:** Kent, London, Essex, Hertfordshire, Surrey, Sussex

---

## Tech Stack

- **Frontend:** React 18.2 + TypeScript 5.3 + Vite 5.0
- **Styling:** Tailwind CSS 3.4 (no custom theme extensions - all colors are inline)
- **Routing:** react-router-dom 7.13
- **SEO:** react-helmet-async 2.0
- **Backend/DB:** Supabase (PostgreSQL + Auth + Edge Functions)
- **Email:** Resend API (via Edge Functions)
- **Hosting:** Netlify (uses `_redirects` file)
- **Build:** `tsc && vite build`
- **Pre-rendering:** Puppeteer-based SSR for SEO pages

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://adfbodeuznbcbiatxkwa.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZmJvZGV1em5iY2JpYXR4a3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MjQ4NDUsImV4cCI6MjA4MzEwMDg0NX0.Zcy-3_7EK7Q4E9DGhJDH6guAQI-BRY1NQUB5SAI_TNw
```

Edge Function secrets (set in Supabase dashboard):
- `RESEND_API_KEY` - For sending email notifications

---

## Color Palette

All colors are used inline via Tailwind classes (no custom theme config):

| Usage | Hex | Context |
|-------|-----|---------|
| Brand Pink (primary) | `#ec008c` | Buttons, links, CTAs, accents, logo color |
| Secondary Pink | `#e91e8c` | Gradient middle stop |
| Dark Pink hover | `#d0007a` | Button hover states |
| Purple | `#8b5fbf` | Gradient end, accents |
| Dark Purple (footer) | `#2d1b69` | Footer background |
| Blue | `#0052CC` | Waste services hero, Kent area |
| Dark Blue | `#003DA5` | Privacy page hero |
| Green | `#2D8659` | Essex area hero, cookie policy |
| Teal | Various | Service gradients |
| Orange | `#ff5722` to `#ff6f3c` | Signup gradient |
| Gray-50 | Tailwind default | Page backgrounds |
| Gray-900 | Tailwind default | Primary text |

**Common Gradients:**
- Hero: `from-[#ec008c] via-[#e91e8c] to-[#8b5fbf]`
- Footer: Solid `bg-[#2d1b69]`
- Waste services: Blue to Teal
- Essex: Green to Teal
- Kent: Blue to Teal
- London: Pink to Purple

---

## Typography

System font stack (no custom fonts):
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
```

---

## Images & Assets (in /public/)

| File | Usage |
|------|-------|
| `sanilady-logo-header.png` | Header navigation logo |
| `sanilady-logo-footer.png` | Footer logo (white version) |
| `sanilady-favicon-v2.png` | Browser favicon |
| `sanilady-hero.png` | OG image for social sharing |
| `PFASimage-1.webp` | Period dignity products hero image |
| `sanilady-sanitary-waste.webp` | Waste services imagery |
| `sanilady-sanitary-waste.png` | PNG version of above |
| `service-map.png` | Service coverage map showing Kent/London/Essex |
| `linkedin.png` | LinkedIn social icon in footer |
| `image.png` | General asset |

---

## Routing Structure (App.tsx)

All routes use React.lazy() except Home:

### Public Routes
```
/                          Home (eager loaded)
/login                     Login
/signup                    Signup
/contact                   Contact (2-tab form: General + Quote)
/about                     About
/faq                       FAQ (18 questions, 6 categories)
/period-dignity            Period Dignity Programme
/waste-services            Waste Management Services
/sanitary-bins             Sanitary Bins product catalog
/service-coverage          Service Coverage overview + map
/service-areas/kent        Kent service area (25 towns)
/service-areas/london      London service area (30 boroughs)
/service-areas/essex       Essex service area (30 towns)
/news                      News/blog listing (paginated, 12/page)
/news/:slug                Individual news article
/terms                     Terms & Conditions
/privacy                   Privacy Policy
/cookie-policy             Cookie Policy
/quote-request             Quote request form (protected)
*                          404 Not Found
```

### Customer Routes (Protected - requires auth)
```
/dashboard                 Customer dashboard
/dashboard/profile         Edit profile
/dashboard/subscriptions   View subscriptions
/dashboard/book-service    Book ad-hoc service
/dashboard/invoices        View invoices
/dashboard/documents       Download compliance documents
```

### Admin Routes (Protected - requires admin role)
```
/admin                     Redirects to /admin/dashboard
/admin/dashboard           Admin dashboard (quotes management)
/admin/contact-submissions Contact form submissions
/admin/settings            Site settings (logos, contact, GA)
/admin/testimonials        Testimonial management
/admin/news                News article list
/admin/news/new            Create news article
/admin/news/edit/:id       Edit news article
/admin/customers           Customer list
/admin/customers/new       Create customer
/admin/customers/:id       Customer detail
/admin/customers/:id/edit  Edit customer
/admin/subscriptions       Subscription list
/admin/subscriptions/new   Create subscription
/admin/subscriptions/:id/edit  Edit subscription
/admin/service-visits      Service visit list
/admin/service-visits/new  Create service visit
/admin/service-visits/:id  View service visit
/admin/service-visits/:id/edit  Edit service visit
/admin/waste-transfer-notes     Waste transfer notes list
/admin/waste-transfer-notes/new Create waste transfer note
/admin/invoices            Invoice list
/admin/invoices/new        Create invoice
/admin/invoices/:id        Invoice detail (with Print/PDF)
/admin/invoices/:id/edit   Edit invoice
```

---

## Database Schema

### Table: quotes
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE -- nullable
property_type text NOT NULL
property_size text NOT NULL
cleaning_frequency text NOT NULL
bedrooms integer DEFAULT 0
bathrooms integer DEFAULT 0
additional_services text[] DEFAULT '{}'
special_requirements text DEFAULT ''
estimated_cost decimal(10,2) DEFAULT 0.00
status text DEFAULT 'pending'
viewed_by_admin boolean DEFAULT false
admin_notes text DEFAULT ''
customer_name text DEFAULT ''
customer_email text DEFAULT ''
customer_phone text DEFAULT ''
company_name text DEFAULT ''
number_of_bins integer DEFAULT 0
bin_collection_frequency text DEFAULT ''
needs_bin_rental boolean DEFAULT false
archived boolean DEFAULT false
archived_at timestamptz
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: user_profiles
```sql
id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
email text NOT NULL
role text DEFAULT 'customer' -- 'customer' or 'admin'
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```
Trigger: `on_auth_user_created` auto-creates profile with 'customer' role.

### Table: contact_submissions
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
type text NOT NULL CHECK (type IN ('general', 'quote'))
name text NOT NULL
email text NOT NULL
phone text DEFAULT ''
company text DEFAULT ''
subject text DEFAULT ''
message text NOT NULL
service_type text DEFAULT ''
status text DEFAULT 'pending'
viewed_by_admin boolean DEFAULT false
archived boolean DEFAULT false
archived_at timestamptz
admin_notes text
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: news_articles
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
title text NOT NULL
slug text UNIQUE NOT NULL
content text NOT NULL DEFAULT ''
excerpt text DEFAULT ''
category text DEFAULT 'general'
thumbnail_url text DEFAULT ''
thumbnail_alt text DEFAULT ''
featured_image_url text DEFAULT ''
featured_image_alt text DEFAULT ''
meta_title text DEFAULT ''
meta_description text DEFAULT ''
meta_keywords text DEFAULT ''
status text DEFAULT 'draft' CHECK (status IN ('draft', 'published'))
author_id uuid REFERENCES auth.users(id)
published_at timestamptz
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```
Trigger: Auto-sets `published_at` when status changes from 'draft' to 'published'.

### Table: site_settings (single row)
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
google_analytics_id text DEFAULT ''
header_logo_url text DEFAULT '/sanilady-logo-header.png'
footer_logo_url text DEFAULT '/sanilady-logo-footer.png'
favicon_url text DEFAULT '/sanilady-favicon-v2.png'
contact_phone text DEFAULT ''
contact_email text DEFAULT ''
contact_address text DEFAULT ''
updated_at timestamptz DEFAULT now()
updated_by uuid REFERENCES auth.users(id)
```

### Table: testimonials
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
service_type text NOT NULL -- 'period-dignity' or 'waste-services'
company_name text NOT NULL
contact_name text NOT NULL
contact_role text DEFAULT ''
testimonial_text text NOT NULL
rating integer DEFAULT 5 CHECK (rating >= 1 AND rating <= 5)
image_url text DEFAULT ''
is_published boolean DEFAULT true
display_order integer DEFAULT 0
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: waste_transfer_notes
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE
reference_number text UNIQUE NOT NULL
issue_date date NOT NULL DEFAULT CURRENT_DATE
collection_address text NOT NULL
waste_classification text NOT NULL
waste_description text NOT NULL
waste_quantity text NOT NULL
ewc_code text NOT NULL DEFAULT '18 01 04'
notes text
document_path text
created_at timestamptz NOT NULL DEFAULT now()
updated_at timestamptz NOT NULL DEFAULT now()
```

### Table: sanitary_bin_base_products
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
name text NOT NULL
slug text UNIQUE NOT NULL
description text
features jsonb DEFAULT '[]'::jsonb
specifications jsonb DEFAULT '{}'::jsonb
category text NOT NULL
brand text
sku_prefix text
detailed_description text DEFAULT ''
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: sanitary_bin_variants
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
base_product_id uuid REFERENCES sanitary_bin_base_products(id) ON DELETE CASCADE
sku text UNIQUE NOT NULL
variant_name text NOT NULL
color text
capacity text
price decimal(10,2)
image_url text
additional_images jsonb DEFAULT '[]'::jsonb
stock_status text DEFAULT 'Available'
is_default boolean DEFAULT false
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: invoices_v2
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
invoice_number text UNIQUE NOT NULL
invoice_type text NOT NULL CHECK (invoice_type IN ('proforma', 'invoice'))
customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE RESTRICT
issue_date date NOT NULL DEFAULT CURRENT_DATE
due_date date
valid_until date
reference text
billing_company_name text NOT NULL
billing_address_line_1 text NOT NULL
billing_address_line_2 text
billing_city text NOT NULL
billing_postcode text NOT NULL
billing_country text NOT NULL DEFAULT 'United Kingdom'
service_location_name text
service_address_line_1 text
service_address_line_2 text
service_city text
service_postcode text
service_country text DEFAULT 'United Kingdom'
subtotal numeric(10,2) NOT NULL DEFAULT 0.00
vat_rate numeric(5,2) NOT NULL DEFAULT 20.00
vat_amount numeric(10,2) NOT NULL DEFAULT 0.00
total_amount numeric(10,2) NOT NULL DEFAULT 0.00
status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled'))
payment_terms text
notes text
paid_date timestamptz
created_by uuid REFERENCES users(id)
created_at timestamptz DEFAULT now()
updated_at timestamptz DEFAULT now()
```

### Table: invoice_line_items
```sql
id uuid PRIMARY KEY DEFAULT gen_random_uuid()
invoice_id uuid NOT NULL REFERENCES invoices_v2(id) ON DELETE CASCADE
description text NOT NULL
quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0)
unit_price numeric(10,2) NOT NULL
line_total numeric(10,2) NOT NULL
sort_order integer NOT NULL DEFAULT 0
created_at timestamptz DEFAULT now()
```

### Table: customers (referenced throughout, key columns)
```sql
id uuid PRIMARY KEY
user_id uuid REFERENCES auth.users(id) -- nullable (admin can create without user)
company_name text
contact_person text
phone text
address_line_1 text
address_line_2 text
city text
postcode text
status text -- active, inactive, suspended
contact_email text -- nullable
location_tier text -- tier_1, tier_2, tier_3
```

### Table: subscriptions (referenced in customer pages)
```sql
id uuid PRIMARY KEY
customer_id uuid REFERENCES customers(id)
service_id uuid REFERENCES services(id)
bin_count integer
frequency text -- weekly, biweekly, monthly
contract_length text -- monthly, 6month, annual
monthly_price numeric
start_date date
end_date date
status text -- active, inactive, cancelled
```

### Table: service_visits (referenced in customer/admin pages)
```sql
id uuid PRIMARY KEY
customer_id uuid REFERENCES customers(id)
subscription_id uuid REFERENCES subscriptions(id)
scheduled_date timestamptz
bin_count integer
status text -- scheduled, in_progress, completed, cancelled
notes text
```

---

## Database Functions

### generate_invoice_number(invoice_type_param text)
Returns next sequential number:
- Proforma: `SLPF-YYYY-001`, `SLPF-YYYY-002`, etc.
- Invoice: `SLINV-YYYY-001`, `SLINV-YYYY-002`, etc.

### update_invoice_totals()
Trigger function: Recalculates subtotal, vat_amount, total_amount from line items.

### update_updated_at_column()
Trigger function: Sets `updated_at = now()` on any update.

### handle_new_user()
Trigger function (SECURITY DEFINER): Creates user_profiles entry on auth.users insert.

### update_news_updated_at()
Trigger function: Sets `updated_at = now()`; if status changes from 'draft' to 'published', sets `published_at = now()`.

---

## RLS Policy Summary

All tables have RLS enabled. Key patterns:

- **Public read:** site_settings, published news articles, published testimonials, sanitary bin products
- **Anonymous insert:** quotes, contact_submissions (for public forms)
- **Customer access:** Own quotes, own invoices (via customer_id -> user_id chain), own waste transfer notes, own profile
- **Admin access:** Full CRUD on all tables (checked via `EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin')`)

---

## Edge Functions

### send-contact-notification
**Trigger:** Called when contact form is submitted
**Sends to:** ronchimbo@gmail.com
**Email:** Styled HTML with gradient header (#ec008c to #8b5fbf), contact details, message

### send-quote-notification
**Trigger:** Called when quote form is submitted
**Sends to:** ronchimbo@gmail.com
**Email:** Styled HTML with gradient header, customer info, service details, estimated cost in bold pink, "View in Dashboard" button

Both use Resend API (`onboarding@resend.dev` as sender).

---

## Key Components

### Layout (src/components/Layout.tsx)
- Header: Logo (linked to dashboard if logged in, home if not), navigation links, phone number, auth buttons
- Navigation links: Home, Period Dignity, Waste Services, Sanitary Bins, Service Coverage, News, About, Contact, FAQ
- Logged-in users see: Dashboard, Admin (if admin), Sign Out
- Mobile: Hamburger menu with slide-down navigation
- Footer: 4-column grid (Company info, Services links, Company links, Legal links)
- Footer has LinkedIn icon link
- Fetches site_settings from Supabase for logos, phone, email, address
- Google Analytics script injection from settings

### InvoicePreview (src/components/InvoicePreview.tsx)
- Modal overlay with invoice document preview
- 2-column header: Logo + "Proforma Invoice" title
- Left column: To (billing address) + Service Address
- Right column: From (CIRCULAR HORIZONS INTERNATIONAL LTD t/a SaniLady broken across lines), Invoice Number, Date, Reference, Payment terms
- Line items table
- Total section with VAT
- Payment details (bank info)
- Proforma notice
- Company footer with registration details
- Print-optimized CSS

### ProtectedRoute (src/components/ProtectedRoute.tsx)
- Wraps routes requiring authentication
- Redirects to /login if not authenticated
- Shows loading spinner while checking auth

### CookieConsent (src/components/CookieConsent.tsx)
- Fixed bottom banner, border-top pink-600
- Accept/Decline buttons
- Persists choice in localStorage('cookieConsent')

### SEO (src/components/SEO.tsx)
- React Helmet wrapper
- Props: title, description, canonical, ogImage, noindex, schema
- Sets: title, meta description, canonical link, og:title, og:description, og:image, robots

### ScrollToTop (src/components/ScrollToTop.tsx)
- Scrolls window to top on route changes

---

## Authentication (src/contexts/AuthContext.tsx)

- Uses Supabase email/password auth
- Admin determined by: `user?.user_metadata?.role === 'admin'`
- Methods exposed: signIn(email, password), signUp(email, password), signOut()
- State: user, session, loading, isAdmin
- Listens to onAuthStateChange events

---

## Invoice Service (src/lib/invoiceService.ts)

Key methods:
- `generateInvoiceNumber(type)` - RPC call to DB function
- `createInvoice(invoice, lineItems)` - Creates invoice + items
- `updateInvoice(id, invoice)` - Updates invoice fields
- `updateLineItems(invoiceId, items)` - Deletes existing, inserts new
- `getInvoice(id)` - Fetch with line items
- `listInvoices(filters?)` - Query with optional customer_id, status, invoice_type
- `deleteInvoice(id)` - Hard delete
- `markAsPaid(id, paidDate)` - Sets status='paid'
- `markAsSent(id)` - Sets status='sent'
- `formatCurrency(amount)` - Returns "£X.XX"
- `calculateLineTotal(qty, unitPrice)` - qty * unitPrice rounded to 2dp
- `calculateVAT(subtotal, vatRate)` - subtotal * (vatRate / 100)
- `calculateTotal(subtotal, vatAmount)` - Sum

---

## Invoice Print/PDF Feature

The invoice detail page (`/admin/invoices/:id`) has a "Print / PDF" button that:
1. Sets document.title to `{invoice_number} - {billing_company_name}` (for PDF filename)
2. Calls `window.print()`
3. Restores original title after 100ms

Print CSS hides: navigation, footer, cookie consent, action buttons.
Print CSS optimizes: Reduced padding/margins, smaller text, fits on single A4 page.

Invoice layout for printing:
- Logo + title on same row
- 2-column grid: Left = To address + Service Address, Right = From (multi-line), Invoice #, Date, Ref, Terms
- Line items table
- Total with due date
- Invoice note (VAT info)
- Payment details (bank account: 93187193, sort: 23-11-85, BACS/FPS only)
- Proforma notice (if applicable)
- Company registration footer

---

## Page Content Details

### Home Page
- Hero with gradient background, headline: "Period Dignity & Sanitary Waste Solutions"
- Sub-headline about HMRC-compliant employee benefit
- CTA buttons: "Request a Quote", "Learn More"
- Hero image: PFASimage-1.webp
- Two service cards linking to /period-dignity and /waste-services
- Compliance badges: Licensed Waste Carrier, Full Compliance Documentation, HMRC Approved Benefit
- Latest news (3 articles from DB)
- Testimonials carousel (from DB)
- FAQ accordion (12 questions)
- CTA banner: "Ready to Transform Your Workplace?"

### Period Dignity Page
- Pricing tiers: Essential (£30/month), Premium (£40/month - Most Popular), Deluxe (£50/month)
- All under £50 HMRC trivial benefit threshold
- 4-step "How It Works" process
- Tax benefits explanation
- Employer and Employee benefits sections
- Success stories from testimonials DB

### Waste Services Page
- 6 service cards: Collection & Disposal, Compliance Documentation, Licensed Carrier, Flexible Scheduling, Environmental Standards, Full Audit Trail
- Pricing: Small Business from £45/month, Standard from £90/month, Enterprise custom
- Blue/teal color scheme

### Contact Page
- Two-tab form: General Enquiry / Request a Quote
- Real-time quote calculator with pricing logic:
  - Period Dignity: £35/employee/month
  - Waste Management: Base £25 + (bins * £14) + frequency multiplier + rental
  - Both: Combined with 10% discount
  - Additional services: £15 each
- Frequency multipliers: weekly=4, biweekly=2, monthly=1
- Contact info cards: Email, Phone, Service Area

### Service Coverage
- Coverage map image (service-map.png)
- Three county cards with top 5 towns each
- Kent: Maidstone, Canterbury, Ashford, Dartford, Gravesend
- London: Westminster, Camden, Islington, Tower Hamlets, Southwark
- Essex: Chelmsford, Colchester, Basildon, Southend-on-Sea, Harlow

### FAQ Page (18 questions across 6 categories)
Categories: General, Period Dignity Programme, Waste Management, Pricing & Contracts, Getting Started

### Service Area Pages
- Kent: 25 towns, blue/teal gradient
- London: 30 boroughs, pink/purple gradient
- Essex: 30 towns, green/teal gradient

### Legal Pages (Terms, Privacy, Cookie Policy)
- All have `noindex` meta tag
- Last updated: 07 February 2026
- Terms: 15 sections
- Privacy: 15 sections (mentions ICO)
- Cookie Policy: 8 sections with cookie tables

---

## Admin Dashboard

Shows:
- Unviewed quotes count
- Unviewed contact submissions count
- Quote list with status management (pending/approved/contacted/rejected)
- Archive/unarchive functionality
- Admin notes modal
- Active vs Archived view toggle

---

## Waste Transfer Note Defaults

- Carrier: WECLEAN4U LTD
- Registration: CBDU542939
- Valid until: 9 July 2027
- Default EWC Code: 18 01 04 (sanitary waste)
- Reference format: WTN-{timestamp}
- Waste classifications: sanitary_waste, general_waste, recyclable, hazardous, clinical

---

## Invoice Payment Details (hardcoded in invoice template)

- Account name: CIRCULAR HORIZONS INTERNATIONAL LTD
- Account number: 93187193
- Sort code: 23-11-85
- Payment method: BACS or FPS payments only
- Company Registration (footer): 15474713
- VAT (footer): 460067173
- Registered Address (footer): 128 City Road, London, EC1V 2NX
- Email (footer): info@sanilady.co.uk
- Phone (footer): 0800 652 8668

---

## Build & Deploy

### Dependencies
```json
{
  "@supabase/supabase-js": "^2.39.3",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-helmet-async": "^2.0.5",
  "react-router-dom": "^7.13.0"
}
```

### Dev Dependencies
```json
{
  "@types/node": "^25.5.0",
  "@types/react": "^18.2.48",
  "@types/react-dom": "^18.2.18",
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.17",
  "dotenv": "^17.3.1",
  "postcss": "^8.4.33",
  "puppeteer": "^24.39.0",
  "tailwindcss": "^3.4.1",
  "typescript": "^5.3.3",
  "vite": "^5.0.11"
}
```

### Config Files
- `tailwind.config.js` - Default config, no extensions
- `postcss.config.js` - tailwindcss + autoprefixer
- `vite.config.ts` - Just react plugin, no custom config
- `tsconfig.json` - Standard React TypeScript config

### Netlify Deployment
- `public/_redirects` handles SPA routing
- Pre-rendered HTML for SEO pages (via Puppeteer scripts)
- `robots.txt` disallows: /admin, /dashboard, /login, /signup, /quote-request

---

## Animations

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
.animate-float { animation: float 6s ease-in-out infinite; }

@keyframes scale-in {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-scale-in { animation: scale-in 0.2s ease-out; }
```

---

## Print Styles

```css
@media print {
  @page { margin: 0.8cm; size: A4 portrait; }
  html, body { margin: 0; padding: 0; height: auto; overflow: visible; }
  header, nav, footer, .no-print, [class*="print:hidden"] { display: none !important; }
  main { padding: 0; margin: 0; }
}
```

---

## Status Flows

| Entity | States |
|--------|--------|
| Quotes | pending -> approved / contacted / rejected |
| Contact Submissions | pending -> responded -> resolved |
| Customers | active / inactive / suspended |
| Subscriptions | active / inactive / cancelled |
| Service Visits | scheduled -> in_progress -> completed / cancelled |
| Invoices | draft -> sent -> paid / overdue / cancelled |
| News Articles | draft <-> published |

---

## Seeded/Default Data

### Testimonials (4 seeded)
1. TechCorp Solutions - "Implementing SaniLady's Period Dignity programme transformed our workplace culture..." (period-dignity, 5 stars)
2. Green Valley Academy - "As a school, student wellbeing is paramount..." (period-dignity, 5 stars)
3. Riverside Office Park - "Managing sanitary waste across our multi-tenant office complex..." (waste-services, 5 stars)
4. Meadowbrook Retail Centre - "SaniLady's waste management service is exceptional..." (waste-services, 5 stars)

### Site Settings (1 row)
- Phone: 0800 123 4567
- Email: info@sanilady.co.uk
- Address: Serving Kent, London & Essex
- Logos: /sanilady-logo-header.png, /sanilady-logo-footer.png, /sanilady-favicon-v2.png

---

## Footer Content

- Company description: "Comprehensive feminine hygiene solutions for UK businesses and individuals."
- Phone: +44 (01322) 879 713
- Email: hello@sanilady.co.uk
- Services links: Period Dignity at Work, Sanitary Waste Management, Request a Quote
- "As featured on Medical WASTE Directory" link
- Company links: About Us, Service Coverage, FAQ, Contact Us
- LinkedIn link with icon
- Legal links: Terms & Conditions, Privacy Policy, Cookie Policy
- Copyright: "2026 SaniLady. All rights reserved. | London, Hertfordshire, Essex, Kent, Sussex and Surrey"
- Footer legal: "SaniLady is a trading name of Circular Horizons International Ltd, registered in England and Wales under company number 15821509. Registered office: Unit A 82 James Carter Road, Mildenhall, United Kingdom, IP28 7DE"

---

## Header Navigation Links

Desktop: Home, Period Dignity, Waste Services, Sanitary Bins, Service Coverage, News, About, Contact, FAQ
(Plus auth links: Login/Signup or Dashboard/Admin/Sign Out)

Mobile: Same links in hamburger menu with phone number displayed.

---

## SEO & Meta (index.html)

```html
<title>SaniLady - Feminine Hygiene & Sanitary Waste Services UK</title>
<meta name="description" content="Professional feminine hygiene solutions and sanitary waste disposal services across Kent, London, and Essex. Fully licensed waste carrier providing discreet, reliable service for businesses and organizations." />
<meta property="og:image" content="https://sanilady.co.uk/sanilady-hero.png" />
<link rel="canonical" href="https://sanilady.co.uk/" />
<meta name="robots" content="index, follow" />
<meta name="geo.region" content="GB" />
<meta name="geo.placename" content="United Kingdom" />
```

---

## Key Business Logic

### Quote Cost Calculator (Contact page)
```
Period Dignity: employees * 35
Waste Management: 25 + (bins * 14 * frequencyMultiplier) + (rental ? bins * 5 : 0)
Both: (periodCost + wasteCost) * 0.9 (10% discount)
Additional services: count * 15
Frequency multipliers: weekly=4, biweekly=2, monthly=1
```

### Invoice Number Generation (DB function)
- Proforma prefix: `SLPF`
- Invoice prefix: `SLINV`
- Format: `{PREFIX}-{YEAR}-{SEQUENTIAL_3_DIGIT}`
- Resets numbering each year

### Customer Book Service (24-hour notice)
- Min date: tomorrow
- Max date: 90 days out
- Time slots: Morning (9AM-12PM), Afternoon (2PM-5PM)
- Service types: Ad-hoc Collection, Emergency Service, Additional Bins

---

## Notes for Rebuilding

1. The Supabase project ID is `adfbodeuznbcbiatxkwa` - you will need a new Supabase project
2. All migrations should be applied in order (they are timestamped)
3. The `users` table referenced in RLS policies is `user_profiles` (aliased as `users` in queries)
4. Admin role is stored in `user_metadata.role` on the auth user AND in `user_profiles.role`
5. The edge functions require `RESEND_API_KEY` secret to be set
6. Email notifications go to `ronchimbo@gmail.com`
7. Product images are stored in Supabase Storage (URLs in DB)
8. The app uses Netlify for hosting with pre-rendered HTML for SEO
9. Invoice printing relies on browser Print dialog - the CSS hides everything except invoice content
10. The `.npmrc` file may contain registry settings - check if needed
