import React, { useState, useEffect } from 'react';
import { MARKET_SYMBOLS } from './data/marketData';
import { MarketCategory, MarketSymbol, ViewMode, SortOption, PriceAlert } from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategorySwitcher } from './components/CategorySwitcher';
import { MarketCard } from './components/MarketCard';
import { MarketTable } from './components/MarketTable';
import { MarketHeatmap } from './components/MarketHeatmap';
import { PriceAlertModal } from './components/PriceAlertModal';
import { DetailModal } from './components/DetailModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

export default function App() {
  const [symbols, setSymbols] = useState<MarketSymbol[]>(MARKET_SYMBOLS);
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('US stocks');
  const [selectedSymbol, setSelectedSymbol] = useState<MarketSymbol | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLiveTicking, setIsLiveTicking] = useState(true);

  // Pro features state
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortOption, setSortOption] = useState<SortOption>('default');
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Keyboard shortcut Ctrl+K or Cmd+K to open Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle star watchlist bookmark
  const handleToggleStar = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSymbols((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isStarred: !s.isStarred } : s))
    );
  };

  // Add a price alert
  const handleAddAlert = (symbolId: string, targetPrice: number, condition: 'above' | 'below') => {
    const targetSymbol = symbols.find((s) => s.id === symbolId);
    if (!targetSymbol) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbolId,
      symbolName: targetSymbol.symbol,
      targetPrice,
      condition,
      isTriggered: false,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setAlerts((prev) => [newAlert, ...prev]);
  };

  // Remove alert
  const handleRemoveAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  // Simulated real-time price updates every 3 seconds
  useEffect(() => {
    if (!isLiveTicking) return;

    const interval = setInterval(() => {
      setSymbols((prevSymbols) =>
        prevSymbols.map((item) => {
          // 45% chance of price update per tick per item
          if (Math.random() > 0.45) return { ...item, priceDirection: 'none' };

          const pctChange = (Math.random() - 0.48) * 0.0035; // small realistic tick
          const newPrice = Math.max(0.01, item.price * (1 + pctChange));
          const priceDiff = newPrice - item.prevClose;
          const newChangePct = (priceDiff / item.prevClose) * 100;
          const dir = newPrice > item.price ? 'up' : 'down';

          // Check if any alerts triggered
          setAlerts((prevAlerts) =>
            prevAlerts.map((alt) => {
              if (alt.symbolId === item.id && !alt.isTriggered) {
                if (alt.condition === 'above' && newPrice >= alt.targetPrice) {
                  return { ...alt, isTriggered: true };
                }
                if (alt.condition === 'below' && newPrice <= alt.targetPrice) {
                  return { ...alt, isTriggered: true };
                }
              }
              return alt;
            })
          );

          // Append point to 1D chart
          const nowStr = new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
          const updated1D = [
            ...(item.chartData['1D'] || []).slice(1),
            {
              time: nowStr,
              value: parseFloat(newPrice.toFixed(2)),
              volume: Math.floor(Math.random() * 2000) + 500,
            },
          ];

          return {
            ...item,
            price: parseFloat(newPrice.toFixed(2)),
            change: parseFloat(priceDiff.toFixed(2)),
            changePercent: parseFloat(newChangePct.toFixed(2)),
            high: Math.max(item.high, parseFloat(newPrice.toFixed(2))),
            low: Math.min(item.low, parseFloat(newPrice.toFixed(2))),
            priceDirection: dir,
            chartData: {
              ...item.chartData,
              '1D': updated1D,
            },
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveTicking]);

  // Filter symbols for active category or Watchlist
  let categorySymbols =
    activeCategory === 'Watchlist'
      ? symbols.filter((s) => s.isStarred)
      : symbols.filter((s) => s.category === activeCategory);

  // Apply sorting
  categorySymbols = [...categorySymbols].sort((a, b) => {
    if (sortOption === 'gainers') return b.changePercent - a.changePercent;
    if (sortOption === 'losers') return a.changePercent - b.changePercent;
    if (sortOption === 'volume') return b.high - a.high; // volume proxy
    if (sortOption === 'rating') return b.technicalScore - a.technicalScore;
    return 0;
  });

  const watchlistCount = symbols.filter((s) => s.isStarred).length;

  return (
    <div className="bg-[#090909] text-gray-200 font-sans antialiased min-h-screen flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navbar */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat as MarketCategory)}
        isLiveTicking={isLiveTicking}
        onToggleLiveTicking={() => setIsLiveTicking(!isLiveTicking)}
        watchlistCount={watchlistCount}
        alertsCount={alerts.length}
        onOpenAlerts={() => setIsAlertModalOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Hero Section */}
        <Hero
          onSelectCategory={(cat) => setActiveCategory(cat)}
          symbols={symbols}
          onSelectSymbol={(sym) => setSelectedSymbol(sym)}
        />

        {/* Category Switcher Tabs & View Controls */}
        <CategorySwitcher
          activeCategory={activeCategory}
          onSelectCategory={(cat) => setActiveCategory(cat)}
          viewMode={viewMode}
          onChangeViewMode={(mode) => setViewMode(mode)}
          sortOption={sortOption}
          onChangeSortOption={(opt) => setSortOption(opt)}
          watchlistCount={watchlistCount}
        />

        {/* Empty Watchlist State */}
        {activeCategory === 'Watchlist' && categorySymbols.length === 0 && (
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center flex flex-col items-center justify-center gap-3">
            <span className="material-symbols-outlined text-4xl text-amber-400">star_outline</span>
            <h3 className="font-headline text-lg font-bold text-white">Your Watchlist is Empty</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Click the star icon on any market card or table row to bookmark key assets for real-time tracking here.
            </p>
            <button
              onClick={() => setActiveCategory('US stocks')}
              className="mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors"
            >
              Browse US Markets
            </button>
          </div>
        )}

        {/* Market Content: Grid View | Table View | Heatmap View */}
        {categorySymbols.length > 0 && (
          <>
            {viewMode === 'grid' && (
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorySymbols.map((item) => (
                  <MarketCard
                    key={item.id}
                    item={item}
                    onSelect={(sym) => setSelectedSymbol(sym)}
                    onToggleStar={handleToggleStar}
                  />
                ))}
              </section>
            )}

            {viewMode === 'table' && (
              <section className="w-full">
                <MarketTable
                  symbols={categorySymbols}
                  onSelectSymbol={(sym) => setSelectedSymbol(sym)}
                  onToggleStar={handleToggleStar}
                />
              </section>
            )}

            {viewMode === 'heatmap' && (
              <section className="w-full">
                <MarketHeatmap
                  symbols={categorySymbols}
                  onSelectSymbol={(sym) => setSelectedSymbol(sym)}
                />
              </section>
            )}
          </>
        )}

        {/* Market Insights Banner */}
        <section className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <span className="material-symbols-outlined text-2xl">insights</span>
            </div>
            <div>
              <h3 className="font-headline text-lg font-bold text-white">
                Pro Real-Time Market Intelligence
              </h3>
              <p className="text-sm text-gray-400 mt-0.5 max-w-2xl">
                Track global indices, currency pairs, commodities, and treasury yields with live streaming chart ticks, technical indicators (SMA 20/50), custom price alerts, and Gemini AI quantitative analysis.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAlertModalOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 text-xs font-semibold flex items-center gap-2 shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-base">notifications_active</span>
              Set Price Alert
            </button>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-4 py-2.5 rounded-lg bg-[#161616] hover:bg-[#222222] border border-[#222222] text-xs font-semibold text-gray-200 flex items-center gap-2 shrink-0 transition-colors"
            >
              <span className="material-symbols-outlined text-base text-indigo-400">
                search
              </span>
              Explore All Symbols
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Detailed Interactive Modal */}
      <DetailModal
        symbol={selectedSymbol}
        onClose={() => setSelectedSymbol(null)}
      />

      {/* Price Alerts Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        symbols={symbols}
        alerts={alerts}
        onAddAlert={handleAddAlert}
        onRemoveAlert={handleRemoveAlert}
      />

      {/* Search Palette (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        symbols={symbols}
        onSelectSymbol={(sym) => setSelectedSymbol(sym)}
      />
    </div>
  );
}
