import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Hero: React.FC = () => {
  const { setCurrentView, settings, setSelectedProduct, products } = useStore();

  const handleShopNow = () => {
    setCurrentView('shop');
    const el = document.getElementById('shop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const displayedProducts = products.slice(0, 2);

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white py-16 sm:py-24">
      {/* Background visual overlay with official GoGlobal Edge brand banner */}
      <div className="absolute inset-0 opacity-25 pointer-events-none mix-blend-overlay">
        <img
          src="/src/assets/images/homepage_hero_wellness_1791963391207.jpg"
          alt="Go Global Edge Brand Atmosphere"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Radiant ambient glow */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & Call to Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/60 text-amber-300 text-xs font-bold tracking-wide uppercase shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Official Premium Wellness Store • Uganda</span>
            </div>

            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black font-serif tracking-tight text-white leading-tight">
              {settings.heroTitle}
            </h1>

            <p className="text-base sm:text-lg text-emerald-100/90 font-normal max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {settings.heroSubtitle}
            </p>

            {/* Compliance Badge */}
            <div className="bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-3 text-xs text-emerald-200/90 flex items-start gap-2 max-w-xl mx-auto lg:mx-0 text-left">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Verified Quality Assurance:</strong> Pure botanical formulations with authentic ingredients and zero unverified medical claims. Packaged for optimal potency.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={handleShopNow}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl shadow-emerald-950/40 hover:shadow-emerald-600/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0 border border-emerald-400/40"
              >
                <span>SHOP NOW</span>
                <ArrowRight className="w-5 h-5 text-amber-300" />
              </button>

              <button
                onClick={() => {
                  const el = document.getElementById('shop');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-base flex items-center justify-center gap-2 backdrop-blur-xs border border-white/20 transition-all"
              >
                <span>VIEW OUR PRODUCTS</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-emerald-800/60 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-serif">100%</div>
                <div className="text-[11px] text-emerald-200 uppercase font-semibold">Verified Pure</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-serif">UGX</div>
                <div className="text-[11px] text-emerald-200 uppercase font-semibold">Local Currency</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-serif">24h</div>
                <div className="text-[11px] text-emerald-200 uppercase font-semibold">Fast Dispatch</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Product Showcase */}
          <div className="lg:col-span-5 relative">
            {displayedProducts.length > 0 ? (
              <div
                className={`grid ${
                  displayedProducts.length === 1 ? 'grid-cols-1 max-w-xs' : 'grid-cols-2 max-w-md'
                } gap-4 mx-auto`}
              >
                {displayedProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className="group cursor-pointer bg-emerald-900/80 rounded-2xl p-3 border border-emerald-700/60 hover:border-amber-400/70 transition-all hover:scale-[1.02] shadow-2xl relative overflow-hidden"
                  >
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-black/40 mb-2.5">
                      <img
                        src={p.images?.[0] || '/src/assets/images/double_root_coffee_1791963357040.jpg'}
                        alt={p.name}
                        className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2 left-2 bg-black/85 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-400/40 truncate max-w-[85%]">
                        {p.packageInfo || p.category}
                      </span>
                    </div>
                    <h3 className="font-serif font-bold text-sm text-white group-hover:text-amber-300 transition-colors truncate">
                      {p.name}
                    </h3>
                    <p className="text-[11px] text-emerald-200/90 mb-1.5 line-clamp-1">
                      {p.subtitle || p.category}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-amber-400">
                        UGX {(p.salePrice || p.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-300 group-hover:underline">View →</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-emerald-900/60 border border-emerald-700/50 text-center space-y-3 max-w-md mx-auto">
                <Sparkles className="w-8 h-8 text-amber-300 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-white">Go Global Edge Wellness</h3>
                <p className="text-xs text-emerald-200 leading-relaxed">
                  Natural formulations, transparent labeling, and door-to-door Uganda courier service.
                </p>
                <button
                  onClick={handleShopNow}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-xl text-xs font-bold text-white shadow-sm inline-flex items-center gap-1.5"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
                </button>
              </div>
            )}

            {/* Floating Trust Pill */}
            <div className="mt-4 p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 flex items-center justify-between text-xs text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>MTN & Airtel MoMo Supported</span>
              </div>
              <span className="text-amber-300 font-bold">Fast Courier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
