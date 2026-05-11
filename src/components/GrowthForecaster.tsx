
import React, { useState, useMemo } from 'react';
import { Snake, WeightLogEntry } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp, Target, Calendar, ChevronsRight, Info, X } from 'lucide-react';

interface GrowthForecasterProps {
  snakes: Snake[];
  onClose: () => void;
}

interface ForecastResult {
  predictionDate: Date | null;
  growthRate: number; // grams per day
  projectedData: { date: number; projectedWeight: number }[];
}

// --- CORE LOGIC: LINEAR REGRESSION ---
const calculateForecast = (logs: WeightLogEntry[], targetWeight: number): ForecastResult | null => {
  const sortedLogs = [...logs]
    .filter(l => l.type === 'Weight')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (sortedLogs.length < 3) return null;

  const firstDate = new Date(sortedLogs[0].date);
  const dataPoints = sortedLogs.map(log => ({
    x: (new Date(log.date).getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24),
    y: log.weight,
  }));

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  const n = dataPoints.length;
  for (const point of dataPoints) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumX2 += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const lastPoint = dataPoints[n - 1];
  if (slope <= 0 || lastPoint.y >= targetWeight) {
    return { predictionDate: null, growthRate: slope, projectedData: [] };
  }

  const daysToTarget = (targetWeight - intercept) / slope;
  const predictionDate = new Date(firstDate.getTime());
  predictionDate.setDate(predictionDate.getDate() + Math.round(daysToTarget));

  // Generate projected data for the chart's trend line
  const projectedData = [
    { date: firstDate.getTime(), projectedWeight: intercept },
    { date: predictionDate.getTime(), projectedWeight: targetWeight }
  ];

  return { predictionDate, growthRate: slope, projectedData };
};

export const GrowthForecaster: React.FC<GrowthForecasterProps> = ({ snakes, onClose }) => {
  // Only suggest females with enough data
  const eligibleSnakes = useMemo(() => 
    snakes.filter(s => s.sex === 'Female' && s.logs.filter(l => l.type === 'Weight').length >= 3),
    [snakes]
  );
  
  const [selectedSnakeId, setSelectedSnakeId] = useState<string>(eligibleSnakes[0]?.id || '');

  const selectedSnake = useMemo(() => snakes.find(s => s.id === selectedSnakeId), [selectedSnakeId, snakes]);

  const forecast = useMemo(() => {
    if (!selectedSnake) return null;
    const weightLogs = selectedSnake.logs.filter(l => l.type === 'Weight') as WeightLogEntry[];
    return calculateForecast(weightLogs, selectedSnake.targetWeight);
  }, [selectedSnake]);

  const chartData = useMemo(() => {
    if (!selectedSnake) return [];
    const weightLogs = (selectedSnake.logs.filter(l => l.type === 'Weight') as WeightLogEntry[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
    const historicalData = weightLogs.map(log => ({
        date: new Date(log.date).getTime(),
        weight: log.weight
    }));

    if (forecast?.projectedData) {
        // Merge historical and projected data for a continuous line
        return [...historicalData, ...forecast.projectedData];
    }
    return historicalData;
  }, [selectedSnake, forecast]);


  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
            <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-indigo-500" size={24} />
                    Smart Growth Forecaster
                </h3>
                <p className="text-xs text-slate-500">Predict breeding weight dates based on historical growth rates.</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="text-sm font-bold text-slate-500 mb-2 md:mb-0 mr-4">Select Female:</label>
                <select
                value={selectedSnakeId}
                onChange={e => setSelectedSnakeId(e.target.value)}
                className="w-full md:w-auto flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-2 px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500"
                >
                <option value="">Select a female...</option>
                {eligibleSnakes.map(s => (
                    <option key={s.id} value={s.id}>{s.id} ({s.currentWeight}g)</option>
                ))}
                </select>
            </div>

            {!selectedSnake ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <ChevronsRight size={32} className="mb-4 opacity-50"/>
                    <p className="font-medium">Select a female to forecast growth.</p>
                    <p className="text-xs mt-1">(Requires at least 3 weight entries)</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Chart */}
                    <div className="lg:col-span-2 h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                                <XAxis 
                                    dataKey="date" 
                                    type="number"
                                    domain={['dataMin', 'dataMax']}
                                    tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString(undefined, { month: 'short', year: '2-digit'})}
                                    tick={{fontSize: 12, fill: '#94a3b8'}}
                                />
                                <YAxis tick={{fontSize: 12, fill: '#94a3b8'}} domain={['dataMin', 'dataMax + 100']}/>
                                <Tooltip 
                                    labelFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                                    formatter={(value: number) => [`${Math.round(value)}g`, 'Weight']}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }}
                                />
                                <ReferenceLine y={selectedSnake.targetWeight} label={{ value: `Target: ${selectedSnake.targetWeight}g`, position: 'insideTopRight', fill: '#f43f5e', fontSize: 10 }} stroke="#f43f5e" strokeDasharray="3 3" />
                                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Actual" />
                                <Line type="monotone" dataKey="projectedWeight" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    {/* Forecast Info */}
                    <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col justify-center">
                        {forecast && forecast.predictionDate ? (
                            <>
                                <div className="mb-6">
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2"><Calendar size={14} /> Predicted Target Date</p>
                                    <p className="text-3xl font-bold text-indigo-500 tracking-tight mt-1">
                                        {forecast.predictionDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider flex items-center gap-2"><Target size={14} /> Growth Rate</p>
                                    <p className="text-xl font-bold text-slate-700 dark:text-slate-300 mt-1">
                                        {forecast.growthRate.toFixed(1)} g / day
                                    </p>
                                    <p className="text-xs text-slate-500">~{(forecast.growthRate * 30).toFixed(0)} g / month</p>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
                                <Info size={24} />
                                <div>
                                    <p className="font-bold">Cannot Forecast</p>
                                    <p className="text-xs">The animal may be past its target weight or is not showing consistent growth.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
