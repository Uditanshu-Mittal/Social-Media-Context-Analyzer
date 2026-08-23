import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  FileCode, 
  Printer, 
  Share2,
  Sparkles
} from 'lucide-react';
import { ContentAnalysisResult } from '../types';

interface ExportModalProps {
  result: ContentAnalysisResult;
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  result,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [exportFormat, setExportFormat] = useState<'markdown' | 'json' | 'text'>('markdown');

  if (!isOpen) return null;

  const generateMarkdown = () => {
    return `# Social Media Content Audit Report
**Extracted At:** ${new Date(result.extractedAt).toLocaleString()}
**Source:** ${result.sourceType.toUpperCase()} ${result.sourceFileName ? `(${result.sourceFileName})` : ''}

---

## 🎯 Executive Summary
- **Overall Engagement Score:** ${result.engagement.overallScore}/100 (${result.engagement.tier})
- **Sentiment Polarity:** ${result.sentiment.category} (${result.sentiment.score > 0 ? `+${result.sentiment.score}` : result.sentiment.score})
- **Dominant Emotion:** ${result.sentiment.dominantEmotion}
- **Predicted Reach Multiplier:** ${result.engagement.predictedReachMultiplier}x
- **Estimated Save Rate:** ${result.engagement.estimatedSaveRate}%
- **Estimated Comment Rate:** ${result.engagement.estimatedCommentRate}%

---

## 📊 Key Text Metrics
- **Word Count:** ${result.stats.wordCount} words
- **Character Count:** ${result.stats.charCount} (${result.stats.charCountNoSpaces} no spaces)
- **Reading Time:** ~${result.stats.readingTimeSeconds} seconds
- **Readability Index:** ${result.stats.fleschReadingEase}/100 (${result.stats.readingLevel})
- **Paragraphs / Sentences:** ${result.stats.paragraphCount} paragraphs / ${result.stats.sentenceCount} sentences
- **Hashtags / Emojis:** ${result.stats.hashtagCount} hashtags / ${result.stats.emojiCount} emojis

---

## 💡 Algorithmic Subscores
- **3-Sec Hook Strength:** ${result.engagement.subscores.hookClarity}%
- **Call-To-Action (CTA):** ${result.engagement.subscores.ctaStrength}%
- **Scannability & Spacing:** ${result.engagement.subscores.readabilityScannability}%
- **Emotional Resonance:** ${result.engagement.subscores.emotionalResonance}%
- **Hashtag Optimization:** ${result.engagement.subscores.hashtagOptimization}%
- **Audience Interaction:** ${result.engagement.subscores.audienceInteraction}%

---

## 🚀 Prioritized Improvement Recommendations
${result.suggestions.map((s, i) => `### ${i + 1}. [${s.priority.toUpperCase()}] ${s.title}
- **Diagnosis:** ${s.issue}
- **Action:** ${s.recommendation}
${s.exampleAction ? `- **Suggested:** \`${s.exampleAction}\`` : ''}
`).join('\n')}

---

## 📝 Raw Analyzed Copy
\`\`\`
${result.rawText}
\`\`\`
`;
  };

  const generateFormattedText = () => {
    return `SOCIAL MEDIA CONTENT ANALYSIS REPORT
=====================================
Date: ${new Date(result.extractedAt).toLocaleString()}
Score: ${result.engagement.overallScore}/100 (${result.engagement.tier})
Sentiment: ${result.sentiment.category} (${result.sentiment.dominantEmotion})

TEXT STATISTICS:
- Words: ${result.stats.wordCount}
- Characters: ${result.stats.charCount}
- Reading Time: ${result.stats.readingTimeSeconds}s
- Readability: ${result.stats.readingLevel}

RECOMMENDED ACTIONS:
${result.suggestions.map((s, i) => `${i + 1}. [${s.priority}] ${s.title}\n   ${s.recommendation}`).join('\n\n')}

RAW COPY:
${result.rawText}
`;
  };

  const getExportContent = () => {
    if (exportFormat === 'json') {
      return JSON.stringify(result, null, 2);
    }
    if (exportFormat === 'text') {
      return generateFormattedText();
    }
    return generateMarkdown();
  };

  const handleDownload = () => {
    const content = getExportContent();
    const extension = exportFormat === 'json' ? 'json' : exportFormat === 'text' ? 'txt' : 'md';
    const mimeType = exportFormat === 'json' ? 'application/json' : 'text/plain';

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-content-audit-${Date.now()}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getExportContent());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Export Content Audit Report</h3>
              <p className="text-xs text-slate-500">Save detailed analytics and suggestions offline</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Switcher */}
        <div className="flex items-center gap-2 mb-4">
          <button
            type="button"
            onClick={() => setExportFormat('markdown')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              exportFormat === 'markdown'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Markdown (.md)</span>
          </button>

          <button
            type="button"
            onClick={() => setExportFormat('json')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              exportFormat === 'json'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileCode className="h-3.5 w-3.5" />
            <span>JSON (.json)</span>
          </button>

          <button
            type="button"
            onClick={() => setExportFormat('text')}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              exportFormat === 'text'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Plain Text (.txt)</span>
          </button>
        </div>

        {/* Content Preview */}
        <div className="relative">
          <pre className="max-h-72 overflow-y-auto rounded-2xl bg-slate-900 p-4 font-mono text-xs text-slate-200 leading-relaxed border border-slate-800">
            {getExportContent()}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Report</span>
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy to Clipboard</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
