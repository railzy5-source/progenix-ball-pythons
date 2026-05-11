
import React from 'react';
import { Snake, Clutch } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { Scale, Heart, Dna, Activity, ArrowUpRight } from 'lucide-react';
import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

interface DashboardProps {
  snakes: Snake[];
  clutches?: Clutch[];
  onViewCollection: () => void;
}

const StatCard: React.FC<{ 
  title: string; 
  value: number; 
  icon: React.ReactNode; 
  subtext?: string; 
  gradient: string;
  textColor: string;
  suffix?: string 
}> = ({ title, value, icon, subtext, gradient, textColor, suffix = '' }) => {
  const { count, ref } = useAnimatedCounter(value);
  const displayValue = suffix === 'g' ? Math.round(count) : Math.round(count);

  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 ${gradient} border border-white/5`}>
      {/* Decorative circle */}
      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full bg-white/5" />
      <div className="absolute -bottom-6 -right-2 w-28 h-28 rounded-full bg-white/5" />

      <div className={`inline-flex p-2.5 rounded-xl bg-white/10 ${textColor} mb-4`}>
        {React.cloneElement(icon as React.ReactElement<{ size: number }>, { size: 20 })}
      </div>
      
      <h3 
        ref={ref as any} 
        className="text-3xl font-bold text-white mb-1 relative z-10" 
        style={{ fontFamily: 'Syne, sans-serif' }}
      >
        {displayValue}{suffix}
      </h3>
      <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-0.5">{title}</p>
      {subtext && <p className="text-xs text-white/40">{subtext}</p>}
    </div>
  );
};


export const Dashboard: React.FC<DashboardProps> = ({ snakes, clutches = [], onViewCollection }) => {
  const totalSnakes = snakes.length;
  const avgWeight = totalSnakes > 0 ? snakes.reduce((acc, snake) => acc + snake.currentWeight, 0) / totalSnakes : 0;
  const breedableCount = snakes.filter(s => s.breedingReadiness).length;
  
  const chartData = [...snakes]
    .sort((a, b) => b.currentWeight - a.currentWeight)
    .map(snake => ({
      name: snake.id,
      Current: snake.currentWeight,
      Target: snake.targetWeight,
      sex: snake.sex
    }));

  return (
    <div className="space-y-8">
      
      {/* Section heading */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
            Collection Overview
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">Live stats from your active collection</p>
        </div>
        <button 
          onClick={onViewCollection} 
          className="text-xs font-semibold text-emerald-500 hover:text-emerald-400 flex items-center gap-1 uppercase tracking-wider transition-colors"
        >
          Full View <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Collection" 
          value={totalSnakes} 
          icon={<Dna />} 
          gradient="bg-gradient-to-br from-emerald-600 to-emerald-800"
          textColor="text-emerald-300"
          subtext="Total Animals"
        />
        <StatCard 
          title="Avg Weight" 
          value={avgWeight} 
          icon={<Scale />} 
          gradient="bg-gradient-to-br from-blue-600 to-blue-800"
          textColor="text-blue-300"
          subtext="Growth Metric"
          suffix="g"
        />
        <StatCard 
          title="Breeders" 
          value={breedableCount} 
          subtext={`${Math.round((breedableCount/(totalSnakes || 1))*100)}% readiness`}
          icon={<Heart />} 
          gradient="bg-gradient-to-br from-rose-600 to-rose-800"
          textColor="text-rose-300"
        />
        <StatCard 
          title="Health" 
          value={100} 
          subtext="No Issues"
          icon={<Activity />} 
          gradient="bg-gradient-to-br from-violet-600 to-violet-800"
          textColor="text-violet-300"
          suffix="%"
        />
      </div>

      {/* Growth Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
              Growth Analysis
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Current weight vs target by animal</p>
          </div>
        </div>
        
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData.slice(0, 14)}
              margin={{ top: 4, right: 0, left: -24, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.15} vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} 
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 9, fontWeight: 600 }} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(16, 185, 129, 0.04)' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-xl text-xs border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
                        <p className="text-emerald-500 font-semibold">{payload[0].value}g</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="Current" fill="#10b981" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
