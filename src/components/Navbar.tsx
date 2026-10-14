import React, { useState } from 'react';
import {
  ShoppingBag,
  User as UserIcon,
  ShieldCheck,
  Search,
  Menu,
  X,
  Phone,
  Sparkles,
  LogIn,
  LogOut,
  Key,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { signInWithGoogle, logOut } from '../firebase';

interface NavbarProps {
  onOpenWellnessHub: () => void;
  onOpenAccount: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenWellnessHub, onOpenAccount }) => {
  const {
    cart,
    cartSubtotal,
    setIsCartOpen,
    currentView,
    setCurrentView,
    activeUser,
    isAdmin,
    settings,
    showNotification,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleGoogleLogin = async () => {
    try {
      const res = await signInWithGoogle();
      showNotification('success', `Welcome back, ${res.user.displayName || 'Customer'}!`);
    } catch (err: any) {
      showNotification('error', err.message || 'Login failed.');
    }
  };

  const handleSignOut = async () => {
    await logOut();
    showNotification('info', 'You have been signed out.');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop Products' },
    { id: 'about', label: 'About Us' },
    { id: 'benefits', label: 'Verified Benefits' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-emerald-950 text-emerald-100 px-4 py-2 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1.5">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>{settings.announcement}</span>
          </div>
          <div className="flex items-center gap-3 text-xs flex-wrap justify-center sm:justify-end">
            <a
              href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>WhatsApp: {settings.whatsapp}</span>
            </a>
            <span className="hidden md:inline text-emerald-700">|</span>
            <a
              href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
              className="hidden sm:flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <span>Call: {settings.phone}</span>
            </a>
            <span className="hidden lg:inline text-emerald-700">|</span>
            <a
              href={`mailto:${settings.contactEmail}`}
              className="hidden lg:flex items-center gap-1 hover:text-amber-300 transition-colors text-amber-300 font-medium"
            >
              <span>{settings.contactEmail}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <button
            onClick={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-3 text-left group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center shadow-md shadow-emerald-950/20 text-amber-400 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 font-serif leading-none flex items-center gap-1">
                GO GLOBAL <span className="text-amber-600">EDGE</span>
              </div>
              <p className="text-[10px] tracking-widest uppercase font-semibold text-emerald-700 mt-1">
                Authentic Wellness • Uganda
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setCurrentView(link.id);
                  if (link.id !== 'admin') {
                    const el = document.getElementById(link.id);
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  currentView === link.id
                    ? 'text-emerald-900 bg-emerald-50'
                    : 'text-gray-600 hover:text-emerald-800 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Grounding / Wellness Research Button */}
            <button
              onClick={onOpenWellnessHub}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 border border-emerald-200 transition-all shadow-2xs"
              title="Search grounded nutritional research"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Research Hub</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-emerald-900 text-white hover:bg-emerald-800 transition-all shadow-xs"
                title="Go to Admin Management Console"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Console</span>
              </button>
            )}

            {/* User Account / Google Sign-in */}
            {activeUser ? (
              <div className="relative group">
                <button
                  onClick={onOpenAccount}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-emerald-300 text-gray-700 text-xs font-semibold hover:bg-emerald-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs uppercase">
                    {activeUser.displayName ? activeUser.displayName[0] : 'U'}
                  </div>
                  <span className="hidden md:inline max-w-[100px] truncate">
                    {activeUser.displayName?.split(' ')[0] || 'Account'}
                  </span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border border-gray-200 hover:border-emerald-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs"
                title="Sign in with Google"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-700" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-md shadow-emerald-700/20 active:scale-95"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span className="font-bold text-xs hidden sm:inline">
                {cartSubtotal > 0
                  ? `UGX ${(cartSubtotal / 1000).toFixed(0)}k`
                  : 'Cart'}
              </span>
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[11px] font-black flex items-center justify-center border-2 border-white shadow-xs animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentView(link.id);
                setMobileMenuOpen(false);
                const el = document.getElementById(link.id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-900"
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-gray-100 flex flex-col gap-2">
            {isAdmin && (
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-emerald-900 text-white flex items-center justify-between shadow-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-300" />
                  <span>Admin Console</span>
                </div>
                <span className="text-[11px] text-emerald-300 font-semibold">
                  Manage Store →
                </span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenWellnessHub();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-900 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Scientific Ingredient Search Hub</span>
            </button>
            {activeUser ? (
              <div className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-semibold text-gray-700 truncate">
                  {activeUser.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="text-xs text-red-600 font-bold hover:underline"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  handleGoogleLogin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800 flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-emerald-700" />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
