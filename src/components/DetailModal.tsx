import React, { useState, useEffect } from 'react';
import { MarketSymbol, AIAnalysisResponse } from '../types';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

interface DetailModalProps {
  symbol: MarketSymbol | null;
  onClose: () => void;
}

export const DetailModal: React.FC<DetailModalProps> = ({ symbol, onClose }) => {
  if (!symbol) return null;

  const [timeframe, setTimeframe] = useState<'1D' | '5D' | '1M' | '1Y'>('1D');
  const [chartType, setChartType] = useState<'area' | 'line' | 'candle'>('area');
  const [activeTab, setActiveTab] = useState<'chart' | 'stats' | 'ai'>('chart');
  
  // Indicator overlays
  const [showSMA20, setShowSMA20] = useState(false);
  const [showSMA50, setShowSMA50] = useState(false);

  // AI Analysis state
  const [aiData, setAiData] = useState<AIAnalysisResponse | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Interactive AI Chat state
  const [chatQuestion, setChatQuestion] = useState('');
  const [chatAnswers, setChatAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [askingChat, setAskingChat] = useState(false);

  const isPositive = symbol.changePercent >= 0;
  const mainColor = isPositive ? '#22c55e' : '#ef4444';

  const rawChartData = symbol.chartData[timeframe] || symbol.chartData['1D'];

  // Calculate SMA 20 and SMA 50
  const chartData = rawChartData.map((pt, idx, arr) => {
    let sma20Val = pt.value;
    let sma50Val = pt.value;

    if (idx >= 5) {
      const window20 = arr.slice(Math.max(0, idx - 5), idx + 1);
      sma20Val = window20.reduce((s, p) => s + p.value, 0) / window20.length;
    }
    if (idx >= 12) {
      const window50 = arr.slice(Math.max(0, idx - 12), idx + 1);
      sma50Val = window50.reduce((s, p) => s + p.value, 0) / window50.length;
    }

    return {
      ...pt,
      sma20: parseFloat(sma20Val.toFixed(2)),
      sma50: parseFloat(sma50Val.toFixed(2)),
    };
  });

  const minPrice = Math.min(...chartData.map((d) => d.value));
  const maxPrice = Math.max(...chartData.map((d) => d.value));

  const handleAskAI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuestion.trim() || askingChat) return;

    const q = chatQuestion.trim();
    setChatQuestion('');
    setAskingChat(true);

    fetch('/api/market-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        symbol: symbol.symbol,
        name: symbol.name,
        price: symbol.price,
        changePercent: symbol.changePercent,
        question: q,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setChatAnswers((prev) => [
          ...prev,
          { question: q, answer: data.answer || 'Analysis complete.' },
        ]);
        setAskingChat(false);
      })
      .catch(() => {
        setAskingChat(false);
      });
  };

  // Fetch AI Analysis when AI tab is selected
  useEffect(() => {
    if (activeTab === 'ai' && !aiData) {
      setLoadingAi(true);
      fetch('/api/market-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: symbol.symbol,
          name: symbol.name,
          price: symbol.price,
          changePercent: symbol.changePercent,
          currency: symbol.currency,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAiData(data);
          setLoadingAi(false);
        })
        .catch(() => {
          setLoadingAi(false);
        });
    }
  }, [activeTab, symbol]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white w-8 h-8 rounded-lg bg-[#161616] border border-[#222222] flex items-center justify-center text-lg z-10 transition-colors"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="p-6 border-b border-[#1a1a1a] flex flex-wrap items-center justify-between gap-4 bg-[#0b0b0b]">
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm font-mono shadow-md"
              style={{
                backgroundColor: symbol.badgeBg || '#3b82f6',
                color: symbol.badgeTextColor || '#FFFFFF',
              }}
            >
              {symbol.badgeText}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-headline text-2xl font-bold text-white">
                  {symbol.symbol}
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161616] text-gray-400 border border-[#222222] uppercase tracking-wider">
                  {symbol.category}
                </span>
              </div>
              <p className="text-xs text-gray-400">{symbol.name}</p>
            </div>
          </div>

          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-white">
              {symbol.currency === 'USD' ? '$' : ''}
              {symbol.price.toLocaleString(undefined, {
                minimumFractionDigits: symbol.price < 10 ? 4 : 2,
              })}
            </div>
            <div
              className={`text-sm font-semibold flex items-center justify-end gap-1 ${
                isPositive ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <span>{isPositive ? '▲' : '▼'}</span>
              <span>
                {isPositive ? '+' : ''}
                {symbol.change.toFixed(2)} ({isPositive ? '+' : ''}
                {symbol.changePercent.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="px-6 py-3 border-b border-[#1a1a1a] bg-[#0e0e0e] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(['chart', 'stats', 'ai'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-[#161616] text-gray-400 hover:bg-[#222222] hover:text-white'
                }`}
              >
                {tab === 'chart' && 'Interactive Chart'}
                {tab === 'stats' && 'Key Statistics'}
                {tab === 'ai' && '✨ AI Analysis'}
              </button>
            ))}
          </div>

          {activeTab === 'chart' && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Technical Indicators Toggle */}
              <div className="flex items-center bg-[#0b0b0b] p-1 rounded-lg border border-[#222222]">
                <button
                  onClick={() => setShowSMA20(!showSMA20)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    showSMA20 ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                  title="20-Period Moving Average"
                >
                  SMA 20
                </button>
                <button
                  onClick={() => setShowSMA50(!showSMA50)}
                  className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                    showSMA50 ? 'bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30' : 'text-gray-400 hover:text-white'
                  }`}
                  title="50-Period Moving Average"
                >
                  SMA 50
                </button>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center bg-[#0b0b0b] p-1 rounded-lg border border-[#222222]">
                {(['1D', '5D', '1M', '1Y'] as const).map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                      timeframe === tf
                        ? 'bg-[#161616] text-indigo-400 font-bold'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              {/* Chart Style Selector */}
              <div className="flex items-center bg-[#0b0b0b] p-1 rounded-lg border border-[#222222]">
                <button
                  onClick={() => setChartType('area')}
                  title="Area Chart"
                  className={`px-2.5 py-1 rounded text-xs ${
                    chartType === 'area'
                      ? 'bg-[#161616] text-indigo-400'
                      : 'text-gray-400'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartType('line')}
                  title="Line Chart"
                  className={`px-2.5 py-1 rounded text-xs ${
                    chartType === 'line'
                      ? 'bg-[#161616] text-indigo-400'
                      : 'text-gray-400'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('candle')}
                  title="Volume/Bars"
                  className={`px-2.5 py-1 rounded text-xs ${
                    chartType === 'candle'
                      ? 'bg-[#161616] text-indigo-400'
                      : 'text-gray-400'
                  }`}
                >
                  Volume
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#090909]">
          {activeTab === 'chart' && (
            <div className="flex flex-col gap-4">
              <div className="h-80 w-full bg-[#111111] p-4 rounded-xl border border-[#1e1e1e] relative">
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'area' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="modalGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={mainColor} stopOpacity={0.4} />
                          <stop offset="100%" stopColor={mainColor} stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.5} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={11} tickLine={false} />
                      <YAxis
                        domain={[minPrice - (maxPrice - minPrice) * 0.05, maxPrice + (maxPrice - minPrice) * 0.05]}
                        stroke="#6b7280"
                        fontSize={11}
                        orientation="right"
                        tickFormatter={(v) => v.toLocaleString()}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b0b0b',
                          borderColor: '#222222',
                          borderRadius: '8px',
                          color: '#e5e7eb',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={mainColor}
                        strokeWidth={2}
                        fill="url(#modalGrad)"
                      />
                      {showSMA20 && (
                        <Line
                          type="monotone"
                          dataKey="sma20"
                          stroke="#f59e0b"
                          strokeWidth={1.5}
                          dot={false}
                          name="SMA 20"
                        />
                      )}
                      {showSMA50 && (
                        <Line
                          type="monotone"
                          dataKey="sma50"
                          stroke="#06b6d4"
                          strokeWidth={1.5}
                          dot={false}
                          name="SMA 50"
                        />
                      )}
                    </AreaChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.5} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                      <YAxis
                        domain={[minPrice - (maxPrice - minPrice) * 0.05, maxPrice + (maxPrice - minPrice) * 0.05]}
                        stroke="#6b7280"
                        fontSize={11}
                        orientation="right"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b0b0b',
                          borderColor: '#222222',
                          borderRadius: '8px',
                          color: '#e5e7eb',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={mainColor}
                        strokeWidth={2.5}
                        dot={false}
                      />
                      {showSMA20 && (
                        <Line
                          type="monotone"
                          dataKey="sma20"
                          stroke="#f59e0b"
                          strokeWidth={1.5}
                          dot={false}
                          name="SMA 20"
                        />
                      )}
                      {showSMA50 && (
                        <Line
                          type="monotone"
                          dataKey="sma50"
                          stroke="#06b6d4"
                          strokeWidth={1.5}
                          dot={false}
                          name="SMA 50"
                        />
                      )}
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222222" opacity={0.5} />
                      <XAxis dataKey="time" stroke="#6b7280" fontSize={11} />
                      <YAxis stroke="#6b7280" fontSize={11} orientation="right" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0b0b0b',
                          borderColor: '#222222',
                          borderRadius: '8px',
                          color: '#e5e7eb',
                        }}
                      />
                      <Bar dataKey="volume" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Technical Sentiment Gauge Row */}
              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-gray-500 font-mono font-semibold uppercase tracking-wider mb-1">
                    Technical Rating
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold px-3 py-1 rounded-full ${
                        symbol.technicalSentiment === 'Strong Buy' || symbol.technicalSentiment === 'Buy'
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20'
                          : symbol.technicalSentiment === 'Neutral'
                          ? 'bg-gray-500/10 text-gray-300 border border-gray-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      {symbol.technicalSentiment}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      (Score: {symbol.technicalScore}/100)
                    </span>
                  </div>
                </div>

                {/* Meter visual bar */}
                <div className="flex-1 max-w-xs">
                  <div className="flex justify-between text-[10px] text-gray-500 mb-1 font-mono uppercase">
                    <span>Strong Sell</span>
                    <span>Neutral</span>
                    <span>Strong Buy</span>
                  </div>
                  <div className="h-2 w-full bg-[#161616] rounded-full overflow-hidden flex border border-[#222222]">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-green-500 transition-all duration-500"
                      style={{ width: `${symbol.technicalScore}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">Open</div>
                <div className="font-mono text-lg font-bold text-white">
                  {symbol.open.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">Day High</div>
                <div className="font-mono text-lg font-bold text-green-500">
                  {symbol.high.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">Day Low</div>
                <div className="font-mono text-lg font-bold text-red-500">
                  {symbol.low.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">Prev Close</div>
                <div className="font-mono text-lg font-bold text-white">
                  {symbol.prevClose.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">52-Week High</div>
                <div className="font-mono text-lg font-bold text-white">
                  {symbol.week52High.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">52-Week Low</div>
                <div className="font-mono text-lg font-bold text-white">
                  {symbol.week52Low.toLocaleString()}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">24h Volume</div>
                <div className="font-mono text-lg font-bold text-indigo-400">
                  {symbol.volume}
                </div>
              </div>

              <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                <div className="text-xs text-gray-500 mb-1">Currency</div>
                <div className="font-mono text-lg font-bold text-white">
                  {symbol.currency}
                </div>
              </div>

              {symbol.description && (
                <div className="col-span-2 md:col-span-4 bg-[#111111] p-4 rounded-xl border border-[#1e1e1e] mt-2">
                  <div className="text-[10px] font-mono text-gray-500 mb-1 font-semibold uppercase tracking-wider">
                    About {symbol.name}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {symbol.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="flex flex-col gap-5">
              {loadingAi ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
                  <span className="material-symbols-outlined text-4xl text-indigo-400 animate-spin">
                    sync
                  </span>
                  <p className="text-sm text-gray-400">Generating real-time AI market analysis...</p>
                </div>
              ) : aiData ? (
                <div className="flex flex-col gap-4">
                  {/* Executive AI Summary Box */}
                  <div className="bg-[#111111] p-5 rounded-xl border border-indigo-500/30 shadow-lg">
                    <div className="flex items-center gap-2 mb-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-base">auto_awesome</span>
                      AI Executive Summary
                    </div>
                    <p className="text-sm text-gray-200 leading-relaxed">
                      {aiData.summary}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Outlook */}
                    <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                      <div className="text-xs text-gray-500 mb-1">Market Outlook</div>
                      <div
                        className={`text-lg font-bold ${
                          aiData.outlook === 'Bullish'
                            ? 'text-green-500'
                            : aiData.outlook === 'Bearish'
                            ? 'text-red-500'
                            : 'text-indigo-400'
                        }`}
                      >
                        {aiData.outlook}
                      </div>
                    </div>

                    {/* Support */}
                    <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                      <div className="text-xs text-gray-500 mb-1">Key Support</div>
                      <div className="text-lg font-mono font-bold text-white">
                        ${aiData.supportLevel}
                      </div>
                    </div>

                    {/* Resistance */}
                    <div className="bg-[#111111] p-4 rounded-xl border border-[#1e1e1e]">
                      <div className="text-xs text-gray-500 mb-1">Key Resistance</div>
                      <div className="text-lg font-mono font-bold text-white">
                        ${aiData.resistanceLevel}
                      </div>
                    </div>
                  </div>

                  {/* Key Market Drivers */}
                  <div className="bg-[#111111] p-5 rounded-xl border border-[#1e1e1e]">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 font-mono">
                      Key Catalysts & Market Drivers
                    </div>
                    <ul className="flex flex-col gap-2">
                      {aiData.keyDrivers?.map((driver, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-sm text-gray-300"
                        >
                          <span className="text-indigo-400 font-bold">›</span>
                          <span>{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Ask AI Quant Analyst Chat */}
                  <div className="bg-[#111111] p-5 rounded-xl border border-[#1e1e1e] flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider font-mono">
                      <span className="material-symbols-outlined text-base">forum</span>
                      Ask AI Analyst for {symbol.symbol}
                    </div>

                    {chatAnswers.length > 0 && (
                      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-1">
                        {chatAnswers.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1.5 p-3 rounded-lg bg-[#161616] border border-[#222222]">
                            <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-sm">help</span>
                              Q: "{item.question}"
                            </div>
                            <div className="text-xs text-gray-200 leading-relaxed pl-5">
                              {item.answer}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <form onSubmit={handleAskAI} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={chatQuestion}
                        onChange={(e) => setChatQuestion(e.target.value)}
                        placeholder={`Ask AI a question about ${symbol.symbol} (e.g., 'Is RSI overbought?', 'Key support levels?')...`}
                        className="flex-1 h-10 px-3.5 rounded-lg bg-[#161616] border border-[#222222] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        disabled={askingChat || !chatQuestion.trim()}
                        className="h-10 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0"
                      >
                        {askingChat ? (
                          <span className="material-symbols-outlined text-base animate-spin">sync</span>
                        ) : (
                          <span className="material-symbols-outlined text-base">send</span>
                        )}
                        <span>Ask AI</span>
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  Unable to load AI analysis. Please try again.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
