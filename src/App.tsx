import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile'));
const CustomerSubscriptions = lazy(() => import('./pages/CustomerSubscriptions'));
const CustomerBookService = lazy(() => import('./pages/CustomerBookService'));
const CustomerInvoices = lazy(() => import('./pages/CustomerInvoices'));
const CustomerDocuments = lazy(() => import('./pages/CustomerDocuments'));
const QuoteRequest = lazy(() => import('./pages/QuoteRequest'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminTestimonials = lazy(() => import('./pages/AdminTestimonials'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const AdminNewsEdit = lazy(() => import('./pages/AdminNewsEdit'));
const AdminCustomers = lazy(() => import('./pages/AdminCustomers'));
const AdminCustomerDetail = lazy(() => import('./pages/AdminCustomerDetail'));
const AdminCustomerForm = lazy(() => import('./pages/AdminCustomerForm'));
const AdminSubscriptions = lazy(() => import('./pages/AdminSubscriptions'));
const AdminSubscriptionForm = lazy(() => import('./pages/AdminSubscriptionForm'));
const AdminServiceVisits = lazy(() => import('./pages/AdminServiceVisits'));
const AdminServiceVisitForm = lazy(() => import('./pages/AdminServiceVisitForm'));
const AdminWasteTransferNotes = lazy(() => import('./pages/AdminWasteTransferNotes'));
const AdminWasteTransferNoteForm = lazy(() => import('./pages/AdminWasteTransferNoteForm'));
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const FAQ = lazy(() => import('./pages/FAQ'));
const PeriodDignity = lazy(() => import('./pages/PeriodDignity'));
const WasteServices = lazy(() => import('./pages/WasteServices'));
const ServiceCoverage = lazy(() => import('./pages/ServiceCoverage'));
const ServiceAreaKent = lazy(() => import('./pages/ServiceAreaKent'));
const ServiceAreaLondon = lazy(() => import('./pages/ServiceAreaLondon'));
const ServiceAreaEssex = lazy(() => import('./pages/ServiceAreaEssex'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const News = lazy(() => import('./pages/News'));
const NewsArticle = lazy(() => import('./pages/NewsArticle'));

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <AuthProvider>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <CustomerProfile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/subscriptions"
                  element={
                    <ProtectedRoute>
                      <CustomerSubscriptions />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/book-service"
                  element={
                    <ProtectedRoute>
                      <CustomerBookService />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/invoices"
                  element={
                    <ProtectedRoute>
                      <CustomerInvoices />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/documents"
                  element={
                    <ProtectedRoute>
                      <CustomerDocuments />
                    </ProtectedRoute>
                  }
                />
            <Route
              path="/quote-request"
              element={
                <ProtectedRoute>
                  <QuoteRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news"
              element={
                <ProtectedRoute>
                  <AdminNews />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/news/edit/:id"
              element={
                <ProtectedRoute>
                  <AdminNewsEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/testimonials"
              element={
                <ProtectedRoute>
                  <AdminTestimonials />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <ProtectedRoute>
                  <AdminCustomers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers/:id"
              element={
                <ProtectedRoute>
                  <AdminCustomerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/customers/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminCustomerForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subscriptions"
              element={
                <ProtectedRoute>
                  <AdminSubscriptions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/subscriptions/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminSubscriptionForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/service-visits"
              element={
                <ProtectedRoute>
                  <AdminServiceVisits />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/service-visits/:id"
              element={
                <ProtectedRoute>
                  <AdminServiceVisitForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/service-visits/:id/edit"
              element={
                <ProtectedRoute>
                  <AdminServiceVisitForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/waste-transfer-notes"
              element={
                <ProtectedRoute>
                  <AdminWasteTransferNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/waste-transfer-notes/new"
              element={
                <ProtectedRoute>
                  <AdminWasteTransferNoteForm />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/period-dignity" element={<PeriodDignity />} />
            <Route path="/waste-services" element={<WasteServices />} />
            <Route path="/service-coverage" element={<ServiceCoverage />} />
            <Route path="/service-areas/kent" element={<ServiceAreaKent />} />
            <Route path="/service-areas/london" element={<ServiceAreaLondon />} />
            <Route path="/service-areas/essex" element={<ServiceAreaEssex />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsArticle />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Layout>
        </AuthProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
