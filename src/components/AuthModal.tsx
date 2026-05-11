
import React, { useState } from 'react';
import { Lock, Unlock, Loader2, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        const { error } = await signIn(email, password);
        if (error) {
            setError(error.message || 'Authentication failed');
        } else {
            onLoginSuccess();
            onClose();
            setEmail('');
            setPassword('');
        }
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden relative">
        
        {/* Decorative Top Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-cyan-500 w-full"></div>

        <div className="p-8">
          <div className="flex flex-col items-center mb-6">
             <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
                <Lock className="text-emerald-500" size={24} />
             </div>
             <h3 className="text-xl font-bold text-slate-900 dark:text-white">Admin Login</h3>
             <p className="text-xs text-slate-500 mt-1">Sign in with Supabase Auth</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
               <div className="absolute top-3.5 left-3 text-slate-400">
                   <Mail size={18} />
               </div>
               <input 
                type="email" 
                autoFocus
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                placeholder="admin@progenix.com"
                disabled={loading}
                required
              />
            </div>
            
             <div className="relative">
               <div className="absolute top-3.5 left-3 text-slate-400">
                   <Lock size={18} />
               </div>
               <input 
                type="password" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-3 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-sm font-medium"
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg animate-pulse">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-lg hover:opacity-90 transition-opacity flex justify-center items-center gap-2 shadow-lg mt-2"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Unlock size={18} />}
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3">
             <button onClick={onClose} className="text-[10px] text-slate-300 hover:text-slate-500 uppercase tracking-widest font-bold mt-2">
                 Cancel
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
