
import React, { useState } from 'react';
import { KeyMetrics } from '../types';
import { ArrowRight, Sparkles, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { AnimatedHeroBackground } from './AnimatedHeroBackground';

const CUSTOM_IMAGE_URL = "https://i.ibb.co/vvwz1YDt/mascot.png"; 

interface HeroProps {
  metrics: KeyMetrics;
  pairingCount: number;
  onViewCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({ metrics, pairingCount, onViewCollection }) => {
  const [imgError, setImgError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const getSource = () => {
    if (CUSTOM_IMAGE_URL) return CUSTOM_IMAGE_URL;
    return `mascot.png?v=${retryCount}`;
  };

  const scrollToContact = () => {
    document.getElementById('footer')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollDown = () => {
    window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-hidden mb-16 rounded-3xl bg-slate-950">
      
      {/* Layered background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-950" />
        <AnimatedHeroBackground />
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950 opacity-40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36 flex flex-col md:flex-row items-center justify-between gap-12">
        
        {/* Left — Text */}
        <div className="max-w-2xl flex-1 text-center md:text-left animate-fade-in">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-8 tracking-widest uppercase backdrop-blur-sm">
            <Sparkles size={12} />
            <span>Cardiff, United Kingdom</span>
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-[80px] font-bold text-white mb-6 leading-[1.02] tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            The Art of
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-500">
              Genetics
            </span>
            <br />
            <span className="text-white/90">Perfected.</span>
          </h1>
          
          <p className="text-base text-slate-400 mb-10 leading-relaxed max-w-md mx-auto md:mx-0 font-light">
            Passionately producing high-end Ball Pythons from a private collection in Cardiff.
            We combine recessive power with dominant traits to create living art.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            <button 
              onClick={onViewCollection}
              className="group px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full font-semibold transition-all duration-200 shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm"
            >
              View Collection 
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button 
              onClick={scrollToContact}
              className="px-7 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-sm rounded-full font-semibold transition-all duration-200 text-sm"
            >
              Get in Touch
            </button>
          </div>

          {/* Stats row */}
          <div className="flex gap-8 mt-12 justify-center md:justify-start">
            {[
              { value: metrics.totalSnakes, label: 'Animals' },
              { value: pairingCount, label: 'Projects' },
              { value: metrics.breedableCount, label: 'Breeders' },
            ].map(({ value, label }) => (
              <div key={label} className="text-center md:text-left">
                <p className="text-2xl font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>{value}</p>
                <p className="text-[11px] text-slate-500 uppercase tracking-widest font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Mascot */}
        <div className="flex-1 w-full flex justify-center lg:justify-end relative">
          <div className="relative w-[280px] h-[280px] lg:w-[460px] lg:h-[460px]">
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-cyan-500/10 rounded-full blur-3xl transform scale-90" />
            <div className="absolute inset-8 bg-emerald-400/5 rounded-full blur-2xl animate-pulse" />
            
            {!imgError ? (
              <img 
                key={retryCount}
                src={getSource()}
                alt="Progenix Ball Python" 
                className="w-full h-full object-contain drop-shadow-2xl relative z-10 transition-transform duration-700 hover:scale-[1.02]" 
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center border border-white/5 rounded-3xl relative z-10 bg-white/5 backdrop-blur-sm text-center p-6">
                <ImageIcon size={40} className="text-slate-600 mb-3" />
                <p className="text-white font-semibold text-sm mb-1">Image Pending</p>
                <p className="text-xs text-slate-500 max-w-xs">Add mascot image to complete branding</p>
                <button onClick={() => { setImgError(false); setRetryCount(p => p+1); }} className="text-[10px] text-slate-600 hover:text-emerald-500 mt-3 transition-colors">
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button 
        onClick={scrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-slate-600 hover:text-emerald-400 transition-colors"
        aria-label="Scroll down"
      >
        <ChevronDown size={20} className="animate-bounce" />
      </button>
    </div>
  );
};
