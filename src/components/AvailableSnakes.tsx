
import React, { useState } from 'react';
import { Snake } from '../types';
import { MorphTag } from './MorphTag';
import { MessageCircle, ShoppingBag, ArrowRight, Info, Scale, Dna } from 'lucide-react';

interface AvailableSnakesProps {
  snakes: Snake[];
  onSnakeClick: (snake: Snake) => void;
}

export const AvailableSnakes: React.FC<AvailableSnakesProps> = ({ snakes, onSnakeClick }) => {
  const [filter, setFilter] = useState<'All' | 'Male' | 'Female'>('All');
  const availableSnakes = snakes.filter(s => s.status === 'For Sale');
  const filtered = filter === 'All' ? availableSnakes : availableSnakes.filter(s => s.sex === filter);

  const handleInquire = (e: React.MouseEvent, snake: Snake) => {
    e.stopPropagation();
    const subject = `Inquiry: ${snake.id} - ${snake.genetics.join(', ')}`;
    const body = `Hi Progenix,\n\nI am interested in ${snake.id} (${snake.genetics.join(', ')}). Is it still available?\n\nKind regards,`;
    window.location.href = `mailto:progenixbp@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="animate-fade-in space-y-8">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-950 text-white">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/50 via-slate-950 to-slate-950" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

        <div className="relative z-10 p-8 md:p-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6 border border-emerald-500/25">
            <ShoppingBag size={12} /> Current Availability
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
            Premium Genetics<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Ready to Go</span>
          </h1>
          <p className="text-slate-300/80 text-base max-w-xl leading-relaxed mb-8">
            All animals are established feeders, healthy, and produced from our own collection.
            Every sale is subject to a vetting process to ensure they go to suitable homes.
          </p>
          
          <div className="flex items-center gap-4">
            <p className="text-slate-500 text-sm">
              <span className="text-white font-bold text-lg">{availableSnakes.length}</span> animals listed
            </p>
            {availableSnakes.filter(s => s.sex === 'Female').length > 0 && (
              <p className="text-slate-500 text-sm">
                <span className="text-rose-400 font-bold">{availableSnakes.filter(s => s.sex === 'Female').length}</span> females
              </p>
            )}
            {availableSnakes.filter(s => s.sex === 'Male').length > 0 && (
              <p className="text-slate-500 text-sm">
                <span className="text-blue-400 font-bold">{availableSnakes.filter(s => s.sex === 'Male').length}</span> males
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Hobbyist Notice */}
      <div className="flex gap-4 items-start bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-2xl p-5">
        <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl shrink-0 mt-0.5">
          <Info className="text-amber-600 dark:text-amber-400" size={18} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">Hobbyist Breeder Notice</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Progenix is a private hobbyist collection, not a commercial pet shop. Animals listed are surplus offspring from our personal breeding projects and are <strong className="text-slate-800 dark:text-slate-200">not sold as pets</strong>. We do not buy and resell animals.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      {availableSnakes.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mr-2">Filter:</span>
          {(['All', 'Male', 'Female'] as const).map(opt => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                filter === opt
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-3xl">
          <ShoppingBag size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>
            {availableSnakes.length === 0 ? 'Nothing Available Yet' : `No ${filter}s Available`}
          </h3>
          <p className="text-slate-400 text-sm">Check back soon for new hatchlings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(snake => (
            <div 
              key={snake.id} 
              onClick={() => onSnakeClick(snake)}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 dark:hover:border-emerald-500/20 transition-all duration-300 flex flex-col cursor-pointer"
            >
              {/* Image */}
              <div className="aspect-square bg-slate-100 dark:bg-slate-800/80 relative overflow-hidden">
                {snake.image ? (
                  <img 
                    src={snake.image} 
                    alt={snake.id} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Dna size={32} className="text-slate-300 dark:text-slate-700" />
                    <span className="text-slate-400 text-xs font-medium">No Photo</span>
                  </div>
                )}
                
                {/* Sex badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-md ${
                    snake.sex === 'Female' 
                      ? 'bg-rose-500/90 text-white' 
                      : 'bg-blue-600/90 text-white'
                  }`}>
                    {snake.sex === 'Female' ? '♀ Female' : '♂ Male'}
                  </span>
                </div>

                {/* Price overlay */}
                {snake.price && (
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg">
                    <span className="text-white font-bold text-sm">£{snake.price}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-auto">
                  <p className="text-xs text-slate-400 font-mono mb-1">{snake.id}</p>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                    {snake.genetics.join(' · ')}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {snake.genetics.slice(0, 4).map((g, i) => <MorphTag key={i} gene={g} />)}
                    {snake.genetics.length > 4 && (
                      <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                        +{snake.genetics.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Weight + CTA */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Scale size={13} />
                    <span className="text-xs font-medium">{snake.currentWeight}g</span>
                  </div>
                  <button 
                    onClick={(e) => handleInquire(e, snake)}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                  >
                    Enquire <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
