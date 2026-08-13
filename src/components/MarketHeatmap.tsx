import React from 'react';
import { MarketSymbol } from '../types';

interface MarketHeatmapProps {
  symbols: MarketSymbol[];
  onSelect: (item: MarketSymbol) => void;
}

export const MarketHeatmap: React.FC<MarketHeatmapProps> = ({
  symbols,
  onSelect,
}) => {
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Heatmap Legend */}
      <div className="flex items-center justify-between text-xs font-mono text-gray-400 bg-[#111111] p-3 rounded-xl border border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-400 text-base">grid_view</span>
          <span className="font-semibold text-white">Market Capitalization & Sector Heatmap</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase">Performance Intensity:</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded bg-red-600 text-white text-[9px] flex items-center justify-center font-bold">-3%</span>
            <span className="w-4 h-4 rounded bg-red-900/60 text-gray-300 text-[9px] flex items-center justify-center">-1%</span>
            <span className="w-4 h-4 rounded bg-[#1e1e1e] text-gray-400 text-[9px] flex items-center justify-center">0%</span>
            <span className="w-4 h-4 rounded bg-emerald-950/80 text-gray-300 text-[9px] flex items-center justify-center">+1%</span>
            <span className="w-4 h-4 rounded bg-emerald-600 text-white text-[9px] flex items-center justify-center font-bold">+3%</span>
          </div>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 min-h-[380px]">
        {symbols.map((item) => {
          const isPositive = item.changePercent >= 0;
          const absVal = Math.abs(item.changePercent);

          // Color intensity calculation
          let bgClass = 'bg-[#181818] border-[#2a2a2a] text-gray-300';
          if (isPositive) {
            if (absVal > 2.5) bgClass = 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/50';
            else if (absVal > 1.0) bgClass = 'bg-emerald-700/80 border-emerald-600/60 text-emerald-100';
            else bgClass = 'bg-emerald-950/70 border-emerald-800/40 text-emerald-200';
          } else {
            if (absVal > 2.5) bgClass = 'bg-red-600 border-red-500 text-white shadow-red-950/50';
            else if (absVal > 1.0) bgClass = 'bg-red-700/80 border-red-600/60 text-red-100';
            else bgClass = 'bg-red-950/70 border-red-800/40 text-red-200';
          }

          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.03] hover:z-10 shadow-lg ${bgClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm tracking-tight">{item.symbol}</span>
                <span className="text-[10px] font-mono opacity-80 uppercase">{item.badgeText}</span>
              </div>

              <div className="my-3">
                <div className="text-xs opacity-90 truncate">{item.name}</div>
                <div className="text-lg font-mono font-bold tracking-tight">
                  ${item.price.toLocaleString(undefined, {
                    minimumFractionDigits: item.price < 10 ? 2 : 2,
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs font-mono font-bold">
                <span>{isPositive ? '+' : ''}{item.changePercent}%</span>
                <span className="text-[10px] font-normal opacity-80">Vol: {item.volume}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
