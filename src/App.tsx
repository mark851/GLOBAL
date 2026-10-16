import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Award,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowRight,
  Heart,
  Truck,
  Leaf,
  Activity,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WellnessSearchHub } from './components/WellnessSearchHub';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { WhatsAppButton } from './components/WhatsAppButton';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    currentView,
    setCurrentView,
    notification,
    settings,
    reviews,
  } = useStore();

  const [isWellnessHubOpen, setIsWellnessHubOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I pay with MTN Mobile Money or Airtel Money in Uganda?',
      a: 'During checkout, simply select MTN Mobile Money or Airtel Money and enter your registered Ugandan phone number. You will receive an instant push prompt directly on your handset requesting you to authorize the payment. We never ask for or store your mobile money PIN.',
    },
    {
      q: 'What are the verified directions for using Double Root Coffee and SlimFit?',
      a: 'For Double Root Coffee (100% Arabica): Mix 1 sachet or 2 scoops with 150ml–200ml of hot water, stir well, and enjoy in the morning or early afternoon to awaken your day and support stamina. For SlimFit Gluco-Burn Formula (60 Vegan Capsules): Take 1 vegan capsule twice daily with water, 20–30 minutes before your two main meals.',
    },
    {
      q: 'How fast is delivery across Uganda?',
      a: 'Orders placed in Kampala City before 2:00 PM are dispatched on the same day via dedicated dispatch riders. Wakiso, Entebbe, and Upcountry destinations (Jinja, Mbarara, Gulu) arrive safely within 24 to 48 hours via registered express courier.',
    },
    {
      q: 'Are these products certified dietary supplements?',
      a: 'Yes. Both Double Root Coffee and GoGlobal Edge SlimFit Gluco-Burn are formulated using standardized herbal extracts, vitamins, and minerals produced in GMP-certified facilities. They are dietary supplements designed to support daily vitality, active energy, and metabolic wellness as part of a healthy lifestyle.',
    },
    {
      q: 'Can I order directly through WhatsApp?',
      a: 'Yes! Click the floating WhatsApp button or message our team at +256707658107. Our certified representatives will confirm your delivery address and process your order seamlessly.',
    },
  ];

  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-gray-100">
        {notification && (
          <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
            <div
              className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border ${
                notification.type === 'success'
                  ? 'bg-emerald-900 text-white border-emerald-700'
                  : notification.type === 'error'
                    ? 'bg-red-800 text-white border-red-700'
                    : 'bg-amber-800 text-white border-amber-700'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{notification.message}</span>
            </div>
          </div>
        )}
        <AdminDashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-gray-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 animate-in slide-in-from-top duration-300">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2 border ${
              notification.type === 'success'
                ? 'bg-emerald-900 text-white border-emerald-700'
                : notification.type === 'error'
                  ? 'bg-red-800 text-white border-red-700'
                  : 'bg-amber-800 text-white border-amber-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        onOpenWellnessHub={() => setIsWellnessHubOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      <main className="flex-1">
        {/* Section 1: Hero Banner */}
        <section id="home">
          <Hero />
        </section>

        {/* Section 2: Product Shop / Featured Products */}
        <section id="shop" className="py-16 sm:py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold tracking-wider uppercase border border-emerald-200">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Formulas • Official Uganda Catalog</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-serif text-emerald-950 tracking-tight">
                Our Wellness Product Collection
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Formulated with pure botanical extracts and essential micro-nutrients to support men's active vitality and healthy daily metabolic balance.
              </p>
            </div>

            {/* Product Cards Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 max-w-2xl mx-auto space-y-3">
                <Sparkles className="w-8 h-8 text-emerald-700 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-emerald-950">
                  New Product Batches Arriving Soon
                </h3>
                <p className="text-xs text-gray-600 max-w-md mx-auto">
                  Our catalog is being updated with freshly verified botanical shipments. Check back shortly or contact our team via WhatsApp for direct reservations.
                </p>
              </div>
            )}

            {/* Quality & Safety Assurance Callout */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-950">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
                <div>
                  <strong>Guaranteed Authentic Packaging:</strong> Tamper-evident seals on every bottle.
                  Manufactured in strictly audited facilities with verified batch documentation.
                </div>
              </div>
              <button
                onClick={() => setIsWellnessHubOpen(true)}
                className="px-4 py-2 rounded-xl bg-white border border-emerald-300 hover:border-emerald-500 font-bold text-xs text-emerald-900 shrink-0 shadow-2xs transition-colors"
              >
                Verify Ingredients →
              </button>
            </div>
          </div>
        </section>

        {/* Section 3: Company Mission */}
        <section id="about" className="py-16 sm:py-20 bg-emerald-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
                  Who We Are
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
                  Our Mission: Transparent Wellness for Uganda
                </h2>
                <p className="text-sm text-emerald-100/90 leading-relaxed">
                  Restore Boby Cells was established to deliver genuine, ethical, and responsibly formulated wellness supplements to our communities across Uganda and East Africa.
                </p>
                <p className="text-xs text-emerald-200/80 leading-relaxed">
                  We believe that long-term vitality begins with honesty. We reject exaggerated stem-cell claims and deceptive cure-all promises. Instead, we provide verified botanical preparations, transparent label disclosures, and exceptional customer care right here in Kampala.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-800">
                    <FileCheck2 className="w-5 h-5 text-amber-400 mb-1.5" />
                    <h4 className="font-bold text-xs text-white">Truthful Labeling</h4>
                    <p className="text-[11px] text-emerald-300">Exact dosages and verified botanical extracts.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-900/60 border border-emerald-800">
                    <Truck className="w-5 h-5 text-amber-400 mb-1.5" />
                    <h4 className="font-bold text-xs text-white">Reliable Courier</h4>
                    <p className="text-[11px] text-emerald-300">Secure door-to-door delivery across all districts.</p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 bg-emerald-900/40 p-6 sm:p-8 rounded-3xl border border-emerald-800/80 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-white">
                      The Restore Boby Cells Commitment
                    </h3>
                    <p className="text-xs text-emerald-300">Setting the standard in dietary wellness</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-emerald-100/90 divide-y divide-emerald-800/60">
                  <div className="pt-2">
                    <strong className="text-amber-300 block mb-0.5">1. No Unsupported Medical Claims</strong>
                    <span>Our dietary formulas support everyday health and vitality; they do not replace standard medical care.</span>
                  </div>
                  <div className="pt-3">
                    <strong className="text-amber-300 block mb-0.5">2. 100% Plant-Based Capsules (SlimFit)</strong>
                    <span>Formulated without gelatin, artificial colors, or harsh synthetic fillers.</span>
                  </div>
                  <div className="pt-3">
                    <strong className="text-amber-300 block mb-0.5">3. Local Uganda Payment Security</strong>
                    <span>Seamless integration with MTN Mobile Money, Airtel Money, and card verification.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Verified Product Benefits */}
        <section id="benefits" className="py-16 sm:py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Science-Backed Nutrition
              </span>
              <h2 className="text-3xl font-black font-serif text-emerald-950">
                Verified Nutritional Benefits
              </h2>
              <p className="text-xs text-gray-600 leading-relaxed">
                Objective nutritional science demonstrates the benefits of our primary botanical compounds when paired with balanced nutrition and an active routine.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Activity className="w-5 h-5 text-emerald-700" />
                </div>
                <h3 className="font-serif font-black text-base text-gray-900">
                  Vitality & Stamina Support
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Double Root Coffee combines 100% premium Arabica coffee with Panax Ginseng root and Maca root, well-documented botanicals that assist in sustaining physical endurance, mental focus, and daily stamina.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5 text-amber-700" />
                </div>
                <h3 className="font-serif font-black text-base text-gray-900">
                  Metabolic Energy Modulation
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  SlimFit utilizes standardized Green Tea EGCG and Berberine extract to help complement active metabolic energy expenditure and maintain regular nutrient breakdown in active adults.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-all space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="font-serif font-black text-base text-gray-900">
                  Essential Micro-Nutrients
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Fortified with bioavailable Zinc Citrate, Chromium Picolinate, and B-complex vitamins that contribute to normal immune function and energy-yielding metabolism.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: Gemini Grounding Research Feature Callout */}
        <section className="py-12 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-3xl bg-emerald-900/60 border border-emerald-700/60 shadow-xl">
              <div className="space-y-1.5 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Powered by Google Search Grounding & Gemini</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-white">
                  Explore Objective Botanical Science
                </h3>
                <p className="text-xs text-emerald-200 max-w-xl">
                  Curious about the exact scientific studies behind Ginseng, Berberine, or Chromium? Use our live research tool to review citations from reputable medical publications.
                </p>
              </div>
              <button
                onClick={() => setIsWellnessHubOpen(true)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold text-xs flex items-center gap-2 shadow-lg transition-all shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>Open Research Hub</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section 6: Customer Testimonials */}
        <section className="py-16 sm:py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Real Customer Experiences
              </span>
              <h2 className="text-3xl font-black font-serif text-emerald-950">
                Verified Customer Feedback
              </h2>
              <p className="text-xs text-gray-500">
                Authentic testimonials shared with consent by customers throughout Uganda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-gray-50 border border-gray-200/80 shadow-2xs flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-gray-900 leading-snug">
                      "{rev.title}"
                    </h4>
                    <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-800">{rev.customerName}</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 7: Frequently Asked Questions */}
        <section id="faq" className="py-16 sm:py-20 bg-gray-50 border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Got Questions?
              </span>
              <h2 className="text-3xl font-black font-serif text-emerald-950">
                Frequently Asked Questions
              </h2>
              <p className="text-xs text-gray-600">
                Common questions about ordering, delivery, dosage, and payments in Uganda.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm text-gray-900 hover:text-emerald-900 transition-colors"
                    >
                      <span>{faq.q}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-emerald-700 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                      )}
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 8: Direct Contact & WhatsApp Help Banner */}
        <section id="contact" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 text-center md:text-left">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  We're Here For You
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-white">
                  Speak Directly With Our Kampala Wellness Team
                </h3>
                <p className="text-xs text-emerald-200 max-w-lg leading-relaxed">
                  Have inquiries about directions for use, corporate orders, or same-day delivery status? Reach out on WhatsApp or give us a direct call.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp: {settings.whatsapp}</span>
                </a>

                <a
                  href={`tel:${settings.phone.replace(/[^0-9+]/g, '')}`}
                  className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center gap-2 border border-white/20 transition-colors"
                >
                  <span>Call {settings.phone}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp Quick Action Button */}
      <WhatsAppButton />

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <CartDrawer />
      <CheckoutModal />
      <WellnessSearchHub
        isOpen={isWellnessHubOpen}
        onClose={() => setIsWellnessHubOpen(false)}
      />
      <CustomerAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
