import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Navbar } from './components/Navbar';
import { HeroLanding } from './components/HeroLanding';
import { DropzoneArea } from './components/DropzoneArea';
import { ExtractionProgress } from './components/ExtractionProgress';
import { RawTextEditor } from './components/RawTextEditor';
import { EngagementGauge } from './components/EngagementGauge';
import { SentimentCard } from './components/SentimentCard';
import { StatsGrid } from './components/StatsGrid';
import { SuggestionsList } from './components/SuggestionsList';
import { PlatformSimulator } from './components/PlatformSimulator';
import { ExportModal } from './components/ExportModal';
import { Footer } from './components/Footer';

import { 
  ContentAnalysisResult, 
  ExtractionProgressState, 
  SamplePost 
} from './types';
import { analyzeSocialContent } from './utils/nlpAnalyzer';
import { extractTextFromPDF } from './utils/pdfExtractor';
import { extractTextFromImage } from './utils/ocrExtractor';
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  ArrowUpRight, 
  AlertCircle,
  FileCheck2,
  Check
} from 'lucide-react';

export default function App() {
  const [result, setResult] = useState<ContentAnalysisResult | null>(null);
  const [progressState, setProgressState] = useState<ExtractionProgressState>({
    status: 'idle',
    progress: 0,
    statusMessage: '',
  });
  const [currentFileName, setCurrentFileName] = useState<string | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#38bdf8', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleFileSelected = async (file: File) => {
    setErrorMessage(null);
    setCurrentFileName(file.name);

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png)$/i.test(file.name);

    try {
      if (isPdf) {
        setProgressState({
          status: 'parsing_pdf',
          progress: 10,
          statusMessage: 'Reading PDF document structure...',
        });

        const extractedText = await extractTextFromPDF(file, (p) => {
          setProgressState({
            status: 'parsing_pdf',
            progress: p.percent,
            statusMessage: p.message,
            detailMessage: `Page ${p.currentPage} of ${p.totalPages}`,
          });
        });

        setProgressState({
          status: 'analyzing',
          progress: 95,
          statusMessage: 'Running linguistic & engagement diagnostics...',
        });

        const analysis = analyzeSocialContent(extractedText, 'pdf', file.name, file.size);
        setResult(analysis);
        setProgressState({ status: 'complete', progress: 100, statusMessage: 'Done' });

        if (analysis.engagement.overallScore >= 80) {
          triggerCelebration();
        }

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else if (isImage) {
        setProgressState({
          status: 'ocr_processing',
          progress: 10,
          statusMessage: 'Initializing Tesseract OCR Engine...',
        });

        const extractedText = await extractTextFromImage(file, (p) => {
          setProgressState({
            status: 'ocr_processing',
            progress: p.percent,
            statusMessage: p.message,
          });
        });

        setProgressState({
          status: 'analyzing',
          progress: 95,
          statusMessage: 'Running linguistic & engagement diagnostics...',
        });

        const analysis = analyzeSocialContent(extractedText, 'image', file.name, file.size);
        setResult(analysis);
        setProgressState({ status: 'complete', progress: 100, statusMessage: 'Done' });

        if (analysis.engagement.overallScore >= 80) {
          triggerCelebration();
        }

        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, JPG, JPEG, or PNG file.');
      }
    } catch (err: any) {
      console.error('Extraction failed:', err);
      setErrorMessage(err?.message || 'Failed to extract text from file.');
      setProgressState({ status: 'error', progress: 0, statusMessage: '' });
    }
  };

  const handleDirectTextSubmit = (text: string) => {
    setErrorMessage(null);
    setCurrentFileName(undefined);
    setProgressState({
      status: 'analyzing',
      progress: 90,
      statusMessage: 'Analyzing copy...',
    });

    const analysis = analyzeSocialContent(text, 'text');
    setResult(analysis);
    setProgressState({ status: 'complete', progress: 100, statusMessage: 'Done' });

    if (analysis.engagement.overallScore >= 80) {
      triggerCelebration();
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleSelectSample = (sample: SamplePost) => {
    setErrorMessage(null);
    setCurrentFileName(`Sample: ${sample.title}`);
    const analysis = analyzeSocialContent(sample.content, 'sample', sample.title);
    setResult(analysis);
    setProgressState({ status: 'complete', progress: 100, statusMessage: 'Done' });

    if (analysis.engagement.overallScore >= 80) {
      triggerCelebration();
    }

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  const handleUpdateText = (newText: string) => {
    if (!result) return;
    const updated = analyzeSocialContent(
      newText,
      result.sourceType,
      result.sourceFileName,
      result.sourceFileSize
    );
    setResult(updated);
  };

  const handleApplySuggestion = (exampleText: string) => {
    if (!result) return;
    const updatedText = result.rawText.trim() + '\n\n' + exampleText;
    handleUpdateText(updatedText);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setProgressState({ status: 'idle', progress: 0, statusMessage: '' });
    setErrorMessage(null);
    setCurrentFileName(undefined);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToDropzone = () => {
    dropzoneRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToEditor = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onNewAnalysis={handleNewAnalysis}
        hasActiveResult={!!result}
        onScrollToAnalyzer={scrollToDropzone}
      />

      {/* Main Container */}
      <main className="space-y-10 pb-16">
        {/* Landing Hero Section */}
        <HeroLanding
          onSelectSample={handleSelectSample}
          onScrollToDropzone={scrollToDropzone}
        />

        {/* Upload & Dropzone Area */}
        <div ref={dropzoneRef}>
          <DropzoneArea
            onFileSelected={handleFileSelected}
            onDirectTextSubmit={handleDirectTextSubmit}
            disabled={progressState.status === 'ocr_processing' || progressState.status === 'parsing_pdf'}
          />
        </div>

        {/* Processing & Extraction Progress View */}
        {(progressState.status === 'ocr_processing' || progressState.status === 'parsing_pdf') && (
          <ExtractionProgress
            progressState={progressState}
            fileName={currentFileName}
          />
        )}

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800 shadow-xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <div className="flex-1">
                <strong className="font-semibold">Extraction Warning:</strong> {errorMessage}
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* RESULTS DASHBOARD VIEW */}
        {result && (
          <div ref={resultsRef} className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 pt-4">
            {/* Dashboard Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    Content Intelligence Report
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Extracted via {result.sourceType.toUpperCase()} · Live diagnostic matrix generated
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 active:scale-95 transition-all"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleNewAnalysis}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 active:scale-95 transition-all"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Analyze Another</span>
                </button>
              </div>
            </div>

            {/* Extracted Text Editor */}
            <RawTextEditor
              initialText={result.rawText}
              sourceType={result.sourceType}
              sourceFileName={result.sourceFileName}
              sourceFileSize={result.sourceFileSize}
              onUpdateText={handleUpdateText}
            />

            {/* Top Score Matrix: Engagement Radial Gauge + Sentiment & Tone Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <EngagementGauge engagement={result.engagement} />
              <SentimentCard sentiment={result.sentiment} />
            </div>

            {/* Detailed Linguistics & Quantitative Text Statistics */}
            <StatsGrid stats={result.stats} />

            {/* Actionable Social Media Improvement Plan */}
            <SuggestionsList
              suggestions={result.suggestions}
              onApplySuggestion={handleApplySuggestion}
            />

            {/* Multi-Platform Feed Simulator (X, LinkedIn, Instagram, Facebook) */}
            <PlatformSimulator
              platformPreviews={result.platformPreviews}
              rawText={result.rawText}
            />
          </div>
        )}
      </main>

      {/* Export Report Modal */}
      {result && (
        <ExportModal
          result={result}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}
