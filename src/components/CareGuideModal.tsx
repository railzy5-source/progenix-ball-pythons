
import React from 'react';
import { X, Printer, Thermometer, Droplets, Home, Utensils, AlertTriangle, HeartHandshake, HelpCircle } from 'lucide-react';
import { Logo } from './Logo';

interface CareGuideModalProps {
  onClose: () => void;
}

export const CareGuideModal: React.FC<CareGuideModalProps> = ({ onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Modal Header (Screen Only) */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0 print:hidden">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Keeper Guide</h2>
            <p className="text-xs text-slate-500">Preview of the printable Ball Python care sheet.</p>
          </div>
          <div className="flex gap-4">
            <button 
                onClick={handlePrint}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-emerald-500/20"
            >
                <Printer size={18} /> Print Guide
            </button>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={24} className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-white text-slate-900" id="print-care">
            
            {/* Print Header */}
            <div className="p-8 pb-4 border-b-4 border-emerald-500 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Care Guide</h1>
                    <h2 className="text-xl font-bold text-emerald-600">Ball Python (Python regius)</h2>
                </div>
                <div className="text-right opacity-80 scale-75 origin-bottom-right">
                    <Logo textClassName="text-slate-900" />
                </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-8">
                
                {/* Intro */}
                <div className="col-span-full mb-2">
                    <p className="text-slate-600 leading-relaxed italic">
                        Ball Pythons make excellent animals to keep due to their docile nature and manageable size. 
                        With a lifespan of 20-30+ years, they are a long-term commitment. 
                        This guide outlines the Progenix standard for keeping your animal healthy and thriving based on UK veterinary guidance.
                    </p>
                </div>

                {/* Section: Housing */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <Home className="text-emerald-600" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Housing & Enclosure</h3>
                    </div>
                    <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-slate-700 font-medium">
                        <li><strong>Hatchlings:</strong> Thrive in smaller tubs (e.g. 5L-9L Really Useful Boxes) or small 2ft vivariums to feel secure.</li>
                        <li><strong>Adults:</strong> Minimum 4ft x 2ft x 2ft vivarium or appropriate rack tub (e.g., LP70/V70).</li>
                        <li><strong>Security:</strong> MUST be escape-proof. Use glass locks or wedges for sliding doors.</li>
                        <li><strong>Hides:</strong> Provide two tight-fitting hides (one warm side, one cool side).</li>
                        <li><strong>Clutter:</strong> Add branches, fake plants, and cork bark. Open spaces stress Ball Pythons.</li>
                    </ul>
                </div>

                {/* Section: Heating */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <Thermometer className="text-orange-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Heating & Lighting</h3>
                    </div>
                    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 print:bg-white print:border-slate-300">
                        <p className="font-bold text-slate-900 text-sm">⚠️ ALWAYS use a thermostat (Dimming for bulb, Pulse for CHE/Mat).</p>
                    </div>
                    <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-slate-700 font-medium">
                        <li><strong>Hot Spot:</strong> 31°C - 33°C (88°F - 92°F).</li>
                        <li><strong>Ambient/Cool Side:</strong> 24°C - 26°C (75°F - 80°F).</li>
                        <li><strong>Night Drop:</strong> Not necessary, but temperatures should not fall below 23°C (74°F).</li>
                        <li><strong>Heat Sources:</strong> Deep Heat Projectors (DHP) or Ceramic Heat Emitters (CHE) with guards are preferred.</li>
                        <li><strong>Lighting:</strong> UVB is beneficial (e.g., Arcadia ShadeDweller 7%) but not mandatory.</li>
                    </ul>
                </div>

                {/* Section: Humidity */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <Droplets className="text-blue-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Humidity & Substrate</h3>
                    </div>
                    <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-slate-700 font-medium">
                        <li><strong>Target:</strong> 60% - 70% relative humidity. Bump to 80% during shedding.</li>
                        <li><strong>Substrate:</strong> Coco husk, coco block, or Lignocel. Avoid pine/cedar (toxic) and aspen (molds easily in UK humidity).</li>
                        <li><strong>Hydration:</strong> Provide a large, fresh water bowl at all times. Change water daily.</li>
                    </ul>
                </div>

                 {/* Section: Feeding */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <Utensils className="text-rose-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Feeding (Vet-Reviewed)</h3>
                    </div>
                    <ul className="list-disc list-outside pl-5 space-y-2 text-sm text-slate-700 font-medium">
                        <li><strong>Prey Type:</strong> Feed <strong>frozen-thawed (F/T)</strong> rats or multimammates (ASFs). Live feeding is illegal/unethical in the UK unless essential for survival.</li>
                        <li><strong>Prey Size:</strong> Prey should be approx the same girth as the widest part of the snake.</li>
                        <li><strong>Schedule:</strong>
                             <ul className="list-disc pl-4 mt-1 text-slate-600">
                                <li><strong>Hatchlings:</strong> Rat Pup/Fluff every 5-7 days.</li>
                                <li><strong>Juveniles:</strong> Weaner Rat every 7-10 days.</li>
                                <li><strong>Adults:</strong> Small/Medium Rat every 14-21 days.</li>
                             </ul>
                        </li>
                        <li><strong>Preparation:</strong> Thaw prey completely and warm to body temp (~37°C) using warm water. Dry off before offering.</li>
                    </ul>
                </div>

                 {/* Section: Handling */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <HeartHandshake className="text-purple-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Handling & Temperament</h3>
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">
                        Allow your new snake <strong>at least 1 week</strong> to settle into its home before handling or feeding. 
                        Approach from the side, not directly above. Support the body fully.
                        Do not handle for 48 hours after feeding to prevent regurgitation.
                    </p>
                </div>

                 {/* Section: Troubleshooting */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-slate-100 rounded-lg print:border print:border-slate-300">
                            <HelpCircle className="text-amber-500" size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Troubleshooting & Health</h3>
                    </div>
                    <ul className="list-disc list-outside pl-5 space-y-3 text-sm text-slate-700 font-medium">
                        <li><strong className="text-slate-800">Refusing Food:</strong> #1 cause is husbandry. Check temps and humidity. Ensure plenty of clutter. Try braining the prey or feeding late at night.</li>
                        <li><strong className="text-slate-800">Stuck Shed:</strong> Do not pull dry shed. Increase enclosure humidity to 80% and/or provide a humid hide with damp moss.</li>
                        <li className="text-rose-600 font-bold"><strong>NEVER use "Heat Rocks".</strong> They cause severe thermal burns.</li>
                    </ul>
                </div>

            </div>

            {/* Footer */}
            <div className="p-8 border-t border-slate-200 mt-4 bg-slate-50 print:bg-white text-center">
                <p className="text-sm text-slate-500">&copy; 2026 Progenix Ball Pythons (Cardiff, UK). All rights reserved.</p>
                <p className="text-xs text-slate-400 mt-1">For questions/support: progenixbp@gmail.com</p>
            </div>
        </div>
      </div>
    </div>
  );
};
