
import React, { useState, useEffect } from 'react';
import { Pairing, Clutch, Snake, PairingEvent, PairingEventType } from '../types';
import { Egg, Plus, Trash2, X, AlertCircle, Calendar, Activity, Dna, Thermometer, ArrowRight, Share2, Eye, ArrowRightLeft, Archive, Lock, Heart, CheckCircle2 } from 'lucide-react';
import { MorphTag } from './MorphTag';
import { HoldbackEvaluatorModal } from './HoldbackEvaluatorModal';
import { generateNextId } from '../services/automationService';

interface BreedingManagerProps {
  pairings: Pairing[];
  clutches: Clutch[];
  snakes: Snake[];
  onAddPairing: (pairing: Pairing) => void;
  onUpdatePairing: (pairing: Pairing) => void;
  onDeletePairing: (id: string) => void;
  onAddClutch: (clutch: Clutch) => void;
  onUpdateClutch: (clutch: Clutch) => void;
  onDeleteClutch: (id: string) => void;
  onAddSnake: (snake: Snake) => void;
  onUpdateSnake?: (snake: Snake) => void;
  isReadOnly?: boolean;
}

// --- HELPERS ---
const getEventIcon = (type: PairingEventType) => {
    switch (type) {
        case 'Lock': return <Lock size={14} />;
        case 'Ovulation': return <Egg size={14} />;
        case 'Pairing': return <Heart size={14} />;
        case 'Separation': return <ArrowRightLeft size={14} />;
        default: return <Activity size={14} />;
    }
};

const getEventColor = (type: PairingEventType) => {
    switch (type) {
        case 'Lock': return 'text-rose-500 bg-rose-100 dark:bg-rose-900/30';
        case 'Ovulation': return 'text-amber-500 bg-amber-100 dark:bg-amber-900/30';
        case 'Pairing': return 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30';
        case 'Separation': return 'text-slate-500 bg-slate-100 dark:bg-slate-800';
        default: return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
    }
};

// --- SUB-COMPONENTS ---

const ProjectDetailsModal = ({ pairing, sire, dam, onClose, onUpdate, isReadOnly }: { pairing: Pairing, sire?: Snake, dam?: Snake, onClose: () => void, onUpdate: (p: Pairing) => void, isReadOnly?: boolean }) => {
    const [newEventDate, setNewEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [newEventType, setNewEventType] = useState<PairingEventType>('Lock');
    const [newEventNotes, setNewEventNotes] = useState('');

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const event: PairingEvent = {
            id: `EV-${Date.now()}`,
            date: newEventDate,
            type: newEventType,
            details: newEventNotes
        };
        
        // Update pairing logic
        const updatedEvents = [...(pairing.events || []), event];
        const updates: Partial<Pairing> = { events: updatedEvents };
        
        // Auto-update status/lastLock
        if (newEventType === 'Lock') updates.lastLockDate = newEventDate;
        if (newEventType === 'Separation') updates.status = 'Separated';
        if (newEventType === 'Pairing') updates.status = 'Paired';
        if (newEventType === 'Ovulation') updates.status = 'Gravid';

        onUpdate({ ...pairing, ...updates });
        setNewEventNotes(''); // Reset notes
    };

    // Sort events descending
    const sortedEvents = [...(pairing.events || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Project {pairing.id}</h3>
                        <p className="text-xs text-slate-500">{dam?.id} x {sire?.id}</p>
                    </div>
                    <button onClick={onClose}><X size={24} className="text-slate-500" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-wider">Timeline</h4>
                    <div className="space-y-6 relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 ml-2">
                        {sortedEvents.map(event => (
                            <div key={event.id} className="relative pl-6">
                                <div className={`absolute -left-[29px] top-0 w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 flex items-center justify-center ${getEventColor(event.type)}`}>
                                    {getEventIcon(event.type)}
                                </div>
                                <div>
                                    <p className="text-xs font-mono text-slate-400 mb-1">{event.date}</p>
                                    <h5 className="font-bold text-slate-900 dark:text-white">{event.type}</h5>
                                    {event.details && <p className="text-sm text-slate-500 mt-1 bg-slate-50 dark:bg-slate-800 p-2 rounded">{event.details}</p>}
                                </div>
                            </div>
                        ))}
                        {sortedEvents.length === 0 && <p className="text-sm text-slate-400 pl-6">No events recorded yet.</p>}
                    </div>
                </div>

                {!isReadOnly && (
                    <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wider">Log New Event</h4>
                        <form onSubmit={handleAddEvent} className="flex flex-col gap-3">
                            <div className="flex gap-3">
                                <input 
                                    type="date" 
                                    value={newEventDate} 
                                    onChange={e => setNewEventDate(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                />
                                <select 
                                    value={newEventType}
                                    onChange={e => setNewEventType(e.target.value as any)}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                >
                                    <option value="Lock">Lock</option>
                                    <option value="Ovulation">Ovulation</option>
                                    <option value="Pairing">Pairing</option>
                                    <option value="Separation">Separation</option>
                                    <option value="Pre-Lay Shed">Pre-Lay Shed</option>
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <input 
                                    type="text" 
                                    placeholder="Notes..."
                                    value={newEventNotes}
                                    onChange={e => setNewEventNotes(e.target.value)}
                                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white outline-none focus:border-indigo-500"
                                />
                                <button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold text-sm transition-colors">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// -- MAIN COMPONENT --

export const BreedingManager: React.FC<BreedingManagerProps> = ({ 
  pairings, 
  clutches, 
  snakes,
  onAddPairing,
  onUpdatePairing,
  onDeletePairing,
  onAddClutch,
  onUpdateClutch,
  onDeleteClutch,
  onAddSnake,
  onUpdateSnake,
  isReadOnly = false
}) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'incubator' | 'history'>('projects');
  const [showPairingModal, setShowPairingModal] = useState(false);
  const [showClutchModal, setShowClutchModal] = useState(false);
  const [editingClutch, setEditingClutch] = useState<Clutch | null>(null);
  const [showHoldbackModal, setShowHoldbackModal] = useState(false);
  const [prefillPairingForClutch, setPrefillPairingForClutch] = useState<Pairing | null>(null);
  
  const [selectedPairingId, setSelectedPairingId] = useState<string | null>(null);
  
  // Helpers
  const getSnake = (id: string) => snakes.find(s => s.id === id);
  const getHatchlings = (clutchId: string) => snakes.filter(s => s.clutchId === clutchId);
  const incubatorCount = clutches.filter(c => c.status === 'Incubating').length;
  const historyCount = clutches.filter(c => c.status !== 'Incubating').length;
  const projectCount = pairings.length;

  // Actions
  const handleOpenClutchModal = (pairing?: Pairing) => {
      setPrefillPairingForClutch(pairing || null);
      setEditingClutch(null);
      setShowClutchModal(true);
  };

  const handleEditClutch = (clutch: Clutch) => {
      setEditingClutch(clutch);
      setPrefillPairingForClutch(null);
      setShowClutchModal(true);
  };

  const handleShareClutch = (clutch: Clutch) => {
      const sire = getSnake(clutch.sireId);
      const dam = getSnake(clutch.damId);
      const text = `🐍 Clutch: ${clutch.id}\n Sire: ${sire ? sire.id : clutch.sireId}\n Dam: ${dam ? dam.id : clutch.damId}\n🥚 Eggs: ${clutch.eggCount}\n📅 Laid: ${clutch.layDate}\n🐣 Est Hatch: ${clutch.hatchDateEst}`;
      navigator.clipboard.writeText(text);
      alert("Clutch details copied to clipboard!");
  };

  const safeDeletePairing = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isReadOnly) return;
    if (window.confirm('Delete this pairing? This cannot be undone.')) {
      onDeletePairing(id);
    }
  };

  const safeDeleteClutch = (id: string) => {
    if (isReadOnly) return;
    if (window.confirm('Delete this clutch record? This cannot be undone.')) {
      onDeleteClutch(id);
    }
  };

  const handleCreateHatchlings = async (clutch: Clutch) => {
     if (isReadOnly) return;
     const viableCount = Math.max(0, clutch.eggCount - (clutch.slugs || 0) - (clutch.infertiles || 0));
     
     if (viableCount === 0) {
        alert("No viable eggs calculated based on counts.");
        return;
     }

     if(!window.confirm(`Generate ${viableCount} hatchling records for Clutch ${clutch.id}? This will also mark the clutch as Hatched.`)) return;
     
     if (clutch.status !== 'Hatched') {
        onUpdateClutch({ ...clutch, status: 'Hatched' });
     }

     for (let i = 1; i <= viableCount; i++) {
        // Generates suffix 01, 02, etc.
        const suffix = i.toString().padStart(2, '0');
        const newSnake: Snake = {
            id: `${clutch.id}-${suffix}`, // Example: PDC001-01
            sex: 'Female', // Default, user can edit
            genetics: ['Unknown'],
            currentWeight: 60,
            targetWeight: 1500,
            health: 'Good',
            breedingReadiness: false,
            feeding: { dueFeed: false, preySize: 'Rat Pup', frequency: 5, isASF: false },
            logs: [],
            price: 0,
            status: 'Hold',
            dob: new Date().toISOString().split('T')[0],
            sireId: clutch.sireId,
            damId: clutch.damId,
            clutchId: clutch.id,
            image: ''
        };
        onAddSnake(newSnake);
     }
  };

  const selectedPairing = pairings.find(p => p.id === selectedPairingId);

  return (
    <div className="space-y-6 pb-20">
       {/* Toolbar */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-lg">
             {['projects', 'incubator', 'history'].map((tab: any) => (
                 <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md text-sm font-bold transition-all capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                 >
                    {tab} {tab === 'projects' ? `(${projectCount})` : tab === 'incubator' ? `(${incubatorCount})` : `(${historyCount})`}
                 </button>
             ))}
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             {activeTab === 'history' && onUpdateSnake && (
                 <button onClick={() => setShowHoldbackModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors border border-indigo-200 dark:border-indigo-800">
                    <ArrowRightLeft size={16} /> Holdback Helper
                 </button>
             )}
             {!isReadOnly && (
                <>
                    <button onClick={() => handleOpenClutchModal()} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700">
                        <Egg size={16} /> Log Clutch
                    </button>
                    <button onClick={() => setShowPairingModal(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-500/20">
                        <Plus size={16} /> New Pairing
                    </button>
                </>
             )}
          </div>
       </div>

       {/* --- PROJECTS TAB --- */}
       {activeTab === 'projects' && (
          <div className="flex flex-col gap-4 animate-fade-in">
             {pairings.length === 0 && (
                <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                   <Activity size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="font-medium">No active breeding projects.</p>
                </div>
             )}
             {pairings.map(pairing => {
                const male = getSnake(pairing.maleId);
                const female = getSnake(pairing.femaleId);
                const lockCount = pairing.events ? pairing.events.filter(e => e.type === 'Lock').length : 0;
                
                // Simple prob calculation based on locks (visual flair only)
                const probability = Math.min(100, lockCount * 25); 

                return (
                   <div 
                        key={pairing.id} 
                        onClick={() => setSelectedPairingId(pairing.id)}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden"
                   >    
                        {/* Status Stripe */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${pairing.status === 'Paired' ? 'bg-emerald-500' : pairing.status === 'Gravid' ? 'bg-amber-500' : 'bg-slate-700'}`}></div>

                        {/* Dam Section */}
                        <div className="flex items-center gap-4 flex-1 w-full md:w-auto">
                            <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border-2 border-white dark:border-slate-700 shadow-lg relative">
                                {female?.image ? <img src={female.image} className="w-full h-full object-cover" /> : <Dna className="w-8 h-8 text-slate-400 m-auto mt-6" />}
                                <div className="absolute bottom-0 w-full bg-rose-500 text-white text-[10px] font-bold text-center py-0.5">Dam</div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{female?.id || pairing.femaleId}</h3>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {/* Show ALL genetics, no slicing */}
                                    {female?.genetics.map((g, i) => <MorphTag key={i} gene={g} />)}
                                </div>
                            </div>
                        </div>

                        {/* Center Actions/Stats */}
                        <div className="flex flex-col items-center justify-center gap-2 min-w-[140px]">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                pairing.status === 'Paired' 
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 border border-emerald-500/30' 
                                : pairing.status === 'Gravid' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30'
                                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                                {pairing.status}
                            </span>
                            
                            <div className="flex items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1"><Lock size={12} /> {lockCount} Locks</span>
                                <span className="flex items-center gap-1"><Activity size={12} /> {probability}% Prob</span>
                            </div>

                            <div className="flex items-center gap-2 mt-1">
                                {!isReadOnly && (
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleOpenClutchModal(pairing); }}
                                        className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-emerald-500 hover:border-emerald-500 text-xs font-bold transition-all flex items-center gap-1"
                                    >
                                        <Egg size={12} /> Log Clutch
                                    </button>
                                )}
                                {!isReadOnly && (
                                    <button 
                                        onClick={(e) => safeDeletePairing(e, pairing.id)}
                                        className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Sire Section */}
                        <div className="flex items-center gap-4 flex-1 w-full md:w-auto justify-end text-right flex-row-reverse">
                            <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden shrink-0 border-2 border-white dark:border-slate-700 shadow-lg relative">
                                {male?.image ? <img src={male.image} className="w-full h-full object-cover" /> : <Dna className="w-8 h-8 text-slate-400 m-auto mt-6" />}
                                <div className="absolute bottom-0 w-full bg-blue-500 text-white text-[10px] font-bold text-center py-0.5">Sire</div>
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-slate-900 dark:text-white truncate">{male?.id || pairing.maleId}</h3>
                                <div className="flex flex-wrap gap-1 mt-1 justify-end">
                                    {/* Show ALL genetics, no slicing */}
                                    {male?.genetics.map((g, i) => <MorphTag key={i} gene={g} />)}
                                </div>
                            </div>
                        </div>
                   </div>
                );
             })}
          </div>
       )}

       {/* --- INCUBATOR TAB --- */}
       {activeTab === 'incubator' && (
          <div className="space-y-6 animate-fade-in">
             {clutches.filter(c => c.status === 'Incubating').length === 0 && (
                <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                   <Thermometer size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="font-medium">Incubator is empty.</p>
                </div>
             )}
             {clutches.filter(c => c.status === 'Incubating').map(clutch => {
                const sire = getSnake(clutch.sireId);
                const dam = getSnake(clutch.damId);
                const progress = Math.min(100, Math.max(0, ((new Date().getTime() - new Date(clutch.layDate).getTime()) / (new Date(clutch.hatchDateEst).getTime() - new Date(clutch.layDate).getTime())) * 100));
                const daysLeft = Math.ceil((new Date(clutch.hatchDateEst).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                // --- LOGIC FOR POTENTIAL GENES ---
                const sireGenetics = sire?.genetics || [];
                const damGenetics = dam?.genetics || [];
                
                // Start with all unique genes from parents
                const potentialSet = new Set([...sireGenetics, ...damGenetics]);

                // Detect potential Visuals from Recessive pairings (Het x Het, Het x Visual)
                const allHets = [...sireGenetics, ...damGenetics].filter(g => g.startsWith('Het '));
                // Iterate unique hets involved
                new Set(allHets).forEach(het => {
                    const visualName = het.replace('Het ', '');
                    const sireHas = sireGenetics.includes(het) || sireGenetics.includes(visualName);
                    const damHas = damGenetics.includes(het) || damGenetics.includes(visualName);
                    
                    // If both parents carry the gene (either as Het or Visual), the Visual form is possible in offspring
                    if (sireHas && damHas) {
                        potentialSet.add(visualName);
                    }
                });
                
                const allGenetics = Array.from(potentialSet);
                // --- END LOGIC ---

                return (
                   <div key={clutch.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      {/* Header */}
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clutch: {clutch.id}</h3>
                          <button onClick={() => handleShareClutch(clutch)} className="text-slate-400 hover:text-emerald-500"><Share2 size={18}/></button>
                      </div>
                      
                      <div className="p-6">
                          {/* Stats Row */}
                          <div className="flex items-center gap-6 mb-6 text-sm">
                              <div>
                                  <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase block">Date Laid</span>
                                  <span className="text-slate-900 dark:text-white font-medium">{clutch.layDate}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <Egg size={16} className="text-slate-400" />
                                  <span className="text-slate-900 dark:text-white font-bold">{clutch.eggCount} EGGS</span>
                              </div>
                          </div>

                          {/* Pairing Section */}
                          <div className="mb-6">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Pairing</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <SnakeCardSmall snake={sire} label={`Sire ${clutch.sireId}`} />
                                  <SnakeCardSmall snake={dam} label={`Dam ${clutch.damId}`} />
                              </div>
                          </div>

                          {/* Clutch Progress */}
                          <div className="mb-6">
                              <div className="flex justify-between items-end mb-2">
                                  <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-500">
                                          <Egg size={16} />
                                      </div>
                                      <span className="font-bold text-slate-900 dark:text-white text-sm">{daysLeft} days left</span>
                                  </div>
                                  <span className="text-xs text-slate-500">Est. Hatch: {clutch.hatchDateEst}</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${progress}%` }}></div>
                              </div>
                          </div>

                          {/* Morphs */}
                          <div className="mb-6">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Potential Genes</p>
                              <div className="flex flex-wrap gap-2">
                                  {allGenetics.map((g, i) => <MorphTag key={i} gene={g} />)}
                              </div>
                          </div>

                          {/* Actions */}
                          <div className="flex justify-end gap-3">
                              {!isReadOnly && (
                                  <button onClick={() => safeDeleteClutch(clutch.id)} className="px-4 py-2 text-slate-400 hover:text-rose-500 font-bold text-xs uppercase">
                                      Delete
                                  </button>
                              )}
                              {!isReadOnly && (
                                  <button onClick={() => handleCreateHatchlings(clutch)} className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg font-bold text-sm shadow-lg shadow-yellow-400/20 transition-all uppercase tracking-wide">
                                      Hatch Clutch
                                  </button>
                              )}
                          </div>
                      </div>
                   </div>
                );
             })}
          </div>
       )}

       {/* --- HISTORY TAB --- */}
       {activeTab === 'history' && (
          <div className="space-y-8 animate-fade-in">
             {clutches.filter(c => c.status !== 'Incubating').length === 0 && (
                <div className="py-16 text-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                   <Archive size={48} className="mx-auto mb-4 opacity-20" />
                   <p className="font-medium">No past clutches.</p>
                </div>
             )}
             {clutches.filter(c => c.status !== 'Incubating').map(clutch => {
                const sire = getSnake(clutch.sireId);
                const dam = getSnake(clutch.damId);
                const hatchlings = getHatchlings(clutch.id);
                // Collect unique genetics from hatchlings
                const hatchlingMorphs = Array.from(new Set(hatchlings.flatMap(s => s.genetics))).filter(g => g !== 'Unknown');

                return (
                   <div key={clutch.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white">Clutch: {clutch.id}</h3>
                          {!isReadOnly && <button onClick={() => safeDeleteClutch(clutch.id)} className="text-slate-400 hover:text-rose-500"><Trash2 size={16}/></button>}
                      </div>

                      <div className="p-6">
                          {/* Stats */}
                          <div className="flex items-center gap-6 mb-6 text-sm">
                              <div>
                                  <span className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase block">Date Hatched</span>
                                  <span className="text-slate-900 dark:text-white font-medium">{clutch.hatchDateEst}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                  <span className="text-slate-900 dark:text-white font-bold flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {hatchlings.length} HATCHLINGS</span>
                              </div>
                          </div>

                          {/* Pairing */}
                          <div className="mb-6">
                              <p className="text-xs font-bold text-slate-500 uppercase mb-2">Pairing</p>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <SnakeCardSmall snake={sire} label={`Sire ${clutch.sireId}`} />
                                  <SnakeCardSmall snake={dam} label={`Dam ${clutch.damId}`} />
                              </div>
                          </div>

                          {/* Hatchlings Grid */}
                          {hatchlings.length > 0 && (
                              <div className="mb-6">
                                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Hatchlings</p>
                                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                                      {hatchlings.map(hatchling => (
                                          <div key={hatchling.id} className="group relative">
                                              <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 flex flex-col items-center gap-1 transition-all hover:border-emerald-500 cursor-pointer">
                                                  <div className="text-[10px] text-slate-500 truncate w-full text-center font-bold">{hatchling.sex === 'Female' ? '♀' : '♂'} {hatchling.id}</div>
                                                  <NeonSnakeIcon />
                                              </div>
                                              {/* Tooltip */}
                                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black text-white text-[10px] p-2 rounded hidden group-hover:block z-10 pointer-events-none">
                                                  {hatchling.genetics.join(', ')}
                                              </div>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          )}

                          {/* Produced Morphs */}
                          {hatchlingMorphs.length > 0 && (
                              <div className="mb-6">
                                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Morphs Produced</p>
                                  <div className="flex flex-wrap gap-2">
                                      {hatchlingMorphs.map((g, i) => <MorphTag key={i} gene={g} />)}
                                  </div>
                              </div>
                          )}
                          
                          <div className="flex justify-end">
                              {!isReadOnly && (
                                  <button onClick={() => handleEditClutch(clutch)} className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-lg font-bold text-sm shadow-lg shadow-yellow-400/20 transition-all uppercase tracking-wide">
                                      View Clutch Details
                                  </button>
                              )}
                          </div>
                      </div>
                   </div>
                );
             })}
          </div>
       )}

       {/* Modals */}
       {selectedPairing && (
           <ProjectDetailsModal 
                pairing={selectedPairing}
                sire={getSnake(selectedPairing.maleId)}
                dam={getSnake(selectedPairing.femaleId)}
                onClose={() => setSelectedPairingId(null)}
                onUpdate={(p) => {
                    onUpdatePairing(p);
                    // Keep modal open but update local data flow
                }}
                isReadOnly={isReadOnly}
           />
       )}

       {showPairingModal && !isReadOnly && (
          <PairingModal 
             snakes={snakes} 
             onSave={(p) => { onAddPairing(p); setShowPairingModal(false); }} 
             onClose={() => setShowPairingModal(false)} 
          />
       )}

       {(showClutchModal || editingClutch) && (
          <ClutchModal 
             existingClutch={editingClutch}
             prefillPairing={prefillPairingForClutch}
             snakes={snakes}
             clutches={clutches}
             onSave={(c) => { 
                 if (editingClutch) onUpdateClutch(c);
                 else onAddClutch(c); 
                 setShowClutchModal(false); 
                 setEditingClutch(null);
             }}
             onClose={() => { setShowClutchModal(false); setEditingClutch(null); }}
          />
       )}

       {showHoldbackModal && onUpdateSnake && (
           <HoldbackEvaluatorModal 
              snakes={snakes}
              onUpdateSnake={onUpdateSnake}
              onClose={() => setShowHoldbackModal(false)}
           />
       )}

    </div>
  );
};

// --- Internal Components ---

const RefreshCwIcon = ({ size }: { size: number }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
);

const PairingModal = ({ snakes, onSave, onClose }: { snakes: Snake[], onSave: (p: Pairing) => void, onClose: () => void }) => {
    const males = snakes.filter(s => s.sex === 'Male');
    const females = snakes.filter(s => s.sex === 'Female');
    const [maleId, setMaleId] = useState(males[0]?.id || '');
    const [femaleId, setFemaleId] = useState(females[0]?.id || '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPairing: Pairing = {
            id: `PR-${Date.now().toString().slice(-6)}`,
            maleId,
            femaleId,
            startDate: date,
            status: 'Paired',
            events: [{ id: `EV-${Date.now()}`, date, type: 'Pairing', details: 'Initial introduction' }]
        };
        onSave(newPairing);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">New Project</h3>
                    <button onClick={onClose}><X size={24} className="text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Sire</label>
                        <select value={maleId} onChange={e => setMaleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                            {males.map(s => <option key={s.id} value={s.id}>{s.id} ({s.genetics.join(', ')})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Dam</label>
                        <select value={femaleId} onChange={e => setFemaleId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white">
                            {females.map(s => <option key={s.id} value={s.id}>{s.id} ({s.genetics.join(', ')})</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg mt-2">Create Pairing</button>
                </form>
            </div>
        </div>
    );
};

const ClutchModal = ({ existingClutch, prefillPairing, snakes, clutches, onSave, onClose }: { existingClutch?: Clutch | null, prefillPairing: Pairing | null, snakes: Snake[], clutches: Clutch[], onSave: (c: Clutch) => void, onClose: () => void }) => {
    const [damId, setDamId] = useState(existingClutch?.damId || prefillPairing?.femaleId || '');
    const [sireId, setSireId] = useState(existingClutch?.sireId || prefillPairing?.maleId || '');
    const [layDate, setLayDate] = useState(existingClutch?.layDate || new Date().toISOString().split('T')[0]);
    const [eggCount, setEggCount] = useState(existingClutch?.eggCount || 6);
    const [slugs, setSlugs] = useState(existingClutch?.slugs || 0);
    const [infertiles, setInfertiles] = useState(existingClutch?.infertiles || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const incubationDays = 60;
        const lay = new Date(layDate);
        lay.setDate(lay.getDate() + incubationDays);
        
        // Use existing ID if editing, else generate new
        const newId = existingClutch ? existingClutch.id : generateNextId(clutches, 'PDC', 3);

        const newClutch: Clutch = {
            id: newId, 
            pairingId: existingClutch?.pairingId || prefillPairing?.id || 'Unknown',
            damId,
            sireId,
            layDate,
            eggCount,
            slugs,
            infertiles,
            hatchDateEst: lay.toISOString().split('T')[0],
            status: existingClutch ? existingClutch.status : 'Incubating'
        };
        onSave(newClutch);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {existingClutch ? `Edit Clutch ${existingClutch.id}` : 'Log Clutch'}
                    </h3>
                    <button onClick={onClose}><X size={24} className="text-slate-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Dam</label>
                            <input value={damId} onChange={e => setDamId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" placeholder="ID" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Sire</label>
                            <input value={sireId} onChange={e => setSireId(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" placeholder="ID" />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase">Lay Date</label>
                        <input type="date" value={layDate} onChange={e => setLayDate(e.target.value)} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Total Eggs</label>
                            <input type="number" value={eggCount} onChange={e => setEggCount(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Slugs</label>
                            <input type="number" value={slugs} onChange={e => setSlugs(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase">Infertiles</label>
                            <input type="number" value={infertiles} onChange={e => setInfertiles(parseInt(e.target.value))} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg mt-2">
                        {existingClutch ? 'Save Changes' : 'Start Incubation'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const SnakeCardSmall = ({ snake, label }: { snake?: Snake, label: string }) => (
    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-200 dark:border-slate-800 w-full">
        <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-md overflow-hidden shrink-0 relative">
            {snake?.image ? (
                <img src={snake.image} className="w-full h-full object-cover" alt={snake.id} />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Dna size={16} />
                </div>
            )}
        </div>
        <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{snake?.id || 'Unknown'}</p>
        </div>
    </div>
);

const NeonSnakeIcon = () => (
    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-emerald-500 shadow-inner border border-emerald-500/20">
       <Dna size={14} />
    </div>
);
