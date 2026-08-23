import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  AlignLeft, 
  Hash, 
  MessageSquarePlus, 
  Trash2,
  FileCode2,
  Image as ImageIcon
} from 'lucide-react';
import { ContentAnalysisResult } from '../types';

interface RawTextEditorProps {
  initialText: string;
  sourceType: 'pdf' | 'image' | 'text' | 'sample';
  sourceFileName?: string;
  sourceFileSize?: number;
  onUpdateText: (newText: string) => void;
}

export const RawTextEditor: React.FC<RawTextEditorProps> = ({
  initialText,
  sourceType,
  sourceFileName,
  sourceFileSize,
  onUpdateText,
}) => {
  const [text, setText] = useState(initialText);
  const [copied, setCopied] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setText(initialText);
    setHasChanges(false);
  }, [initialText]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setHasChanges(val !== initialText);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleApplyChanges = () => {
    onUpdateText(text);
    setHasChanges(false);
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Quick Formatting Helpers
  const addLineBreaks = () => {
    const spaced = text
      .split(/(?<=[.!?])\s+/)
      .filter(s => s.trim())
      .join('\n\n');
    setText(spaced);
    setHasChanges(true);
  };

  const addQuestionCTA = () => {
    const updated = text.trim() + '\n\n💬 What are your thoughts on this? Drop a comment below 👇';
    setText(updated);
    setHasChanges(true);
  };

  const addHashtagCluster = () => {
    const updated = text.trim() + '\n\n#ContentStrategy #Growth #SocialMediaMarketing #SaaS #CreatorEconomy';
    setText(updated);
    setHasChanges(true);
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Header bar with Source Info and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            {sourceType === 'pdf' ? (
              <FileText className="h-4 w-4 text-red-600" />
            ) : sourceType === 'image' ? (
              <ImageIcon className="h-4 w-4 text-blue-600" />
            ) : (
              <FileCode2 className="h-4 w-4 text-indigo-600" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                OCR Extracted Text & Live Editor
              </h3>
              <span className="px-2 py-0.5 bg-green-500/20 text-green-700 rounded text-[10px] font-bold uppercase tracking-wider">
                VERIFIED
              </span>
            </div>
            {sourceFileName && (
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs">
                {sourceFileName} {sourceFileSize ? `(${formatFileSize(sourceFileSize)})` : ''}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
            title="Copy extracted text to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Text</span>
              </>
            )}
          </button>

          {hasChanges && (
            <button
              type="button"
              onClick={handleApplyChanges}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all animate-in fade-in"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Re-Analyze Edits</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Formatting Tools */}
      <div className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
        <span className="text-slate-400 font-medium mr-1">Quick Tools:</span>
        <button
          type="button"
          onClick={addLineBreaks}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 font-medium text-slate-700 transition-colors"
        >
          <AlignLeft className="h-3 w-3" />
          <span>Double-Space Sentences</span>
        </button>
        <button
          type="button"
          onClick={addQuestionCTA}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 font-medium text-slate-700 transition-colors"
        >
          <MessageSquarePlus className="h-3 w-3" />
          <span>Add Discussion CTA</span>
        </button>
        <button
          type="button"
          onClick={addHashtagCluster}
          className="inline-flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 font-medium text-slate-700 transition-colors"
        >
          <Hash className="h-3 w-3" />
          <span>Add 5 Hashtags</span>
        </button>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          rows={7}
          value={text}
          onChange={handleChange}
          placeholder="Extracted copy will appear here for live review and editing..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-4 font-mono text-xs sm:text-sm text-slate-800 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y leading-relaxed"
        />
      </div>

      {/* Live metadata summary bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <span>{text.length} chars</span>
          <span>•</span>
          <span>{text.trim() ? text.trim().split(/\s+/).length : 0} words</span>
          <span>•</span>
          <span>{text.split('\n').filter(l => l.trim()).length} lines</span>
        </div>

        {hasChanges && (
          <span className="text-amber-600 font-semibold flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
            Unsaved changes — Click "Re-Analyze Edits" above
          </span>
        )}
      </div>
    </div>
  );
};
