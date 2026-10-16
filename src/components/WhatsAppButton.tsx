import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useStore();
  const phoneDigits = settings.whatsapp.replace(/[^0-9]/g, '');

  return (
    <aside aria-label="Customer Support">
      <a
        href={`https://wa.me/${phoneDigits}?text=Hello%20Restore%20Boby%20Cells,%20I%20would%20like%20to%20inquire%20about%20your%20wellness%20products.`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-300 group border-2 border-white/40"
        aria-label="Chat with Restore Boby Cells on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <span className="text-xs font-bold tracking-wide hidden sm:inline">
          Order on WhatsApp
        </span>
      </a>
    </aside>
  );
};
