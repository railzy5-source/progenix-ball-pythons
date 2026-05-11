
import React, { useState } from 'react';
import { Facebook, Instagram, Twitter, Mail, MapPin, CheckCircle2, Loader2, Info } from 'lucide-react';
import { Logo } from './Logo';

interface FooterProps {
  onNavigate: (tab: 'home' | 'collection' | 'available' | 'breeding' | 'calculator' | 'logistics') => void;
  onSubscribe?: (email: string) => Promise<void>;
  onOpenTerms?: () => void;
  onOpenSitemap?: () => void;
  onOpenPrivacy?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onSubscribe, onOpenTerms, onOpenSitemap, onOpenPrivacy }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNav = (e: React.MouseEvent, tab: 'home' | 'collection' | 'available' | 'breeding' | 'calculator' | 'logistics') => {
    e.preventDefault();
    onNavigate(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = async () => {
    if (!email || !email.includes('@')) return;
    if (!onSubscribe) return;
    setStatus('loading');
    try {
      await onSubscribe(email);
      setStatus('success');
      setEmail('');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <footer id="footer" className="bg-slate-950 text-slate-300 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="mb-5">
              <Logo textClassName="text-white" />
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Producing high quality Ball Pythons through selective breeding and meticulous care from a private collection in Cardiff, Wales.
            </p>
            <div className="flex gap-2.5">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                <Instagram size={15} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                <Facebook size={15} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl text-slate-400 hover:text-white transition-all duration-200">
                <Twitter size={15} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', tab: 'home' },
                { label: 'Available', tab: 'available' },
                { label: 'Collection', tab: 'collection' },
                { label: 'Breeding Projects', tab: 'breeding' },
                { label: 'Genetic Tools', tab: 'calculator' },
              ].map(({ label, tab }) => (
                <li key={tab}>
                  <a 
                    href="#" 
                    onClick={(e) => handleNav(e, tab as any)} 
                    className="text-sm text-slate-500 hover:text-emerald-400 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact-section">
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-500">St Mellons, Cardiff<br />Wales, United Kingdom</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={14} className="text-emerald-500 shrink-0" />
                <a href="mailto:progenixbp@gmail.com" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors break-all">
                  progenixbp@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-widest text-[10px]">Breeding Updates</h4>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Be first to hear about new availability, pairings, and hatchlings.
            </p>
            
            {status === 'success' ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-center gap-3 text-emerald-400">
                <CheckCircle2 size={18} />
                <span className="text-sm font-semibold">You're subscribed!</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                  placeholder="your@email.com" 
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm w-full focus:outline-none focus:border-emerald-500/50 focus:bg-white/8 transition-all text-white placeholder:text-slate-600"
                />
                <button 
                  onClick={handleSubscribe}
                  disabled={status === 'loading'}
                  className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center min-w-[52px]"
                >
                  {status === 'loading' ? <Loader2 size={15} className="animate-spin" /> : 'Join'}
                </button>
              </div>
            )}
            {status === 'error' && <p className="text-xs text-rose-500 mt-2">Something went wrong. Please try again.</p>}
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 space-y-6">
          {/* Regulatory notice */}
          <div className="flex gap-3 items-start bg-white/[0.02] border border-white/5 rounded-xl p-4 max-w-3xl mx-auto text-center">
            <Info size={13} className="text-slate-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              Progenix Ball Pythons is a private hobbyist collection. We are not a licensed pet shop or commercial business. 
              All animals are surplus stock from our own breeding projects and are <strong className="text-slate-500">not sold as pets</strong>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-600">
            <p>&copy; 2026 Progenix Ball Pythons. All rights reserved.</p>
            <div className="flex gap-5">
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenPrivacy?.(); }} className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenTerms?.(); }} className="hover:text-slate-300 transition-colors">Terms of Sale</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onOpenSitemap?.(); }} className="hover:text-slate-300 transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
