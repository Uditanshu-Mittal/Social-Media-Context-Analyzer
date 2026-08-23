import React from 'react';
import { 
  FileText, 
  Type, 
  Clock, 
  BookOpen, 
  Smile, 
  Hash, 
  HelpCircle, 
  AtSign,
  BarChart2
} from 'lucide-react';
import { TextStatistics } from '../types';

interface StatsGridProps {
  stats: TextStatistics;
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  const statItems = [
    {
      label: 'Exact Word Count',
      value: stats.wordCount,
      subValue: `${stats.avgWordLength} avg letters/word`,
      icon: <FileText className="h-4 w-4 text-indigo-600" />,
      bg: 'bg-indigo-50/70',
    },
    {
      label: 'Character Count',
      value: stats.charCount,
      subValue: `${stats.charCountNoSpaces} without spaces`,
      icon: <Type className="h-4 w-4 text-cyan-600" />,
      bg: 'bg-cyan-50/70',
    },
    {
      label: 'Reading Time',
      value: stats.readingTimeSeconds < 60 ? `${stats.readingTimeSeconds}s` : `${Math.ceil(stats.readingTimeSeconds / 60)} min`,
      subValue: `~${stats.speakingTimeSeconds}s speaking`,
      icon: <Clock className="h-4 w-4 text-amber-600" />,
      bg: 'bg-amber-50/70',
    },
    {
      label: 'Readability Grade',
      value: `${stats.fleschReadingEase}/100`,
      subValue: stats.readingLevel,
      icon: <BookOpen className="h-4 w-4 text-emerald-600" />,
      bg: 'bg-emerald-50/70',
    },
    {
      label: 'Paragraphs & Lines',
      value: stats.paragraphCount,
      subValue: `${stats.sentenceCount} total sentences`,
      icon: <BarChart2 className="h-4 w-4 text-purple-600" />,
      bg: 'bg-purple-50/70',
    },
    {
      label: 'Emojis Used',
      value: stats.emojiCount,
      subValue: stats.emojisFound.length > 0 ? stats.emojisFound.slice(0, 5).join(' ') : 'None',
      icon: <Smile className="h-4 w-4 text-rose-600" />,
      bg: 'bg-rose-50/70',
    },
    {
      label: 'Hashtags (#)',
      value: stats.hashtagCount,
      subValue: stats.hashtagCount >= 2 && stats.hashtagCount <= 5 ? 'Optimal (2-5)' : stats.hashtagCount === 0 ? 'Missing' : 'High density',
      icon: <Hash className="h-4 w-4 text-teal-600" />,
      bg: 'bg-teal-50/70',
    },
    {
      label: 'Questions (?)',
      value: stats.questionCount,
      subValue: stats.questionCount > 0 ? 'Conversation starter' : 'No question hook',
      icon: <HelpCircle className="h-4 w-4 text-blue-600" />,
      bg: 'bg-blue-50/70',
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm">
      <div className="border-b border-slate-100 pb-4 mb-6">
        <h3 className="text-sm font-bold text-slate-900">Content Dimensions & Linguistics</h3>
        <p className="text-xs text-slate-500">Quantitative metrics, readability index, and density indicators</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
        {statItems.map((item, index) => (
          <div
            key={index}
            className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 transition-all hover:bg-white hover:border-indigo-100 hover:shadow-xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${item.bg}`}>
                {item.icon}
              </div>
            </div>

            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight block">
              {item.value}
            </span>

            <p className="text-xs font-semibold text-slate-700 mt-0.5 truncate">
              {item.label}
            </p>

            <p className="text-[11px] text-slate-400 mt-0.5 truncate">
              {item.subValue}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
