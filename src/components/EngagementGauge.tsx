import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Target, 
  Bookmark, 
  MessageSquare, 
  Sparkles, 
  Zap, 
  HelpCircle,
  Award
} from 'lucide-react';
import { EngagementMetrics } from '../types';

interface EngagementGaugeProps {
  engagement: EngagementMetrics;
}

export const EngagementGauge: React.FC<EngagementGaugeProps> = ({ engagement }) => {
  const score = engagement.overallScore;

  // Gauge color based on score
  let scoreColor = 'text-emerald-600';
  let strokeColor = '#10b981'; // emerald-500
  let badgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score < 50) {
    scoreColor = 'text-rose-600';
    strokeColor = '#f43f5e';
    badgeBg = 'bg-rose-50 text-rose-700 border-rose-200';
  } else if (score < 70) {
    scoreColor = 'text-amber-600';
    strokeColor = '#f59e0b';
    badgeBg = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (score < 85) {
    scoreColor = 'text-indigo-600';
    strokeColor = '#6366f1';
    badgeBg = 'bg-indigo-50 text-indigo-700 border-indigo-200';
  }

  // SVG Circular progress math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const subscoresList = [
    { label: '3-Sec Hook Strength', value: engagement.subscores.hookClarity, desc: 'Opening impact & curiosity gap' },
    { label: 'Call-to-Action (CTA)', value: engagement.subscores.ctaStrength, desc: 'Clarity of conversion next step' },
    { label: 'Scannability & Spacing', value: engagement.subscores.readabilityScannability, desc: 'Line breaks & paragraph density' },
    { label: 'Emotional Resonance', value: engagement.subscores.emotionalResonance, desc: 'Power words and conviction' },
    { label: 'Hashtag Optimization', value: engagement.subscores.hashtagOptimization, desc: 'Discovery indexing balance' },
    { label: 'Audience Interaction', value: engagement.subscores.audienceInteraction, desc: 'Questions & comment prompts' },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Engagement Score</h3>
            <p className="text-xs text-slate-500">Algorithmic distribution index (0–100 scale)</p>
          </div>
        </div>

        <span className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold border ${badgeBg}`}>
          <Sparkles className="h-3 w-3" />
          {engagement.tier}
        </span>
      </div>

      {/* Main Score Circular Gauge & Multipliers */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circle Radial Meter */}
        <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
          <div className="relative flex items-center justify-center">
            <svg className="h-40 w-40 transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-100"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Track */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Score Center Text */}
            <div className="absolute flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className={`text-4xl font-extrabold tracking-tight ${scoreColor}`}
              >
                {score}
              </motion.span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 max-w-xs font-medium leading-relaxed">
            {engagement.summary}
          </p>
        </div>

        {/* Prediction Cards */}
        <div className="md:col-span-7 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              {engagement.predictedReachMultiplier}x
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Reach Lift
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-1.5">
              <Bookmark className="h-3.5 w-3.5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              {engagement.estimatedSaveRate}%
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Save Rate
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-3.5 text-center">
            <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 mb-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
            </div>
            <span className="text-lg font-extrabold text-slate-900">
              {engagement.estimatedCommentRate}%
            </span>
            <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
              Comments
            </p>
          </div>
        </div>
      </div>

      {/* Subscores Progress Breakdown */}
      <div className="mt-8 border-t border-slate-100 pt-6">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4">
          Algorithmic Subscore Breakdown
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subscoresList.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">{item.label}</span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>

              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.08 }}
                  className={`h-full rounded-full ${
                    item.value >= 80
                      ? 'bg-emerald-500'
                      : item.value >= 60
                      ? 'bg-indigo-500'
                      : item.value >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                />
              </div>

              <p className="text-[11px] text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
