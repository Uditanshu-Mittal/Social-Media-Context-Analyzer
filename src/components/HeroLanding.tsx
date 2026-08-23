import React from 'react';
import { motion } from 'motion/react';
import { 
  FileCheck2, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  ScanText, 
  FileCode, 
  ShieldCheck, 
  Share2, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { SAMPLE_POSTS } from '../utils/samplePosts';
import { SamplePost } from '../types';

interface HeroLandingProps {
  onSelectSample: (sample: SamplePost) => void;
  onScrollToDropzone: () => void;
}

export const HeroLanding: React.FC<HeroLandingProps> = ({
  onSelectSample,
  onScrollToDropzone,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16">
      {/* Subtle Background Glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-full -translate-x-1/2 max-w-6xl opacity-30 blur-3xl [background:radial-gradient(circle_at_center,#6366f1_0%,#38bdf8_50%,transparent_80%)]" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto">
          {/* Animated Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-indigo-700 shadow-xs mb-6"
          >
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span className="tracking-wide">Upload. Analyze. Improve.</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-tight"
          >
            Social Content Analyzer
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-3 text-base sm:text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Extract text from PDF and images using client-side OCR, calculate engagement scores, sentiment analysis, exact word counts, and actionable social media improvements.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-7 flex flex-wrap items-center justify-center gap-3.5"
          >
            <button
              type="button"
              onClick={onScrollToDropzone}
              className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 text-sm sm:text-base font-semibold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
            >
              <ScanText className="h-4 w-4" />
              <span>Select Files</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onSelectSample(SAMPLE_POSTS[0])}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm sm:text-base font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 active:scale-95 transition-all"
            >
              <Zap className="h-4 w-4 text-amber-500" />
              <span>Try Launch Post Sample</span>
            </button>
          </motion.div>

          {/* Trust points */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500"
          >
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>100% Client-Side Extraction</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>PDF & Image OCR Support</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-indigo-600" />
              <span>Zero Data Storage / Private</span>
            </div>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
              <ScanText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">PDF & Image OCR</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Extract typography and copy from PDF docs via <code>pdfjs-dist</code> and image screenshots via <code>tesseract.js</code>.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">0–100 Engagement Score</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Multi-factor algorithm evaluating 3-second hook strength, call-to-action signals, scannability, and audience response.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 mb-3">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Sentiment & Emotion Spectrum</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              Polarity classification (Positive, Neutral, Negative) with power word detection and tone breakdown.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 mb-3">
              <Share2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Platform Optimizers</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              One-click previews and character boundary verifications for X (Twitter), LinkedIn, Instagram, and Facebook.
            </p>
          </motion.div>
        </div>

        {/* Quick Sample Selector Bar */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/60 via-slate-50 to-indigo-50/60 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-indigo-600" />
              <span className="text-xs sm:text-sm font-bold text-slate-800">
                Don't have a file handy? Try one of our instant sample posts:
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Click to load instantly</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_POSTS.map((sample) => (
              <button
                key={sample.id}
                type="button"
                onClick={() => onSelectSample(sample)}
                className="flex flex-col text-left rounded-xl border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-1">
                    {sample.title}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500 line-clamp-1">
                  {sample.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
