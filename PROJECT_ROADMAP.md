# SaniLady Project Roadmap

## Current Status: Foundation Complete, Advanced Features Partially Implemented
Last Updated: January 30, 2026

---

## 🎯 IMPLEMENTATION STATUS OVERVIEW

### ✅ FULLY IMPLEMENTED (Frontend + Backend)
- Core infrastructure and authentication
- Homepage, About, FAQ, Contact pages
- Basic admin dashboard
- Quote request management
- News articles management system
- Testimonials management
- Site settings configuration
- Email notifications for quotes
- Cookie consent and policy pages

### 🟡 PARTIALLY IMPLEMENTED (Backend Ready, Frontend Missing)
- Customer management system (DB tables exist, no UI)
- Subscription management (DB tables exist, no UI)
- Service scheduling and visits (DB tables exist, no UI)
- Invoice generation (DB tables exist, no UI)
- Document management including waste transfer notes (DB tables exist, no UI)
- Employee benefits platform (DB tables exist, no UI)
- Staff/employee tracking (DB tables exist, no UI)

### ⏳ PLANNED (Not Yet Started)
- Customer portal
- Staff mobile app/portal
- Communication features (WhatsApp, AI chatbot)
- Advanced reporting and analytics

---

## 📊 PRIORITY ROADMAP

### 🔴 CRITICAL PRIORITY (Weeks 1-4)
Core business operations that generate revenue and reduce manual work

#### 1. Admin Subscription Management
**Business Value:** HIGH - Core revenue management
**Complexity:** MEDIUM
**Dependencies:** Customer management UI

**Features:**
- [ ] View all active subscriptions
- [ ] Create new subscriptions for customers
- [ ] Edit subscription details (frequency, bin count, pricing)
- [ ] Cancel/suspend subscriptions
- [ ] View subscription history and changes
- [ ] Calculate and display monthly recurring revenue (MRR)
- [ ] Renewal reminders and auto-renewal settings

#### 2. Admin Customer Management
**Business Value:** HIGH - Central to all operations
**Complexity:** MEDIUM
**Dependencies:** None

**Features:**
- [ ] Customer list view with search and filtering
- [ ] Create new customer accounts
- [ ] Edit customer details (company, contact, address)
- [ ] View customer profile with all related data
  - [ ] Active subscriptions
  - [ ] Service history
  - [ ] Invoices and payments
  - [ ] Documents and waste transfer notes
- [ ] Customer status management (active/inactive/suspended)
- [ ] Merge duplicate customers
- [ ] Export customer data

#### 3. Service Request Management
**Business Value:** HIGH - Track all service work
**Complexity:** MEDIUM
**Dependencies:** Customer management

**Features:**
- [ ] Calendar view of scheduled services
- [ ] List view with filtering (by status, customer, date)
- [ ] Create ad-hoc service requests
- [ ] Assign staff to service visits
- [ ] Track service status (scheduled, in progress, completed, cancelled)
- [ ] View service details and customer info
- [ ] Reschedule services with notification
- [ ] Mark services as completed with notes
- [ ] View service history per customer

#### 4. Waste Transfer Notes Generation
**Business Value:** HIGH - Legal compliance requirement
**Complexity:** MEDIUM
**Dependencies:** Customer management, Service visits

**Features:**
- [ ] Generate waste transfer note per service visit
- [ ] Auto-populate customer and service details
- [ ] Capture waste description, quantity, and classification
- [ ] Digital signature capture (staff)
- [ ] Unique reference numbering system
- [ ] PDF generation and storage
- [ ] Link notes to specific customers and invoices
- [ ] Search and filter waste transfer notes
- [ ] Bulk export for compliance reporting
- [ ] Email notes to customers automatically

---

### 🟠 HIGH PRIORITY (Weeks 5-8)
Customer self-service features to reduce admin workload

#### 5. Customer Portal - Authentication & Profile
**Business Value:** HIGH - Reduces admin workload
**Complexity:** MEDIUM
**Dependencies:** Customer management

**Features:**
- [ ] Customer login (linked to existing user accounts)
- [ ] Password reset functionality
- [ ] View and edit profile information
- [ ] Update contact details and addresses
- [ ] Change password
- [ ] Email notification preferences

#### 6. Customer Portal - Subscription Management
**Business Value:** HIGH - Customer self-service
**Complexity:** MEDIUM
**Dependencies:** Customer portal authentication

**Features:**
- [ ] View active subscriptions
- [ ] See subscription details (frequency, bin count, pricing)
- [ ] Request subscription changes (escalates to admin)
- [ ] View subscription history
- [ ] Download subscription agreement/contract
- [ ] Request cancellation (with confirmation)
- [ ] Upgrade/downgrade options

#### 7. Customer Portal - Ad-hoc Service Booking
**Business Value:** MEDIUM - Additional revenue stream
**Complexity:** MEDIUM
**Dependencies:** Customer portal, Service management

**Features:**
- [ ] Browse available services
- [ ] Select service type and date
- [ ] View available time slots
- [ ] Add special instructions
- [ ] See pricing estimate
- [ ] Submit booking request
- [ ] Receive confirmation email
- [ ] View upcoming ad-hoc bookings
- [ ] Cancel or reschedule bookings

#### 8. Customer Portal - Schedule Management
**Business Value:** MEDIUM - Flexibility for customers
**Complexity:** MEDIUM
**Dependencies:** Customer portal, Subscription management

**Features:**
- [ ] View service schedule (calendar view)
- [ ] Request schedule changes
- [ ] Skip a service (with notice period)
- [ ] Add extra service dates
- [ ] Set holiday/pause periods
- [ ] Receive schedule reminders

---

### 🟡 MEDIUM PRIORITY (Weeks 9-12)
Financial management and documentation

#### 9. Invoice Management (Admin)
**Business Value:** HIGH - Financial operations
**Complexity:** MEDIUM
**Dependencies:** Customer management, Subscriptions

**Features:**
- [ ] Auto-generate invoices for subscriptions
- [ ] Manual invoice creation for ad-hoc services
- [ ] Invoice list with filtering and search
- [ ] Edit draft invoices
- [ ] Send invoices via email
- [ ] Mark invoices as paid/overdue
- [ ] Record payment details
- [ ] Generate credit notes
- [ ] Invoice templates with company branding
- [ ] Tax/VAT calculations
- [ ] Bulk invoice generation for billing period

#### 10. Customer Portal - Invoices & Receipts
**Business Value:** MEDIUM - Customer convenience
**Complexity:** LOW
**Dependencies:** Customer portal, Invoice management

**Features:**
- [ ] View invoice history
- [ ] Filter invoices by status and date
- [ ] Download invoices as PDF
- [ ] View payment receipts
- [ ] Download receipts as PDF
- [ ] See payment history
- [ ] Outstanding balance summary
- [ ] Payment reminders

#### 11. Customer Portal - Document Center
**Business Value:** MEDIUM - Document access
**Complexity:** LOW
**Dependencies:** Customer portal, Document management

**Features:**
- [ ] View all documents
- [ ] Download waste transfer notes
- [ ] Download compliance certificates
- [ ] Download contracts and agreements
- [ ] Search documents
- [ ] Filter by document type and date
- [ ] Email documents to self

---

### 🟢 IMPORTANT (Weeks 13-16)
Staff operations and field service management

#### 12. Staff Portal - Authentication & Dashboard
**Business Value:** HIGH - Field operations
**Complexity:** MEDIUM
**Dependencies:** User management

**Features:**
- [ ] Staff login system
- [ ] Role-based access (field staff vs supervisors)
- [ ] Personal dashboard
- [ ] Today's schedule overview
- [ ] Notifications center
- [ ] Profile management

#### 13. Staff Portal - Schedule View
**Business Value:** HIGH - Daily operations
**Complexity:** MEDIUM
**Dependencies:** Staff portal, Service visits

**Features:**
- [ ] Daily schedule view
- [ ] Weekly schedule view
- [ ] Service visit details
  - [ ] Customer information
  - [ ] Service address with map/directions
  - [ ] Service type and requirements
  - [ ] Special instructions
  - [ ] Previous visit notes
- [ ] Filter by status
- [ ] Route optimization view

#### 14. Staff Portal - Service Execution
**Business Value:** HIGH - Service delivery tracking
**Complexity:** MEDIUM
**Dependencies:** Staff portal, Service visits

**Features:**
- [ ] Clock in/Start service button
- [ ] Photo upload capability
  - [ ] Before photos
  - [ ] During service photos
  - [ ] After photos
  - [ ] Issue/damage photos
- [ ] Service notes and observations
- [ ] Report issues or damages
- [ ] Request admin assistance
- [ ] Clock out/Complete service button
- [ ] Automatic timestamp tracking
- [ ] GPS location verification

#### 15. Staff Portal - Issue Reporting
**Business Value:** MEDIUM - Quality control
**Complexity:** LOW
**Dependencies:** Staff portal

**Features:**
- [ ] Report service issues
- [ ] Categorize issues (equipment, access, damage, etc.)
- [ ] Upload photos of issues
- [ ] Priority flagging
- [ ] Real-time admin notifications
- [ ] Issue status tracking
- [ ] Resolution notes
- [ ] Issue history per customer

#### 16. Service Sign-off System
**Business Value:** MEDIUM - Service verification
**Complexity:** MEDIUM
**Dependencies:** Staff portal, Service execution

**Features:**
- [ ] Staff completion sign-off
- [ ] Customer PIN-based sign-off
  - [ ] Generate unique PIN per service
  - [ ] Send PIN to customer contact
  - [ ] PIN entry interface
  - [ ] Time-limited PIN validity
- [ ] Optional customer feedback/rating
- [ ] Sign-off timestamp
- [ ] Dispute resolution process
- [ ] Sign-off reports

---

### 🔵 STANDARD PRIORITY (Weeks 17-24)
Enhanced features and communication

#### 17. Advanced Reporting & Analytics
**Business Value:** MEDIUM - Business intelligence
**Complexity:** MEDIUM
**Dependencies:** All core features

**Features:**
- [ ] Revenue reports
  - [ ] MRR trends
  - [ ] Revenue by service type
  - [ ] Revenue by region
  - [ ] Customer lifetime value
- [ ] Operations reports
  - [ ] Services completed vs scheduled
  - [ ] Staff productivity
  - [ ] Service completion time averages
  - [ ] Issue frequency reports
- [ ] Customer reports
  - [ ] Customer acquisition trends
  - [ ] Churn rate analysis
  - [ ] Customer satisfaction scores
  - [ ] Top customers by revenue
- [ ] Compliance reports
  - [ ] Waste transfer note summary
  - [ ] Service coverage by region
  - [ ] Certificate expiration tracking
- [ ] Export to Excel/CSV
- [ ] Scheduled report emails

#### 18. Payment Integration
**Business Value:** HIGH - Revenue collection
**Complexity:** HIGH
**Dependencies:** Invoice management, Customer portal

**Features:**
- [ ] Stripe payment gateway integration
- [ ] Customer payment methods storage
- [ ] One-click payment from invoices
- [ ] Recurring payment setup
- [ ] Payment failure handling
- [ ] Refund processing
- [ ] Payment receipt generation
- [ ] PCI compliance

#### 19. Email Notification System (Enhanced)
**Business Value:** MEDIUM - Communication automation
**Complexity:** LOW
**Dependencies:** All modules

**Features:**
- [ ] Service reminders (24h before)
- [ ] Service completion notifications
- [ ] Invoice issued notifications
- [ ] Payment received confirmations
- [ ] Payment overdue reminders
- [ ] Schedule change confirmations
- [ ] Staff assignment notifications
- [ ] Issue alert notifications
- [ ] Document available notifications
- [ ] Email template management
- [ ] Unsubscribe management

#### 20. SMS Notifications
**Business Value:** MEDIUM - Critical communications
**Complexity:** MEDIUM
**Dependencies:** Notification system

**Features:**
- [ ] Service reminders via SMS
- [ ] Staff on the way notifications
- [ ] Service completion SMS
- [ ] PIN code delivery for sign-offs
- [ ] Emergency notifications
- [ ] SMS preferences per customer
- [ ] Twilio or similar integration

---

### 🟣 FUTURE ENHANCEMENTS (Weeks 25+)
Advanced features for competitive advantage

#### 21. WhatsApp Integration
**Business Value:** MEDIUM - Modern communication
**Complexity:** HIGH
**Dependencies:** WhatsApp Business API

**Features:**
- [ ] WhatsApp Business API setup
- [ ] Customer opt-in management
- [ ] Service reminders via WhatsApp
- [ ] Two-way customer communication
- [ ] Quick replies for common questions
- [ ] Share documents via WhatsApp
- [ ] Staff notifications via WhatsApp
- [ ] Read receipts and delivery status
- [ ] WhatsApp chat history in customer profile

#### 22. AI Chatbot
**Business Value:** MEDIUM - 24/7 customer support
**Complexity:** HIGH
**Dependencies:** None (can be independent)

**Features:**
- [ ] Website chat widget
- [ ] Natural language processing
- [ ] Common question handling
  - [ ] Service area coverage
  - [ ] Pricing inquiries
  - [ ] Service descriptions
  - [ ] Booking information
  - [ ] Account queries
- [ ] Lead capture and qualification
- [ ] Handoff to human support
- [ ] Multi-language support
- [ ] Chat history storage
- [ ] Admin chat dashboard
- [ ] AI training and improvement
- [ ] Integration with customer data

#### 23. Mobile Apps (Native)
**Business Value:** HIGH - Better user experience
**Complexity:** VERY HIGH
**Dependencies:** All APIs built

**Features:**
- [ ] Customer mobile app (iOS & Android)
  - [ ] All customer portal features
  - [ ] Push notifications
  - [ ] Quick booking
  - [ ] Photo upload for issues
- [ ] Staff mobile app (iOS & Android)
  - [ ] Offline capability
  - [ ] GPS tracking
  - [ ] Photo capture
  - [ ] Digital signatures
  - [ ] Route navigation
- [ ] App store deployment
- [ ] Mobile app analytics

#### 24. Route Optimization Engine
**Business Value:** HIGH - Operational efficiency
**Complexity:** VERY HIGH
**Dependencies:** Service scheduling, GPS tracking

**Features:**
- [ ] Automatic route planning
- [ ] Multi-stop optimization
- [ ] Traffic consideration
- [ ] Time window constraints
- [ ] Staff capacity balancing
- [ ] Fuel cost optimization
- [ ] Real-time route adjustments
- [ ] Route performance analytics

#### 25. Inventory Management
**Business Value:** MEDIUM - Stock control
**Complexity:** MEDIUM
**Dependencies:** None

**Features:**
- [ ] Product/supply catalog
- [ ] Stock level tracking
- [ ] Low stock alerts
- [ ] Reorder point management
- [ ] Purchase order generation
- [ ] Supplier management
- [ ] Stock allocation to vehicles
- [ ] Inventory reports
- [ ] Barcode scanning

#### 26. Quality Assurance System
**Business Value:** MEDIUM - Service quality
**Complexity:** MEDIUM
**Dependencies:** Service visits, Staff portal

**Features:**
- [ ] Service quality checklists
- [ ] Random QA inspections
- [ ] Photo verification requirements
- [ ] Customer satisfaction surveys
- [ ] Staff performance scoring
- [ ] Quality trend reports
- [ ] Training recommendations
- [ ] Reward/recognition system

#### 27. Advanced Period Dignity Platform
**Business Value:** MEDIUM - Market differentiation
**Complexity:** HIGH
**Dependencies:** Employee benefits tables

**Features:**
- [ ] Company enrollment portal
- [ ] Employee self-service platform
- [ ] Product selection and preferences
- [ ] Delivery scheduling
- [ ] Budget tracking per employee
- [ ] Order fulfillment workflow
- [ ] Social media sharing rewards
- [ ] Product feedback system
- [ ] Anonymous satisfaction surveys
- [ ] Company billing and invoicing
- [ ] Usage analytics

---

## 📋 TECHNICAL DEBT & INFRASTRUCTURE

### Code Quality
- [ ] Add unit tests for critical functions
- [ ] Add integration tests for API endpoints
- [ ] Set up E2E testing with Playwright/Cypress
- [ ] Configure ESLint with strict rules
- [ ] Add Prettier for code formatting
- [ ] Set up pre-commit hooks with Husky
- [ ] Add JSDoc comments to complex functions
- [ ] Refactor large components into smaller ones

### Performance
- [ ] Implement lazy loading for images
- [ ] Add code splitting for routes
- [ ] Optimize bundle size
- [ ] Set up CDN for static assets
- [ ] Implement server-side caching
- [ ] Database query optimization
- [ ] Add pagination to all list views
- [ ] Implement virtual scrolling for long lists

### Security
- [ ] Rate limiting on all API endpoints
- [ ] Add CAPTCHA to public forms
- [ ] Security headers configuration
- [ ] Regular dependency updates
- [ ] SQL injection prevention audit
- [ ] XSS protection audit
- [ ] CSRF token implementation
- [ ] API key rotation system
- [ ] Regular security audits

### DevOps
- [ ] CI/CD pipeline setup
- [ ] Automated testing in pipeline
- [ ] Automated deployments
- [ ] Staging environment
- [ ] Backup strategy implementation
- [ ] Disaster recovery plan
- [ ] Monitoring and alerting (Sentry, etc.)
- [ ] Uptime monitoring
- [ ] Performance monitoring
- [ ] Database backup automation

### SEO & Marketing
- [ ] XML sitemap generation
- [ ] Structured data (Schema.org)
- [ ] robots.txt optimization
- [ ] Open Graph tags for all pages
- [ ] Twitter Card tags
- [ ] Google Analytics 4 setup
- [ ] Google Search Console setup
- [ ] Page speed optimization
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (WCAG 2.1)

---

## 🎯 SUCCESS METRICS

### Phase 1: Core Operations (Weeks 1-8)
- [ ] Admin can manage 100% of customers without spreadsheets
- [ ] All subscriptions tracked in system
- [ ] 100% of services scheduled in system
- [ ] 100% of waste transfer notes generated digitally
- [ ] Zero missed compliance documents

### Phase 2: Customer Self-Service (Weeks 9-12)
- [ ] 80% of customers onboarded to portal
- [ ] 50% of schedule changes requested via portal
- [ ] 30% of ad-hoc bookings made online
- [ ] 90% of invoices downloaded by customers
- [ ] Customer satisfaction score 4.5+/5

### Phase 3: Staff Operations (Weeks 13-16)
- [ ] 100% of staff using mobile portal
- [ ] 100% of services have photo documentation
- [ ] 95% of services signed off digitally
- [ ] Issue reporting time reduced by 80%
- [ ] Service completion time reduced by 15%

### Phase 4: Advanced Features (Weeks 17-24)
- [ ] Payment collection time reduced by 50%
- [ ] 40% of payments automated
- [ ] Admin time saved: 20 hours/week
- [ ] Route efficiency improved by 20%
- [ ] Revenue increased by 15% (better tracking + upsells)

### Phase 5: Future Enhancements (Weeks 25+)
- [ ] 60% of customers using WhatsApp
- [ ] Chatbot handles 70% of basic inquiries
- [ ] Mobile app rating 4.5+/5
- [ ] Staff productivity increased by 25%
- [ ] Customer retention improved by 20%

---

## 💡 RECOMMENDATIONS

### Immediate Actions (This Week)
1. **Start with Customer Management UI** - Foundation for everything else
2. **Implement Subscription Management** - Core to business operations
3. **Build Service Request Dashboard** - Critical for daily operations

### Quick Wins (Low Effort, High Value)
1. **Customer Portal Login** - Backend exists, just needs UI
2. **Invoice PDF Downloads** - Data exists, just generate PDFs
3. **Document Download Center** - Simple file serving

### Long-term Strategic Investments
1. **Mobile Apps** - Wait until web features are stable
2. **AI Chatbot** - Start with simple FAQ bot, enhance over time
3. **Route Optimization** - Very high ROI but complex, plan carefully

### Resource Allocation Suggestion
- **Weeks 1-4:** 100% focus on admin tools (customers, subscriptions, services)
- **Weeks 5-8:** 100% focus on customer portal
- **Weeks 9-12:** 70% customer portal, 30% financial management
- **Weeks 13-16:** 100% focus on staff portal
- **Weeks 17+:** Mix of enhancements, optimization, and new features

---

## 📝 NOTES

- This roadmap prioritizes features that reduce manual work and generate revenue
- Database schema is already very comprehensive - focus is on UI development
- Customer portal and staff portal are KEY differentiators in the market
- Compliance features (waste transfer notes) are legally required - HIGH PRIORITY
- Communication features (WhatsApp, chatbot) are nice-to-have but not urgent
- Mobile apps should wait until web platform is stable and proven
- Every feature should include admin settings/configuration
- Security and data privacy are non-negotiable throughout
- Regular customer feedback should inform prioritization adjustments

---

## 🔄 CHANGE LOG

**January 30, 2026**
- Complete roadmap revision based on actual database schema
- Identified gap between backend capability and frontend UI
- Prioritized based on business value and operational needs
- Added detailed feature breakdowns for each priority level
- Added success metrics and recommendations
- Restructured priorities into time-based phases

**January 29, 2026**
- Initial roadmap created
- Basic phases outlined
- Foundation features completed
