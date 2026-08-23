import React, { useState } from 'react';
import { 
  Twitter, 
  Linkedin, 
  Instagram, 
  Share2, 
  Copy, 
  Check, 
  Heart, 
  MessageCircle, 
  Repeat, 
  Bookmark, 
  Send,
  MoreHorizontal,
  Sparkles,
  AlertTriangle,
  Layers
} from 'lucide-react';
import { PlatformPreview } from '../types';

interface PlatformSimulatorProps {
  platformPreviews: Record<string, PlatformPreview>;
  rawText: string;
}

export const PlatformSimulator: React.FC<PlatformSimulatorProps> = ({
  platformPreviews,
  rawText,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState<'twitter' | 'linkedin' | 'instagram' | 'facebook'>('twitter');
  const [copied, setCopied] = useState(false);

  const preview = platformPreviews[selectedPlatform] || platformPreviews.twitter;

  const handleCopyVariant = async () => {
    try {
      await navigator.clipboard.writeText(preview.optimizedVariant);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      {/* Title bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Share2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Multi-Platform Visual Simulator</h3>
            <p className="text-xs text-slate-500">Preview character boundaries, folds, and feed mockups</p>
          </div>
        </div>

        {/* Copy Optimized Variant button */}
        <button
          type="button"
          onClick={handleCopyVariant}
          className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 transition-all"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-white" />
              <span>Copied {preview.name} Post!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy {preview.name} Format</span>
            </>
          )}
        </button>
      </div>

      {/* Platform Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <button
          type="button"
          onClick={() => setSelectedPlatform('twitter')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            selectedPlatform === 'twitter'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
          }`}
        >
          <Twitter className="h-4 w-4" />
          <span>X / Twitter</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('linkedin')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            selectedPlatform === 'linkedin'
              ? 'bg-[#0a66c2] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
          }`}
        >
          <Linkedin className="h-4 w-4" />
          <span>LinkedIn</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('instagram')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            selectedPlatform === 'instagram'
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
          }`}
        >
          <Instagram className="h-4 w-4" />
          <span>Instagram</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedPlatform('facebook')}
          className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-semibold transition-all ${
            selectedPlatform === 'facebook'
              ? 'bg-[#1877f2] text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
          }`}
        >
          <Share2 className="h-4 w-4" />
          <span>Facebook</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Diagnostics & Tips */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Character Boundary
              </span>
              <span className="text-xs font-bold text-slate-900">
                {rawText.length} / {preview.maxChars} chars
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  rawText.length > preview.maxChars
                    ? 'bg-rose-500'
                    : rawText.length > preview.maxChars * 0.85
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, (rawText.length / preview.maxChars) * 100)}%` }}
              />
            </div>

            {rawText.length > preview.maxChars && (
              <div className="flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                <span>Exceeds single post capacity by {rawText.length - preview.maxChars} chars</span>
              </div>
            )}

            {preview.threadCount && preview.threadCount > 1 && (
              <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                <Layers className="h-3.5 w-3.5 shrink-0" />
                <span>Automatically formatted as a {preview.threadCount}-part thread</span>
              </div>
            )}
          </div>

          {/* Platform Specific Best Practices */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              {preview.name} Algorithm Playbook
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {preview.tips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column: Interactive UI Mockup */}
        <div className="lg:col-span-7">
          {selectedPlatform === 'twitter' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs font-sans">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                    AI
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-slate-900">Your Brand</span>
                      <span className="text-indigo-500 text-xs">✓</span>
                    </div>
                    <span className="text-xs text-slate-400">@yourhandle · Just now</span>
                  </div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {preview.optimizedVariant}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-slate-400 text-xs">
                <span className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer">
                  <MessageCircle className="h-4 w-4" /> 18
                </span>
                <span className="flex items-center gap-1.5 hover:text-emerald-600 cursor-pointer">
                  <Repeat className="h-4 w-4" /> 42
                </span>
                <span className="flex items-center gap-1.5 hover:text-rose-600 cursor-pointer">
                  <Heart className="h-4 w-4" /> 184
                </span>
                <span className="flex items-center gap-1.5 hover:text-indigo-600 cursor-pointer">
                  <Bookmark className="h-4 w-4" /> 56
                </span>
              </div>
            </div>
          )}

          {selectedPlatform === 'linkedin' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs font-sans">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-[#0a66c2] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    IN
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-sm text-slate-900">Founder & Strategist</span>
                      <span className="text-slate-400 text-xs">• 1st</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Building next-gen digital systems</p>
                    <span className="text-[10px] text-slate-400">Just now • 🌐</span>
                  </div>
                </div>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {preview.optimizedVariant}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-slate-500 text-xs font-semibold">
                <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer">
                  <Heart className="h-4 w-4 text-[#0a66c2]" /> Like
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer">
                  <MessageCircle className="h-4 w-4" /> Comment
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer">
                  <Repeat className="h-4 w-4" /> Repost
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#0a66c2] cursor-pointer">
                  <Send className="h-4 w-4" /> Send
                </span>
              </div>
            </div>
          )}

          {selectedPlatform === 'instagram' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs font-sans">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                    <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-slate-800">
                      IG
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-900">your.creator.page</span>
                </div>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>

              <div className="mt-3 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                <strong className="text-slate-900">your.creator.page</strong>{' '}
                {preview.optimizedVariant}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Heart className="h-4 w-4 hover:text-rose-500 cursor-pointer" />
                  <MessageCircle className="h-4 w-4 hover:text-indigo-500 cursor-pointer" />
                  <Send className="h-4 w-4 hover:text-indigo-500 cursor-pointer" />
                </div>
                <Bookmark className="h-4 w-4 hover:text-indigo-500 cursor-pointer" />
              </div>
            </div>
          )}

          {selectedPlatform === 'facebook' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs font-sans">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                <div className="h-9 w-9 rounded-full bg-[#1877f2] flex items-center justify-center text-white font-bold text-xs">
                  FB
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Social Media Community</h4>
                  <span className="text-[11px] text-slate-400">Just now • 👥</span>
                </div>
              </div>

              <div className="mt-3 text-xs sm:text-sm text-slate-800 whitespace-pre-wrap leading-relaxed">
                {preview.optimizedVariant}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
