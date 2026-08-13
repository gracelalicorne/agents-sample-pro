import React, { useState } from 'react';
import { MarketSymbol, MarketCategory } from '../types';

interface HeroProps {
  onSelectCategory: (cat: MarketCategory) => void;
  symbols: MarketSymbol[];
  onSelectSymbol: (symbol: MarketSymbol) => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSelectCategory,
  symbols,
  onSelectSymbol,
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const categories: MarketCategory[] = [
    'US stocks',
    'World stocks',
    'Crypto',
    'Futures',
    'Forex',
    'Government bonds',
    'Corporate bonds',
    'ETFs',
    'Economy',
  ];

  // Pick top 6 major ticker symbols for live ticker tape
  const tickerItems = symbols.slice(0, 8);

  return (
    <section className="flex flex-col items-center justify-center pt-8 pb-4 relative">
      {/* Top Ticker Tape Banner */}
      <div className="w-full overflow-hidden bg-[#0b0b0b]/90 border-y border-[#1a1a1a] py-2 mb-8 rounded-xl">
        <div className="flex items-center gap-6 animate-none overflow-x-auto scrollbar-hide px-4">
          <div className="flex items-center gap-2 text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-widest shrink-0 mr-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
            LIVE MARKETS:
          </div>

          {tickerItems.map((item) => {
            const isPositive = item.changePercent >= 0;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSymbol(item)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#161616] hover:bg-[#222222] border border-[#222222] transition-all shrink-0 text-xs cursor-pointer group"
              >
                <span className="font-semibold text-white group-hover:text-indigo-400">
                  {item.symbol}
                </span>
                <span className="font-mono text-gray-400">
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: item.price < 10 ? 2 : 2,
                  })}
                </span>
                <span
                  className={`font-semibold ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {isPositive ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Headline exact match */}
      <div className="relative">
        <h1
          onClick={() => setShowCategoryMenu(!showCategoryMenu)}
          className="font-headline text-4xl sm:text-6xl md:text-7xl font-bold text-white flex items-center gap-2 sm:gap-4 cursor-pointer group hover:opacity-90 transition-opacity select-none tracking-tight"
        >
          <span>Markets, everywhere</span>
          <span
            className="material-symbols-outlined text-4xl sm:text-6xl md:text-7xl group-hover:text-indigo-400 transition-colors text-gray-400"
            data-icon="expand_more"
          >
            expand_more
          </span>
        </h1>

        {/* Category Dropdown Menu */}
        {showCategoryMenu && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72 bg-[#111111] border border-[#1e1e1e] rounded-xl shadow-2xl p-2 z-50 backdrop-blur-md">
            <div className="px-3 py-2 text-[10px] font-mono font-semibold text-gray-500 uppercase tracking-wider">
              Explore Market Sectors
            </div>
            <div className="grid grid-cols-1 gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    setShowCategoryMenu(false);
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-gray-300 hover:bg-[#161616] hover:text-indigo-400 flex items-center justify-between transition-colors"
                >
                  <span>{cat}</span>
                  <span className="material-symbols-outlined text-base text-gray-500">
                    chevron_right
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
