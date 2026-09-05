import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { AssistantPage } from './pages/AssistantPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { OrdersPage } from './pages/OrdersPage';
import { WishlistPage } from './pages/WishlistPage';
import { PreferencesPage } from './pages/PreferencesPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminInsightsPage } from './pages/admin/AdminInsightsPage';
import { AdminCampaignsPage } from './pages/admin/AdminCampaignsPage';
import { AdminSegmentsPage } from './pages/admin/AdminSegmentsPage';
import { AdminAgentsPage } from './pages/admin/AdminAgentsPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';

export const App: React.FC = () => {
  return (
    <UserProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen flex flex-col bg-[#080b11] text-slate-100 font-sans">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public & Customer Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/assistant" element={<AssistantPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/wishlist" element={<WishlistPage />} />
                  <Route path="/preferences" element={<PreferencesPage />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/how-it-works" element={<HowItWorksPage />} />

                  {/* Admin BI Routes */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/insights" element={<AdminInsightsPage />} />
                  <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
                  <Route path="/admin/segments" element={<AdminSegmentsPage />} />
                  <Route path="/admin/agents" element={<AdminAgentsPage />} />
                  <Route path="/admin/products" element={<AdminProductsPage />} />
                  <Route path="/admin/customers" element={<AdminCustomersPage />} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </UserProvider>
  );
};

export default App;
