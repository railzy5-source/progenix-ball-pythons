
import React from 'react';
import { 
  X, 
  Map, 
  LayoutDashboard, 
  ShoppingBag, 
  ListFilter, 
  Calculator, 
  HeartHandshake, 
  BookOpen, 
  Scale, 
  Shield, 
  Lock, 
  Mail,
  Home
} from 'lucide-react';
import { Logo } from './Logo';

interface SitemapModalProps {
  onClose: () => void;
  onNavigate: (tab: 'home' | 'collection' | 'available' | 'breeding' | 'calculator') => void;
  onOpenCareGuide: () => void;
  onOpenTerms: () => void;
  onOpenLogin: () => void;
  onOpenPrivacy?: () => void;
}

export const SitemapModal: React.FC<SitemapModalProps> = ({ 
  onClose, 
  onNavigate, 
  onOpenCareGuide, 
  onOpenTerms, 
  onOpenLogin,
  onOpenPrivacy
}) => {

  const handleNav = (tab: 'home' | 'collection' | 'available' | 'breeding' | 'calculator') => {
    onNavigate(tab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Map className="text-emerald-500" /> Sitemap
            </h2>
            <p className="text-xs text-slate-500">Overview of site structure and quick links.</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-white dark:bg-slate-950">
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Section 1: Main Navigation */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                    Explore
                 </h3>
                 <ul className="space-y-3">
                    <li>
                        <button onClick={() => handleNav('home')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <LayoutDashboard size={18} />
                            </div>
                            <span className="font-bold text-sm">Dashboard</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('available')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <ShoppingBag size={18} />
                            </div>
                            <span className="font-bold text-sm">Available Animals</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('collection')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <ListFilter size={18} />
                            </div>
                            <span className="font-bold text-sm">Full Collection</span>
                        </button>
                    </li>
                 </ul>
              </div>

              {/* Section 2: Tools & Breeding */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                    Tools & Breeding
                 </h3>
                 <ul className="space-y-3">
                    <li>
                        <button onClick={() => handleNav('breeding')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <HeartHandshake size={18} />
                            </div>
                            <span className="font-bold text-sm">Projects & Incubator</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => handleNav('calculator')} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <Calculator size={18} />
                            </div>
                            <span className="font-bold text-sm">Genetic Calculator</span>
                        </button>
                    </li>
                 </ul>
              </div>

              {/* Section 3: Resources & Legal */}
              <div className="space-y-4">
                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
                    Support
                 </h3>
                 <ul className="space-y-3">
                    <li>
                        <button onClick={() => { onOpenCareGuide(); onClose(); }} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <BookOpen size={18} />
                            </div>
                            <span className="font-bold text-sm">Care Guide</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { onOpenTerms(); onClose(); }} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <Scale size={18} />
                            </div>
                            <span className="font-bold text-sm">Terms of Sale</span>
                        </button>
                    </li>
                    <li>
                        <button onClick={() => { if(onOpenPrivacy) onOpenPrivacy(); onClose(); }} className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <Shield size={18} />
                            </div>
                            <span className="font-bold text-sm">Privacy Policy</span>
                        </button>
                    </li>
                    <li>
                        <a href="mailto:progenixbp@gmail.com" className="flex items-center gap-3 text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors w-full text-left group">
                            <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
                                <Mail size={18} />
                            </div>
                            <span className="font-bold text-sm">Contact</span>
                        </a>
                    </li>
                    <li className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <button onClick={() => { onOpenLogin(); onClose(); }} className="flex items-center gap-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors w-full text-left group">
                            <Lock size={14} />
                            <span className="font-bold text-xs">Admin Login</span>
                        </button>
                    </li>
                 </ul>
              </div>

           </div>

           <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center">
                <Logo />
                <p className="text-xs text-slate-400 mt-4">&copy; 2026 Progenix Ball Pythons. All rights reserved.</p>
           </div>

        </div>
      </div>
    </div>
  );
};
