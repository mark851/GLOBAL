import React, { useState } from 'react';
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Send,
  Lock,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings, showNotification, setCurrentView } = useStore();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [activePolicyModal, setActivePolicyModal] = useState<string | null>(null);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showNotification('success', 'Thank you! You have subscribed to Restore Boby Cells wellness updates.');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-emerald-950 text-emerald-100 border-t border-emerald-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-900 flex items-center justify-center border border-amber-400/40 text-amber-400 shadow-md">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <div className="text-xl font-black tracking-tight text-white font-serif leading-none">
                  RESTORE <span className="text-amber-500">BOBY CELLS</span>
                </div>
                <p className="text-[10px] tracking-widest uppercase font-semibold text-emerald-400 mt-1">
                  Wellness Product Collection
                </p>
              </div>
            </div>

            <p className="text-xs text-emerald-200/80 leading-relaxed max-w-sm">
              {settings.missionStatement}
            </p>

            <div className="space-y-2 text-xs text-emerald-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Kampala, Uganda • East Africa Regional Office</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  WhatsApp:{' '}
                  <a
                    href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-amber-300 font-semibold"
                  >
                    {settings.whatsapp}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Call:{' '}
                  <a
                    href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                    className="hover:underline text-amber-300 font-semibold"
                  >
                    {settings.phone}
                  </a>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Email:{' '}
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="hover:underline text-amber-300 font-semibold"
                  >
                    {settings.contactEmail}
                  </a>
                </span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/90 font-medium">
              <li>
                <button
                  onClick={() => {
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    const el = document.getElementById('shop');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Shop Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('about');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('benefits');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Verified Benefits
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('faq');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    const el = document.getElementById('contact');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors"
                >
                  Contact Support
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
              Customer Policies
            </h4>
            <ul className="space-y-2 text-xs text-emerald-200/90 font-medium">
              <li>
                <button
                  onClick={() => setActivePolicyModal('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms and Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('refund')}
                  className="hover:text-white transition-colors"
                >
                  Refund & Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePolicyModal('delivery')}
                  className="hover:text-white transition-colors"
                >
                  Uganda Delivery Info
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-sans">
              Wellness Newsletter
            </h4>
            <p className="text-xs text-emerald-200/80 leading-relaxed">
              Subscribe for evidence-based nutritional tips and exclusive Ugandan discount vouchers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-900/80 border border-emerald-700 rounded-xl text-xs text-white placeholder-emerald-400 focus:outline-hidden focus:ring-1 focus:ring-amber-400"
              />
              <button
                type="submit"
                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Regulatory & Medical Disclaimer */}
        <div className="p-4 rounded-2xl bg-emerald-900/60 border border-emerald-800 text-[11px] text-emerald-300 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Important Medical & Compliance Notice:</span>
          </div>
          <p>
            The products offered on this website (Revicell Men's Wellness and SlimFit Gluco-Burn Formula) are dietary wellness supplements. They are NOT intended to diagnose, treat, cure, or prevent cancer, infertility, erectile dysfunction, diabetes, kidney stones, or any other disease. We do not advertise Revicell as a proven stem-cell treatment nor claim guaranteed weight loss. Always consult your qualified healthcare practitioner before starting any supplement regimen.
          </p>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-emerald-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-400">
          <div>
            © {new Date().getFullYear()} Restore Boby Cells. All rights reserved. Registered in Uganda.
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Secure 256-bit SSL Checkout</span>
            </div>
            <span className="text-emerald-800">|</span>
            <button
              onClick={() => {
                setCurrentView('admin');
                if (typeof window !== 'undefined') {
                  window.location.hash = '#admin';
                }
              }}
              className="text-emerald-400/70 hover:text-amber-300 transition-colors cursor-pointer"
              title="Authorized Personnel Access"
            >
              Staff Portal
            </button>
          </div>
        </div>
      </div>

      {/* Policy Modal */}
      {activePolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white text-gray-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="font-serif font-black text-base text-emerald-950 capitalize">
                {activePolicyModal === 'privacy' && 'Privacy Policy'}
                {activePolicyModal === 'terms' && 'Terms and Conditions'}
                {activePolicyModal === 'refund' && 'Refund & Returns Policy'}
                {activePolicyModal === 'delivery' && 'Uganda Delivery Information'}
              </h3>
              <button
                onClick={() => setActivePolicyModal(null)}
                className="text-gray-400 hover:text-gray-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-gray-600 leading-relaxed max-h-72 overflow-y-auto pr-1 space-y-2">
              {activePolicyModal === 'privacy' && (
                <>
                  <p>
                    Restore Boby Cells is committed to protecting your personal information. We collect customer names, telephone numbers, and delivery addresses strictly for order fulfillment.
                  </p>
                  <p>
                    We NEVER collect, transmit, or store your Mobile Money PINs or banking credentials. Data is securely held in compliance with privacy guidelines.
                  </p>
                </>
              )}
              {activePolicyModal === 'terms' && (
                <>
                  <p>
                    By purchasing through Restore Boby Cells, you agree that dietary supplements must be used according to package directions.
                  </p>
                  <p>
                    All prices are quoted in Ugandan Shillings (UGX). Orders are fulfilled upon payment verification through authenticated provider callbacks.
                  </p>
                </>
              )}
              {activePolicyModal === 'refund' && (
                <>
                  <p>
                    We offer a 7-day return policy for unopened products with intact tamper-evident seals. If an item arrives damaged, notify our support within 24 hours.
                  </p>
                  <p>
                    Refunds are processed after verification via the original payment method (MTN MoMo, Airtel, or Card).
                  </p>
                </>
              )}
              {activePolicyModal === 'delivery' && (
                <>
                  <p>
                    <strong>Kampala City:</strong> Same-day delivery for orders placed before 2:00 PM (UGX 10,000).
                  </p>
                  <p>
                    <strong>Wakiso & Entebbe:</strong> 24-hour dispatch via courier (UGX 15,000).
                  </p>
                  <p>
                    <strong>Upcountry:</strong> 24–48 hours to major hubs including Jinja, Mbarara, and Gulu (UGX 25,000). Free delivery applies for orders over UGX 300,000!
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setActivePolicyModal(null)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </footer>
  );
};
