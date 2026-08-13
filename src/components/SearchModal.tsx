import React, { useState, useEffect } from 'react';
import { MarketSymbol, MarketCategory } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  symbols,
  onSelectSymbol,
}) => {
  if (!isOpen) return null;

  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState<string>('All');

  const categories = [
    'All',
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'ETFs',
    'Economy',
  ];

  // Filter symbols based on query and category chip
  const filtered = symbols.filter((s) => {
    const matchesCat = filterCat === 'All' || s.category === filterCat;
    const q = query.toLowerCase().trim();
    const matchesQuery =
      !q ||
      s.symbol.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.badgeText.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] relative">
        {/* Search Header Input */}
        <div className="p-4 border-b border-[#1a1a1a] flex items-center gap-3 bg-[#0b0b0b]">
          <span className="material-symbols-outlined text-indigo-400 text-2xl">
            search
          </span>
          <input
            type="text"
            autoFocus
            placeholder="Search symbol, index, crypto, forex, commodity..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-base text-white placeholder-gray-500 focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-md bg-[#161616] border border-[#222222]"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-mono font-semibold text-gray-500 hover:text-white px-2 py-1 rounded-md bg-[#161616] border border-[#222222]"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Chips */}
        <div className="px-4 py-2 bg-[#0e0e0e] border-b border-[#1a1a1a] flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                filterCat === cat
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'bg-[#161616] text-gray-400 hover:bg-[#222222] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-2 overflow-y-auto flex-1 divide-y divide-[#1a1a1a]">
          {filtered.length > 0 ? (
            filtered.map((item) => {
              const isPositive = item.changePercent >= 0;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectSymbol(item);
                    onClose();
                  }}
                  className="px-4 py-3 hover:bg-[#161616] rounded-lg cursor-pointer flex items-center justify-between transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs font-mono shrink-0"
                      style={{
                        backgroundColor: item.badgeBg || '#3b82f6',
                        color: item.badgeTextColor || '#FFFFFF',
                      }}
                    >
                      {item.badgeText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white group-hover:text-indigo-400">
                          {item.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0b0b0b] text-gray-400 border border-[#222222] uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">{item.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold text-white">
                      {item.price.toLocaleString(undefined, {
                        minimumFractionDigits: item.price < 10 ? 4 : 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-semibold ${
                        isPositive ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {isPositive ? '+' : ''}
                      {item.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-sm text-gray-500">
              No market symbols found matching "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
