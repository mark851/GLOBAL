import React, { useState } from 'react';
import { X, Search, Sparkles, ExternalLink, ShieldAlert, BookOpen } from 'lucide-react';
import { searchWellnessTopic, GroundingResult } from '../services/geminiService';

interface WellnessSearchHubProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WellnessSearchHub: React.FC<WellnessSearchHubProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GroundingResult | null>(null);

  if (!isOpen) return null;

  const sampleTopics = [
    'Panax Ginseng stamina and vitality',
    'Berberine nutritional metabolic research',
    'Maca Root essential minerals & adaptogen profile',
    'Green Tea EGCG antioxidant cellular research',
    'Tribulus Terrestris men active wellness',
  ];

  const handleSearch = async (topicToSearch: string) => {
    if (!topicToSearch.trim()) return;
    setIsLoading(true);
    setResult(null);
    try {
      const data = await searchWellnessTopic(topicToSearch);
      setResult(data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-emerald-100 overflow-hidden my-6 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-black text-base text-white">
                Grounded Wellness Research Hub
              </h3>
              <p className="text-[11px] text-emerald-300">
                Evidence-Based Botanical Insights Powered by Google Search Data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-gray-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Compliance Disclaimer */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong>Scientific Dietary Education:</strong> Information retrieved via Google Search Grounding is for dietary educational purposes only. Dietary supplements do NOT cure, treat, or prevent chronic illnesses. Always verify with certified medical personnel.
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search an ingredient (e.g. Berberine, Maca Root, Zinc)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-900/20 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 text-amber-300" />
              )}
              <span>Research</span>
            </button>
          </form>

          {/* Preset Buttons */}
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Suggested Topics:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {sampleTopics.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setQuery(topic);
                    handleSearch(topic);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-emerald-50 hover:text-emerald-900 text-gray-700 text-xs transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Results Area */}
          {isLoading && (
            <div className="p-8 text-center space-y-2 bg-emerald-50/50 rounded-2xl border border-emerald-100">
              <div className="inline-block w-7 h-7 border-3 border-emerald-700 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-bold text-emerald-900">
                Retrieving grounded scientific data via Google Search...
              </p>
              <p className="text-[11px] text-emerald-700">Analyzing peer-reviewed botanical facts...</p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs text-gray-800 space-y-3">
                <div className="flex items-center gap-1.5 text-emerald-900 font-bold">
                  <BookOpen className="w-4 h-4 text-emerald-700" />
                  <span>Synthesized Scientific Findings:</span>
                </div>
                <div className="whitespace-pre-line leading-relaxed font-sans">
                  {result.text}
                </div>
              </div>

              {/* Citations & Sources */}
              {result.sources.length > 0 && (
                <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 space-y-2">
                  <span className="text-xs font-bold text-emerald-950 block">
                    Grounded Web References ({result.sources.length}):
                  </span>
                  <div className="space-y-1.5">
                    {result.sources.map((src, i) => (
                      <a
                        key={i}
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-emerald-100 text-xs text-emerald-900 hover:border-emerald-300 transition-colors group"
                      >
                        <span className="truncate pr-2 font-medium">{src.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
