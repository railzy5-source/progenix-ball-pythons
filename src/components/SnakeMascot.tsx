
import React from 'react';

export const SnakeMascot: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 500 500" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      {/* Body Base Gradient (White/Cream) */}
      <linearGradient id="baseScale" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F8FAFC" />
      </linearGradient>
      
      {/* Pattern Gradient (Orange/Gold for Pied/Albino look) */}
      <linearGradient id="patternScale" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FB923C" /> {/* Orange-400 */}
        <stop offset="50%" stopColor="#F59E0B" /> {/* Amber-500 */}
        <stop offset="100%" stopColor="#EA580C" /> {/* Orange-600 */}
      </linearGradient>

      {/* Soft Shadow for depth */}
      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
        <feOffset dx="0" dy="8" result="offsetblur" />
        <feComponentTransfer>
          <feFuncA type="linear" slope="0.25" />
        </feComponentTransfer>
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
    
    <g filter="url(#softShadow)">
       {/* 
          Drawing strategy:
          1. Thick stroke paths for the body coils (White).
          2. Duplicate paths with dash-array to create the 'Pied' orange blotches overlay.
          3. Detailed head group on top.
       */}

       {/* --- BACK COIL --- */}
       <path 
         d="M 320 280 C 400 280, 420 150, 250 150 C 120 150, 80 300, 150 380 C 180 415, 250 420, 300 380"
         fill="none"
         stroke="url(#baseScale)"
         strokeWidth="85"
         strokeLinecap="round"
       />
       {/* Pattern Back Coil */}
       <path 
         d="M 320 280 C 400 280, 420 150, 250 150 C 120 150, 80 300, 150 380 C 180 415, 250 420, 300 380"
         fill="none"
         stroke="url(#patternScale)"
         strokeWidth="85"
         strokeLinecap="round"
         strokeDasharray="0 180 120 200"
         strokeDashoffset="20"
         opacity="0.95"
       />

       {/* --- MID/FRONT COIL --- */}
       <path 
         d="M 300 380 C 340 350, 350 300, 300 280 C 250 260, 180 280, 200 340"
         fill="none"
         stroke="url(#baseScale)"
         strokeWidth="80"
         strokeLinecap="round"
       />
        {/* Pattern Front Coil */}
       <path 
         d="M 300 380 C 340 350, 350 300, 300 280 C 250 260, 180 280, 200 340"
         fill="none"
         stroke="url(#patternScale)"
         strokeWidth="80"
         strokeLinecap="round"
         strokeDasharray="60 100 400"
         strokeDashoffset="0"
         opacity="0.95"
       />

       {/* --- NECK --- */}
       <path 
         d="M 200 340 C 210 380, 260 380, 260 340"
         fill="none"
         stroke="url(#baseScale)"
         strokeWidth="75"
         strokeLinecap="round"
       />
       {/* Pattern Neck */}
       <path 
         d="M 200 340 C 210 380, 260 380, 260 340"
         fill="none"
         stroke="url(#patternScale)"
         strokeWidth="75"
         strokeLinecap="round"
         strokeDasharray="0 80 100"
       />

       {/* --- HEAD (Detailed) --- */}
       <g transform="translate(260, 300) rotate(-10)">
          {/* Head Shape */}
          <path 
            d="M -30 20 C -40 40, -20 60, 10 70 C 40 80, 70 70, 90 50 C 110 30, 90 -10, 50 -20 C 20 -25, -20 0, -30 20 Z"
            fill="url(#patternScale)"
          />
          
          {/* White Pied Patch on Head */}
          <path 
            d="M 10 10 C 20 0, 40 0, 50 10 C 60 20, 50 40, 30 50 C 10 60, 0 30, 10 10"
            fill="#FFFFFF"
            opacity="0.9"
            filter="blur(1px)"
          />

          {/* Eye Ridge highlight */}
          <path d="M 60 10 Q 75 5 80 15" fill="none" stroke="#EA580C" strokeWidth="2" opacity="0.5" />

          {/* Eye */}
          <g transform="translate(75, 20)">
             <ellipse cx="0" cy="0" rx="6" ry="7" fill="#1e293b" />
             <circle cx="-2" cy="-2" r="2.5" fill="white" opacity="0.9" />
          </g>
          
          {/* Left Eye (peeking) */}
          <g transform="translate(60, -10)">
             <ellipse cx="0" cy="0" rx="4" ry="5" fill="#1e293b" />
          </g>

          {/* Nostrils */}
          <circle cx="95" cy="45" r="1.5" fill="#451a03" />
          <circle cx="85" cy="55" r="1.5" fill="#451a03" />

          {/* Heat Pits */}
          <circle cx="85" cy="65" r="1.5" fill="#78350f" opacity="0.6" />
          <circle cx="75" cy="70" r="1.5" fill="#78350f" opacity="0.6" />
          <circle cx="65" cy="72" r="1.5" fill="#78350f" opacity="0.6" />

          {/* Tongue */}
          <path 
             d="M 90 60 Q 110 70 120 80 L 130 75 M 120 80 L 130 85" 
             stroke="#F43F5E" 
             strokeWidth="3" 
             fill="none" 
             strokeLinecap="round" 
             strokeLinejoin="round"
          />
       </g>
    </g>
  </svg>
);
