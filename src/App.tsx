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
const QuoteRequest = lazy(() => import('./pages/QuoteRequest'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminTestimonials = lazy(() => import('./pages/AdminTestimonials'));
const AdminNews = lazy(() => import('./pages/AdminNews'));
const AdminNewsEdit = lazy(() => import('./pages/AdminNewsEdit'));
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
