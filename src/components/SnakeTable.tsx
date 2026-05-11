
import React, { useState } from 'react';
import { Snake, SnakeLog } from '../types';
import { Search, Filter, XCircle, Plus, LayoutGrid, List, CheckSquare, Square, Utensils, Scale, Printer, Check, X, ChevronRight } from 'lucide-react';
import { MorphTag } from './MorphTag';
import QRCode from 'react-qr-code';

interface SnakeTableProps {
  snakes: Snake[];
  onSnakeClick: (snake: Snake) => void;
  onAddSnake: () => void;
  onBulkAction: (snakeIds: string[], logTemplate: Partial<SnakeLog>) => void;
  isReadOnly?: boolean;
}

export const SnakeTable: React.FC<SnakeTableProps> = ({ snakes, onSnakeClick, onAddSnake, onBulkAction, isReadOnly = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSex, setFilterSex] = useState<'All' | 'Male' | 'Female'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showBulkModal, setShowBulkModal] = useState<'feeding' | 'weight' | 'print' | null>(null);

  const filteredSnakes = snakes.filter(snake => {
    // 1. Filter by Sex
    if (filterSex !== 'All' && snake.sex !== filterSex) return false;

    // 2. Filter by Search (Multiple Keywords)
    if (!searchTerm.trim()) return true;

    const lowerId = snake.id.toLowerCase();
    // Cache lowercased genetics for performance (though iterating usually fast enough for small collections)
    const lowerGenetics = snake.genetics.map(g => g.toLowerCase());
    
    // Split by space or comma to support "Pastel Clown" or "Pastel, Clown"
    const searchTerms = searchTerm.toLowerCase().split(/[\s,]+/).filter(t => t.length > 0);

    // Every term must be found in either the ID or one of the Genetics
    return searchTerms.every(term => 
      lowerId.includes(term) || lowerGenetics.some(g => g.includes(term))
    );
  });

  // --- SELECTION LOGIC ---
  const toggleSelect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isReadOnly) return; // Disable selection in read-only
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
        newSelected.delete(id);
    } else {
        newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = () => {
    if (isReadOnly) return;
    if (selectedIds.size === filteredSnakes.length) {
        setSelectedIds(new Set());
    } else {
        setSelectedIds(new Set(filteredSnakes.map(s => s.id)));
    }
  };

  return (
    <div className="space-y-6 relative pb-24 md:pb-20">
      {/* Controls Bar (Glassmorphic) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 glass-panel backdrop-blur-md p-4 rounded-xl shadow-lg sticky top-[72px] z-30 border border-slate-200 dark:border-white/10">
        
        {/* Search & Bulk Toggle */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-1">
            <div className="relative w-full lg:max-w-md group flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                    type="text"
                    placeholder="Search ID or genetics..."
                    className="w-full pl-12 pr-4 py-2.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Desktop Select All Toggle inside Bar */}
            {filteredSnakes.length > 0 && !isReadOnly && (
                <button 
                    onClick={handleSelectAll}
                    className={`hidden md:flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-all text-sm font-bold whitespace-nowrap ${selectedIds.size === filteredSnakes.length ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' : 'border-slate-200 dark:border-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5'}`}
                    title="Select All Visible"
                >
                    {selectedIds.size === filteredSnakes.length ? <CheckSquare size={18} /> : <Square size={18} />}
                    <span className="text-xs uppercase tracking-wide">{selectedIds.size}/{filteredSnakes.length}</span>
                </button>
            )}
        </div>
        
        <div className="flex flex-row gap-3 w-full lg:w-auto items-center justify-between lg:justify-end overflow-x-auto pb-1 lg:pb-0 hide-scrollbar">
           {/* Sex Filter */}
           <div className="flex items-center gap-1.5 shrink-0">
              {['All', 'Male', 'Female'].map((sex) => (
                  <button 
                    key={sex}
                    onClick={() => setFilterSex(sex as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        filterSex === sex
                        ? 'bg-slate-100 dark:bg-slate-200 text-slate-900 border-transparent' 
                        : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                    }`}
                  >
                    {sex}
                  </button>
              ))}
           </div>

           <div className="flex items-center gap-2 shrink-0">
               {/* View Toggle (Desktop Only) */}
               <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-white/5">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
                  >
                    <List size={16} />
                  </button>
               </div>
               
               {!isReadOnly && (
                 <button 
                   onClick={onAddSnake}
                   className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-all shadow-lg shadow-emerald-500/20 whitespace-nowrap"
                 >
                   <Plus size={16} />
                   <span className="hidden sm:inline">Add Reptile</span>
                   <span className="sm:hidden">Add</span>
                 </button>
               )}
           </div>
        </div>
      </div>

      {/* Mobile Select All Bar */}
      {filteredSnakes.length > 0 && !isReadOnly && (
         <div className="md:hidden flex items-center justify-between px-2 pb-2">
             <button 
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-500 transition-colors uppercase tracking-wider"
             >
                {selectedIds.size === filteredSnakes.length && filteredSnakes.length > 0 ? (
                    <CheckSquare size={16} className="text-emerald-500" />
                ) : (
                    <Square size={16} />
                )}
                Select All ({filteredSnakes.length})
             </button>
         </div>
      )}

      {/* --- MOBILE VIEW (Compact List) --- */}
      <div className="md:hidden space-y-3">
          {filteredSnakes.length === 0 ? (
             <div className="py-12 text-center text-slate-400">
                <p className="text-sm">No reptiles found.</p>
             </div>
          ) : filteredSnakes.map((snake, index) => (
             <div 
                key={snake.id}
                onClick={() => onSnakeClick(snake)}
                className={`bg-white dark:bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 flex gap-3 items-center shadow-sm border border-slate-200 dark:border-white/5 active:scale-[0.98] transition-transform opacity-0 animate-stagger-in ${selectedIds.has(snake.id) ? 'ring-2 ring-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : ''}`}
                style={{ animationDelay: `${index * 30}ms` }}
             >
                {/* Checkbox Area */}
                {!isReadOnly && (
                    <div onClick={(e) => toggleSelect(e, snake.id)} className="shrink-0 p-2 -ml-2">
                        {selectedIds.has(snake.id) ? (
                            <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center text-white"><Check size={12} strokeWidth={4}/></div>
                        ) : (
                            <div className="w-5 h-5 rounded border-2 border-slate-300 dark:border-slate-700"></div>
                        )}
                    </div>
                )}

                {/* Thumb */}
                <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0 relative">
                    {snake.image ? (
                        <img src={snake.image} className="w-full h-full object-cover" alt="" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 text-[10px]">No Img</div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-slate-900 dark:text-white text-sm truncate">{snake.id}</h3>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${snake.sex === 'Female' ? 'text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/20' : 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20'}`}>
                            {snake.sex.charAt(0)}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {snake.genetics.join(", ")}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] font-mono text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                            {snake.currentWeight}g
                        </span>
                        <span className={`w-2 h-2 rounded-full ${snake.feeding.dueFeed ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
                    </div>
                </div>

                <ChevronRight size={16} className="text-slate-400 dark:text-slate-600" />
             </div>
          ))}
      </div>

      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:block">
        {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSnakes.length === 0 ? (
                <div className="col-span-full py-20 text-center text-slate-500 flex flex-col items-center">
                    <Search size={48} className="mb-4 opacity-20" />
                    <p className="text-lg font-medium">No reptiles found matching your criteria.</p>
                </div>
            ) : filteredSnakes.map((snake, index) => (
                <div 
                    key={snake.id}
                    onClick={() => onSnakeClick(snake)}
                    className={`group flex flex-col cursor-pointer transition-transform duration-200 opacity-0 animate-stagger-in ${selectedIds.has(snake.id) ? 'scale-[0.98]' : ''}`}
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                {/* Image Container */}
                <div className={`relative aspect-[4/5] bg-white dark:bg-slate-900 rounded-2xl overflow-hidden mb-4 shadow-lg border border-slate-200 dark:border-white/5 transition-all duration-300 group-hover:shadow-emerald-500/10 group-hover:border-emerald-500/30 group-hover:-translate-y-1 ${selectedIds.has(snake.id) ? 'ring-4 ring-emerald-500' : ''}`}>
                    {snake.image ? (
                    <img 
                        src={snake.image} 
                        alt={snake.id} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/50">
                        <span className="text-sm font-medium">No Image</span>
                    </div>
                    )}
                    
                    {/* Checkbox Overlay */}
                    {!isReadOnly && (
                        <div 
                            onClick={(e) => toggleSelect(e, snake.id)}
                            className={`absolute top-3 left-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer backdrop-blur-sm ${selectedIds.has(snake.id) ? 'bg-emerald-500 text-white' : 'bg-black/50 text-white/70 hover:bg-white hover:text-black'}`}
                        >
                            {selectedIds.has(snake.id) ? <Check size={16} strokeWidth={4} /> : <div className="w-4 h-4 rounded border-2 border-current"></div>}
                        </div>
                    )}

                    {/* Status Badges */}
                    <div className="absolute top-3 right-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur-md shadow-sm uppercase tracking-wide ${
                        snake.sex === 'Female' 
                        ? 'bg-rose-500/90 text-white' 
                        : 'bg-blue-600/90 text-white'
                    }`}>
                        {snake.sex === 'Female' ? 'Female' : 'Male'}
                    </span>
                    </div>
                </div>

                {/* Content */}
                <div>
                    <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                        {snake.id}
                    </h3>
                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                        {snake.price ? `£${snake.price}` : 'NFS'}
                    </span>
                    </div>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-1 h-5 font-medium">
                    {snake.genetics.join(", ")}
                    </p>

                    <div className="flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    {snake.genetics.slice(0, 3).map((gene, i) => (
                        <div key={i} className="scale-95 origin-left">
                        <MorphTag gene={gene} />
                        </div>
                    ))}
                    {snake.genetics.length > 3 && (
                        <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            +{snake.genetics.length - 3}
                        </span>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-lg">
            <table className="w-full text-left text-sm text-slate-500 dark:text-slate-400">
                <thead className="bg-slate-50/80 dark:bg-slate-900/80 text-xs uppercase font-bold text-slate-500 tracking-wider">
                <tr>
                    {!isReadOnly && <th className="px-6 py-4 w-12 text-center"></th>}
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Sex</th>
                    <th className="px-6 py-4">Genetics</th>
                    <th className="px-6 py-4 text-center">Weight</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Price</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-white/5">
                {filteredSnakes.length === 0 ? (
                    <tr><td colSpan={isReadOnly ? 6 : 7} className="text-center py-12">No reptiles found.</td></tr>
                ) : filteredSnakes.map((snake) => (
                    <tr 
                    key={snake.id} 
                    onClick={() => onSnakeClick(snake)}
                    className={`transition-colors cursor-pointer group ${selectedIds.has(snake.id) ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    >
                    {!isReadOnly && (
                        <td className="px-6 py-4" onClick={(e) => toggleSelect(e, snake.id)}>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedIds.has(snake.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300 dark:border-slate-600'}`}>
                                {selectedIds.has(snake.id) && <Check size={14} strokeWidth={3} />}
                            </div>
                        </td>
                    )}
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {snake.id}
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-md ${snake.sex === 'Female' ? 'bg-rose-100 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400' : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                            {snake.sex}
                        </span>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                        {snake.genetics.slice(0, 3).map((gene, i) => (
                            <MorphTag key={i} gene={gene} />
                        ))}
                        {snake.genetics.length > 3 && (
                            <span className="text-xs text-slate-500 self-center">+{snake.genetics.length - 3} more</span>
                        )}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-center font-mono text-slate-700 dark:text-slate-300">
                        {snake.currentWeight}g
                    </td>
                    <td className="px-6 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        snake.status === 'For Sale' 
                            ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                        }`}>
                        {snake.status || 'COLLECTION'}
                        </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900 dark:text-white">
                        {snake.price ? `£${snake.price}` : '-'}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.size > 0 && !isReadOnly && (
         <div className="fixed bottom-20 md:bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-slate-800 text-white rounded-full px-6 py-3 shadow-2xl flex items-center gap-4 md:gap-6 animate-[fadeIn_0.3s_ease-out] border border-slate-600 w-[90%] md:w-auto justify-between md:justify-center backdrop-blur-md">
            <div className="font-bold text-sm whitespace-nowrap border-r border-slate-600 pr-4 md:pr-6">
                {selectedIds.size} <span className="hidden sm:inline">Selected</span>
            </div>
            <div className="flex gap-4">
                <button onClick={() => setShowBulkModal('feeding')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-bold text-sm">
                    <Utensils size={16} /> <span className="hidden sm:inline">Bulk Feed</span><span className="sm:hidden">Feed</span>
                </button>
                <button onClick={() => setShowBulkModal('print')} className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-bold text-sm">
                    <Printer size={16} /> <span className="hidden sm:inline">Print Cards</span><span className="sm:hidden">Print</span>
                </button>
            </div>
            <button 
                onClick={() => setSelectedIds(new Set())}
                className="ml-2 p-1 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white"
            >
                <X size={16} />
            </button>
         </div>
      )}

      {/* Bulk Operations Modal */}
      {showBulkModal && (
        <BulkActionModal 
            type={showBulkModal} 
            count={selectedIds.size}
            onClose={() => setShowBulkModal(null)}
            onConfirm={(template) => {
                if (showBulkModal === 'print') {
                   window.print();
                } else {
                   onBulkAction(Array.from(selectedIds), template);
                   setSelectedIds(new Set()); 
                }
                setShowBulkModal(null);
            }}
            selectedSnakes={snakes.filter(s => selectedIds.has(s.id))} 
        />
      )}

      {/* Bulk Print Area (Hidden) - Only render active elements to prevent ghosts in other print jobs */}
       <div id="print-bulk" className="hidden">
           <div className="grid grid-cols-2 gap-4 p-8 w-full h-full">
             {Array.from(selectedIds).map(id => {
                const s = snakes.find(snake => snake.id === id);
                if (!s) return null;
                return (
                    <div key={id} className="bg-white p-4 border-2 border-black w-[350px] h-[220px] flex gap-4 break-inside-avoid">
                         <div className="flex-1 flex flex-col justify-between">
                            <div>
                                <h2 className="text-2xl font-black text-black uppercase tracking-tighter leading-none mb-1">{s.id}</h2>
                                <span className="text-xs font-bold px-2 py-0.5 border border-black rounded inline-block uppercase mb-2">
                                    {s.sex}
                                </span>
                                <div className="text-xs font-bold text-black leading-tight border-l-2 border-black pl-2">
                                    {s.genetics.map(g => <div key={g}>{g}</div>)}
                                </div>
                            </div>
                            <div className="text-[10px] font-bold uppercase text-slate-500">PROGENIX GENETICS</div>
                        </div>
                        <div className="w-24 shrink-0 flex items-center">
                            <QRCode 
                                value={JSON.stringify({id: s.id, g: s.genetics})} 
                                size={90} 
                            />
                        </div>
                    </div>
                );
             })}
           </div>
      </div>

    </div>
  );
};

const BulkActionModal = ({ type, count, onClose, onConfirm, selectedSnakes }: { type: 'feeding' | 'weight' | 'print', count: number, onClose: () => void, onConfirm: (t: any) => void, selectedSnakes: Snake[] }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Feed State
    const [result, setResult] = useState('Eaten');
    const [item, setItem] = useState(''); 

    if (type === 'print') {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl p-6 shadow-2xl text-center border border-slate-200 dark:border-slate-700">
                    <Printer size={48} className="mx-auto text-emerald-500 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Print {count} Cage Cards</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">This will generate a printable sheet with QR codes for all selected reptiles.</p>
                    <div className="flex gap-4">
                        <button onClick={onClose} className="flex-1 py-3 text-slate-500 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
                        <button onClick={() => onConfirm({})} className="flex-1 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90">Print Now</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
             <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-xl p-6 shadow-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Bulk Log {type === 'feeding' ? 'Feeding' : 'Weight'}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-500" /></button>
                </div>
                
                <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50">
                    Applying to <strong>{count}</strong> selected reptiles.
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500" />
                    </div>
                    {type === 'feeding' && (
                        <>
                           <div>
                                <label className="text-xs font-bold text-slate-500 uppercase">Prey Item</label>
                                <input 
                                    type="text" 
                                    value={item} 
                                    onChange={e => setItem(e.target.value)} 
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 text-slate-900 dark:text-white outline-none focus:border-emerald-500" 
                                    placeholder="(Leave empty to use default)" 
                                />
                           </div>
                           <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-1 block">Result</label>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setResult('Eaten')}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                                            result === 'Eaten' 
                                            ? 'bg-emerald-500 border-emerald-500 text-white shadow-md' 
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500'
                                        }`}
                                    >
                                        Eaten
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setResult('Refused')}
                                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                                            result === 'Refused' 
                                            ? 'bg-rose-500 border-rose-500 text-white shadow-md' 
                                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-rose-500 hover:text-rose-500'
                                        }`}
                                    >
                                        Refused
                                    </button>
                                </div>
                           </div>
                        </>
                    )}
                </div>

                <button 
                    onClick={() => {
                        const template: any = { type: type === 'feeding' ? 'Feeding' : 'Weight', date };
                        if (type === 'feeding') {
                            template.result = result;
                            if (item) template.item = item;
                        }
                        onConfirm(template);
                    }}
                    className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg"
                >
                    Confirm Bulk Log
                </button>
             </div>
        </div>
    );
}
