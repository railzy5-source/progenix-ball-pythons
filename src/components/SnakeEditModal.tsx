
import React, { useState, useEffect } from 'react';
import { Snake } from '../types';
import { X, Save, Wand2 } from 'lucide-react';
import { storageService } from '../services/storage';
import { calculateFrequency, calculatePreySize, calculateReadiness, generateNextId } from '../services/automationService';

interface SnakeEditModalProps {
  snake?: Snake | null;
  allSnakes: Snake[];
  onSave: (snake: Snake) => void;
  onClose: () => void;
}

const emptySnake: Snake = {
  id: '',
  genetics: [],
  sex: 'Female',
  currentWeight: 0,
  targetWeight: 1500,
  health: 'No issues',
  breedingReadiness: false,
  feeding: {
    dueFeed: false,
    preySize: '',
    frequency: 7,
    isASF: true
  },
  logs: [],
  status: 'Collection',
  image: '',
  price: 0
};

export const SnakeEditModal: React.FC<SnakeEditModalProps> = ({ snake, allSnakes, onSave, onClose }) => {
  const [formData, setFormData] = useState<Snake>(snake ? { ...snake } : { ...emptySnake });
  const [geneticsInput, setGeneticsInput] = useState(snake ? snake.genetics.join(', ') : '');
  const [autoCalculate, setAutoCalculate] = useState(true);
  
  // Potential parents list
  const [potentialSires, setPotentialSires] = useState<Snake[]>([]);
  const [potentialDams, setPotentialDams] = useState<Snake[]>([]);

  useEffect(() => {
     // If adding a new snake (no existing ID in props), generate the next PDS ID
     if (!snake || !snake.id) {
         const nextId = generateNextId(allSnakes, 'PDS');
         setFormData(prev => ({ ...prev, id: nextId }));
     }

     // Load all snakes to populate parent dropdowns (async to simulate DB fetch or just access store)
     const loadParents = async () => {
         const data = await storageService.loadData();
         if (data.snakes) {
             setPotentialSires(data.snakes.filter(s => s.sex === 'Male' && s.id !== formData.id));
             setPotentialDams(data.snakes.filter(s => s.sex === 'Female' && s.id !== formData.id));
         }
     };
     loadParents();
  }, [snake, allSnakes, formData.id]); // Added dependencies

  // Auto-calculation effect
  useEffect(() => {
    if (autoCalculate) {
      setFormData(prev => ({
        ...prev,
        breedingReadiness: calculateReadiness(prev.currentWeight, prev.sex),
        feeding: {
          ...prev.feeding,
          frequency: calculateFrequency(prev.currentWeight, prev.sex),
          preySize: calculatePreySize(prev.currentWeight, prev.sex, !!prev.feeding.isASF)
        }
      }));
    }
  }, [formData.currentWeight, formData.sex, formData.feeding.isASF, autoCalculate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof Snake] as any,
          [child]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseFloat(value) || 0 : 
                 type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
      }));
    }
  };

  const handleGeneticsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGeneticsInput(e.target.value);
    setFormData(prev => ({
      ...prev,
      genetics: e.target.value.split(',').map(g => g.trim()).filter(g => g !== '')
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id) {
       alert("ID is required");
       return;
    }
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
             <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {snake ? `Edit ${snake.id}` : 'Add New Reptile'}
             </h2>
             <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                <input 
                  type="checkbox" 
                  id="autoCalc"
                  checked={autoCalculate}
                  onChange={(e) => setAutoCalculate(e.target.checked)}
                  className="w-4 h-4 text-indigo-500 rounded focus:ring-indigo-500"
                />
                <label htmlFor="autoCalc" className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1 cursor-pointer select-none">
                  <Wand2 size={12} /> Auto-Calculate
                </label>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Name</label>
              <input 
                name="id" 
                value={formData.id} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none font-mono"
                placeholder="e.g. PDS008"
                required
              />
            </div>
            
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sex</label>
              <select 
                name="sex" 
                value={formData.sex} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
              </select>
            </div>
          </div>

          {/* Lineage Section */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300 mb-4">Origin & Lineage</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2 col-span-full md:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Clutch ID</label>
                    <input 
                      name="clutchId" 
                      value={formData.clutchId || ''} 
                      onChange={handleChange}
                      placeholder="e.g. 2502"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2 col-span-full md:col-span-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date of Birth / Hatch</label>
                    <input 
                      type="date"
                      name="dob" 
                      value={formData.dob || ''} 
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-blue-500 uppercase tracking-wider">Sire (Father)</label>
                    <select 
                      name="sireId" 
                      value={formData.sireId || ''} 
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Unknown / Outside</option>
                      {potentialSires.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-rose-500 uppercase tracking-wider">Dam (Mother)</label>
                    <select 
                      name="damId" 
                      value={formData.damId || ''} 
                      onChange={handleChange}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="">Unknown / Outside</option>
                      {potentialDams.map(s => <option key={s.id} value={s.id}>{s.id}</option>)}
                    </select>
                 </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Genetics (Comma separated)</label>
            <input 
              value={geneticsInput} 
              onChange={handleGeneticsChange}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="e.g. Pastel, Clown, Yellow Belly"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.genetics.map((g, i) => (
                <span key={i} className="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 text-xs rounded font-medium">
                  {g}
                </span>
              ))}
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Weight (g)</label>
              <input 
                type="number"
                name="currentWeight" 
                value={formData.currentWeight} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Weight (g)</label>
              <input 
                type="number"
                name="targetWeight" 
                value={formData.targetWeight} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
             <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Price (£)</label>
              <input 
                type="number"
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-sm font-bold text-slate-600 dark:text-slate-300">Feeding Automation</h3>
               <div className="flex items-center gap-2">
                   <input 
                    type="checkbox" 
                    id="isASF"
                    name="feeding.isASF"
                    checked={formData.feeding.isASF}
                    onChange={e => setFormData({...formData, feeding: {...formData.feeding, isASF: e.target.checked}})}
                    className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500"
                   />
                   <label htmlFor="isASF" className="text-xs font-medium text-slate-600 dark:text-slate-400">Eats ASF?</label>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Prey Size</label>
                <div className="relative">
                   <input 
                    name="feeding.preySize" 
                    value={formData.feeding.preySize} 
                    onChange={handleChange}
                    className={`w-full bg-white dark:bg-slate-900 border ${autoCalculate ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none`}
                    placeholder="e.g. Rat Pup"
                    readOnly={autoCalculate}
                  />
                  {autoCalculate && <Wand2 size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />}
                </div>
              </div>
               <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Feeding Freq (Days)</label>
                <div className="relative">
                   <input 
                    type="number"
                    name="feeding.frequency" 
                    value={formData.feeding.frequency} 
                    onChange={handleChange}
                    className={`w-full bg-white dark:bg-slate-900 border ${autoCalculate ? 'border-emerald-300 dark:border-emerald-800' : 'border-slate-200 dark:border-slate-700'} rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none`}
                    readOnly={autoCalculate}
                  />
                  {autoCalculate && <Wand2 size={14} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-500" />}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Image URL</label>
            <div className="flex gap-2">
              <input 
                name="image" 
                value={formData.image} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                placeholder="https://..."
              />
            </div>
             {formData.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${formData.breedingReadiness ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-700'}`}>
               <input 
                type="checkbox" 
                id="breedingReadiness"
                name="breedingReadiness"
                checked={formData.breedingReadiness}
                onChange={e => setFormData({...formData, breedingReadiness: e.target.checked})}
                disabled={autoCalculate}
                className="w-5 h-5 text-rose-500 rounded focus:ring-rose-500 disabled:opacity-50"
               />
               <label htmlFor="breedingReadiness" className={`text-sm font-bold ${formData.breedingReadiness ? 'text-rose-700 dark:text-rose-400' : 'text-slate-500'}`}>
                  {formData.breedingReadiness ? 'Ready to Breed' : 'Not Ready'}
               </label>
               {autoCalculate && formData.breedingReadiness && <Wand2 size={12} className="ml-auto text-rose-500" />}
            </div>
             <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-700">
               <input 
                type="checkbox" 
                id="dueFeed"
                name="feeding.dueFeed"
                checked={formData.feeding.dueFeed}
                onChange={e => setFormData({...formData, feeding: {...formData.feeding, dueFeed: e.target.checked}})}
                className="w-5 h-5 text-emerald-500 rounded focus:ring-emerald-500"
               />
               <label htmlFor="dueFeed" className="text-sm font-medium text-slate-700 dark:text-slate-300">Feed Due</label>
            </div>
          </div>
          
          <div className="space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
             <select 
                name="status" 
                value={formData.status} 
                onChange={handleChange}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none"
              >
                <option value="Collection">Collection</option>
                <option value="For Sale">For Sale</option>
                <option value="Hold">Hold</option>
                <option value="Sold">Sold</option>
              </select>
          </div>

        </form>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-all font-medium flex items-center gap-2"
          >
            <Save size={18} />
            Save Reptile
          </button>
        </div>
      </div>
    </div>
  );
};
