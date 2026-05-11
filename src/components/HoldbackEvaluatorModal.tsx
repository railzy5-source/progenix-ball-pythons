
import React, { useState } from 'react';
import { Snake } from '../types';
import { X, Scale, Utensils, Award, Check, ArrowRightLeft, Sparkles, Loader2, Info } from 'lucide-react';
import { MorphTag } from './MorphTag';
import { aiService } from '../services/ai';

interface HoldbackEvaluatorModalProps {
  snakes: Snake[];
  onClose: () => void;
  onUpdateSnake: (snake: Snake) => void;
}

export const HoldbackEvaluatorModal: React.FC<HoldbackEvaluatorModalProps> = ({ snakes, onClose, onUpdateSnake }) => {
  // Default to showing snakes born/added recently or marked as Hold/For Sale/Collection (exclude Sold)
  const [candidates, setCandidates] = useState<Snake[]>(
      snakes
        .filter(s => s.status !== 'Sold')
        .sort((a, b) => new Date(b.dob || '2000-01-01').getTime() - new Date(a.dob || '2000-01-01').getTime())
  );
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');

  const toggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(s => s !== id));
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      } else {
        alert("You can compare up to 3 animals at a time.");
      }
    }
  };

  const getFeedingConsistency = (snake: Snake) => {
      const feeds = snake.logs.filter(l => l.type === 'Feeding').sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
      if (feeds.length === 0) return 'N/A';
      const eaten = feeds.filter(f => (f as any).result === 'Eaten').length;
      return `${Math.round((eaten / feeds.length) * 100)}% (${eaten}/${feeds.length})`;
  };

  const setStatus = (snakeId: string, status: Snake['status']) => {
     const snake = snakes.find(s => s.id === snakeId);
     if (snake) {
         onUpdateSnake({ ...snake, status });
     }
  };

  const selectedSnakes = selectedIds.map(id => snakes.find(s => s.id === id)).filter(Boolean) as Snake[];

  const handleAskAI = async () => {
      if (selectedSnakes.length < 2) {
          alert("Please select at least 2 reptiles to compare.");
          return;
      }
      setIsAnalyzing(true);
      setAiAnalysis('');
      const result = await aiService.analyzeHoldbackCandidates(selectedSnakes);
      setAiAnalysis(result);
      setIsAnalyzing(false);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ArrowRightLeft className="text-indigo-500" />
                Holdback Decision Helper
            </h2>
            <p className="text-xs text-slate-500">Compare hatchlings side-by-side to decide keepers.</p>
          </div>
          <div className="flex gap-4 items-center">
             {selectedSnakes.length >= 2 && (
                 <button 
                    onClick={handleAskAI}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-70 disabled:cursor-wait"
                 >
                    {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    Ask AI Advisor
                 </button>
             )}
             <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            
            {/* Sidebar: Selection List */}
            <div className="w-full md:w-80 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 flex flex-col">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                    <input 
                        type="text" 
                        placeholder="Search ID..." 
                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <p className="text-xs text-slate-400 mt-2">Selected: {selectedIds.length}/3</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {candidates
                        .filter(s => s.id.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map(s => (
                        <div 
                            key={s.id}
                            onClick={() => toggleSelection(s.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                selectedIds.includes(s.id) 
                                ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-500 ring-1 ring-indigo-500' 
                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                            }`}
                        >
                            <div className="flex justify-between items-start">
                                <span className="font-bold text-sm text-slate-900 dark:text-white">{s.id}</span>
                                <span className={`text-[10px] font-bold px-1.5 rounded uppercase ${s.sex === 'Female' ? 'bg-rose-100 text-rose-600' : 'bg-blue-100 text-blue-600'}`}>{s.sex}</span>
                            </div>
                            <p className="text-xs text-slate-500 truncate mt-1">{s.genetics.join(", ")}</p>
                            <p className="text-xs text-slate-400 mt-1 font-mono">{s.currentWeight}g • {s.status}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Area: Comparison Table */}
            <div className="flex-1 overflow-y-auto bg-slate-100 dark:bg-black p-4 md:p-8 flex flex-col">
                
                {/* AI Analysis Result Block */}
                {aiAnalysis && (
                    <div className="mb-8 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900 rounded-xl p-6 shadow-sm animate-fade-in relative">
                        <div className="absolute top-4 right-4">
                            <button onClick={() => setAiAnalysis('')} className="p-1 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-full text-indigo-400"><X size={16} /></button>
                        </div>
                        <h3 className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold mb-3">
                            <Sparkles size={18} /> AI Analysis
                        </h3>
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {aiAnalysis.split('\n').map((line, i) => (
                                <p key={i} className={`mb-1 ${line.toLowerCase().includes('winner') ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}`}>
                                    {line.replace(/\*\*/g, '')}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                {selectedSnakes.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <ArrowRightLeft size={64} className="mb-6 opacity-20" />
                        <p className="text-lg font-medium">Select up to 3 reptiles from the list to compare.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
                        {selectedSnakes.map(snake => (
                            <div key={snake.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-full animate-fade-in">
                                {/* Image */}
                                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800 relative">
                                    {snake.image ? (
                                        <img src={snake.image} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold">No Image</div>
                                    )}
                                    <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
                                        <h3 className="text-2xl font-black text-white shadow-sm">{snake.id}</h3>
                                    </div>
                                    <div className="absolute bottom-4 right-4">
                                         <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase shadow-lg ${snake.status === 'Collection' ? 'bg-emerald-500 text-white' : snake.status === 'For Sale' ? 'bg-blue-500 text-white' : 'bg-slate-500 text-white'}`}>
                                            {snake.status}
                                         </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="p-6 flex-1 flex flex-col gap-6">
                                    
                                    {/* Genetics */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Genetics</p>
                                        <div className="flex flex-wrap gap-2">
                                            {snake.genetics.map(g => <MorphTag key={g} gene={g} />)}
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                                <Scale size={14} /> <span className="text-xs font-bold uppercase">Weight</span>
                                            </div>
                                            <p className="text-xl font-bold text-slate-900 dark:text-white">{snake.currentWeight}g</p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-2 mb-1 text-slate-500">
                                                <Utensils size={14} /> <span className="text-xs font-bold uppercase">Feed Rate</span>
                                            </div>
                                            <p className="text-lg font-bold text-slate-900 dark:text-white">{getFeedingConsistency(snake)}</p>
                                        </div>
                                    </div>

                                    {/* Decision Actions */}
                                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
                                        <p className="text-xs text-center font-bold text-slate-400 uppercase">Make Decision</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button 
                                                onClick={() => setStatus(snake.id, 'Collection')}
                                                className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${snake.status === 'Collection' ? 'bg-emerald-500 text-white ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-emerald-100 hover:text-emerald-600'}`}
                                            >
                                                <Award size={16} /> Keep
                                            </button>
                                            <button 
                                                onClick={() => setStatus(snake.id, 'For Sale')}
                                                className={`py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${snake.status === 'For Sale' ? 'bg-blue-500 text-white ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-blue-100 hover:text-blue-600'}`}
                                            >
                                                Sell
                                            </button>
                                        </div>
                                        <button 
                                            onClick={() => setStatus(snake.id, 'Hold')}
                                            className={`w-full py-2 rounded-lg font-bold text-xs transition-all ${snake.status === 'Hold' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                                        >
                                            Mark as Hold (Undecided)
                                        </button>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
      </div>
    </div>
  );
};
