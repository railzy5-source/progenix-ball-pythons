
import React, { useState } from 'react';
import { Snake } from '../types';
import { aiService } from '../services/ai';
import { BrainCircuit, Wand2, Loader2, Lightbulb, Dna, HeartHandshake, Baby, X } from 'lucide-react';

interface DreamComboPlannerProps {
  snakes: Snake[];
}

export const DreamComboPlanner: React.FC<DreamComboPlannerProps> = ({ snakes }) => {
  const [targetMorph, setTargetMorph] = useState('');
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGeneratePlan = async () => {
    if (!targetMorph) {
      setError('Please enter a target morph.');
      return;
    }
    setLoading(true);
    setPlan('');
    setError('');
    try {
      const result = await aiService.generateBreedingPlan(targetMorph, snakes);
      setPlan(result);
    } catch (e: any) {
      setError('An error occurred while generating the plan. The AI service may be busy or API key missing.');
    } finally {
      setLoading(false);
    }
  };
  
  const parsePlan = (text: string) => {
    // Split by newlines, but filter out empty lines that might result from multiple newlines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    return lines.map((line, index) => {
      let icon = <Dna size={16} className="text-slate-400" />;
      let isStep = false;
      let isHeader = false;

      const trimmedLine = line.trim();

      // Check for step markers like "Step 1:" or "1."
      if (trimmedLine.match(/^Step \d+:/) || trimmedLine.match(/^\d+\./)) {
        icon = <span className="font-bold text-slate-400">{trimmedLine.match(/\d+/)?.[0]}</span>;
        isStep = true;
      } else if (trimmedLine.endsWith(':') && !trimmedLine.includes('Pairing') && !trimmedLine.includes('Goal')) {
        // Treat lines ending with a colon as headers (e.g., "The Plan:")
        isHeader = true;
      }
      
      // Check for keywords to assign contextual icons
      const lowerLine = trimmedLine.toLowerCase();
      if (lowerLine.includes('pair') || lowerLine.includes('breed')) icon = <HeartHandshake size={16} className="text-rose-500" />;
      if (lowerLine.includes('hold back') || lowerLine.includes('keep') || lowerLine.includes('raise')) icon = <Baby size={16} className="text-blue-500" />;

      if (isHeader) {
          return (
              <h4 key={index} className="font-bold text-slate-600 dark:text-slate-300 mt-4 mb-2 text-sm uppercase tracking-wider">
                  {trimmedLine}
              </h4>
          );
      }

      return (
        <div key={index} className={`flex items-start gap-3 p-2 ${isStep ? 'mt-1' : ''}`}>
          <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">{icon}</div>
          <p className="text-sm text-slate-700 dark:text-slate-300 pt-0.5 leading-relaxed">{trimmedLine.replace(/^Step \d+:/, '').replace(/^\d+\./, '').trim()}</p>
        </div>
      );
    });
  };

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
        <BrainCircuit className="text-indigo-500" size={24} />
        "Dream Combo" Reverse Planner
      </h3>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
            <input
            type="text"
            value={targetMorph}
            onChange={(e) => setTargetMorph(e.target.value)}
            placeholder="e.g., 'Pastel Clown Piebald' or 'Super Gravel Highway'"
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 pr-10 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {targetMorph && (
                <button 
                    onClick={() => setTargetMorph('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                    <X size={16} />
                </button>
            )}
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={loading || !targetMorph}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
          {loading ? 'Generating...' : 'Create Plan'}
        </button>
      </div>

      <div className="mt-6">
        {loading && (
          <div className="text-center p-8 text-slate-500 flex flex-col items-center">
            <div className="relative">
                <Loader2 className="animate-spin text-indigo-500 mb-2" size={32} />
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full"></div>
            </div>
            <p className="font-medium text-slate-600 dark:text-slate-300">AI is analyzing your genetics...</p>
            <p className="text-xs text-slate-400 mt-1">This may take a few seconds.</p>
          </div>
        )}
        {error && <p className="text-center text-rose-500 p-4 border border-rose-100 bg-rose-50 dark:bg-rose-900/10 rounded-lg text-sm">{error}</p>}
        {plan && (
          <div className="bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 p-4 animate-fade-in">
            {parsePlan(plan)}
          </div>
        )}
        {!loading && !plan && !error && (
            <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                 <Lightbulb size={32} className="text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                 <p className="text-slate-500 text-sm">Enter your dream combo and let the AI generate a multi-year breeding strategy using your current collection.</p>
            </div>
        )}
      </div>
    </div>
  );
};
