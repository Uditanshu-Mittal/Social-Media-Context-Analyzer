import React from 'react';
import { Sparkles, FileText, BarChart3, RefreshCw, Layers } from 'lucide-react';

interface NavbarProps {
  onNewAnalysis: () => void;
  hasActiveResult: boolean;
  onScrollToAnalyzer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNewAnalysis,
  hasActiveResult,
  onScrollToAnalyzer,
}) => {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-200 bg-white shadow-sm shrink-0 transition-all">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div 
          onClick={onNewAnalysis}
          className="flex cursor-pointer items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
                Social Content Analyzer
              </span>
              <span className="hidden sm:inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200/60">
                Pro
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block font-medium">
              Upload. Analyze. Improve.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <nav className="flex items-center gap-3 sm:gap-4">
          {hasActiveResult ? (
            <>
              <button
                type="button"
                onClick={onScrollToAnalyzer}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
              >
                <FileText className="h-4 w-4 text-slate-500" />
                <span>Text Editor</span>
              </button>
              <button
                type="button"
                onClick={onNewAnalysis}
                className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>New Upload</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onScrollToAnalyzer}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <BarChart3 className="h-4 w-4" />
              <span>Start Analyzing</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
            SC
          </div>
        </nav>
      </div>
    </header>
  );
};
