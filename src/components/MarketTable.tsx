import React, { useState } from 'react';
import { MarketSymbol } from '../types';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

interface MarketTableProps {
  symbols: MarketSymbol[];
  onSelect: (item: MarketSymbol) => void;
  onToggleStar: (e: React.MouseEvent, id: string) => void;
}

export const MarketTable: React.FC<MarketTableProps> = ({
  symbols,
  onSelect,
  onToggleStar,
}) => {
  const [sortField, setSortField] = useState<keyof MarketSymbol | 'changePercent'>('changePercent');
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (field: keyof MarketSymbol | 'changePercent') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const sortedSymbols = [...symbols].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = (bVal as string).toLowerCase();
    }

    if (aVal < bVal) return sortAsc ? -1 : 1;
    if (aVal > bVal) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="w-full overflow-x-auto bg-[#0d0d0d] border border-[#1e1e1e] rounded-xl shadow-xl">
      <table className="w-full text-left border-collapse min-w-[850px]">
        <thead>
          <tr className="bg-[#141414] border-b border-[#222222] text-[11px] font-mono uppercase tracking-wider text-gray-400 select-none">
            <th className="py-3 px-3 text-center w-10">★</th>
            <th
              onClick={() => handleSort('symbol')}
              className="py-3 px-4 cursor-pointer hover:text-white transition-colors"
            >
              <div className="flex items-center gap-1">
                Asset / Symbol
                {sortField === 'symbol' && (<span>{sortAsc ? '▲' : '▼'}</span>)}
              </div>
            </th>
            <th
              onClick={() => handleSort('price')}
              className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
            >
              <div className="flex items-center justify-end gap-1">
                Price
                {sortField === 'price' && (<span>{sortAsc ? '▲' : '▼'}</span>)}
              </div>
            </th>
            <th
              onClick={() => handleSort('changePercent')}
              className="py-3 px-4 text-right cursor-pointer hover:text-white transition-colors"
            >
              <div className="flex items-center justify-end gap-1">
                24h Change
                {sortField === 'changePercent' && (<span>{sortAsc ? '▲' : '▼'}</span>)}
              </div>
            </th>
            <th className="py-3 px-4 text-center">Day Range (L - H)</th>
            <th className="py-3 px-4 text-center">52W Position</th>
            <th className="py-3 px-4 text-right">Volume</th>
            <th
              onClick={() => handleSort('technicalScore')}
              className="py-3 px-4 text-center cursor-pointer hover:text-white transition-colors"
            >
              <div className="flex items-center justify-center gap-1">
                Rating
                {sortField === 'technicalScore' && (<span>{sortAsc ? '▲' : '▼'}</span>)}
              </div>
            </th>
            <th className="py-3 px-4 text-center w-28">1D Trend</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#181818] text-xs font-sans">
          {sortedSymbols.map((item) => {
            const isPositive = item.changePercent >= 0;
            const chartColor = isPositive ? '#22c55e' : '#ef4444';
            const chartData = item.chartData['1D'] || [];

            // 52W range calculation
            const range52 = item.week52High - item.week52Low;
            const pct52 = range52 > 0 ? Math.min(100, Math.max(0, ((item.price - item.week52Low) / range52) * 100)) : 50;

            return (
              <tr
                key={item.id}
                onClick={() => onSelect(item)}
                className={`hover:bg-[#161616] cursor-pointer transition-colors group ${
                  item.priceDirection === 'up'
                    ? 'bg-green-500/10'
                    : item.priceDirection === 'down'
                    ? 'bg-red-500/10'
                    : ''
                }`}
              >
                {/* Star Toggle */}
                <td
                  onClick={(e) => onToggleStar(e, item.id)}
                  className="py-3 px-3 text-center text-gray-500 hover:text-amber-400 transition-colors"
                >
                  <span className={`material-symbols-outlined text-base ${item.isStarred ? 'text-amber-400 font-bold' : ''}`}>
                    {item.isStarred ? 'star' : 'star_border'}
                  </span>
                </td>

                {/* Symbol & Name */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] font-mono shrink-0 shadow-sm"
                      style={{
                        backgroundColor: item.badgeBg || '#3b82f6',
                        color: item.badgeTextColor || '#FFFFFF',
                      }}
                    >
                      {item.badgeText}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                        <span>{item.symbol}</span>
                        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#1c1c1c] text-gray-400 border border-[#2a2a2a]">
                          {item.currency}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-400 truncate max-w-[180px]">
                        {item.name}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Price */}
                <td className="py-3 px-4 text-right font-mono font-semibold text-sm text-white">
                  {item.price.toLocaleString(undefined, {
                    minimumFractionDigits: item.price < 10 ? 4 : 2,
                  })}
                </td>

                {/* Change */}
                <td className="py-3 px-4 text-right">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                      isPositive
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    <span>{isPositive ? '+' : ''}{item.changePercent}%</span>
                  </div>
                </td>

                {/* Day Range */}
                <td className="py-3 px-4 text-center font-mono text-[11px] text-gray-400">
                  <span>${item.low.toLocaleString()}</span>
                  <span className="mx-1 text-gray-600">—</span>
                  <span>${item.high.toLocaleString()}</span>
                </td>

                {/* 52W Range Bar */}
                <td className="py-3 px-4">
                  <div className="flex flex-col items-center gap-0.5 w-32 mx-auto">
                    <div className="h-1.5 w-full bg-[#1e1e1e] rounded-full overflow-hidden relative">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${pct52}%` }}
                      />
                    </div>
                    <div className="flex justify-between w-full text-[9px] font-mono text-gray-500">
                      <span>${item.week52Low.toLocaleString()}</span>
                      <span>${item.week52High.toLocaleString()}</span>
                    </div>
                  </div>
                </td>

                {/* Volume */}
                <td className="py-3 px-4 text-right font-mono text-xs text-gray-300">
                  {item.volume}
                </td>

                {/* Tech Rating */}
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border ${
                      item.technicalSentiment.includes('Buy')
                        ? 'bg-green-500/10 text-green-400 border-green-500/20'
                        : item.technicalSentiment === 'Neutral'
                        ? 'bg-gray-500/10 text-gray-300 border-gray-500/20'
                        : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}
                  >
                    {item.technicalSentiment}
                  </span>
                </td>

                {/* Mini Sparkline */}
                <td className="py-3 px-4 text-center">
                  <div className="h-8 w-24 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={chartColor}
                          strokeWidth={1.5}
                          fill="none"
                          isAnimationActive={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
