import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { 
  UploadCloud, 
  FileText, 
  Image as ImageIcon, 
  FileCheck, 
  AlertCircle, 
  Type, 
  Zap, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { SAMPLE_POSTS } from '../utils/samplePosts';

interface DropzoneAreaProps {
  onFileSelected: (file: File) => void;
  onDirectTextSubmit: (text: string) => void;
  disabled?: boolean;
}

export const DropzoneArea: React.FC<DropzoneAreaProps> = ({
  onFileSelected,
  onDirectTextSubmit,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      setErrorMessage(null);
      if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setErrorMessage('File size exceeds the 15MB maximum limit.');
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setErrorMessage('Invalid file format. Please upload a PDF, JPG, JPEG, or PNG file.');
        } else {
          setErrorMessage(rejection.errors[0]?.message || 'Failed to upload file.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onFileSelected(file);
      }
    },
    [onFileSelected]
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize: 15 * 1024 * 1024, // 15MB
    multiple: false,
    disabled,
  } as any);

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) {
      setErrorMessage('Please enter or paste some social media copy to analyze.');
      return;
    }
    setErrorMessage(null);
    onDirectTextSubmit(pastedText.trim());
  };

  return (
    <div id="dropzone-section" className="mx-auto max-w-4xl px-4 sm:px-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
        {/* Navigation Tabs (Upload vs Paste) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <UploadCloud className="h-4 w-4" />
              <span>Upload Document / Image</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('paste');
                setErrorMessage(null);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              <Type className="h-4 w-4" />
              <span>Direct Text Input</span>
            </button>
          </div>

          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <FileCheck className="h-3.5 w-3.5 text-indigo-600" />
            PDF, JPG, PNG supported
          </span>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/90 p-3.5 text-xs sm:text-sm font-medium text-rose-800 animate-in fade-in">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Upload Mode */}
        {activeTab === 'upload' ? (
          <div>
            <div
              {...getRootProps()}
              className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer shadow-inner bg-gradient-to-br from-white to-indigo-50/30 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDragActive && !isDragReject
                  ? 'border-indigo-500 bg-indigo-50/60 ring-4 ring-indigo-500/10'
                  : isDragReject
                  ? 'border-rose-500 bg-rose-50/50'
                  : 'border-indigo-200 hover:border-indigo-400'
              }`}
            >
              <input {...getInputProps()} />

              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-slate-800">
                  {isDragActive ? 'Drop your post assets here...' : 'Drop your post assets here'}
                </p>
                <p className="text-xs text-slate-400 mt-1">Supports PDF, JPG, PNG up to 15MB</p>
              </div>

              <button
                type="button"
                className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all pointer-events-none"
              >
                Select Files
              </button>

              {/* Supported Format Badges */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 border border-red-100">
                  <FileText className="h-3 w-3" /> PDF
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 border border-blue-100">
                  <ImageIcon className="h-3 w-3" /> JPG / JPEG
                </span>
                <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 border border-emerald-100">
                  <ImageIcon className="h-3 w-3" /> PNG
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Direct Text Mode */
          <form onSubmit={handlePasteSubmit} className="space-y-4">
            <div>
              <label htmlFor="pasted-text-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Paste or write your social media copy:
              </label>
              <textarea
                id="pasted-text-input"
                rows={6}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your Twitter post, LinkedIn update, Instagram caption, or marketing copy here..."
                className="w-full rounded-xl border border-slate-200 p-4 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                <span>{pastedText.length} characters</span>
                <span>•</span>
                <span>{pastedText.trim() ? pastedText.trim().split(/\s+/).length : 0} words</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPastedText(SAMPLE_POSTS[0].content)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Load Sample Copy
                </button>
                <button
                  type="submit"
                  disabled={!pastedText.trim() || disabled}
                  className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-5 py-2 text-xs sm:text-sm font-semibold text-white shadow-md shadow-indigo-200 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <span>Analyze Content</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
