import React from 'react';
import { motion } from 'motion/react';
import { Loader2, ScanText, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { ExtractionProgressState } from '../types';

interface ExtractionProgressProps {
  progressState: ExtractionProgressState;
  fileName?: string;
  onCancel?: () => void;
}

export const ExtractionProgress: React.FC<ExtractionProgressProps> = ({
  progressState,
  fileName,
}) => {
  const isOCR = progressState.status === 'ocr_processing';
  const isPDF = progressState.status === 'parsing_pdf';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-3xl border border-indigo-100 bg-white p-6 sm:p-8 shadow-lg text-center"
      >
        {/* Animated Scanner Radar / Spinner Icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 rounded-2xl border-2 border-indigo-400/30 border-t-indigo-600"
          />
          {isOCR ? (
            <ScanText className="h-9 w-9 text-indigo-600 animate-pulse" />
          ) : isPDF ? (
            <FileText className="h-9 w-9 text-indigo-600 animate-pulse" />
          ) : (
            <Sparkles className="h-9 w-9 text-indigo-600 animate-pulse" />
          )}
        </div>

        {/* Status Headings */}
        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          {progressState.statusMessage || 'Processing Content...'}
        </h3>

        {fileName && (
          <p className="mt-1 text-xs text-slate-500 font-medium truncate max-w-sm mx-auto">
            Target: <span className="font-semibold text-slate-700">{fileName}</span>
          </p>
        )}

        {progressState.detailMessage && (
          <p className="mt-2 text-xs text-slate-600">
            {progressState.detailMessage}
          </p>
        )}

        {/* Progress Bar Container */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>
              {isOCR ? 'Tesseract OCR Recognition' : isPDF ? 'PDF Stream Extraction' : 'NLP Diagnostics'}
            </span>
            <span className="text-indigo-600 font-bold">{progressState.progress}%</span>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5 border border-slate-200">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(5, progressState.progress)}%` }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-cyan-500 shadow-xs"
            />
          </div>
        </div>

        {/* Phase checklist */}
        <div className="mt-6 grid grid-cols-3 gap-2 border-t border-slate-100 pt-5 text-[11px] font-medium text-slate-500">
          <div className={`flex items-center justify-center gap-1 ${progressState.progress >= 20 ? 'text-indigo-600 font-semibold' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>1. Ingestion</span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${progressState.progress >= 60 ? 'text-indigo-600 font-semibold' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>2. Text Extract</span>
          </div>
          <div className={`flex items-center justify-center gap-1 ${progressState.progress >= 95 ? 'text-indigo-600 font-semibold' : ''}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>3. Diagnostics</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
