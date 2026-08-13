import React, { useEffect } from 'react';

interface DisqusForumProps {
  title?: string;
  subtitle?: string;
}

export const DisqusForum: React.FC<DisqusForumProps> = ({
  title = 'Markets Discussion & Trader Forum',
  subtitle = 'Share real-time trading ideas, market predictions, and technical analysis with fellow traders.',
}) => {
  useEffect(() => {
    // Check if script is already added
    const embedScriptId = 'disqus-embed-script';
    const countScriptId = 'dsq-count-scr';

    if (!document.getElementById(embedScriptId)) {
      const d = document;
      const s = d.createElement('script');
      s.id = embedScriptId;
      s.src = 'https://sample-site-10.disqus.com/embed.js';
      s.setAttribute('data-timestamp', String(+new Date()));
      s.async = true;
      (d.head || d.body).appendChild(s);
    } else if ((window as any).DISQUS) {
      // Reload DISQUS if already present
      (window as any).DISQUS.reset({
        reload: true,
      });
    }

    if (!document.getElementById(countScriptId)) {
      const countScript = document.createElement('script');
      countScript.id = countScriptId;
      countScript.src = '//sample-site-10.disqus.com/count.js';
      countScript.async = true;
      (document.head || document.body).appendChild(countScript);
    }
  }, []);

  return (
    <section className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 md:p-8 shadow-xl mt-4">
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
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

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-gray-400 bg-[#161616] px-3 py-1.5 rounded-lg border border-[#222222]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Disqus Powered</span>
        </div>
      </div>

      {/* Disqus Thread Container */}
      <div id="disqus_thread" className="min-h-[250px]" />

      <noscript>
        Please enable JavaScript to view the{' '}
        <a href="https://disqus.com/?ref_noscript" className="text-indigo-400 underline">
          comments powered by Disqus.
        </a>
      </noscript>
    </section>
  );
};
