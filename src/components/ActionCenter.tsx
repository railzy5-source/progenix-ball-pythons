
import React from 'react';
import { Snake, Clutch, FeedingLogEntry } from '../types';
import { CheckCircle2, Utensils, Egg, Mail, ArrowRight, Wand2, AlertTriangle, Clock } from 'lucide-react';

interface ActionCenterProps {
  snakes: Snake[];
  clutches: Clutch[];
  subscribers?: string[];
  onOpenNewsletter?: () => void;
  onRunAutomation?: () => void;
}

/**
 * Determines a snake's feeding status by looking at its actual feeding log history
 * and comparing the last fed date against the snake's feeding frequency.
 * Returns: 'overdue' | 'due-today' | 'due-soon' | 'ok'
 */
function getFeedingStatus(snake: Snake): { status: 'overdue' | 'due-today' | 'due-soon' | 'ok'; daysOverdue: number; nextFeedDate: Date | null } {
  const feedingLogs = snake.logs
    .filter(l => l.type === 'Feeding' && (l as FeedingLogEntry).result === 'Eaten')
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) as FeedingLogEntry[];

  const frequency = snake.feeding.frequency || 7; // default weekly
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (feedingLogs.length === 0) {
    // No feeding history — fall back to the manual dueFeed flag
    return {
      status: snake.feeding.dueFeed ? 'due-today' : 'ok',
      daysOverdue: 0,
      nextFeedDate: null,
    };
  }

  const lastFedDate = new Date(feedingLogs[0].date);
  lastFedDate.setHours(0, 0, 0, 0);

  const nextFeedDate = new Date(lastFedDate);
  nextFeedDate.setDate(lastFedDate.getDate() + frequency);

  const diffMs = today.getTime() - nextFeedDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 0) {
    return { status: 'overdue', daysOverdue: diffDays, nextFeedDate };
  } else if (diffDays === 0) {
    return { status: 'due-today', daysOverdue: 0, nextFeedDate };
  } else if (diffDays >= -2) {
    // Due within the next 2 days — show a heads-up
    return { status: 'due-soon', daysOverdue: diffDays, nextFeedDate };
  }

  return { status: 'ok', daysOverdue: 0, nextFeedDate };
}

export const ActionCenter: React.FC<ActionCenterProps> = ({ snakes, clutches, subscribers = [], onOpenNewsletter, onRunAutomation }) => {
  const activeSnakes = snakes.filter(s => s.status !== 'Sold');

  // Categorise snakes by feeding status
  const overdueSnakes = activeSnakes.filter(s => getFeedingStatus(s).status === 'overdue');
  const dueTodaySnakes = activeSnakes.filter(s => getFeedingStatus(s).status === 'due-today');
  const dueSoonSnakes = activeSnakes.filter(s => getFeedingStatus(s).status === 'due-soon');

  const hungrySnakes = [...overdueSnakes, ...dueTodaySnakes];

  // Clutches hatching within 5 days
  const hatchingSoon = clutches.filter(c => {
    if (c.status !== 'Incubating') return false;
    const daysLeft = Math.ceil((new Date(c.hatchDateEst).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 5;
  });

  const formatNames = (list: Snake[]) =>
    list.slice(0, 3).map(s => s.name || s.id).join(', ') + (list.length > 3 ? ` +${list.length - 3} more` : '');

  return (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-700">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
        <CheckCircle2 size={16} className="text-emerald-500" />
        Action Center
      </h3>

      <div className="space-y-3">

        {/* Overdue feedings */}
        {overdueSnakes.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-red-200 dark:border-red-900/50 shadow-sm">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600 dark:text-red-400">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Feeding Overdue</h4>
              <p className="text-xs text-slate-500 mt-1">
                {overdueSnakes.length} {overdueSnakes.length === 1 ? 'animal is' : 'animals are'} overdue: {formatNames(overdueSnakes)}.
              </p>
            </div>
          </div>
        )}

        {/* Due today */}
        {dueTodaySnakes.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-amber-900/50 shadow-sm">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
              <Utensils size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Feeding Due Today</h4>
              <p className="text-xs text-slate-500 mt-1">
                {dueTodaySnakes.length} {dueTodaySnakes.length === 1 ? 'animal' : 'animals'}: {formatNames(dueTodaySnakes)}.
              </p>
            </div>
          </div>
        )}

        {/* Due soon (next 2 days) */}
        {dueSoonSnakes.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-yellow-500 dark:text-yellow-400">
              <Clock size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Upcoming Feedings</h4>
              <p className="text-xs text-slate-500 mt-1">
                {dueSoonSnakes.length} {dueSoonSnakes.length === 1 ? 'animal' : 'animals'} due within 2 days: {formatNames(dueSoonSnakes)}.
              </p>
            </div>
          </div>
        )}

        {/* All fed */}
        {hungrySnakes.length === 0 && dueSoonSnakes.length === 0 && (
          <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-xs text-slate-500">All animals are on schedule. Next feedings auto-tracked from logs.</span>
          </div>
        )}

        {/* Hatch Alerts */}
        {hatchingSoon.length > 0 && (
          <div className="flex items-start gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400 animate-pulse">
              <Egg size={18} />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Hatching Soon</h4>
              <p className="text-xs text-slate-500 mt-1">
                {hatchingSoon.length} {hatchingSoon.length === 1 ? 'clutch' : 'clutches'} ready within 5 days. Prepare incubators.
              </p>
            </div>
          </div>
        )}

        {/* Subscriber/Newsletter Alert */}
        {subscribers.length > 0 && (
          <div className="flex items-start justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Community</h4>
                <p className="text-xs text-slate-500 mt-1">
                  {subscribers.length} subscribers waiting for updates.
                </p>
              </div>
            </div>
            {onOpenNewsletter && (
              <button
                onClick={onOpenNewsletter}
                className="text-xs font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1 self-center"
              >
                Draft Update <ArrowRight size={14} />
              </button>
            )}
          </div>
        )}

        {/* Automation Runner */}
        {onRunAutomation && (
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600 dark:text-indigo-400">
              <Wand2 size={18} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Update Schedules</h4>
              <p className="text-xs text-slate-500 mt-1">
                Recalculate all prey sizes and feeding frequencies based on current weights.
              </p>
            </div>
            <button
              onClick={onRunAutomation}
              className="ml-auto self-center text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-3 py-2 rounded-lg transition-colors"
            >
              Run <ArrowRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
