import React from 'react';
import { MarketSymbol } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis, Tooltip } from 'recharts';

interface MarketCardProps {
  item: MarketSymbol;
  onSelect: (item: MarketSymbol) => void;
  onToggleStar?: (e: React.MouseEvent, id: string) => void;
}

export const MarketCard: React.FC<MarketCardProps> = ({ item, onSelect, onToggleStar }) => {
  const isPositive = item.changePercent >= 0;
  const chartColor = isPositive ? '#22c55e' : '#ef4444'; // Bull green vs Bear red
  const gradientId = `grad-${item.id}`;

  const chartData = item.chartData['1D'] || [];
  const minVal = Math.min(...chartData.map((d) => d.value));
  const maxVal = Math.max(...chartData.map((d) => d.value));

  // 52-Week range progress percentage
  const range52 = item.week52High - item.week52Low;
  const pct52 = range52 > 0 ? Math.min(100, Math.max(0, ((item.price - item.week52Low) / range52) * 100)) : 50;

  return (
    <div
      onClick={() => onSelect(item)}
      className={`bg-[#111111] hover:bg-[#161616] border border-[#1e1e1e] hover:border-[#2a2a2a] rounded-xl p-4.5 flex flex-col justify-between gap-3.5 cursor-pointer transition-all group shadow-md hover:shadow-xl relative overflow-hidden ${
        item.priceDirection === 'up'
          ? 'ring-1 ring-emerald-500/50 bg-emerald-950/10'
          : item.priceDirection === 'down'
          ? 'ring-1 ring-red-500/50 bg-red-950/10'
          : ''
      }`}
    >
      {/* Top Bar: Badge & Title & Star Action */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Badge Icon */}
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-sm"
            style={{
              backgroundColor: item.badgeBg || '#3b82f6',
              color: item.badgeTextColor || '#FFFFFF',
            }}
          >
            {item.badgeText}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-headline text-base font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">
                {item.symbol}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-mono uppercase border font-semibold ${
                  item.technicalSentiment.includes('Buy')
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : item.technicalSentiment === 'Neutral'
                    ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}
              >
                {item.technicalSentiment}
              </span>
            </div>
            <span className="text-xs text-gray-400 truncate max-w-[130px] sm:max-w-[160px]">
              {item.name}
            </span>
          </div>
        </div>

        {/* Star Watchlist Action */}
        {onToggleStar && (
          <button
            onClick={(e) => onToggleStar(e, item.id)}
            className={`p-1 rounded-md hover:bg-[#222222] transition-colors ${
              item.isStarred ? 'text-amber-400' : 'text-gray-600 hover:text-amber-400'
            }`}
            title={item.isStarred ? 'Remove from Watchlist' : 'Add to Watchlist'}
          >
            <span className={`material-symbols-outlined text-lg ${item.isStarred ? 'font-bold' : ''}`}>
              {item.isStarred ? 'star' : 'star_border'}
            </span>
          </button>
        )}
      </div>

      {/* Middle Bar: Price & Change */}
      <div className="flex items-baseline justify-between border-t border-[#1a1a1a] pt-3">
        <div className="font-mono text-xl font-bold text-white tracking-tight">
          ${item.price.toLocaleString(undefined, {
            minimumFractionDigits: item.price < 10 ? 4 : 2,
          })}
        </div>
        <div
          className={`text-xs font-mono font-bold flex items-center gap-1 px-2 py-0.5 rounded ${
            isPositive
              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
              : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}
        >
          <span>{isPositive ? '▲' : '▼'}</span>
          <span>
            {isPositive ? '+' : ''}
            {item.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* 52W Range Meter */}
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-[10px] font-mono text-gray-500">
          <span>52W L: ${item.week52Low.toLocaleString()}</span>
          <span>52W H: ${item.week52High.toLocaleString()}</span>
        </div>
        <div className="h-1.5 w-full bg-[#1c1c1c] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-indigo-500 rounded-full"
            style={{ width: `${pct52}%` }}
          />
        </div>
      </div>

      {/* Chart Box Container */}
      <div className="h-24 w-full bg-[#090909] rounded-lg border border-[#1e1e1e] p-1 flex flex-col justify-end relative overflow-hidden group-hover:border-[#2a2a2a] transition-colors">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.35} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <YAxis domain={[minVal - (maxVal - minVal) * 0.1, maxVal + (maxVal - minVal) * 0.1]} hide />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-[#0b0b0b] border border-[#222222] rounded px-2.5 py-1 text-[11px] font-mono shadow-xl text-gray-200">
                      <div className="text-gray-500">{data.time}</div>
                      <div className="font-bold text-indigo-400">
                        ${data.value.toLocaleString(undefined, {
                          minimumFractionDigits: data.value < 10 ? 4 : 2,
                        })}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Overlay Label for Quick Context */}
        <div className="absolute top-1.5 left-2.5 text-[9px] uppercase font-mono tracking-wider text-gray-500/80 pointer-events-none">
          1D Intraday
        </div>
      </div>
    </div>
  );
};
