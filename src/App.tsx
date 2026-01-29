import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import QuoteRequest from './pages/QuoteRequest';
import AdminDashboard from './pages/AdminDashboard';
import AdminSettings from './pages/AdminSettings';
import Contact from './pages/Contact';
import About from './pages/About';
import FAQ from './pages/FAQ';
import PeriodDignity from './pages/PeriodDignity';
import WasteServices from './pages/WasteServices';
import ServiceCoverage from './pages/ServiceCoverage';
import ServiceAreaKent from './pages/ServiceAreaKent';
import ServiceAreaLondon from './pages/ServiceAreaLondon';
import ServiceAreaEssex from './pages/ServiceAreaEssex';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import CookiePolicy from './pages/CookiePolicy';
import News from './pages/News';
import NewsArticle from './pages/NewsArticle';
import AdminNews from './pages/AdminNews';
import AdminNewsEdit from './pages/AdminNewsEdit';

function App() {
  return (
    <HelmetProvider>
      <Router>
        <AuthProvider>
          <Layout>
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
        </Layout>
      </AuthProvider>
    </Router>
    </HelmetProvider>
  );
}

export default App;
