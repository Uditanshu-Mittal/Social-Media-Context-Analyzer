import React from 'react';
import { Sparkles, Heart, ShieldCheck, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white/60 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs shadow-xs">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Social Media Content Analyzer
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Upload. Analyze. Improve.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
            <span>Powered by <strong>pdfjs-dist</strong> & <strong>Tesseract.js</strong></span>
            <span>•</span>
            <span>100% Client-Side Engine</span>
          </div>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Social Media Content Analyzer. Production-grade content diagnostics.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Built for creators, marketers & founders
          </p>
        </div>
      </div>
    </footer>
  );
};
