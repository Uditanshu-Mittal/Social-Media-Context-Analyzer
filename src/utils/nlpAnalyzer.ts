import {
  ContentAnalysisResult,
  EngagementMetrics,
  EngagementSubscores,
  ImprovementSuggestion,
  PlatformPreview,
  SentimentAnalysis,
  TextStatistics,
} from '../types';

// Lexicons for Sentiment and Tone
const POSITIVE_WORDS = new Set([
  'great', 'excellent', 'amazing', 'superb', 'outstanding', 'awesome', 'brilliant',
  'growth', 'win', 'winning', 'success', 'succeed', 'successful', 'thrive', 'profit',
  'breakthrough', 'innovative', 'revolution', 'transform', 'elevate', 'master',
  'love', 'loved', 'loving', 'best', 'incredible', 'boost', 'accelerate', 'proven',
  'inspire', 'inspiration', 'insightful', 'valuable', 'gamechanger', 'proud',
  'excited', 'exciting', 'empower', 'opportunity', 'unlocked', 'unlock', 'solution',
  'celebrate', 'milestone', 'delight', 'benefit', 'effective', 'efficient', 'genius',
  'champion', 'leader', 'mastery', 'exceptional', 'flawless', 'rewarding', 'scale'
]);

const NEGATIVE_WORDS = new Set([
  'bad', 'terrible', 'awful', 'worst', 'poor', 'fail', 'failure', 'failing',
  'crisis', 'struggle', 'struggling', 'problem', 'risk', 'danger', 'drop',
  'crash', 'lose', 'loss', 'lost', 'waste', 'wasting', 'regret', 'mistake',
  'dead', 'broken', 'disaster', 'flaw', 'harm', 'pain', 'frustrate', 'frustrated',
  'burnout', 'exhausted', 'trap', 'annoying', 'boring', 'weak', 'inferior',
  'scam', 'fraud', 'toxic', 'decline', 'suffer', 'warning', 'damage', 'chaos'
]);

const POWER_WORDS = new Set([
  'secret', 'framework', 'blueprint', 'ultimate', 'guide', 'hack', 'strategy',
  'tactics', 'step-by-step', 'proven', 'insider', 'free', 'exclusive',
  'critical', 'essential', 'masterclass', 'unpopular', 'truth', 'revealed',
  'mistake', 'transform', 'accelerate', 'exponential', 'roi', 'actionable'
]);

const POSITIVE_EMOJIS = ['🔥', '🚀', '💡', '✨', '👏', '🎉', '💪', '📈', '🙌', '💯', '❤️', '🌟', '🎯', '✅', '🏆'];
const NEGATIVE_EMOJIS = ['❌', '⚠️', '💔', '📉', '😡', '😢', '🤦‍♂️', '🤦‍♀️', '🚨', '👎', '💀', '🛑'];

const CTA_PHRASES = [
  'comment below', 'drop a comment', 'let me know', 'share your thoughts',
  'link in bio', 'link in comments', 'click the link', 'save this',
  'bookmark this', 'repost this', 'retweet', 'share with', 'swipe left',
  'dm me', 'send a message', 'follow for more', 'subscribe', 'join us',
  'sign up', 'register now', 'what do you think', 'tag a friend', 'tap the bell'
];

export function analyzeSocialContent(
  text: string,
  sourceType: 'pdf' | 'image' | 'text' | 'sample' = 'text',
  sourceFileName?: string,
  sourceFileSize?: number
): ContentAnalysisResult {
  const cleanText = text.trim();
  const stats = calculateStatistics(cleanText);
  const sentiment = calculateSentiment(cleanText, stats);
  const engagement = calculateEngagement(cleanText, stats, sentiment);
  const suggestions = generateSuggestions(cleanText, stats, sentiment, engagement);
  const platformPreviews = generatePlatformPreviews(cleanText, stats);
  const topKeywords = extractTopKeywords(cleanText);

  return {
    rawText: cleanText,
    sourceType,
    sourceFileName,
    sourceFileSize,
    extractedAt: new Date().toISOString(),
    sentiment,
    engagement,
    stats,
    suggestions,
    platformPreviews,
    topKeywords,
  };
}

function calculateStatistics(text: string): TextStatistics {
  if (!text) {
    return {
      wordCount: 0,
      charCount: 0,
      charCountNoSpaces: 0,
      sentenceCount: 0,
      paragraphCount: 0,
      readingTimeSeconds: 0,
      speakingTimeSeconds: 0,
      avgWordLength: 0,
      avgSentenceLength: 0,
      fleschReadingEase: 100,
      readingLevel: 'Very Easy',
      emojiCount: 0,
      emojisFound: [],
      hashtagCount: 0,
      hashtagsFound: [],
      mentionCount: 0,
      mentionsFound: [],
      questionCount: 0,
      urlCount: 0,
    };
  }

  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s+/g, '').length;

  // Words extraction
  const rawWords = text.match(/[\w'-]+/g) || [];
  const words = rawWords.filter(w => !w.startsWith('#') && !w.startsWith('@') && w.length > 0);
  const wordCount = rawWords.length;

  // Sentences extraction (. ! ? or newline as boundary)
  const sentences = text
    .split(/(?<=[.!?])\s+|\n{2,}/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
  const sentenceCount = Math.max(sentences.length, 1);

  // Paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map(p => p.trim())
    .filter(p => p.length > 0);
  const paragraphCount = Math.max(paragraphs.length, 1);

  // Reading time based on 220 words per minute
  const readingTimeSeconds = Math.max(1, Math.round((wordCount / 220) * 60));
  const speakingTimeSeconds = Math.max(1, Math.round((wordCount / 135) * 60));

  // Averages
  const totalWordLengths = words.reduce((acc, w) => acc + w.length, 0);
  const avgWordLength = words.length > 0 ? Number((totalWordLengths / words.length).toFixed(1)) : 0;
  const avgSentenceLength = sentenceCount > 0 ? Number((wordCount / sentenceCount).toFixed(1)) : 0;

  // Emojis regex
  const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/gu;
  const emojisFound = Array.from(text.match(emojiRegex) || []);
  const emojiCount = emojisFound.length;

  // Hashtags
  const hashtagRegex = /#([a-zA-Z0-9_\u00c0-\u00ff]+)/g;
  const hashtagMatches = Array.from(text.matchAll(hashtagRegex));
  const hashtagsFound = Array.from(new Set(hashtagMatches.map(m => m[0])));
  const hashtagCount = hashtagMatches.length;

  // Mentions
  const mentionRegex = /@([a-zA-Z0-9_]+)/g;
  const mentionMatches = Array.from(text.matchAll(mentionRegex));
  const mentionsFound = Array.from(new Set(mentionMatches.map(m => m[0])));
  const mentionCount = mentionMatches.length;

  // Questions
  const questionCount = (text.match(/\?/g) || []).length;

  // URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urlCount = (text.match(urlRegex) || []).length;

  // Flesch Reading Ease calculation
  // 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  const syllables = countTotalSyllables(words);
  let flesch = 206.835 - 1.015 * (wordCount / sentenceCount) - 84.6 * (syllables / Math.max(wordCount, 1));
  flesch = Math.min(100, Math.max(0, Math.round(flesch)));

  let readingLevel = 'Standard';
  if (flesch >= 90) readingLevel = 'Very Easy (5th Grade)';
  else if (flesch >= 80) readingLevel = 'Easy (6th Grade)';
  else if (flesch >= 70) readingLevel = 'Fairly Easy (7th Grade)';
  else if (flesch >= 60) readingLevel = 'Standard / Conversational';
  else if (flesch >= 50) readingLevel = 'Fairly Difficult (High School)';
  else if (flesch >= 30) readingLevel = 'Difficult (College)';
  else readingLevel = 'Very Confusing / Academic';

  return {
    wordCount,
    charCount,
    charCountNoSpaces,
    sentenceCount,
    paragraphCount,
    readingTimeSeconds,
    speakingTimeSeconds,
    avgWordLength,
    avgSentenceLength,
    fleschReadingEase: flesch,
    readingLevel,
    emojiCount,
    emojisFound,
    hashtagCount,
    hashtagsFound,
    mentionCount,
    mentionsFound,
    questionCount,
    urlCount,
  };
}

function countTotalSyllables(words: string[]): number {
  return words.reduce((acc, word) => {
    return acc + countWordSyllables(word.toLowerCase());
  }, 0);
}

function countWordSyllables(word: string): number {
  const clean = word.replace(/[^a-z]/g, '');
  if (!clean || clean.length <= 2) return 1;
  const matches = clean.match(/[aeiouy]{1,2}/g);
  let count = matches ? matches.length : 1;
  if (clean.endsWith('e') && !clean.endsWith('le') && count > 1) {
    count--;
  }
  return Math.max(1, count);
}

function calculateSentiment(text: string, stats: TextStatistics): SentimentAnalysis {
  const lower = text.toLowerCase();
  const words = lower.match(/[a-z'-]+/g) || [];

  const foundPositives: string[] = [];
  const foundNegatives: string[] = [];
  const foundPowerWords: string[] = [];

  let posScore = 0;
  let negScore = 0;

  for (const word of words) {
    if (POSITIVE_WORDS.has(word)) {
      posScore += 1.5;
      foundPositives.push(word);
    }
    if (NEGATIVE_WORDS.has(word)) {
      negScore += 1.5;
      foundNegatives.push(word);
    }
    if (POWER_WORDS.has(word)) {
      foundPowerWords.push(word);
      posScore += 0.8;
    }
  }

  // Emoji influence
  for (const emoji of stats.emojisFound) {
    if (POSITIVE_EMOJIS.includes(emoji)) posScore += 2;
    if (NEGATIVE_EMOJIS.includes(emoji)) negScore += 2;
  }

  const totalEvaluated = posScore + negScore + Math.max(words.length * 0.1, 1);
  const positiveRatio = Math.min(1, Number((posScore / totalEvaluated).toFixed(2)));
  const negativeRatio = Math.min(1, Number((negScore / totalEvaluated).toFixed(2)));
  const neutralRatio = Math.max(0, Number((1 - (positiveRatio + negativeRatio)).toFixed(2)));

  // Score from -100 to +100
  let rawScore = 0;
  if (posScore + negScore > 0) {
    rawScore = Math.round(((posScore - negScore) / (posScore + negScore + 2)) * 100);
  }

  let category: 'Positive' | 'Neutral' | 'Negative' = 'Neutral';
  if (rawScore >= 18) category = 'Positive';
  else if (rawScore <= -18) category = 'Negative';

  // Dominant emotion & breakdown
  let dominantEmotion = 'Informational & Balanced';
  const tones = [
    { label: 'Optimistic & Inspiring', score: Math.min(100, Math.round(positiveRatio * 130 + (foundPowerWords.length > 0 ? 25 : 0))) },
    { label: 'Action-Oriented / Urgent', score: Math.min(100, Math.round((foundPowerWords.length * 18) + (stats.questionCount * 12))) },
    { label: 'Conversational & Casual', score: Math.min(100, Math.round((stats.emojiCount * 12) + (stats.questionCount * 15) + 30)) },
    { label: 'Analytical & Direct', score: Math.min(100, Math.round((stats.fleschReadingEase > 60 ? 70 : 40) + (stats.avgSentenceLength > 15 ? 20 : 0))) },
    { label: 'Problem-Solving / Critical', score: Math.min(100, Math.round(negativeRatio * 140)) },
  ];

  if (category === 'Positive') {
    dominantEmotion = foundPowerWords.length > 1 ? 'High-Energy & Motivating' : 'Warm & Encouraging';
  } else if (category === 'Negative') {
    dominantEmotion = 'Problem Awareness & Urgent';
  } else {
    dominantEmotion = stats.questionCount > 0 ? 'Inquisitive & Engaging' : 'Clear & Informative';
  }

  return {
    category,
    score: rawScore,
    positiveRatio,
    negativeRatio,
    neutralRatio,
    dominantEmotion,
    emotionalTones: tones,
    highlightWords: {
      positive: Array.from(new Set(foundPositives)).slice(0, 8),
      negative: Array.from(new Set(foundNegatives)).slice(0, 8),
      powerWords: Array.from(new Set(foundPowerWords)).slice(0, 8),
    },
  };
}

function calculateEngagement(
  text: string,
  stats: TextStatistics,
  sentiment: SentimentAnalysis
): EngagementMetrics {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const firstLine = lines[0] || '';

  // 1. Hook Score (0-100)
  let hookClarity = 45;
  const firstLineWords = firstLine.split(/\s+/).length;
  if (firstLineWords >= 4 && firstLineWords <= 16) hookClarity += 20; // Sweet spot for hook length
  if (/\?/.test(firstLine)) hookClarity += 15; // Question hook
  if (/\d+/.test(firstLine)) hookClarity += 15; // Numbers in hook ("7 ways...", "In 30 days...")
  if (Array.from(POWER_WORDS).some(pw => firstLine.toLowerCase().includes(pw))) hookClarity += 15;
  if (lines.length > 1 && lines[0].length < 100) hookClarity += 10; // First line isolated
  hookClarity = Math.min(100, Math.max(10, hookClarity));

  // 2. CTA Strength (0-100)
  let ctaStrength = 20;
  const lowerText = text.toLowerCase();
  const hasExplicitCTA = CTA_PHRASES.some(phrase => lowerText.includes(phrase));
  if (hasExplicitCTA) ctaStrength += 55;
  if (stats.questionCount >= 1) ctaStrength += 20;
  if (stats.urlCount >= 1) ctaStrength += 15;
  ctaStrength = Math.min(100, Math.max(15, ctaStrength));

  // 3. Emotional Resonance (0-100)
  let emotionalResonance = 40;
  if (sentiment.score > 20 || sentiment.score < -20) emotionalResonance += 25;
  if (stats.emojiCount >= 1 && stats.emojiCount <= 6) emotionalResonance += 20;
  if (sentiment.highlightWords.powerWords.length > 0) emotionalResonance += 15;
  emotionalResonance = Math.min(100, Math.max(20, emotionalResonance));

  // 4. Readability & Scannability (0-100)
  let readabilityScannability = 50;
  if (stats.paragraphCount >= 2) readabilityScannability += 20;
  if (stats.avgSentenceLength <= 18) readabilityScannability += 15;
  if (stats.fleschReadingEase >= 60) readabilityScannability += 15;
  // Penalty for giant continuous text wall
  if (stats.wordCount > 60 && stats.paragraphCount === 1) readabilityScannability -= 30;
  readabilityScannability = Math.min(100, Math.max(15, readabilityScannability));

  // 5. Hashtag Optimization (0-100)
  let hashtagOptimization = 50;
  if (stats.hashtagCount >= 2 && stats.hashtagCount <= 5) hashtagOptimization = 95;
  else if (stats.hashtagCount === 1) hashtagOptimization = 75;
  else if (stats.hashtagCount > 5 && stats.hashtagCount <= 10) hashtagOptimization = 70;
  else if (stats.hashtagCount > 10) hashtagOptimization = 40; // Keyword stuffing penalty
  else if (stats.hashtagCount === 0) hashtagOptimization = 45; // Missing hashtags

  // 6. Audience Interaction (0-100)
  let audienceInteraction = 30;
  if (stats.questionCount >= 1) audienceInteraction += 40;
  if (stats.mentionCount >= 1) audienceInteraction += 15;
  if (lowerText.includes('you') || lowerText.includes('your')) audienceInteraction += 15;
  audienceInteraction = Math.min(100, Math.max(15, audienceInteraction));

  // Weighted Overall Score calculation
  const overall = Math.round(
    hookClarity * 0.25 +
    ctaStrength * 0.20 +
    readabilityScannability * 0.20 +
    emotionalResonance * 0.15 +
    hashtagOptimization * 0.10 +
    audienceInteraction * 0.10
  );

  const subscores: EngagementSubscores = {
    hookClarity,
    ctaStrength,
    emotionalResonance,
    readabilityScannability,
    hashtagOptimization,
    audienceInteraction,
  };

  let tier: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement' = 'Average';
  let summary = '';
  let reachMult = 1.0;
  let saveRate = 2.5;
  let commentRate = 1.8;

  if (overall >= 85) {
    tier = 'Excellent';
    summary = 'Top 5% social copy. Outstanding hook, strong formatting, clear engagement triggers.';
    reachMult = 2.4;
    saveRate = 7.8;
    commentRate = 5.6;
  } else if (overall >= 70) {
    tier = 'Good';
    summary = 'Strong content baseline with solid clarity. A few minor tweaks will drive peak viral reach.';
    reachMult = 1.6;
    saveRate = 4.5;
    commentRate = 3.2;
  } else if (overall >= 50) {
    tier = 'Average';
    summary = 'Decent readability, but lacks an arresting opening hook or decisive call-to-action.';
    reachMult = 1.1;
    saveRate = 2.1;
    commentRate = 1.4;
  } else {
    tier = 'Needs Improvement';
    summary = 'High cognitive load or weak conversion signals. Apply recommended structural updates below.';
    reachMult = 0.7;
    saveRate = 0.8;
    commentRate = 0.5;
  }

  return {
    overallScore: overall,
    tier,
    summary,
    subscores,
    predictedReachMultiplier: reachMult,
    estimatedSaveRate: saveRate,
    estimatedCommentRate: commentRate,
  };
}

function generateSuggestions(
  text: string,
  stats: TextStatistics,
  sentiment: SentimentAnalysis,
  engagement: EngagementMetrics
): ImprovementSuggestion[] {
  const suggestions: ImprovementSuggestion[] = [];
  const lower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const firstLine = lines[0] || '';

  // 1. Hook Optimization
  if (engagement.subscores.hookClarity < 70) {
    suggestions.push({
      id: 'sug-hook',
      category: 'hook',
      priority: 'high',
      title: 'Strengthen the 3-Second Scroll-Stopping Hook',
      issue: 'The opening line does not immediately leverage a curiosity gap, quantifiable proof, or a bold claim.',
      recommendation: 'Use a provocative question, contrasting statement, or specific number within the first 12 words.',
      exampleAction: `Try: "${firstLine ? firstLine.slice(0, 40) : 'Here is the truth'}... in 3 simple steps 🧵" or "Most people get this completely wrong:"`,
    });
  }

  // 2. Call to Action (CTA)
  const hasCTA = CTA_PHRASES.some(p => lower.includes(p));
  if (!hasCTA) {
    suggestions.push({
      id: 'sug-cta',
      category: 'cta',
      priority: 'high',
      title: 'Add a Clear Call-to-Action (CTA)',
      issue: 'No explicit action prompt was detected. Readers will consume the post without liking, saving, or commenting.',
      recommendation: 'Direct the reader to save for reference, drop their opinion, or visit a link.',
      exampleAction: 'Add: "Found this helpful? 🔁 Repost to help a colleague & Save for later 📌"',
    });
  }

  // 3. Formatting & Line Breaks
  if (stats.paragraphCount <= 1 && stats.wordCount > 40) {
    suggestions.push({
      id: 'sug-format',
      category: 'format',
      priority: 'high',
      title: 'Break Up Dense Wall of Text',
      issue: 'Mobile readers experience cognitive fatigue from large continuous text blocks.',
      recommendation: 'Limit paragraphs to 1-2 punchy sentences. Use emojis or bullet points as visual anchors.',
      exampleAction: 'Add empty lines between key insights and bullet points (• or 🔹).',
    });
  }

  // 4. Hashtag Optimization
  if (stats.hashtagCount === 0) {
    suggestions.push({
      id: 'sug-hashtags',
      category: 'hashtags',
      priority: 'medium',
      title: 'Incorporate 3 to 5 Targeted Hashtags',
      issue: 'Zero hashtags detected. Discovery algorithms rely on categorical tags to index your post to relevant audiences.',
      recommendation: 'Add 3-5 specific, high-intent tags at the end of the post rather than generic tags.',
      exampleAction: 'Suggested tags: #ContentStrategy #GrowthMarketing #SocialMediaTips #CreatorEconomy',
    });
  } else if (stats.hashtagCount > 8) {
    suggestions.push({
      id: 'sug-hashtags-spam',
      category: 'hashtags',
      priority: 'medium',
      title: 'Reduce Hashtag Density (Avoid Tag Stuffing)',
      issue: `Found ${stats.hashtagCount} hashtags. Modern algorithms penalize hashtag clusters as spam signals.`,
      recommendation: 'Prune down to 3-5 hyper-relevant tags aligned with your core topic.',
    });
  }

  // 5. Question & Discussion Starter
  if (stats.questionCount === 0) {
    suggestions.push({
      id: 'sug-engagement',
      category: 'engagement',
      priority: 'medium',
      title: 'End with an Open-Ended Question',
      issue: 'Posts with a closing question generate 3.4x more comments, triggering algorithmic reach multipliers.',
      recommendation: 'Ask a specific, low-friction question to invite audience perspective.',
      exampleAction: 'Try: "What is your biggest roadblock with this right now? Drop a comment below 👇"',
    });
  }

  // 6. Emoji Balance
  if (stats.emojiCount === 0) {
    suggestions.push({
      id: 'sug-tone',
      category: 'tone',
      priority: 'growth-tip',
      title: 'Add 2-4 Strategic Emojis for Visual Pacing',
      issue: 'The copy appears strictly text-heavy without visual anchors.',
      recommendation: 'Use clean emojis (🚀, 💡, 📌, 👇, 🎯) as bullet points or emphasis markers.',
    });
  } else if (stats.emojiCount > 10) {
    suggestions.push({
      id: 'sug-tone-emojis',
      category: 'tone',
      priority: 'growth-tip',
      title: 'Refine Emoji Usage for Professional Credibility',
      issue: `High emoji count (${stats.emojiCount}) can reduce authority on B2B platforms like LinkedIn.`,
      recommendation: 'Keep emojis tasteful and contextual (maximum 4-5 per post).',
    });
  }

  // 7. Platform Length Calibration
  if (stats.charCount > 280 && stats.charCount < 400) {
    suggestions.push({
      id: 'sug-length-x',
      category: 'length',
      priority: 'growth-tip',
      title: 'Optimize for Single-Tweet Boundary (280 chars)',
      issue: `Current character count is ${stats.charCount}, slightly exceeding standard X/Twitter limits.`,
      recommendation: 'Trim filler words to fit a high-impact single tweet, or expand into a structured 3-part thread.',
    });
  }

  return suggestions;
}

function generatePlatformPreviews(text: string, stats: TextStatistics): Record<string, PlatformPreview> {
  const clean = text.trim();
  const charLen = clean.length;

  // Twitter / X
  const twitterMax = 280;
  const twitterUsage = Math.min(100, Math.round((charLen / twitterMax) * 100));
  const twitterStatus: 'optimal' | 'warning' | 'exceeded' =
    charLen <= 280 ? 'optimal' : charLen <= 350 ? 'warning' : 'exceeded';
  const threadCount = charLen > 280 ? Math.ceil(charLen / 250) : 1;

  // Create Twitter variant
  let twitterVariant = clean;
  if (charLen > 280) {
    twitterVariant = `1/${threadCount} 🧵 ${clean.slice(0, 240)}...\n\n(Continued in thread 👇)`;
  }

  // LinkedIn
  const linkedinMax = 3000;
  const linkedinUsage = Math.min(100, Math.round((charLen / linkedinMax) * 100));
  const linkedinStatus: 'optimal' | 'warning' | 'exceeded' =
    charLen >= 600 && charLen <= 1800 ? 'optimal' : charLen < 300 ? 'warning' : 'optimal';
  
  // Format LinkedIn with spacing & strong see-more cutoff
  const lines = clean.split('\n');
  const linkedinVariant = lines.length > 2 
    ? `${lines[0]}\n\n${lines.slice(1).join('\n')}\n\n---\n💬 What's your experience? Let's discuss in the comments.`
    : `${clean}\n\n📌 Save this for reference.\n💬 What's your take?`;

  // Instagram
  const igMax = 2200;
  const igUsage = Math.min(100, Math.round((charLen / igMax) * 100));
  const igStatus: 'optimal' | 'warning' | 'exceeded' =
    charLen <= 1200 ? 'optimal' : 'warning';
  
  const igTags = stats.hashtagCount > 0 ? '' : '\n.\n.\n#socialmediatips #contentstrategy #creatorgrowth #saas #marketingtips';
  const igVariant = `${clean}\n\n👉 Follow @yourbrand for daily insights\n💾 Save this post for later${igTags}`;

  // Facebook / Threads
  const fbMax = 5000;
  const fbUsage = Math.min(100, Math.round((charLen / fbMax) * 100));

  return {
    twitter: {
      platform: 'twitter',
      name: 'X (Twitter)',
      maxChars: 280,
      status: twitterStatus,
      charUsagePercent: twitterUsage,
      threadCount,
      tips: [
        'Hook in first 50 chars',
        charLen > 280 ? `Split into ${threadCount}-part thread` : 'Fits within standard 280-char limit',
        'Use 1-2 hashtags maximum'
      ],
      optimizedVariant: twitterVariant,
    },
    linkedin: {
      platform: 'linkedin',
      name: 'LinkedIn',
      maxChars: 3000,
      status: linkedinStatus,
      charUsagePercent: linkedinUsage,
      tips: [
        'First 3 lines appear before "...see more" fold',
        'Sweet spot is 1,200 to 1,800 characters',
        'End with an insightful community question'
      ],
      optimizedVariant: linkedinVariant,
    },
    instagram: {
      platform: 'instagram',
      name: 'Instagram',
      maxChars: 2200,
      status: igStatus,
      charUsagePercent: igUsage,
      tips: [
        'First 125 chars appear in feed preview',
        'Use line breaks to avoid clutter',
        'Include 3-5 focused hashtags'
      ],
      optimizedVariant: igVariant,
    },
    facebook: {
      platform: 'facebook',
      name: 'Facebook / Threads',
      maxChars: 5000,
      status: 'optimal',
      charUsagePercent: fbUsage,
      tips: [
        'Strong storytelling format performs best',
        'Direct links in post or first comment',
        'Ask friends/followers to tag someone'
      ],
      optimizedVariant: clean,
    },
  };
}

function extractTopKeywords(text: string): { word: string; count: number }[] {
  const stopWords = new Set([
    'the', 'and', 'for', 'that', 'this', 'with', 'you', 'your', 'are', 'was',
    'have', 'from', 'they', 'will', 'what', 'about', 'more', 'when', 'which',
    'their', 'there', 'been', 'some', 'than', 'into', 'just', 'like', 'how',
    'can', 'all', 'out', 'them', 'then', 'these', 'would', 'here', 'our'
  ]);

  const words = text.toLowerCase().match(/[a-z]{3,}/g) || [];
  const map: Record<string, number> = {};

  for (const word of words) {
    if (!stopWords.has(word)) {
      map[word] = (map[word] || 0) + 1;
    }
  }

  return Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([word, count]) => ({ word, count }));
}
