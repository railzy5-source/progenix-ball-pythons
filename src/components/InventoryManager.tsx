
import React, { useState } from 'react';
import { InventoryItem } from '../types';
import { Archive, Plus, Minus, Trash2, Info, X } from 'lucide-react';
import { PREY_PRICE_MAP } from '../services/shoppingListService';

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onUpdateInventory: (newInventory: InventoryItem[]) => void;
  onClose: () => void;
}

export const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, onUpdateInventory, onClose }) => {
  const [newItem, setNewItem] = useState('');

  const handleUpdateQuantity = (preySize: string, delta: number) => {
    const updatedInventory = inventory.map(item => {
      if (item.preySize === preySize) {
        return { ...item, quantity: Math.max(0, item.quantity + delta), lastUpdated: new Date().toISOString() };
      }
      return item;
    });
    onUpdateInventory(updatedInventory);
  };

  const handleRemoveItem = (preySize: string) => {
    if (window.confirm(`Remove ${preySize} from your inventory list?`)) {
      onUpdateInventory(inventory.filter(item => item.preySize !== preySize));
    }
  };

  const handleAddItem = () => {
    if (newItem && !inventory.some(item => item.preySize === newItem)) {
      const newInventoryItem: InventoryItem = {
        preySize: newItem,
        quantity: 0,
        lastUpdated: new Date().toISOString()
      };
      onUpdateInventory([...inventory, newInventoryItem].sort((a,b) => (PREY_PRICE_MAP[a.preySize] || 0) - (PREY_PRICE_MAP[b.preySize] || 0)));
      setNewItem('');
    }
  };

  const availablePreyToAdd = Object.keys(PREY_PRICE_MAP)
    .filter(preySize => !inventory.some(item => item.preySize === preySize))
    .sort((a, b) => (PREY_PRICE_MAP[a] || 0) - (PREY_PRICE_MAP[b] || 0));

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[80vh]">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Archive className="text-emerald-500" size={20} />
            Frozen Food Inventory
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-xs text-slate-500 mb-4 px-2">Update quantities to reflect your current stock. This will be automatically deducted from your next shopping list.</p>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border-y border-slate-100 dark:border-slate-800">
            {inventory.length === 0 ? (
              <div className="p-8 text-center text-slate-400 flex flex-col items-center">
                <Info size={24} className="mb-2 opacity-50" />
                Your inventory is empty. Add items below.
              </div>
            ) : (
              inventory.map(item => (
                <div key={item.preySize} className="p-3 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{item.preySize}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleUpdateQuantity(item.preySize, -1)} className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-rose-100 dark:hover:bg-rose-900/40"><Minus size={14} /></button>
                    <span className="font-mono font-bold text-slate-900 dark:text-white w-8 text-center">{item.quantity}</span>
                    <button onClick={() => handleUpdateQuantity(item.preySize, 1)} className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900/40"><Plus size={14} /></button>
                    <button onClick={() => handleRemoveItem(item.preySize)} className="ml-2 p-1.5 text-slate-400 hover:text-rose-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
          <div className="flex gap-2">
              <select
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Add new prey type...</option>
                {availablePreyToAdd.map(prey => (
                  <option key={prey} value={prey}>{prey}</option>
                ))}
              </select>
              <button
                  onClick={handleAddItem}
                  disabled={!newItem}
                  className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
              >
                  Add Item
              </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button onClick={onClose} className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-6 py-2.5 rounded-lg font-bold text-sm">
                Done
            </button>
        </div>
      </div>
    </div>
  );
};
