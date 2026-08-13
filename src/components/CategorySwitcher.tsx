import React from 'react';
import { MarketCategory, ViewMode, SortOption } from '../types';

interface CategorySwitcherProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  sortOption: SortOption;
  onChangeSortOption: (sort: SortOption) => void;
  watchlistCount: number;
}

export const CATEGORIES: MarketCategory[] = [
  'US stocks',
  'World stocks',
  'Crypto',
  'Futures',
  'Forex',
  'Government bonds',
  'Corporate bonds',
  'ETFs',
  'Economy',
  'Watchlist',
];

export const CategorySwitcher: React.FC<CategorySwitcherProps> = ({
  activeCategory,
  onSelectCategory,
  viewMode,
  onChangeViewMode,
  sortOption,
  onChangeSortOption,
  watchlistCount,
}) => {
  // Title map for the section header
  const titleMap: Record<MarketCategory, string> = {
    'US stocks': 'Indices & US Stocks',
    'World stocks': 'World Stocks',
    Crypto: 'Cryptocurrency',
    Futures: 'Futures & Commodities',
    Forex: 'Forex Currency Pairs',
    'Government bonds': 'Sovereign Treasury Bonds',
    'Corporate bonds': 'Corporate Bond Yields',
    ETFs: 'Exchange Traded Funds',
    Economy: 'Macro Economic Indicators',
    Watchlist: 'My Watchlist',
  };

  return (
    <section className="flex flex-col gap-4">
      {/* Category Section Header & View Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="font-headline text-2xl sm:text-3xl font-bold text-white flex items-center gap-2 tracking-tight">
            <span>{titleMap[activeCategory] || activeCategory}</span>
            {activeCategory === 'Watchlist' && (
              <span className="text-xs font-mono font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {watchlistCount} Saved
              </span>
            )}
          </h2>
        </div>

        {/* View Controls: View Mode & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sort Selector */}
          <div className="flex items-center gap-1.5 bg-[#0b0b0b] border border-[#1e1e1e] p-1 rounded-lg text-xs">
            <span className="text-gray-500 font-mono px-2 text-[10px] uppercase">Sort:</span>
            {(
              [
                { id: 'default', label: 'Default' },
                { id: 'gainers', label: '▲ Gainers' },
                { id: 'losers', label: '▼ Losers' },
                { id: 'volume', label: 'Volume' },
                { id: 'rating', label: 'Rating' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChangeSortOption(opt.id as SortOption)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  sortOption === opt.id
                    ? 'bg-[#1e1e1e] text-white font-semibold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* View Mode Toggle Switcher */}
          <div className="flex items-center bg-[#0b0b0b] border border-[#1e1e1e] p-1 rounded-lg text-xs">
            <button
              onClick={() => onChangeViewMode('grid')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Grid Card View"
            >
              <span className="material-symbols-outlined text-sm">grid_view</span>
              <span>Grid</span>
            </button>
            <button
              onClick={() => onChangeViewMode('table')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Pro Financial Table View"
            >
              <span className="material-symbols-outlined text-sm">table_rows</span>
              <span>Table</span>
            </button>
            <button
              onClick={() => onChangeViewMode('heatmap')}
              className={`flex items-center gap-1 px-3 py-1 rounded-md transition-colors ${
                viewMode === 'heatmap'
                  ? 'bg-indigo-600 text-white font-semibold'
                  : 'text-gray-400 hover:text-white'
              }`}
              title="Sector Heatmap View"
            >
              <span className="material-symbols-outlined text-sm">view_module</span>
              <span>Heatmap</span>
            </button>
          </div>
        </div>
      </div>

      {/* Pill Switcher Bar */}
      <div className="w-full overflow-x-auto pb-1 scrollbar-hide">
        <div className="inline-flex items-center gap-1.5 p-1 rounded-xl border border-[#1e1e1e] bg-[#0b0b0b]">
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            const isWatchlist = cat === 'Watchlist';
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg font-medium text-xs transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#161616] text-white shadow-sm border border-[#2a2a2a] font-semibold'
                    : 'text-gray-400 hover:bg-[#161616] hover:text-white'
                }`}
              >
                {isWatchlist && (
                  <span className="material-symbols-outlined text-sm text-amber-400">star</span>
                )}
                <span>{cat}</span>
                {isWatchlist && (
                  <span className="px-1.5 py-0.2 rounded bg-[#222222] text-[10px] text-amber-300 font-bold font-mono">
                    {watchlistCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
