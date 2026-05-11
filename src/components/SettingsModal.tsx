
import React, { useRef } from 'react';
import { X, Download, Upload, Database, LogOut } from 'lucide-react';
import { storageService } from '../services/storage';
import { CollectionData } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SettingsModalProps {
  onClose: () => void;
  currentData: Partial<CollectionData>;
  onDataImported: (data: Partial<CollectionData>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, currentData, onDataImported }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, signOut } = useAuth();

  // Security Gate: Do not render if not logged in
  if (!user) {
      return null;
  }

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const data = await storageService.importData(file);
      if (data) {
        onDataImported(data);
        alert('Backup restored successfully!');
        onClose();
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Database className="text-emerald-500" size={24} />
             </div>
             <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">System Settings</h2>
                <p className="text-xs text-slate-500">Manage account and backups.</p>
             </div>
          </div>
          <button onClick={onClose}><X size={24} className="text-slate-500" /></button>
        </div>

        <div className="overflow-y-auto p-6 space-y-8">

          {/* Account Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Admin Account</h3>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 flex justify-between items-center border border-slate-200 dark:border-slate-700">
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Logged in as</p>
                    <p className="text-xs text-slate-500 font-mono">{user.email}</p>
                </div>
                <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-500 hover:border-rose-200 text-slate-600 dark:text-slate-400 rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                >
                    <LogOut size={16} /> Sign Out
                </button>
            </div>
          </section>

          {/* Backup / Restore */}
          <section>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <button 
                 onClick={() => storageService.exportData(currentData)}
                 className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 transition-all group"
               >
                  <Download size={32} className="text-slate-400 group-hover:text-emerald-500 mb-3 transition-colors" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">Export Backup</span>
                  <span className="text-xs text-slate-500 mt-1">Download JSON file</span>
               </button>

               <button 
                 onClick={handleImportClick}
                 className="flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all group"
               >
                  <Upload size={32} className="text-slate-400 group-hover:text-blue-500 mb-3 transition-colors" />
                  <span className="font-bold text-slate-700 dark:text-slate-200">Import Backup</span>
                  <span className="text-xs text-slate-500 mt-1">Restore from JSON file</span>
               </button>
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileChange} 
                 className="hidden" 
                 accept=".json"
               />
            </div>
          </section>

          {/* Danger Zone */}
           <section className="border-t border-slate-100 dark:border-slate-800 pt-8">
              <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider mb-4">Danger Zone</h3>
              <button 
                onClick={() => {
                   if(confirm("Are you sure? This will wipe LOCAL data. If you are logged in, Cloud data is preserved.")) {
                      storageService.clearAll();
                      window.location.reload();
                   }
                }}
                className="px-4 py-2 border border-rose-200 dark:border-rose-900 text-rose-500 rounded-lg text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/20"
              >
                 Reset Local Data
              </button>
           </section>

        </div>
      </div>
    </div>
  );
};
