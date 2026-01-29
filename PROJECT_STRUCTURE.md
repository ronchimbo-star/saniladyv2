# SaniLady Project Structure & Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Database Schema](#database-schema)
5. [Authentication Flow](#authentication-flow)
6. [Key Features](#key-features)
7. [Backup & Deployment](#backup--deployment)
8. [Development Workflow](#development-workflow)
9. [Performance Optimization](#performance-optimization)

---

## Project Overview

**Name:** SaniLady Website
**Type:** Business Website with Admin CMS
**Purpose:** Feminine hygiene solutions (B2B and B2C)
**Framework:** React 18 + TypeScript + Vite
**Backend:** Supabase (PostgreSQL + Authentication + Edge Functions)
**Hosting:** Static hosting (Vercel/Netlify recommended)

### Key Business Functions
- Lead generation (quote requests & contact forms)
- Content marketing (news/blog articles)
- Service information pages
- Admin content management system
- Customer relationship management (quotes & contacts)

---

## Technology Stack

### Frontend
- **React 18.2.0** - UI library
- **TypeScript 5.3.3** - Type safety
- **Vite 5.0.11** - Build tool & dev server
- **React Router DOM 7.13.0** - Client-side routing
- **TailwindCSS 3.4.1** - Utility-first CSS framework

### Backend & Services
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Authentication (email/password)
  - Row Level Security (RLS)
  - Edge Functions (Deno runtime)
  - Real-time subscriptions
- **Resend** - Transactional email service
  - Quote notifications
  - Contact form notifications
  - Admin alerts

### Development Tools
- **npm** - Package manager
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## Directory Structure

```
/tmp/cc-agent/62167274/project/
│
├── public/                          # Static assets
│   ├── sanilady-favicon-v2.png     # Browser favicon
│   ├── sanilady-hero.png           # Homepage hero image
│   ├── sanilady-logo-header.png    # Header logo (white bg)
│   └── sanilady-logo-footer.png    # Footer logo (dark bg)
│
├── src/                             # Source code
│   ├── components/                  # Reusable React components
│   │   ├── CookieConsent.tsx       # Cookie consent banner
│   │   ├── Layout.tsx              # Main layout wrapper (nav + footer)
│   │   └── ProtectedRoute.tsx      # Auth-required route wrapper
│   │
│   ├── contexts/                    # React Context providers
│   │   └── AuthContext.tsx         # Authentication state management
│   │
│   ├── lib/                         # Utility libraries
│   │   └── supabase.ts             # Supabase client initialization
│   │
│   ├── pages/                       # Page components (routes)
│   │   ├── About.tsx               # About Us page
│   │   ├── AdminDashboard.tsx      # Admin dashboard (quotes/contacts)
│   │   ├── Contact.tsx             # Contact form page
│   │   ├── CookiePolicy.tsx        # Cookie policy
│   │   ├── Dashboard.tsx           # User dashboard
│   │   ├── FAQ.tsx                 # Frequently asked questions
│   │   ├── Home.tsx                # Homepage
│   │   ├── Login.tsx               # Login page
│   │   ├── PeriodDignity.tsx       # Period Dignity service page
│   │   ├── Privacy.tsx             # Privacy policy
│   │   ├── QuoteRequest.tsx        # Quote request form
│   │   ├── Signup.tsx              # User registration
│   │   ├── Terms.tsx               # Terms & conditions
│   │   └── WasteServices.tsx       # Waste management service page
│   │
│   ├── App.tsx                      # Main app component (routing)
│   ├── main.tsx                     # App entry point
│   ├── index.css                    # Global styles
│   └── vite-env.d.ts               # Vite type definitions
│
├── supabase/                        # Supabase configuration
│   ├── functions/                   # Edge Functions
│   │   └── send-quote-notification/ # Email notification function
│   │       └── index.ts
│   │
│   └── migrations/                  # Database migrations
│       ├── 20260129153334_create_quotes_table.sql
│       ├── 20260129154559_add_admin_functionality.sql
│       └── 20260129155330_create_contact_submissions_table.sql
│
├── .env                             # Environment variables (NEVER commit!)
├── .gitignore                       # Git ignore rules
├── index.html                       # HTML entry point
├── package.json                     # Dependencies & scripts
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── PROJECT_ROADMAP.md               # Feature roadmap
└── PROJECT_STRUCTURE.md             # This file
```

---

## Database Schema

### Tables

#### 1. `user_profiles`
Extends Supabase's `auth.users` with application-specific data.

```sql
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role text DEFAULT 'customer',  -- 'customer' or 'admin'
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view their own profile
- Users can update their own profile
- Automatic creation on user signup (trigger)

#### 2. `quotes`
Stores quote requests from potential customers.

```sql
CREATE TABLE quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  customer_name text,
  customer_email text,
  customer_phone text,
  company_name text,
  property_type text,           -- Service type selected
  property_size text,
  cleaning_frequency text,
  bedrooms integer,             -- Reused for employee count
  bathrooms integer,            -- Reused for bin count
  additional_services text[],
  special_requirements text,
  estimated_cost numeric,
  status text DEFAULT 'pending',
  viewed_by_admin boolean DEFAULT false,
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Users can view their own quotes
- Users can insert their own quotes
- Admins can view all quotes
- Admins can update all quotes

#### 3. `contact_submissions`
Stores contact form and quote request submissions.

```sql
CREATE TABLE contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('general', 'quote')),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company text DEFAULT '',
  subject text DEFAULT '',
  message text NOT NULL,
  service_type text DEFAULT '',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**RLS Policies:**
- Anyone (anon or authenticated) can insert
- Admins can view all submissions
- Admins can update submissions

### Database Location
**Host:** Supabase Cloud (adfbodeuznbcbiatxkwa.supabase.co)
**Access:** Via Supabase client library using environment variables

---

## Authentication Flow

### User Registration
1. User fills signup form (`/signup`)
2. `supabase.auth.signUp()` creates account in `auth.users`
3. Database trigger automatically creates entry in `user_profiles` with role='customer'
4. User redirected to dashboard

### User Login
1. User fills login form (`/login`)
2. `supabase.auth.signInWithPassword()` authenticates
3. `AuthContext` fetches user profile and checks role
4. User redirected to appropriate dashboard (customer or admin)

### Admin Access
- Admin role stored in `user_profiles.role = 'admin'`
- Admin routes protected by `ProtectedRoute` component
- Admin-only UI elements shown conditionally via `isAdmin` from `AuthContext`

### Session Management
- JWT tokens stored in browser (httpOnly cookies preferred in production)
- Auto-refresh before expiration
- `onAuthStateChange` listener maintains session state
- Logout clears all auth data

---

## Key Features

### 1. Quote Request System
**Flow:**
1. User fills form at `/quote-request` (auth required) or `/contact` (no auth)
2. Data saved to `quotes` or `contact_submissions` table
3. Edge Function triggered to send email via Resend
4. Admin receives email notification
5. Quote appears in admin dashboard with "New" badge
6. Admin can view, update status, add notes

### 2. Admin Dashboard
**Location:** `/admin`
**Access:** Admin role required
**Features:**
- View all quote requests
- Filter by status (pending/approved/rejected/contacted)
- Mark quotes as viewed
- Add admin notes
- Update quote status
- Modal for detailed quote view

### 3. Content Pages
- All service pages are static React components
- Content editable by modifying page files
- Future: Move to database for admin editing

### 4. Email Notifications
**Service:** Resend API
**Edge Function:** `send-quote-notification`
**Triggers:** Quote form submission
**Template:** HTML email with customer details
**Recipient:** ronchimbo@gmail.com (configurable in function)

### 5. Cookie Consent
**Component:** `CookieConsent.tsx`
**Storage:** localStorage (`cookieConsent`)
**Policy Page:** `/cookie-policy`
**Compliance:** UK/EU GDPR friendly

---

## Backup & Deployment

### Backing Up to GitHub

1. **Initialize Git Repository**
```bash
cd /tmp/cc-agent/62167274/project
git init
```

2. **Create .gitignore (already exists)**
Ensure these are ignored:
```
node_modules/
dist/
.env
.env.local
```

3. **Create GitHub Repository**
- Go to github.com and create new repository
- Name it `sanilady-website`
- Don't initialize with README (local repo already exists)

4. **Connect and Push**
```bash
git add .
git commit -m "Initial commit - SaniLady website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sanilady-website.git
git push -u origin main
```

5. **Regular Backups**
```bash
git add .
git commit -m "Description of changes"
git push
```

### Database Backup

**Automatic Backups:** Supabase provides automatic daily backups

**Manual Backup via SQL:**
```sql
-- Export all tables
COPY user_profiles TO '/tmp/user_profiles.csv' CSV HEADER;
COPY quotes TO '/tmp/quotes.csv' CSV HEADER;
COPY contact_submissions TO '/tmp/contact_submissions.csv' CSV HEADER;
```

**Via Supabase Dashboard:**
1. Go to Database → Backups
2. Create manual backup
3. Download backup file

### Deployment Options

#### Option 1: Vercel (Recommended)
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Auto-deploys on git push
4. Free tier available

#### Option 2: Netlify
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Set environment variables

#### Option 3: Traditional Hosting
1. Run `npm run build`
2. Upload `dist/` folder contents
3. Configure server for SPA routing
4. Set up SSL certificate

### Environment Variables Required
```
VITE_SUPABASE_URL=https://adfbodeuznbcbiatxkwa.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
RESEND_API_KEY=re_RGhPgGnH_7Bp8UAVa5yfpJGu2aUtbejdE
```

---

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### File Modification Guidelines

**Creating New Pages:**
1. Create component in `src/pages/`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/Layout.tsx`

**Database Changes:**
1. Create migration file in `supabase/migrations/`
2. Use `mcp__supabase__apply_migration` tool
3. Test RLS policies thoroughly
4. Document changes

**Styling:**
- Use Tailwind utility classes
- Follow existing color scheme (pink gradients)
- Maintain responsive design (mobile-first)
- Test on multiple screen sizes

---

## Performance Optimization

### Current Status
- Bundle size: ~466KB (gzipped: ~125KB)
- Build time: ~5-6 seconds
- First Contentful Paint: <2s (good network)

### Optimization Opportunities

#### 1. Code Splitting
```typescript
// Use lazy loading for routes
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
```

#### 2. Image Optimization
- Convert PNGs to WebP
- Add responsive images
- Implement lazy loading
- Use CDN for static assets

#### 3. Bundle Analysis
```bash
npm install --save-dev rollup-plugin-visualizer
```

#### 4. Caching Strategy
- Set long cache times for static assets
- Use service workers for offline support

#### 5. Database Optimization
- Add indexes on frequently queried columns
- Use `maybeSingle()` instead of `single()`
- Implement pagination for large datasets

### Recommended Improvements

**High Priority:**
1. Add loading states to all async operations
2. Implement error boundaries
3. Add retry logic for failed requests
4. Optimize images (convert to WebP)
5. Add meta tags for SEO

**Medium Priority:**
1. Implement code splitting
2. Add service worker for offline support
3. Set up CDN for static assets
4. Implement progressive image loading
5. Add analytics tracking

**Low Priority:**
1. Implement virtual scrolling for long lists
2. Add prefetching for likely next pages
3. Optimize bundle with tree shaking
4. Implement HTTP/2 push

---

## Security Considerations

### Current Security Features
- Row Level Security (RLS) on all tables
- Password-based authentication
- CORS headers on Edge Functions
- Environment variables for sensitive data
- Input sanitization on forms

### Security Improvements Needed
1. **Rate Limiting:** Prevent form spam
2. **CAPTCHA:** On public forms
3. **Content Security Policy:** Restrict resource loading
4. **HTTPS Only:** Enforce in production
5. **Regular Updates:** Keep dependencies current

---

## Monitoring & Maintenance

### What to Monitor
- Supabase usage (database, storage, bandwidth)
- Email delivery rates (Resend dashboard)
- Error rates in production
- Page load times
- Quote submission volumes

### Regular Maintenance Tasks
- Review and respond to quotes (daily)
- Check for security updates (weekly)
- Review analytics data (weekly)
- Database backup verification (monthly)
- Dependency updates (monthly)

---

## Support & Documentation

### External Documentation
- **React:** https://react.dev/
- **Supabase:** https://supabase.com/docs
- **TailwindCSS:** https://tailwindcss.com/docs
- **Vite:** https://vitejs.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/

### Internal Resources
- PROJECT_ROADMAP.md - Feature planning
- /supabase/migrations/ - Database change history
- /.env.example - Environment variable template (create this)

### Getting Help
- Supabase Discord: https://discord.supabase.com
- React Community: https://react.dev/community
- Stack Overflow: Tag questions with relevant tech

---

## Conclusion

This project is well-structured and ready for expansion. The modular architecture makes it easy to add features, and the use of modern technologies ensures good performance and developer experience.

**Next Steps:**
1. Implement news/blog system
2. Add admin settings page
3. Enhance SEO capabilities
4. Set up automated testing
5. Deploy to production hosting

For questions or issues, refer to the roadmap and this documentation first. Happy coding!
