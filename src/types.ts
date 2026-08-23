export type SentimentCategory = 'Positive' | 'Neutral' | 'Negative';

export interface SentimentAnalysis {
  category: SentimentCategory;
  score: number; // -100 to +100
  positiveRatio: number; // 0 to 1
  negativeRatio: number; // 0 to 1
  neutralRatio: number; // 0 to 1
  dominantEmotion: string;
  emotionalTones: { label: string; score: number }[];
  highlightWords: {
    positive: string[];
    negative: string[];
    powerWords: string[];
  };
}

export interface EngagementSubscores {
  hookClarity: number; // 0-100 (strength of opening line)
  ctaStrength: number; // 0-100 (presence of clear Call-to-Action)
  emotionalResonance: number; // 0-100 (emotional engagement & tone)
  readabilityScannability: number; // 0-100 (spacing, sentence length, ease)
  hashtagOptimization: number; // 0-100 (density and count)
  audienceInteraction: number; // 0-100 (questions, community prompts)
}

export interface EngagementMetrics {
  overallScore: number; // 0-100
  tier: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
  summary: string;
  subscores: EngagementSubscores;
  predictedReachMultiplier: number; // e.g. 1.8x
  estimatedSaveRate: number; // % estimate
  estimatedCommentRate: number; // % estimate
}

export interface TextStatistics {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  avgWordLength: number;
  avgSentenceLength: number;
  fleschReadingEase: number;
  readingLevel: string;
  emojiCount: number;
  emojisFound: string[];
  hashtagCount: number;
  hashtagsFound: string[];
  mentionCount: number;
  mentionsFound: string[];
  questionCount: number;
  urlCount: number;
}

export interface ImprovementSuggestion {
  id: string;
  category: 'hook' | 'cta' | 'format' | 'hashtags' | 'engagement' | 'tone' | 'length';
  priority: 'high' | 'medium' | 'growth-tip';
  title: string;
  issue: string;
  recommendation: string;
  exampleAction?: string;
  suggestedText?: string;
}

export interface PlatformPreview {
  platform: 'twitter' | 'linkedin' | 'instagram' | 'facebook';
  name: string;
  maxChars: number;
  status: 'optimal' | 'warning' | 'exceeded';
  charUsagePercent: number;
  threadCount?: number;
  tips: string[];
  optimizedVariant: string;
}

export interface ContentAnalysisResult {
  rawText: string;
  sourceType: 'pdf' | 'image' | 'text' | 'sample';
  sourceFileName?: string;
  sourceFileSize?: number;
  extractedAt: string;
  sentiment: SentimentAnalysis;
  engagement: EngagementMetrics;
  stats: TextStatistics;
  suggestions: ImprovementSuggestion[];
  platformPreviews: Record<string, PlatformPreview>;
  topKeywords: { word: string; count: number }[];
}

export type ExtractionStatus = 'idle' | 'uploading' | 'parsing_pdf' | 'ocr_processing' | 'analyzing' | 'complete' | 'error';

export interface ExtractionProgressState {
  status: ExtractionStatus;
  progress: number; // 0 - 100
  statusMessage: string;
  detailMessage?: string;
  error?: string;
}

export interface SamplePost {
  id: string;
  title: string;
  platform: string;
  type: 'Launch' | 'Thought Leadership' | 'Story' | 'Carousel / Infographic' | 'Short Hook';
  content: string;
  description: string;
}
