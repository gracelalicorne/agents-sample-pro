import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b0b0b] border-t border-[#1a1a1a] mt-auto w-full">
      <div className="w-full max-w-7xl mx-auto px-6 py-12 flex flex-col items-center gap-6">
        {/* SVG TradingView Logo */}
        <div className="flex items-center gap-2">
          <svg
            className="text-white"
            fill="none"
            height="17"
            viewBox="0 0 36 26"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              d="M11.6667 0H2.33333C1.04467 0 0 1.04467 0 2.33333V23.6667C0 24.9553 1.04467 26 2.33333 26H11.6667V0ZM11.6667 26H21C22.2887 26 23.3333 24.9553 23.3333 23.6667V11.6667H11.6667V26ZM33.6667 0H24.3333C23.0447 0 22 1.04467 22 2.33333V9.33333H36V2.33333C36 1.04467 34.9553 0 33.6667 0Z"
              fill="currentColor"
              fillRule="evenodd"
            />
          </svg>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-400">
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Features
          </a>
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Pricing
          </a>
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Help Center
          </a>
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Terms of Use
          </a>
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="hover:text-white hover:underline underline-offset-4 transition-colors"
            onClick={(e) => e.preventDefault()}
          >
            Cookies
          </a>
        </nav>

        {/* Copyright */}
        <div className="text-[10px] text-gray-500 tracking-widest uppercase mt-2 font-mono">
          © 2024 TradingView, Inc.
        </div>
      </div>
    </footer>
  );
};
