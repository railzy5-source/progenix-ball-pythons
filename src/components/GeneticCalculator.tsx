
import React, { useState, useMemo } from 'react';
import { Snake } from '../types';
import { Calculator, ArrowRight, Dna, RefreshCw, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import { MorphTag } from './MorphTag';

interface GeneticCalculatorProps {
  snakes: Snake[];
}

// --- GENETIC DATA LIBRARY ---
const RECESSIVE = new Set([
  "210 Hypo", "Albino", "Atomic", "Axanthic (GCR)", "Axanthic (Jolliff)", "Axanthic (MJ)", "Axanthic (TSK)", "Axanthic (VPI)", 
  "Bengal", "Black Axanthic", "Black Lace", "Candy", "Caramel Albino", "Clown", "Cryptic", "Desert Ghost", "Enhancer", 
  "Genetic Stripe", "Ghost (Vesper)", "Hypo", "Lavender Albino", "Maple", "Metal Flake", "Migraine", "Monarch", "Monsoon", 
  "Orange Crush", "Orange Ghost", "Paint", "Patternless", "Piebald", "Puzzle", "Rainbow", "Sahara", "Sandstorm", "Sunset", 
  "Tornado", "Tri-stripe", "Ultramel", "Whitewash", "Zebra"
]);

const DOMINANT = new Set([
  "Adder", "AHI", "Ashen", "Black Belly", "Confusion", "Congo", "Desert", "Eramosa", "Frost", "Gold Blush", "Harlequin", 
  "Het Daddy", "Josie", "Leopard", "Mordor", "Nova", "Oriole", "Pinstripe", "Redhead", "Shatter", "Splash", "Static", 
  "Sunrise", "Vesper", "Zip Belly"
]);

const INCOMPLETE_DOMINANT = new Set([
  "Acid", "Ajax", "Alloy", "Ambush", "Arcane", "Arroyo", "Asphalt", "Astro", "Bald", "Bambino", "Bamboo", "Banana", "Bang", 
  "Black Head", "Black Pastel", "Blade", "Bongo", "Cafe", "Calico", "Carbon", "Carnivore", "Champagne", "Chino", "Chocolate", 
  "Cinder", "Cinnamon", "Circle", "Citron", "Coffee", "Copper", "Creed", "Cypress", "Dark Viking", "Diesel", "Disco", "Dot", 
  "EMG", "Enchi", "Epic", "Exo-lbb", "Fire", "Flame", "FNR Vanilla", "Furrow", "Fusion", "Gaia", "Gallium", "GeneX", "GHI", 
  "Glossy", "Gobi", "Granite", "Gravel", "Grim", "Het Red Axanthic", "Hidden Gene Woma", "Hieroglyphic", "Honey", "Huffman", 
  "Hydra", "Jaguar", "Java", "Jedi", "Jolliff Tiger", "Jolt", "Joppa", "Jungle Woma", "KRG", "Lace", "LC Black Magic", 
  "Lemonback", "Lesser", "Mahogany", "Mario", "Marvel", "Mckenzie", "Melt", "Microscale", "Mocha", "Mojave", "Mosaic", 
  "Motley", "Mystic", "Nanny", "Nico", "Nr Mandarin", "Nyala", "Odium", "OFY", "Orange Dream", "Orbit", "Panther", "Pastel", 
  "Peach", "Phantom", "Phenomenon", "Pixel", "Quake", "Rain", "RAR", "Raven", "Razor", "Reaper", "Red Gene", "Red Stripe", 
  "Rhino", "Russo", "Saar", "Sable", "Sandblast", "Sapphire", "Satin", "Scaleless Head", "Scrambler", "Shadow", "Sherg", 
  "Shrapnel", "Shredder", "Smuggler", "Spark", "Special", "Specter", "Spider", "Splatter", "Spotnose", "Stranger", "Striker", 
  "Sulfur", "Surge", "Taronja", "The Darkling", "Trick", "Trident", "Trojan", "Twister", "Vanilla", "Vudoo", "Web", "Woma", 
  "Wookie", "Wrecking Ball", "X-treme Gene", "X-tremist", "Yellow Belly", "Zuwadi"
]);

// Define specific lethal/issue combos
// Using loose matching strings
const LETHAL_WARNINGS = [
    {
        trigger: ['Spider'],
        partnerTrigger: ['Spider', 'Champagne', 'Woma', 'Hidden Gene Woma'],
        title: "LETHAL COMBO RISK",
        description: "Pairing two Spider-complex morphs (Spider, Champagne, Woma, HGW) is widely considered to produce lethal 'Super' offspring that often fail to thrive or die in egg."
    },
    {
        trigger: ['Champagne'],
        partnerTrigger: ['Champagne', 'Spider', 'Woma', 'Hidden Gene Woma'],
        title: "LETHAL COMBO RISK",
        description: "Homozygous Champagne (Super Champagne) is lethal."
    },
    {
        trigger: ['Black Pastel', 'Cinnamon', 'Het Red Axanthic'],
        partnerTrigger: ['Black Pastel', 'Cinnamon', 'Het Red Axanthic'],
        title: "SEVERE DEFECT RISK",
        description: "Super forms of the Black Pastel/Cinnamon complex are prone to severe kinking and duckbill facial deformities."
    },
    {
        trigger: ['Spotnose'],
        partnerTrigger: ['Spotnose'],
        title: "SEVERE NEURO RISK",
        description: "Super Spotnose is known to often display severe neurological issues (wobble/corkscrewing) significantly worse than the single gene form."
    },
    {
        trigger: ['Caramel'], // Catch 'Caramel Albino' or 'Caramel'
        partnerTrigger: ['Caramel'],
        title: "KINKING RISK",
        description: "Homozygous Caramel Albinos are statistically prone to spinal kinking."
    },
    {
        trigger: ['Desert'],
        partnerTrigger: ['*'], // * means any pairing
        genderSpecific: 'Female', // If the female has Desert
        title: "FERTILITY RISK",
        description: "Female Desert Ball Pythons are known to have significant fertility issues and are often unable to produce viable clutches."
    }
];

type GeneType = 'Recessive' | 'Dominant' | 'IncDom' | 'Unknown';

interface GeneAlleles {
  name: string;
  type: GeneType;
  count: number; // 0=None, 1=Het/Het-form, 2=Visual/Super
}

// Helper to determine genetic makeup from string array
const parseGenetics = (genetics: string[]): GeneAlleles[] => {
  const map = new Map<string, GeneAlleles>();

  genetics.forEach(traitRaw => {
    let trait = traitRaw.trim();
    let type: GeneType = 'Unknown';
    let count = 1;

    // Handle "Het" prefix
    let isHet = false;
    if (trait.startsWith("Het ")) {
      isHet = true;
      trait = trait.replace("Het ", "");
    }
    
    // Handle "Super" prefix for IncDom
    let isSuper = false;
    if (trait.startsWith("Super ")) {
      isSuper = true;
      count = 2;
      trait = trait.replace("Super ", "");
    }

    // Identify Type
    if (RECESSIVE.has(trait)) type = 'Recessive';
    else if (DOMINANT.has(trait)) type = 'Dominant';
    else if (INCOMPLETE_DOMINANT.has(trait)) type = 'IncDom';
    
    // Fallback logic
    if (type === 'Unknown') {
        // If we saw "Het", assume Recessive
        if (isHet) type = 'Recessive';
    }

    // Logic adjustments
    if (type === 'Recessive') {
        // "Clown" = 2 copies (Visual), "Het Clown" = 1 copy
        if (!isHet) count = 2;
        else count = 1;
    }

    map.set(trait, { name: trait, type, count });
  });

  return Array.from(map.values());
};

export const GeneticCalculator: React.FC<GeneticCalculatorProps> = ({ snakes }) => {
  const males = snakes.filter(s => s.sex === 'Male');
  const females = snakes.filter(s => s.sex === 'Female');

  const [selectedMale, setSelectedMale] = useState<string>('');
  const [selectedFemale, setSelectedFemale] = useState<string>('');

  const getSnakeById = (id: string) => snakes.find(s => s.id === id);
  const maleSnake = getSnakeById(selectedMale);
  const femaleSnake = getSnakeById(selectedFemale);

  // --- HEALTH CHECK ENGINE ---
  const healthWarnings = useMemo(() => {
     if (!maleSnake || !femaleSnake) return [];
     
     const warnings: { title: string, desc: string }[] = [];
     const sireGenes = maleSnake.genetics.map(g => g.toLowerCase());
     const damGenes = femaleSnake.genetics.map(g => g.toLowerCase());

     LETHAL_WARNINGS.forEach(rule => {
        // Check gender specific rules (e.g. Female Desert)
        if (rule.genderSpecific === 'Female') {
             const hasTrigger = rule.trigger.some(t => damGenes.some(g => g.includes(t.toLowerCase())));
             if (hasTrigger) warnings.push({ title: rule.title, desc: rule.description });
             return;
        }

        // Standard Pairing Rules
        const sireHasTrigger = rule.trigger.some(t => sireGenes.some(g => g.includes(t.toLowerCase())));
        const damHasPartner = rule.partnerTrigger.some(t => damGenes.some(g => g.includes(t.toLowerCase())));

        // Check inverse as well (if symmetric)
        const damHasTrigger = rule.trigger.some(t => damGenes.some(g => g.includes(t.toLowerCase())));
        const sireHasPartner = rule.partnerTrigger.some(t => sireGenes.some(g => g.includes(t.toLowerCase())));
        
        if ((sireHasTrigger && damHasPartner) || (damHasTrigger && sireHasPartner)) {
            // Avoid duplicates if rule is symmetric
            if (!warnings.some(w => w.title === rule.title)) {
                warnings.push({ title: rule.title, desc: rule.description });
            }
        }
     });

     return warnings;
  }, [maleSnake, femaleSnake]);

  // --- CALCULATOR ENGINE ---
  const outcomes = useMemo(() => {
    if (!maleSnake || !femaleSnake) return [];

    const sireGenes = parseGenetics(maleSnake.genetics);
    const damGenes = parseGenetics(femaleSnake.genetics);
    
    // Merge list of all unique genes involved
    const allGeneNames = new Set([...sireGenes.map(g => g.name), ...damGenes.map(g => g.name)]);
    
    // We will simulate each gene independently and combine probabilities
    // For simplicity in this UI, we will just list *Possible* visual/het outcomes, rather than the 2^N combo list which gets huge.
    
    const traitResults: { name: string, chance: number, form: string }[] = [];

    allGeneNames.forEach(geneName => {
       const sireGene = sireGenes.find(g => g.name === geneName);
       const damGene = damGenes.find(g => g.name === geneName);
       
       const sireAlleles = sireGene ? sireGene.count : 0;
       const damAlleles = damGene ? damGene.count : 0;
       
       // Determine type from whichever parent has it defined, or check DB
       let type: GeneType = 'Unknown';
       if (RECESSIVE.has(geneName)) type = 'Recessive';
       else if (DOMINANT.has(geneName)) type = 'Dominant';
       else if (INCOMPLETE_DOMINANT.has(geneName)) type = 'IncDom';

       // --- MENDELIAN LOGIC ---
       // Each parent passes 1 allele.
       // Allele possibilities from parent:
       // Count 0: 0 (100%)
       // Count 1: 0 (50%), 1 (50%)
       // Count 2: 1 (100%)
       
       const getPassingProb = (count: number) => {
           if (count === 2) return 1.0; // Always passes 1
           if (count === 1) return 0.5; // 50% chance passes 1
           return 0.0; // Never passes
       };

       const sirePass = getPassingProb(sireAlleles); // Prob of passing 1 allele
       const damPass = getPassingProb(damAlleles);   // Prob of passing 1 allele

       // Outcomes (Offspring alleles: 0, 1, or 2)
       // P(2) = sirePass * damPass
       // P(1) = sirePass * (1-damPass) + (1-sirePass) * damPass
       // P(0) = (1-sirePass) * (1-damPass)
       
       const p2 = sirePass * damPass;
       const p1 = (sirePass * (1 - damPass)) + ((1 - sirePass) * damPass);
       // const p0 = (1 - sirePass) * (1 - damPass);

       if (type === 'Recessive') {
           // 2 copies = Visual, 1 copy = Het
           if (p2 > 0) traitResults.push({ name: geneName, chance: p2, form: '(Visual)' });
           if (p1 > 0) traitResults.push({ name: geneName, chance: p1, form: 'Het' });
       } 
       else if (type === 'IncDom') {
           // 2 copies = Super, 1 copy = Visual (Single)
           if (p2 > 0) traitResults.push({ name: geneName, chance: p2, form: 'Super' });
           if (p1 > 0) traitResults.push({ name: geneName, chance: p1, form: '' });
       }
       else {
           // Dominant (or Unknown)
           // 1 or 2 copies = Visual. (Super dominant usually looks same or is lethal, we treat 1&2 as Visual)
           const pVisual = p2 + p1;
           if (pVisual > 0) traitResults.push({ name: geneName, chance: pVisual, form: '' });
       }
    });

    return traitResults.sort((a, b) => b.chance - a.chance);

  }, [maleSnake, femaleSnake]);


  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6">
          <Calculator className="text-emerald-500" size={24} />
          Genetic Pair Simulator
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Male Selector */}
          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 relative">
             <div className="absolute -top-3 left-6 bg-slate-50 dark:bg-slate-950 px-2 text-xs font-bold text-blue-500 uppercase tracking-wider">
               Sire (Male)
             </div>
             <select 
               className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
               value={selectedMale}
               onChange={(e) => setSelectedMale(e.target.value)}
             >
               <option value="">Select Sire...</option>
               {males.map(s => (
                 <option key={s.id} value={s.id}>{s.id} ({s.genetics.length} genes)</option>
               ))}
             </select>
             {maleSnake ? (
               <div className="mt-4 animate-fade-in">
                 <div className="h-32 w-full rounded-lg bg-slate-200 dark:bg-slate-800 mb-3 overflow-hidden">
                    {maleSnake.image ? (
                        <img src={maleSnake.image} className="w-full h-full object-cover" alt="sire" />
                    ) : null}
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {maleSnake.genetics.map((g, i) => (
                      <MorphTag key={i} gene={g} />
                   ))}
                 </div>
               </div>
             ) : (
                <div className="mt-4 h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-sm">
                    Select a male
                </div>
             )}
          </div>

          <div className="flex flex-col items-center justify-center text-slate-300 dark:text-slate-600 gap-2">
             <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                <RefreshCw size={24} className="text-emerald-500" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Pairing</span>
          </div>

          {/* Female Selector */}
           <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 relative">
             <div className="absolute -top-3 left-6 bg-slate-50 dark:bg-slate-950 px-2 text-xs font-bold text-rose-500 uppercase tracking-wider">
               Dam (Female)
             </div>
             <select 
               className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
               value={selectedFemale}
               onChange={(e) => setSelectedFemale(e.target.value)}
             >
               <option value="">Select Dam...</option>
               {females.map(s => (
                 <option key={s.id} value={s.id}>{s.id} ({s.genetics.length} genes)</option>
               ))}
             </select>
             {femaleSnake ? (
               <div className="mt-4 animate-fade-in">
                 <div className="h-32 w-full rounded-lg bg-slate-200 dark:bg-slate-800 mb-3 overflow-hidden">
                    {femaleSnake.image ? (
                        <img src={femaleSnake.image} className="w-full h-full object-cover" alt="dam" />
                    ) : null}
                 </div>
                 <div className="flex flex-wrap gap-2">
                   {femaleSnake.genetics.map((g, i) => (
                      <MorphTag key={i} gene={g} />
                   ))}
                 </div>
               </div>
             ) : (
                <div className="mt-4 h-32 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-sm">
                    Select a female
                </div>
             )}
          </div>
        </div>
      </div>

      {/* HEALTH WARNINGS */}
      {healthWarnings.length > 0 && (
         <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl p-4 animate-fade-in">
            <h4 className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold mb-3 uppercase tracking-wider text-sm">
                <ShieldAlert size={18} /> Genetic Health Warnings
            </h4>
            <div className="space-y-2">
                {healthWarnings.map((w, i) => (
                    <div key={i} className="flex gap-3 items-start">
                        <AlertTriangle size={16} className="text-rose-500 shrink-0 mt-0.5" />
                        <div>
                            <span className="font-bold text-rose-700 dark:text-rose-300 text-sm block">{w.title}</span>
                            <span className="text-sm text-rose-600 dark:text-rose-400/80">{w.desc}</span>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      )}

      {/* Results */}
      {maleSnake && femaleSnake && (
        <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900 p-6 rounded-xl border border-emerald-500/30 shadow-lg relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
              <Dna size={120} />
           </div>
           
           <h4 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-6 relative z-10">
             <Dna className="text-emerald-500" size={20} />
             Offspring Probabilities (Per Gene)
           </h4>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
             {outcomes.length === 0 && (
                <div className="col-span-full p-4 text-slate-500 text-center">
                    No visual mutations predicted. Offspring will be Normal/Wild Type (possibly Het if recessive genes are involved).
                </div>
             )}
             
             {outcomes.map((outcome, idx) => (
               <div key={idx} className="group bg-white dark:bg-slate-950 p-4 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors shadow-sm">
                 <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Chance</span>
                    <span className={`text-xs font-bold ${outcome.chance === 1 ? 'text-emerald-500' : 'text-blue-500'}`}>
                        {(outcome.chance * 100).toFixed(0)}%
                    </span>
                 </div>
                 <div className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-500 transition-colors text-lg">
                    {outcome.form} {outcome.name}
                 </div>
               </div>
             ))}
           </div>
           
           <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg relative z-10 flex gap-3 items-start">
              <Info className="text-blue-500 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-blue-800 dark:text-blue-200">
                <p className="font-bold mb-1">How to read this:</p>
                <p>
                    These probabilities are calculated <strong>per gene</strong>. To find the probability of a combo (e.g. "Super Pastel Clown"), 
                    multiply the individual probabilities. <br/>
                    <em>Example: If 50% chance of Super Pastel and 25% chance of Clown, the combo chance is 12.5%.</em>
                </p>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
