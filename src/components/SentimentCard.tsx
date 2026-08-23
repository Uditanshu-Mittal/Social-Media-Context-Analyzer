import React from 'react';
import { motion } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  Sparkles, 
  Flame, 
  HeartHandshake, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { SentimentAnalysis } from '../types';

interface SentimentCardProps {
  sentiment: SentimentAnalysis;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment }) => {
  const isPos = sentiment.category === 'Positive';
  const isNeg = sentiment.category === 'Negative';

  let badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  let categoryIcon = <Meh className="h-5 w-5 text-indigo-600" />;
  if (isPos) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    categoryIcon = <Smile className="h-5 w-5 text-emerald-600" />;
  } else if (isNeg) {
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
    categoryIcon = <Frown className="h-5 w-5 text-rose-600" />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <HeartHandshake className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sentiment & Tone</h3>
            <p className="text-xs text-slate-500">Emotional polarity and reader psychological resonance</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-bold border ${badgeColor}`}>
          {categoryIcon}
          <span>{sentiment.category} Tone</span>
        </span>
      </div>

      {/* Primary Sentiment Score Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 flex flex-col justify-center">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Sentiment Polarity</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-800 uppercase">
              {sentiment.category}
            </span>
            <span className={`w-2.5 h-2.5 rounded-full ${isPos ? 'bg-green-500 animate-pulse' : isNeg ? 'bg-rose-500 animate-pulse' : 'bg-slate-400'}`} />
          </div>

          <p className="text-[11px] text-slate-400 mt-1.5 font-medium italic">
            Dominant Mood: <strong className="text-indigo-600 font-semibold">{sentiment.dominantEmotion}</strong> ({sentiment.score > 0 ? `+${sentiment.score}` : sentiment.score} Index)
          </p>

          {/* Polarity Slider Bar */}
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              <span className="text-rose-500">Negative</span>
              <span className="text-slate-400">Neutral (0)</span>
              <span className="text-emerald-500">Positive</span>
            </div>
            <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-200">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400 via-slate-200 to-emerald-400 opacity-80" />
              {/* Slider marker */}
              <div
                className="absolute top-0 bottom-0 w-2.5 -ml-1 rounded-full bg-slate-900 shadow-md ring-2 ring-white"
                style={{ left: `${Math.min(96, Math.max(4, ((sentiment.score + 100) / 200) * 100))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Emotion Spectrum Breakdown */}
        <div className="md:col-span-7 space-y-2.5 bg-slate-50/80 p-4 rounded-xl border border-slate-100">
          <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Emotional Tone Distribution
          </h4>

          {sentiment.emotionalTones.map((tone, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700">{tone.label}</span>
                <span className="font-bold text-slate-900">{tone.score}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200/70 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${tone.score}%` }}
                  transition={{ duration: 0.6, delay: idx * 0.05 }}
                  className="h-full bg-indigo-500 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected Word Highlights */}
      <div className="mt-6 border-t border-slate-100 pt-5">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
          Linguistic Keyword Triggers
        </h4>

        <div className="flex flex-wrap gap-2 text-xs">
          {sentiment.highlightWords.powerWords.map((pw, i) => (
            <span
              key={`pw-${i}`}
              className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 font-semibold text-amber-800 border border-amber-200/70"
            >
              <Zap className="h-3 w-3 text-amber-600" />
              <span>{pw}</span>
              <span className="text-[10px] text-amber-600 font-normal">(Power)</span>
            </span>
          ))}

          {sentiment.highlightWords.positive.map((w, i) => (
            <span
              key={`pos-${i}`}
              className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-800 border border-emerald-200/70"
            >
              <Smile className="h-3 w-3 text-emerald-600" />
              <span>{w}</span>
            </span>
          ))}

          {sentiment.highlightWords.negative.map((w, i) => (
            <span
              key={`neg-${i}`}
              className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1 font-semibold text-rose-800 border border-rose-200/70"
            >
              <AlertTriangle className="h-3 w-3 text-rose-600" />
              <span>{w}</span>
            </span>
          ))}

          {sentiment.highlightWords.powerWords.length === 0 &&
            sentiment.highlightWords.positive.length === 0 &&
            sentiment.highlightWords.negative.length === 0 && (
              <span className="text-xs text-slate-400 italic">
                Clean objective copy with balanced tone markers.
              </span>
            )}
        </div>
      </div>
    </div>
  );
};
