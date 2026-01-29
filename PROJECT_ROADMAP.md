# SaniLady Project Roadmap

## Current Status: Phase 1 Complete
Last Updated: January 2026

---

## Phase 1: Foundation (✅ COMPLETED)

### Core Infrastructure
- [x] React + TypeScript setup with Vite
- [x] Supabase database integration
- [x] Authentication system (email/password)
- [x] Admin role management
- [x] Row Level Security (RLS) policies

### Pages & Navigation
- [x] Homepage with hero section
- [x] About Us page
- [x] FAQ page
- [x] Contact page (dual form)
- [x] Period Dignity at Work page
- [x] Waste Services page
- [x] Terms & Conditions
- [x] Privacy Policy
- [x] Cookie Policy
- [x] Cookie consent banner
- [x] Responsive navigation
- [x] Footer with links

### Admin Features (Basic)
- [x] Admin dashboard
- [x] Quote request management
- [x] Contact form submissions viewing
- [x] Status updates for quotes
- [x] Admin notes functionality

### Forms & Data Capture
- [x] Quote request form (basic)
- [x] Contact form (general enquiry & quote)
- [x] Customer information capture
- [x] Email notifications via Resend

### Database Tables
- [x] user_profiles (role management)
- [x] quotes
- [x] contact_submissions

---

## Phase 2: News & Content Management (🔄 IN PROGRESS)

### News System
- [ ] News articles database table
  - [ ] Title, content (HTML), excerpt
  - [ ] Category system
  - [ ] Thumbnail & featured image
  - [ ] SEO metadata (title, description, keywords)
  - [ ] Publish/draft status
  - [ ] Author & timestamps
  - [ ] Slug for URLs

- [ ] Admin News Management
  - [ ] Create/edit news articles (rich text editor)
  - [ ] HTML content editor
  - [ ] Category management
  - [ ] Image upload (thumbnail & featured)
  - [ ] SEO fields per article
  - [ ] Publish/unpublish functionality
  - [ ] Delete articles
  - [ ] Preview before publishing

- [ ] Public News Pages
  - [ ] News index page (12 articles + pagination)
  - [ ] Individual news article pages
  - [ ] Category filtering
  - [ ] Social share buttons (before & after content)
  - [ ] Latest 3 articles on homepage
  - [ ] Related articles section

### Media Management
- [ ] Image upload system
- [ ] Image optimization
- [ ] Media library in admin
- [ ] Alt text & metadata for images

---

## Phase 3: Enhanced Admin Features (⏳ PLANNED)

### Dashboard Notifications
- [ ] Real-time notification system
- [ ] Unread quote requests badge
- [ ] Unread contact submissions badge
- [ ] Mark as read/unread functionality
- [ ] Notification preferences

### Email Notifications
- [ ] Contact form submission emails
- [ ] Quote request emails (already implemented)
- [ ] Email template system
- [ ] Configurable email recipients

### Admin Settings Page
- [ ] Site contact information
  - [ ] Email address
  - [ ] Phone numbers (multiple)
  - [ ] Business address
- [ ] Notification settings
  - [ ] Email recipients for forms
  - [ ] Notification preferences
- [ ] Social media links
  - [ ] Facebook, Twitter, Instagram, LinkedIn
  - [ ] Display in footer
- [ ] Google Analytics
  - [ ] Measurement ID input
  - [ ] Auto-inject into <head>

### User Management
- [ ] Create admin accounts
- [ ] Edit user roles
- [ ] Disable/enable users
- [ ] Password reset for admins

---

## Phase 4: SEO & Analytics (⏳ PLANNED)

### SEO Management
- [ ] Global SEO settings
  - [ ] Default title format
  - [ ] Default description
  - [ ] Default keywords
- [ ] Page-specific SEO
  - [ ] Custom title per page
  - [ ] Custom description per page
  - [ ] Custom keywords per page
  - [ ] Open Graph tags
  - [ ] Twitter Card tags
- [ ] SEO admin interface
  - [ ] Edit SEO for all pages
  - [ ] Preview how it appears in search
  - [ ] Character count indicators

### Analytics Integration
- [ ] Google Analytics 4 integration
- [ ] Admin analytics dashboard
  - [ ] Most visited pages
  - [ ] Traffic sources
  - [ ] User demographics
  - [ ] Real-time visitors
- [ ] Custom event tracking
  - [ ] Quote form submissions
  - [ ] Contact form submissions
  - [ ] Button clicks

### Sitemap
- [ ] XML sitemap generation
- [ ] Include all public pages
- [ ] Include published news articles
  - [ ] Updated when articles published
- [ ] Sitemap URL copyable from admin
- [ ] Auto-submit to search engines

---

## Phase 5: Enhanced Quote System (⏳ PLANNED)

### Improved Quote Form
- [ ] Service-specific fields
  - [ ] Number of bins
  - [ ] Bin locations (address/building)
  - [ ] Collection frequency (weekly/fortnightly/monthly)
  - [ ] Bin rental required (yes/no)
  - [ ] Existing bins (yes/no)
- [ ] Property type selection
- [ ] Floor plan upload (optional)
- [ ] Special requirements
- [ ] Preferred start date

### Quote Management
- [ ] Quote status workflow
  - [ ] New → Reviewing → Quote Sent → Accepted/Rejected
- [ ] Generate PDF quotes
- [ ] Send quotes via email
- [ ] Quote history tracking
- [ ] Follow-up reminders

---

## Phase 6: Performance & Optimization (⏳ PLANNED)

### Performance
- [ ] Image lazy loading
- [ ] Code splitting
- [ ] Bundle size optimization
- [ ] CDN integration
- [ ] Caching strategy

### SEO Technical
- [ ] Structured data (Schema.org)
- [ ] robots.txt
- [ ] Meta robots tags
- [ ] Canonical URLs
- [ ] 301 redirects management

### Security
- [ ] Rate limiting
- [ ] CAPTCHA on forms
- [ ] Security headers
- [ ] Regular security audits
- [ ] SQL injection prevention
- [ ] XSS protection

---

## Phase 7: Advanced Features (📅 FUTURE)

### Customer Portal
- [ ] Customer login area
- [ ] View quotes history
- [ ] Service agreement documents
- [ ] Invoice access
- [ ] Support ticket system

### Booking System
- [ ] Online service booking
- [ ] Calendar integration
- [ ] Automated confirmations
- [ ] Reminders

### E-commerce (Individual Subscriptions)
- [ ] Product catalog
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Payment integration (Stripe)
- [ ] Subscription management

### Reporting
- [ ] Business intelligence dashboard
- [ ] Revenue reports
- [ ] Customer acquisition reports
- [ ] Service area heat maps
- [ ] Export data (CSV/Excel)

### Multi-language Support
- [ ] English (primary)
- [ ] Additional languages
- [ ] Translation management

---

## Technical Debt & Improvements

### Code Quality
- [ ] Add comprehensive unit tests
- [ ] Add integration tests
- [ ] E2E testing setup
- [ ] ESLint configuration
- [ ] Prettier setup
- [ ] Pre-commit hooks

### Documentation
- [ ] API documentation
- [ ] Component documentation
- [ ] Developer onboarding guide
- [ ] Deployment guide
- [ ] Troubleshooting guide

### Infrastructure
- [ ] CI/CD pipeline
- [ ] Automated deployments
- [ ] Staging environment
- [ ] Backup strategy
- [ ] Disaster recovery plan
- [ ] Monitoring & alerting

---

## Priority Matrix

### High Priority (Next 2-4 weeks)
1. News management system
2. Admin settings page
3. Improved quote form
4. Email notifications for contact forms
5. Dashboard notifications

### Medium Priority (1-2 months)
1. SEO management system
2. Google Analytics integration
3. Sitemap generation
4. Social media integration
5. Admin analytics dashboard

### Low Priority (3+ months)
1. Customer portal
2. Booking system
3. E-commerce features
4. Advanced reporting
5. Multi-language support

---

## Success Metrics

### Phase 2 Goals
- News system operational
- 10+ published articles
- Admin can manage content independently
- SEO improved with metadata

### Phase 3 Goals
- Email notifications 100% reliable
- Admin settings fully functional
- Google Analytics tracking all key events
- Dashboard provides actionable insights

### Phase 4 Goals
- Sitemap indexed by Google
- All pages have custom SEO
- Organic traffic increasing
- Search rankings improving

---

## Notes

- This roadmap is a living document and will be updated as priorities change
- User feedback will influence feature prioritization
- Security and performance are ongoing concerns throughout all phases
- Each phase should include testing and documentation
