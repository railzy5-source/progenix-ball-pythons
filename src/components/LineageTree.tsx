
import React from 'react';
import { Snake } from '../types';
import { LineageData } from './SnakeDetailModal';
import { Dna } from 'lucide-react';

interface LineageTreeProps {
    subject: Snake;
    lineage: LineageData;
}

// --- Sub-components for the tree ---

const LineageCard = ({ animal, role }: { animal: Snake | undefined, role: string }) => {
    const isSireLine = role.toLowerCase().includes('sire');
    const genderColor = isSireLine ? 'border-blue-500' : 'border-rose-500';
    
    return (
        <div className={`
            bg-white dark:bg-slate-900 rounded-lg border-l-4 ${genderColor}
            shadow-md w-full p-3 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]
            ${!animal ? 'opacity-60' : ''}
        `}>
            <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{role}</p>
            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{animal ? animal.id : 'Unknown'}</p>
            {animal && <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{animal.genetics.join(', ')}</p>}
        </div>
    );
};

const SubjectCard = ({ snake }: { snake: Snake }) => (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border-2 border-emerald-500 shadow-xl w-full max-w-xs mx-auto flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 border-4 border-white dark:border-slate-800 shadow-lg overflow-hidden -mt-12 mb-3">
            {snake.image ? (
                <img src={snake.image} className="w-full h-full object-cover" alt="current" />
            ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold text-2xl"><Dna size={32} /></div>
            )}
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{snake.id}</h3>
        <p className="text-xs text-slate-500 mt-1">{snake.sex} - Hatched: {snake.dob || 'Unknown'}</p>
    </div>
);


export const LineageTree: React.FC<LineageTreeProps> = ({ subject, lineage }) => {
    
    // --- Render Logic ---
    return (
        <div className="flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <div className="flex justify-center items-start">
                    
                    {/* -- Grandparents Column -- */}
                    <div className="w-1/3 flex flex-col justify-around gap-2 pt-2 pr-4">
                        {/* Paternal Grandparents */}
                        <div className="relative">
                            <LineageCard animal={lineage.paternalGrandSire} role="Paternal GrandSire" />
                            <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                         <div className="h-4"></div>
                        <div className="relative">
                           <LineageCard animal={lineage.paternalGrandDam} role="Paternal GrandDam" />
                           <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                        
                        <div className="h-12"></div>

                        {/* Maternal Grandparents */}
                        <div className="relative">
                           <LineageCard animal={lineage.maternalGrandSire} role="Maternal GrandSire" />
                           <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                         <div className="h-4"></div>
                        <div className="relative">
                           <LineageCard animal={lineage.maternalGrandDam} role="Maternal GrandDam" />
                           <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                    </div>

                    {/* -- Parents Column -- */}
                    <div className="w-1/3 flex flex-col justify-around gap-12 px-4">
                        {/* Sire */}
                        <div className="relative">
                            <div className="absolute top-[-3.5rem] bottom-[-3.5rem] left-[-1.5rem] w-4 border-r-2 border-t-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-r-lg"></div>
                            <LineageCard animal={lineage.sire} role="Sire" />
                            <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                        {/* Dam */}
                        <div className="relative">
                             <div className="absolute top-[-3.5rem] bottom-[-3.5rem] left-[-1.5rem] w-4 border-r-2 border-t-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-r-lg"></div>
                            <LineageCard animal={lineage.dam} role="Dam" />
                            <div className="absolute top-1/2 -right-4 w-4 h-0.5 bg-slate-300 dark:bg-slate-700"></div>
                        </div>
                    </div>
                    
                    {/* -- Subject Column -- */}
                    <div className="w-1/3 flex items-center pl-4">
                        <div className="relative w-full">
                           <div className="absolute top-[-9rem] bottom-[-9rem] left-[-1.5rem] w-4 border-r-2 border-t-2 border-b-2 border-slate-300 dark:border-slate-700 rounded-r-lg"></div>
                           <SubjectCard snake={subject} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};
