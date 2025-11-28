import React from 'react';
import SimpleMarkdown from './SimpleMarkdown';

interface ResultCardProps {
  result: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  return (
    <div className="w-full bg-white/90 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-xl border border-white/60 animate-fade-in relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-400 to-teal-600"></div>
      
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg mr-3">
          <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800">Analysis Result</h3>
      </div>
      
      <div className="prose prose-emerald max-w-none text-slate-600 prose-headings:text-emerald-900 prose-strong:text-slate-800">
        <SimpleMarkdown content={result} />
      </div>
    </div>
  );
};

export default ResultCard;