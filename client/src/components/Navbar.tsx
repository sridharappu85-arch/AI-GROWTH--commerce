import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bot, 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  BarChart3, 
  ShieldCheck, 
  ChevronDown, 
  Layers, 
  TrendingUp, 
  Megaphone, 
  Activity, 
  Package, 
  Users,
  Menu,
  X,
  KeyRound
} from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';

interface NavLinkItem {
  name: string;
  path: string;
  highlight?: boolean;
  icon?: React.ReactNode;
}

export const Navbar: React.FC = () => {
  const { currentUser, users, switchUser, switchRole } = useUser();
  const { cart } = useCart();
  const { wishlistIds } = useWishlist();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdmin = currentUser?.role === 'ADMIN';

  const customerNavLinks: NavLinkItem[] = [
    { name: 'Home', path: '/' },
    { 
      name: 'AI Shopping Assistant', 
      path: '/assistant', 
      highlight: true, 
      icon: <Sparkles className="w-4 h-4 text-cyanAccent-400 animate-pulse" /> 
    },
    { name: 'Products', path: '/products' },
    { name: 'My Orders', path: '/orders' },
    { name: 'Preferences', path: '/preferences' },
  ];

  const adminNavLinks: NavLinkItem[] = [
    { name: 'Overview', path: '/admin', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Growth Insights', path: '/admin/insights', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Campaign Studio', path: '/admin/campaigns', icon: <Megaphone className="w-4 h-4" /> },
    { name: 'Customer Segments', path: '/admin/segments', icon: <Layers className="w-4 h-4" /> },
    { name: 'Agent Activity', path: '/admin/agents', icon: <Activity className="w-4 h-4" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="w-4 h-4" /> },
  ];

  const activeLinks: NavLinkItem[] = isAdmin ? adminNavLinks : customerNavLinks;

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-xl border-b border-white/10 transition-all">
      {/* Top Demo Bar */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-950 px-4 py-1.5 border-b border-indigo-500/20 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            AI AGENTIC COMMERCE DEMO
          </span>
          <span className="hidden sm:inline text-slate-400">
            Autonomous multi-agent orchestration with human-in-the-loop safety.
          </span>
        </div>

        {/* Quick Role Toggle */}
        <div className="flex items-center gap-3">
          <span className="text-slate-400 hidden md:inline">Viewing as:</span>
          <button
            onClick={() => switchRole(isAdmin ? 'CUSTOMER' : 'ADMIN')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-400/30 transition text-xs font-medium cursor-pointer"
            title="Toggle between Customer Persona and Admin View"
          >
            {isAdmin ? (
              <>
                <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Switch to Customer Mode</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Switch to Admin BI Mode</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent tracking-tight">
                  NexAgentic
                </span>
                <span className="text-[10px] block text-indigo-400 -mt-1 font-mono tracking-wider uppercase">
                  {isAdmin ? 'Growth Suite' : 'AI Commerce'}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {activeLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-inner'
                      : link.highlight
                      ? 'bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Cart, Wishlist, User Switcher */}
          <div className="flex items-center gap-3">
            {!isAdmin && (
              <>
                {/* Wishlist */}
                <Link
                  to="/wishlist"
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 relative transition"
                  title="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistIds.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {wishlistIds.length}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 relative transition"
                  title="Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {(cart?.itemCount || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {cart?.itemCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* Sign In / Agent Portal Button */}
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition hover:border-cyan-400/50 hover:text-cyan-300"
              title="Open AI Authentication Portal"
            >
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Login</span>
            </Link>

            {/* Persona Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 pr-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 transition cursor-pointer"
              >
                <img
                  src={currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
                  alt={currentUser?.name || 'User'}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200 leading-tight">
                    {currentUser?.name || 'Select User'}
                  </div>
                  <div className="text-[10px] text-indigo-400">
                    {currentUser?.role === 'ADMIN' ? 'Store Administrator' : (currentUser?.profile?.personaTag || 'Customer')}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl bg-[#0f172a] border border-white/10 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-300">Active Persona</p>
                      <p className="text-[11px] text-slate-400">Fast switch or full login portal</p>
                    </div>
                    <Link
                      to="/login"
                      onClick={() => setDropdownOpen(false)}
                      className="text-[10px] px-2 py-1 rounded bg-indigo-600/30 hover:bg-indigo-600/60 text-cyan-300 border border-indigo-500/30 font-semibold"
                    >
                      Login Portal ⚡
                    </Link>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {users.map((u) => {
                      const isSelected = u.id === currentUser?.id;
                      return (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                              : 'text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=128&q=80'}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">
                              {u.role === 'ADMIN' ? '👑 Store Administrator' : (u.profile?.personaTag || 'Customer')}
                            </p>
                          </div>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-white/10 flex flex-col gap-1">
            {activeLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-white/5 flex items-center gap-2"
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
