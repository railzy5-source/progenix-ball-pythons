
import React from 'react';

interface MorphTagProps {
  gene: string;
}

export const MorphTag: React.FC<MorphTagProps> = ({ gene }) => {
  // Simple hashing function to pick a consistent color
  const getColor = (text: string) => {
    const colors = [
      'bg-orange-400 text-slate-900',
      'bg-purple-400 text-slate-900',
      'bg-teal-400 text-slate-900', 
      'bg-rose-400 text-slate-900',
      'bg-yellow-400 text-slate-900',
      'bg-indigo-400 text-slate-900',
      'bg-lime-400 text-slate-900',
    ];
    
    // Specific overrides based on screenshot colors if possible
    const lower = text.toLowerCase();
    if (lower.includes('clown')) return 'bg-teal-400 text-slate-900 font-bold';
    if (lower.includes('russo')) return 'bg-orange-400 text-slate-900 font-bold';
    if (lower.includes('fire')) return 'bg-purple-300 text-slate-900 font-bold';
    if (lower.includes('spotnose')) return 'bg-rose-400 text-slate-900 font-bold';
    if (lower.includes('yellowbelly')) return 'bg-teal-400 text-slate-900 font-bold';
    if (lower.includes('lace')) return 'bg-purple-300 text-slate-900 font-bold';

    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold shadow-sm ${getColor(gene)}`}>
      {gene}
    </span>
  );
};
