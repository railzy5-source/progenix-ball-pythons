
import React from 'react';

export const LogoMark: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="logo_grad_prof" x1="0" y1="120" x2="120" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#34d399" /> {/* emerald-400 */}
        <stop offset="1" stopColor="#0ea5e9" /> {/* sky-500 */}
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.2" />
      </filter>
    </defs>
    
    {/* Hexagon Container - Represents Science/Genetics */}
    <path 
      d="M60 10 L103.3 35 V85 L60 110 L16.7 85 V35 L60 10Z" 
      stroke="url(#logo_grad_prof)" 
      strokeWidth="6" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      fill="url(#logo_grad_prof)"
      fillOpacity="0.05"
    />

    {/* Central Motif - Abstract Snake S-Curve forming DNA */}
    <g filter="url(#shadow)">
        {/* Main Body Curve */}
        <path
          d="M60 90 C 45 90, 35 75, 45 60 C 55 45, 65 45, 75 30"
          stroke="url(#logo_grad_prof)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        
        {/* Head Detail */}
        <path
            d="M75 30 L 68 22"
            stroke="url(#logo_grad_prof)"
            strokeWidth="8"
            strokeLinecap="round"
        />
        
        {/* Tail Detail (fading out) */}
        <path
            d="M60 90 L 65 98"
            stroke="url(#logo_grad_prof)"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.6"
        />

        {/* Genetic Rungs (floating) */}
        <rect x="42" y="55" width="12" height="3" rx="1.5" fill="white" fillOpacity="0.9" />
        <rect x="58" y="42" width="10" height="3" rx="1.5" fill="white" fillOpacity="0.9" />
        
        {/* Eye */}
        <circle cx="68" cy="27" r="1.5" fill="white" />
    </g>

  </svg>
);

export const Logo: React.FC<{ className?: string, textClassName?: string }> = ({ className = "h-10 w-10", textClassName = "text-slate-900 dark:text-white" }) => (
  <div className="flex items-center gap-3">
    <div className={`${className} flex items-center justify-center`}>
        <LogoMark className="w-full h-full" />
    </div>
    <div className="flex flex-col justify-center">
      <span className={`text-xl font-black tracking-tight leading-none ${textClassName}`} style={{ fontFamily: 'Syne, sans-serif', letterSpacing: '-0.02em' }}>
        PROGENIX
      </span>
      <div className="flex items-center gap-1.5 mt-1">
          <div className="h-px w-3 bg-emerald-500"></div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500 leading-none">
            GENETICS
          </span>
      </div>
    </div>
  </div>
);
