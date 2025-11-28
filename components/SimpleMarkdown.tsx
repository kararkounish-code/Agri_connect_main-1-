import React from 'react';

const SimpleMarkdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  return (
    <div>
      {lines.map((line, index) => {
        line = line.trim();
        if (line.startsWith('###')) {
          return <h4 key={index} className="text-md font-semibold mt-3 mb-1 text-green-800">{line.replace(/###\s*/, '')}</h4>;
        }
        if (line.startsWith('##')) {
          return <h3 key={index} className="text-lg font-semibold mt-4 mb-2 text-green-900">{line.replace(/##\s*/, '')}</h3>;
        }
        if (line.startsWith('#')) {
          return <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-green-900">{line.replace(/#\s*/, '')}</h2>;
        }
        if (line.startsWith('* ') || line.startsWith('- ')) {
          return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        }
        if (line.match(/^\d+\.\s/)) {
            return <li key={index} className="ml-5 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        if (line === '') {
          return <br key={index} />;
        }
        const parts = line.split('**');
        return (
          <p key={index} className="mb-2">
            {parts.map((part, i) => (i % 2 === 1) ? <strong key={i} className="font-semibold text-gray-800">{part}</strong> : part)}
          </p>
        );
      })}
    </div>
  );
};

export default SimpleMarkdown;
