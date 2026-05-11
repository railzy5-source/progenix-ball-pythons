
import React from 'react';
import { X, ShieldCheck, Truck, CreditCard, AlertTriangle, Scale, HeartHandshake } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Scale className="text-emerald-500" /> Terms of Sale
            </h2>
            <p className="text-xs text-slate-500">Private Hobbyist Policy</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
           
           {/* Section 1: Intro/Hobbyist Statement */}
           <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-3 flex items-center gap-2 text-base">
                 <AlertTriangle size={18} /> Hobbyist Breeder Statement
              </h3>
              <p className="mb-2">
                 Progenix operates strictly as a <strong>private hobbyist breeder</strong>. We are <strong>not a licensed pet shop</strong> and do not operate as a commercial entity.
              </p>
              <p>
                 All animals listed are surplus offspring produced from our personal breeding projects and are made available for sale to other breeders or enthusiasts. 
                 By purchasing, you acknowledge this is a private transaction between hobbyists. 
                 <strong>Animals are not sold as pets.</strong>
              </p>
           </div>

           {/* Section 2: Welfare */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <HeartHandshake size={20} className="text-emerald-500" /> Animal Welfare
              </h3>
              <p className="mb-3">
                 We take the health and welfare of our animals seriously. All animals for sale are raised and cared for in accordance with the highest standards in a private setting.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Health:</strong> All animals are healthy, feeding regularly, and correctly housed prior to sale.</li>
                 <li><strong>Guidance:</strong> We offer guidance and advice on husbandry upon request to ensure the animal continues to thrive.</li>
                 <li><strong>Suitability:</strong> Animals are sold only to responsible breeders and enthusiasts. We do not sell animals to minors (under 18).</li>
              </ul>
           </section>

           {/* Section 3: Payment */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <CreditCard size={20} className="text-emerald-500" /> Payment Methods
              </h3>
              <p className="mb-3">We accept the following payment methods for private transactions:</p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>PayPal Friends and Family:</strong> Preferred for security and ease.</li>
                 <li><strong>Bank Transfer:</strong> Full payment must be received and cleared before collection or shipping.</li>
                 <li><strong>Cash on Collection:</strong> Available only if collecting in person.</li>
              </ul>
              <p className="mt-3 text-xs text-slate-500 italic">
                 Note: As a private seller, we do not cover payment processor fees. Please ensure payments are made using the appropriate methods outlined above.
              </p>
           </section>

           {/* Section 4: Collection & Shipping */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Truck size={20} className="text-emerald-500" /> Collection & Shipping
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Collection:</strong> You are welcome to collect your animals in person from our location in Cardiff, UK.</li>
                 <li><strong>Shipping:</strong> We can arrange shipping at the buyer’s expense via a third-party courier specializing in live animals.</li>
                 <li><strong>Risk:</strong> While animals are shipped in suitable conditions, shipping is arranged on behalf of the buyer.</li>
              </ul>
           </section>

           {/* Section 5: Legal & Warranty */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <ShieldCheck size={20} className="text-emerald-500" /> Legal Disclaimer & Returns
              </h3>
              <div className="space-y-3">
                  <p>
                    <strong>No Commercial License:</strong> As a hobbyist breeder, we do not hold a commercial pet shop license. All sales are considered private transactions of surplus stock.
                  </p>
                  <p>
                    <strong>No Warranty/Refunds:</strong> As a private seller, <strong>we do not offer warranties, returns, or refunds</strong> on animals once they are sold and in your care.
                  </p>
                  <p>
                    <strong>Responsibility:</strong> By purchasing, the buyer acknowledges they are over 18 years of age and accept full responsibility for the care and well-being of the animal after the sale.
                  </p>
                  <p className="text-xs text-slate-500 pt-2">
                    * While we do not offer long-term warranties, we guarantee the animal is healthy at the time of transfer. Any issues with the condition of the animal upon arrival must be reported immediately.
                  </p>
              </div>
           </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
           <button 
              onClick={onClose}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
           >
              I Understand & Agree
           </button>
        </div>

      </div>
    </div>
  );
};
