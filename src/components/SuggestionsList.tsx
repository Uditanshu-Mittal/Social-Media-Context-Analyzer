import React, { useState } from 'react';
import { 
  CheckCircle, 
  Lightbulb, 
  AlertCircle, 
  ArrowRight, 
  Copy, 
  Check, 
  Sparkles, 
  Target, 
  MessageSquare, 
  Hash, 
  AlignLeft
} from 'lucide-react';
import { ImprovementSuggestion } from '../types';

interface SuggestionsListProps {
  suggestions: ImprovementSuggestion[];
  onApplySuggestion?: (exampleText: string) => void;
}

export const SuggestionsList: React.FC<SuggestionsListProps> = ({
  suggestions,
  onApplySuggestion,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyExample = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hook':
        return <Target className="h-4 w-4 text-rose-600" />;
      case 'cta':
        return <ArrowRight className="h-4 w-4 text-emerald-600" />;
      case 'format':
        return <AlignLeft className="h-4 w-4 text-indigo-600" />;
      case 'hashtags':
        return <Hash className="h-4 w-4 text-cyan-600" />;
      case 'engagement':
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default:
        return <Lightbulb className="h-4 w-4 text-amber-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
            High Priority
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
            Medium Priority
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 border border-indigo-200">
            Growth Tip
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">
              Actionable Recommendations
            </h3>
            <p className="text-xs text-slate-500">
              Targeted algorithm-aligned fixes to maximize distribution and engagement
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold text-slate-500">
          {suggestions.length} tips
        </span>
      </div>

      {suggestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
          <p className="text-sm font-bold text-slate-800">Flawless Social Execution!</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Your content satisfies all criteria for hooks, call-to-actions, spacing, and hashtag optimization.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {suggestions.map((sug, idx) => (
            <div
              key={sug.id}
              className="group rounded-xl border border-slate-100 bg-slate-50/80 p-4 transition-all hover:bg-white hover:border-indigo-200 hover:shadow-xs"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-7 h-7 shrink-0 bg-white rounded-lg shadow-2xs border border-slate-200 flex items-center justify-center text-indigo-600 font-bold text-xs">
                  {String(idx + 1).padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{sug.title}</h4>
                    </div>

                    {getPriorityBadge(sug.priority)}
                  </div>

                  {/* Problem diagnosis */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-2">
                    <strong className="text-slate-700 font-semibold">Diagnosis:</strong> {sug.issue}
                  </p>

                  {/* Solution recommendation */}
                  <p className="text-xs text-indigo-900 bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100/80 leading-relaxed">
                    <strong className="font-semibold text-indigo-950">Action:</strong> {sug.recommendation}
                  </p>

                  {/* Example action prompt & copy button */}
                  {sug.exampleAction && (
                    <div className="mt-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-lg bg-white p-2.5 border border-slate-200 text-xs">
                      <span className="font-mono text-slate-700 text-[11px] sm:text-xs">
                        {sug.exampleAction}
                      </span>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyExample(sug.id, sug.exampleAction!)}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700 transition-colors"
                          title="Copy example"
                        >
                          {copiedId === sug.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>

                        {onApplySuggestion && (
                          <button
                            type="button"
                            onClick={() => onApplySuggestion(sug.exampleAction!)}
                            className="inline-flex items-center gap-1 rounded-md bg-indigo-600 hover:bg-indigo-700 px-2 py-1 text-[11px] font-semibold text-white transition-colors"
                            title="Append to editor"
                          >
                            <span>Insert</span>
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
