import React, { useState } from 'react';

interface HeaderProps {
  onOpenSearch: () => void;
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  isLiveTicking: boolean;
  onToggleLiveTicking: () => void;
  watchlistCount: number;
  onOpenAlertsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  activeCategory,
  onSelectCategory,
  isLiveTicking,
  onToggleLiveTicking,
  watchlistCount,
  onOpenAlertsModal,
}) => {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [signedInUser, setSignedInUser] = useState<string | null>(null);

  const [estTime, setEstTime] = useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setEstTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'America/New_York',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' EST'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const navItems = ['Products', 'Community', 'Markets', 'Brokers', 'More'];

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSignedInUser(emailInput.trim());
      setShowGetStartedModal(false);
      setEmailInput('');
    }
  };

  return (
    <header className="bg-[#0b0b0b] border-b border-[#1a1a1a] sticky top-0 z-40 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <a
            href="#"
            className="flex items-center gap-2 text-white hover:opacity-90 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory('US stocks');
            }}
          >
            {/* TradingView SVG Logo matching exact prompt SVG */}
            <svg
              className="text-white"
              fill="none"
              height="24"
              viewBox="0 0 36 26"
              width="33"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                clipRule="evenodd"
                d="M11.6667 0H2.33333C1.04467 0 0 1.04467 0 2.33333V23.6667C0 24.9553 1.04467 26 2.33333 26H11.6667V0ZM11.6667 26H21C22.2887 26 23.3333 24.9553 23.3333 23.6667V11.6667H11.6667V26ZM33.6667 0H24.3333C23.0447 0 22 1.04467 22 2.33333V9.33333H36V2.33333C36 1.04467 34.9553 0 33.6667 0Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </a>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md ml-4 mr-auto hidden sm:block">
          <button
            onClick={onOpenSearch}
            type="button"
            className="w-full h-10 px-3.5 rounded-full bg-[#161616] border border-[#222222] hover:border-[#333333] text-left text-sm text-gray-400 flex items-center gap-2.5 transition-all group focus:outline-none"
          >
            <span className="material-symbols-outlined text-gray-400 text-lg group-hover:text-indigo-400 transition-colors">
              search
            </span>
            <span className="flex-1 text-sm font-normal">Search (Ctrl+K)</span>
            <kbd className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-mono bg-[#090909] border border-[#222222] rounded text-gray-500">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 mx-4 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = item === 'Markets';
            return (
              <a
                key={item}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item === 'Markets') onSelectCategory('US stocks');
                }}
                className={`px-3.5 py-1.5 rounded-md transition-colors ${
                  isActive
                    ? 'text-white font-semibold border-b-2 border-indigo-500 pb-1'
                    : 'text-gray-400 hover:bg-[#161616] hover:text-white'
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Live Market Clock */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#222222] text-[11px] font-mono text-gray-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-white font-semibold">{estTime}</span>
            <span className="text-gray-600">|</span>
            <span className="text-emerald-400 font-bold">NYSE OPEN</span>
          </div>

          {/* Watchlist Quick Access Button */}
          <button
            onClick={() => onSelectCategory('Watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
              activeCategory === 'Watchlist'
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/40 font-bold'
                : 'bg-[#161616] text-gray-300 border-[#222222] hover:bg-[#222222]'
            }`}
            title="View Watchlist"
          >
            <span className="material-symbols-outlined text-sm text-amber-400 font-bold">star</span>
            <span className="hidden sm:inline">Watchlist</span>
            <span className="px-1.5 py-0.2 rounded bg-[#090909] text-[10px] text-amber-300 font-bold">
              {watchlistCount}
            </span>
          </button>

          {/* Price Alerts Manager Button */}
          <button
            onClick={onOpenAlertsModal}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#161616] text-gray-300 border border-[#222222] hover:bg-[#222222] hover:text-white transition-all"
            title="Price Alerts Manager"
          >
            <span className="material-symbols-outlined text-sm text-indigo-400">notifications</span>
            <span className="hidden lg:inline">Alerts</span>
          </button>

          {/* Live Data Toggle Button */}
          <button
            onClick={onToggleLiveTicking}
            title={isLiveTicking ? 'Pause live market feed' : 'Resume live market feed'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider border transition-all ${
              isLiveTicking
                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : 'bg-[#161616] text-gray-500 border-[#222222]'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isLiveTicking ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="hidden sm:inline">
              {isLiveTicking ? 'LIVE' : 'PAUSED'}
            </span>
          </button>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageModal(!showLanguageModal)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#161616] hover:text-white transition-colors"
              title="Select Language"
            >
              <span className="material-symbols-outlined text-xl">language</span>
            </button>
            {showLanguageModal && (
              <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-[#1e1e1e] rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1 text-[10px] font-mono tracking-wider uppercase text-gray-500">
                  Select Language
                </div>
                {['English (US)', 'Español', 'Deutsch', 'Français', '日本語', '简体中文'].map((lang, idx) => (
                  <button
                    key={lang}
                    onClick={() => setShowLanguageModal(false)}
                    className={`w-full text-left px-4 py-2 text-xs flex items-center justify-between hover:bg-[#161616] ${
                      idx === 0 ? 'text-indigo-400 font-semibold' : 'text-gray-300'
                    }`}
                  >
                    <span>{lang}</span>
                    {idx === 0 && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserModal(!showUserModal)}
              className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-[#161616] hover:text-white transition-colors"
              title="User Account"
            >
              <span className="material-symbols-outlined text-xl">person</span>
            </button>
            {showUserModal && (
              <div className="absolute right-0 mt-2 w-56 bg-[#111111] border border-[#1e1e1e] rounded-xl shadow-2xl py-2 z-50 text-sm">
                {signedInUser ? (
                  <div className="px-4 py-2 border-b border-[#1a1a1a]">
                    <div className="text-xs text-gray-500">Signed in as</div>
                    <div className="font-semibold text-white truncate">{signedInUser}</div>
                  </div>
                ) : (
                  <div className="px-4 py-2 border-b border-[#1a1a1a]">
                    <div className="font-semibold text-white">Guest Investor</div>
                    <div className="text-xs text-gray-500">Sign in to sync watchlists</div>
                  </div>
                )}
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    setShowGetStartedModal(true);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#161616] text-gray-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">login</span>
                  {signedInUser ? 'Switch Account' : 'Sign In / Register'}
                </button>
                <button
                  onClick={() => {
                    setShowUserModal(false);
                    onOpenSearch();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#161616] text-gray-300 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">star</span>
                  Symbol Search
                </button>
              </div>
            )}
          </div>

          {/* Get Started Button */}
          <button
            onClick={() => setShowGetStartedModal(true)}
            className="px-4 py-1.5 rounded-md bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-500 active:scale-95 transition-all shadow-md"
          >
            {signedInUser ? 'Pro Member' : 'Get started'}
          </button>
        </div>
      </div>

      {/* Get Started / Sign In Modal */}
      {showGetStartedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setShowGetStartedModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white text-xl"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Welcome to TradingView</h3>
                <p className="text-xs text-gray-500">Look first, then leap. Join millions of traders.</p>
              </div>
            </div>

            <form onSubmit={handleAuth} className="flex flex-col gap-4 mt-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="trader@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#161616] border border-[#222222] text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full h-10 rounded-lg bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 transition-colors"
              >
                Continue with Email
              </button>

              <div className="text-center text-xs text-gray-500 my-1">or quick sign in</div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSignedInUser('google.trader@gmail.com');
                    setShowGetStartedModal(false);
                  }}
                  className="h-10 rounded-lg bg-[#161616] border border-[#222222] text-xs font-medium text-gray-300 hover:bg-[#222222] flex items-center justify-center gap-2"
                >
                  <span className="font-bold text-indigo-400">G</span> Google
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSignedInUser('apple.trader@icloud.com');
                    setShowGetStartedModal(false);
                  }}
                  className="h-10 rounded-lg bg-[#161616] border border-[#222222] text-xs font-medium text-gray-300 hover:bg-[#222222] flex items-center justify-center gap-2"
                >
                  <span className="font-bold"></span> Apple
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
