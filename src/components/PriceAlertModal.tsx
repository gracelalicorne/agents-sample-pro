import React, { useState } from 'react';
import { MarketSymbol, PriceAlert } from '../types';

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  symbols: MarketSymbol[];
  alerts: PriceAlert[];
  onAddAlert: (symbol: MarketSymbol, targetPrice: number, condition: 'above' | 'below') => void;
  onRemoveAlert: (id: string) => void;
}

export const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  symbols,
  alerts,
  onAddAlert,
  onRemoveAlert,
}) => {
  if (!isOpen) return null;

  const [selectedSymbolId, setSelectedSymbolId] = useState(symbols[0]?.id || '');
  const selectedSymbol = symbols.find((s) => s.id === selectedSymbolId) || symbols[0];
  const [targetPrice, setTargetPrice] = useState(selectedSymbol ? selectedSymbol.price * 1.05 : 100);
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSymbol || targetPrice <= 0) return;
    onAddAlert(selectedSymbol, parseFloat(targetPrice.toFixed(2)), condition);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl w-full max-w-lg shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-[#1a1a1a] flex items-center justify-between bg-[#0b0b0b]">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-base">
            <span className="material-symbols-outlined">notifications_active</span>
            Price Alerts Manager
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl font-bold"
          >
            &times;
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6">
          {/* Create Alert Form */}
          <form onSubmit={handleSubmit} className="bg-[#161616] p-4 rounded-xl border border-[#222222] flex flex-col gap-4">
            <div className="text-xs font-mono uppercase text-gray-400 font-semibold">
              Create New Alert
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Select Asset</label>
                <select
                  value={selectedSymbolId}
                  onChange={(e) => {
                    setSelectedSymbolId(e.target.value);
                    const sym = symbols.find((s) => s.id === e.target.value);
                    if (sym) setTargetPrice(parseFloat((sym.price * 1.05).toFixed(2)));
                  }}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b0b0b] border border-[#222222] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {symbols.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.symbol} (${s.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Trigger Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as 'above' | 'below')}
                  className="w-full h-10 px-3 rounded-lg bg-[#0b0b0b] border border-[#222222] text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="above">Price rises above (≥)</option>
                  <option value="below">Price drops below (≤)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Target Price ($)</label>
              <input
                type="number"
                step="any"
                value={targetPrice}
                onChange={(e) => setTargetPrice(parseFloat(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#0b0b0b] border border-[#222222] text-sm font-mono text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full h-10 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-base">add_alert</span>
              Set Price Alert
            </button>
          </form>

          {/* Active Alerts List */}
          <div className="flex flex-col gap-3">
            <div className="text-xs font-mono uppercase text-gray-400 font-semibold flex items-center justify-between">
              <span>Active Alerts ({alerts.length})</span>
            </div>

            {alerts.length > 0 ? (
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                {alerts.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-[#161616] border border-[#222222] rounded-lg flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-indigo-400 text-base">
                        notifications
                      </span>
                      <div>
                        <div className="font-bold text-white">{a.symbolName}</div>
                        <div className="text-gray-400 font-mono text-[11px]">
                          Target: {a.condition === 'above' ? '≥' : '≤'} ${a.targetPrice.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveAlert(a.id)}
                      className="text-gray-500 hover:text-red-400 p-1 transition-colors"
                      title="Delete Alert"
                    >
                      <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-gray-500 border border-dashed border-[#222222] rounded-xl">
                No active price alerts set yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
