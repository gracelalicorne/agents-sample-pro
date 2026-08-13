import React, { useEffect, useState } from 'react';

interface DisqusForumProps {
  title?: string;
  subtitle?: string;
}

interface LocalComment {
  id: string;
  author: string;
  avatarBg: string;
  time: string;
  content: string;
  likes: number;
  isLiked?: boolean;
}

export const DisqusForum: React.FC<DisqusForumProps> = ({
  title = 'Markets Discussion & Trader Forum',
  subtitle = 'Share real-time trading ideas, market predictions, and technical analysis with fellow traders.',
}) => {
  const [loadStatus, setLoadStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<LocalComment[]>([
    {
      id: '1',
      author: 'QuantTrader_88',
      avatarBg: '#3b82f6',
      time: '12 mins ago',
      content: 'S&P 500 is testing resistance at 5850. Watching for a volume-backed breakout above the 20-day SMA.',
      likes: 14,
    },
    {
      id: '2',
      author: 'CryptoMacro',
      avatarBg: '#f59e0b',
      time: '28 mins ago',
      content: 'Bitcoin consolidating near $68,200. Funding rates look healthy and spot ETF inflows remain positive.',
      likes: 9,
    },
    {
      id: '3',
      author: 'FxAnalyst_Elena',
      avatarBg: '#10b981',
      time: '45 mins ago',
      content: 'EUR/USD holding support at 1.0850 ahead of upcoming ECB interest rate decision.',
      likes: 6,
    },
  ]);

  const loadDisqusScript = () => {
    setLoadStatus('loading');

    // Configure Disqus global page identifier
    (window as any).disqus_config = function () {
      this.page.url = window.location.href.split('#')[0];
      this.page.identifier = 'tradingview-pro-markets-forum';
    };

    const embedScriptId = 'disqus-embed-script';
    const countScriptId = 'dsq-count-scr';

    const existingEmbed = document.getElementById(embedScriptId);

    if (existingEmbed) {
      if ((window as any).DISQUS) {
        try {
          (window as any).DISQUS.reset({
            reload: true,
            config: function (this: any) {
              this.page.url = window.location.href.split('#')[0];
              this.page.identifier = 'tradingview-pro-markets-forum';
            },
          });
          setLoadStatus('loaded');
        } catch {
          setLoadStatus('error');
        }
      } else {
        // Wait or retry
        setTimeout(() => {
          if ((window as any).DISQUS) setLoadStatus('loaded');
          else setLoadStatus('error');
        }, 2000);
      }
    } else {
      const d = document;
      const s = d.createElement('script');
      s.id = embedScriptId;
      s.src = 'https://sample-site-10.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;

      s.onload = () => {
        setLoadStatus('loaded');
      };

      s.onerror = () => {
        setLoadStatus('error');
      };

      (d.head || d.body).appendChild(s);
    }

    if (!document.getElementById(countScriptId)) {
      const countScript = document.createElement('script');
      countScript.id = countScriptId;
      countScript.src = '//sample-site-10.disqus.com/count.js';
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }

    // Safety timeout: if Disqus doesn't mount within 3s (e.g. adblocker or cookie policy), fall back cleanly
    const timer = setTimeout(() => {
      const iframe = document.querySelector('#disqus_thread iframe');
      if (!iframe && !(window as any).DISQUS) {
        setLoadStatus('error');
      } else {
        setLoadStatus('loaded');
      }
    }, 3500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    loadDisqusScript();
  }, []);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const item: LocalComment = {
      id: String(Date.now()),
      author: 'Trader_You',
      avatarBg: '#6366f1',
      time: 'Just now',
      content: newComment.trim(),
      likes: 1,
      isLiked: true,
    };

    setComments([item, ...comments]);
    setNewComment('');
  };

  const handleToggleLike = (id: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : c.likes - 1,
          };
        }
        return c;
      })
    );
  };

  return (
    <section className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 md:p-8 shadow-xl mt-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-[#1e1e1e] gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <span className="material-symbols-outlined text-xl">forum</span>
          </div>
          <div>
            <h3 className="font-headline text-lg font-bold text-white">
              {title}
            </h3>
            <p className="text-xs text-gray-400">
              {subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {loadStatus === 'loaded' && (
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Disqus Connected</span>
            </div>
          )}

          {loadStatus === 'error' && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded border border-amber-500/20">
                AdBlock / Sandbox Fallback Active
              </span>
              <button
                onClick={loadDisqusScript}
                className="text-xs px-2.5 py-1 bg-[#1a1a1a] hover:bg-[#222222] border border-[#333333] text-gray-300 rounded font-semibold transition-colors flex items-center gap-1"
                title="Retry loading Disqus"
              >
                <span className="material-symbols-outlined text-sm">refresh</span>
                Retry Disqus
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Disqus Thread Container */}
      <div
        id="disqus_thread"
        className={`min-h-[200px] ${loadStatus === 'error' ? 'hidden' : 'block'}`}
      />

      {/* Loading state indicator */}
      {loadStatus === 'loading' && (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 gap-3">
          <span className="material-symbols-outlined text-3xl text-indigo-400 animate-spin">sync</span>
          <p className="text-xs font-mono">Initializing Disqus Discussion Thread...</p>
        </div>
      )}

      {/* Fallback Native Discussion Forum (If Disqus is blocked by AdBlocker or Third-Party Cookie Policy) */}
      {loadStatus === 'error' && (
        <div className="flex flex-col gap-6">
          {/* Post Comment Form */}
          <form onSubmit={handleAddComment} className="flex flex-col gap-3 bg-[#161616] p-4 rounded-xl border border-[#222222]">
            <label className="text-xs font-semibold text-gray-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-indigo-400">edit_note</span>
              Post a Market Thought
            </label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What is your price prediction or technical setup for today's market session?..."
              className="w-full h-20 p-3 rounded-lg bg-[#0b0b0b] border border-[#262626] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
            <div className="flex justify-between items-center">
              <span className="text-[11px] text-gray-500 font-mono">
                Disqus embedded mode blocked by browser/adblocker settings. Native forum active.
              </span>
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">send</span>
                <span>Publish</span>
              </button>
            </div>
          </form>

          {/* Comments Feed */}
          <div className="flex flex-col gap-3">
            {comments.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-[#161616] border border-[#222222] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs text-white font-mono"
                      style={{ backgroundColor: c.avatarBg }}
                    >
                      {c.author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-white">{c.author}</span>
                    <span className="text-[10px] text-gray-500 font-mono">• {c.time}</span>
                  </div>

                  <button
                    onClick={() => handleToggleLike(c.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                      c.isLiked
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                        : 'bg-[#222222] text-gray-400 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">thumb_up</span>
                    <span>{c.likes}</span>
                  </button>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed pl-9">
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-indigo-400 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </section>
  );
};

