
import React, { useState } from 'react';
import { Snake } from '../types';
import { aiService } from '../services/ai';
import { X, Sparkles, Copy, RefreshCw, Zap, MessageSquareText, Mail, BrainCircuit } from 'lucide-react';

interface AILabModalProps {
  snakes: Snake[];
  subscribers: string[];
  initialTab?: 'copy' | 'advisor' | 'newsletter';
  onClose: () => void;
}

export const AILabModal: React.FC<AILabModalProps> = ({ snakes, subscribers, initialTab = 'copy', onClose }) => {
  const [activeTab, setActiveTab] = useState<'copy' | 'advisor' | 'newsletter'>(initialTab);
  const [selectedSnakeId, setSelectedSnakeId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleGenerateCopy = async () => {
    if (!selectedSnakeId) return;
    const snake = snakes.find(s => s.id === selectedSnakeId);
    if (!snake) return;

    setLoading(true);
    setResult('');
    const text = await aiService.generateSalesCopy(snake);
    setResult(text);
    setLoading(false);
  };

  const handleAnalyzeCollection = async () => {
    setLoading(true);
    setResult('');
    const text = await aiService.getStrategicAnalysis(snakes);
    setResult(text);
    setLoading(false);
  };

  const handleGenerateNewsletter = async () => {
    setLoading(true);
    setResult('');
    const text = await aiService.generateNewsletter(snakes);
    setResult(text);
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    alert("Copied to clipboard!");
  };

  const copyEmails = () => {
      navigator.clipboard.writeText(subscribers.join(', '));
      alert("Subscriber emails copied!");
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-700 flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-gradient-to-r from-violet-600 to-indigo-600">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/20 backdrop-blur-sm rounded-lg">
                <Sparkles className="text-white" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-white">Progenix AI Lab</h2>
                <p className="text-xs text-indigo-100">Powered by Gemini</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar / Tabs */}
            <div className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-4 flex flex-row md:flex-col gap-2 shrink-0">
                <button 
                    onClick={() => { setActiveTab('copy'); setResult(''); }}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'copy' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700' : 'text-slate-500 hover:bg-slate-900'}`}
                >
                    <MessageSquareText size={18} /> Listing Helper
                </button>
                <button 
                    onClick={() => { setActiveTab('advisor'); setResult(''); }}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'advisor' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700' : 'text-slate-500 hover:bg-slate-900'}`}
                >
                    <BrainCircuit size={18} /> Strategic Advisor
                </button>
                <button 
                    onClick={() => { setActiveTab('newsletter'); setResult(''); }}
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeTab === 'newsletter' ? 'bg-slate-800 text-indigo-400 shadow-sm border border-slate-700' : 'text-slate-500 hover:bg-slate-900'}`}
                >
                    <Mail size={18} /> Newsletter
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-6 overflow-y-auto bg-slate-900 text-slate-100">
                
                {/* --- SALES COPY TAB --- */}
                {activeTab === 'copy' && (
                    <div className="space-y-6 h-full flex flex-col">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Generate Ad Description</h3>
                            <p className="text-sm text-slate-400">Select an animal to instantly generate professional text optimized for MorphMarket and Instagram.</p>
                            
                            <div className="flex gap-3">
                                <select 
                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 text-white min-w-0"
                                    value={selectedSnakeId}
                                    onChange={(e) => setSelectedSnakeId(e.target.value)}
                                >
                                    <option value="">Select a Reptile...</option>
                                    {snakes.map(s => (
                                        <option key={s.id} value={s.id}>{s.id}</option>
                                    ))}
                                </select>
                                <button 
                                    onClick={handleGenerateCopy}
                                    disabled={!selectedSnakeId || loading}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20 shrink-0"
                                >
                                    {loading ? <RefreshCw size={20} className="animate-spin" /> : <Sparkles size={20} />}
                                    Generate
                                </button>
                            </div>
                        </div>

                        {/* Result Area */}
                        <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-4 relative font-mono text-sm text-slate-300 leading-relaxed overflow-y-auto shadow-inner">
                            {result ? (
                                <div className="whitespace-pre-wrap">{result}</div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                    <MessageSquareText size={48} className="mb-4" />
                                    <p>AI output will appear here...</p>
                                </div>
                            )}
                            
                            {result && (
                                <button 
                                    onClick={copyToClipboard}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg shadow-sm hover:text-indigo-400 transition-colors border border-slate-700"
                                    title="Copy to Clipboard"
                                >
                                    <Copy size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* --- STRATEGIC ADVISOR TAB --- */}
                {activeTab === 'advisor' && (
                    <div className="space-y-6 h-full flex flex-col">
                         <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Strategic Collection Analysis</h3>
                            <p className="text-sm text-slate-400">Ask the AI to audit your entire inventory, identify genetic gaps, male/female ratio imbalances, and suggest power pairings.</p>
                            
                            <button 
                                onClick={handleAnalyzeCollection}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/20"
                            >
                                {loading ? <RefreshCw size={24} className="animate-spin" /> : <BrainCircuit size={24} />}
                                Perform Strategic Audit
                            </button>
                        </div>

                         <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 relative text-sm text-slate-300 leading-relaxed overflow-y-auto shadow-inner">
                            {result ? (
                                <div className="whitespace-pre-wrap prose prose-invert max-w-none">
                                    {result.split('\n').map((line, i) => (
                                        <p key={i} className={`mb-2 ${line.trim().startsWith('**') || line.includes(':') ? 'font-bold text-indigo-400 text-base mt-4 border-b border-indigo-900/30 pb-1' : ''}`}>
                                            {line.replace(/\*\*/g, '')}
                                        </p>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                    <Zap size={48} className="mb-4" />
                                    <p>Click Audit to start...</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* --- NEWSLETTER TAB --- */}
                {activeTab === 'newsletter' && (
                    <div className="space-y-6 h-full flex flex-col">
                         <div className="space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-white">Newsletter Generator</h3>
                                    <p className="text-sm text-slate-400">Draft an email for your {subscribers.length} subscribers highlighting current availability.</p>
                                </div>
                                <button onClick={copyEmails} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded text-slate-300 font-bold border border-slate-700">
                                    Copy Emails
                                </button>
                            </div>
                            
                            <button 
                                onClick={handleGenerateNewsletter}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                {loading ? <RefreshCw size={24} className="animate-spin" /> : <Mail size={24} />}
                                Generate Update Email
                            </button>
                        </div>

                         <div className="flex-1 bg-slate-950 rounded-xl border border-slate-800 p-6 relative text-sm text-slate-300 leading-relaxed overflow-y-auto shadow-inner">
                            {result ? (
                                <div className="whitespace-pre-wrap">{result}</div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                                    <Mail size={48} className="mb-4" />
                                    <p>Click Generate to draft email...</p>
                                </div>
                            )}
                             {result && (
                                <button 
                                    onClick={copyToClipboard}
                                    className="absolute top-4 right-4 p-2 bg-slate-800 rounded-lg shadow-sm hover:text-indigo-400 transition-colors border border-slate-700"
                                    title="Copy Text"
                                >
                                    <Copy size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                )}

            </div>
        </div>
      </div>
    </div>
  );
};
