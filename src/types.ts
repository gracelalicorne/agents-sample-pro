export type MarketCategory = 
  | 'US stocks'
  | 'World stocks'
  | 'Crypto'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Corporate bonds'
  | 'ETFs'
  | 'Economy'
  | 'Watchlist';

export type ViewMode = 'grid' | 'table' | 'heatmap';
export type SortOption = 'default' | 'gainers' | 'losers' | 'volume' | 'rating';

export interface ChartPoint {
  time: string;
  value: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
  volume?: number;
  sma20?: number;
  sma50?: number;
}

export interface MarketSymbol {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  badgeText: string;
  badgeBg: string; // Hex or Tailwind color class
  badgeTextColor?: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  week52High: number;
  week52Low: number;
  volume: string;
  technicalSentiment: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  technicalScore: number; // 0 to 100
  chartData: {
    '1D': ChartPoint[];
    '5D': ChartPoint[];
    '1M': ChartPoint[];
    '1Y': ChartPoint[];
  };
  description?: string;
  isStarred?: boolean;
  priceDirection?: 'up' | 'down' | null;
}

export interface AIAnalysisResponse {
  summary: string;
  keyDrivers: string[];
  outlook: 'Bullish' | 'Bearish' | 'Neutral';
  supportLevel: string;
  resistanceLevel: string;
}

export interface PriceAlert {
  id: string;
  symbolId: string;
  symbolName: string;
  targetPrice: number;
  condition: 'above' | 'below';
  createdAt: string;
  isTriggered?: boolean;
}
