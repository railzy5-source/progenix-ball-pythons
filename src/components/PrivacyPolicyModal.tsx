
import React from 'react';
import { X, Lock, Eye, Server, Mail, Shield, Cookie } from 'lucide-react';

interface PrivacyPolicyModalProps {
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
               <Shield className="text-emerald-500" /> Privacy Policy
            </h2>
            <p className="text-xs text-slate-500">Effective Date: February 2026</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={24} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
           
           {/* Intro */}
           <section>
              <p>
                 At <strong>Progenix Ball Pythons</strong>, we respect your privacy. As a private hobbyist breeder, we are committed to protecting the personal information you share with us. This policy outlines what data we collect, how we use it, and your rights regarding your information.
              </p>
           </section>

           {/* Section 1: Collection */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Eye size={20} className="text-emerald-500" /> Information We Collect
              </h3>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Inquiries:</strong> When you contact us via email or social media to inquire about an animal, we collect your name, contact details, and any information provided in your message.</li>
                 <li><strong>Transfer Data:</strong> If you acquire an animal, we collect information necessary to process the private transaction and arrange delivery, including your full name, physical address, and phone number.</li>
                 <li><strong>Updates:</strong> If you subscribe to our season updates, we collect your email address.</li>
              </ul>
           </section>

           {/* Section 2: Usage */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Server size={20} className="text-emerald-500" /> How We Use Your Data
              </h3>
              <p className="mb-2">We use your information solely for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                 <li><strong>Communication:</strong> To respond to your inquiries regarding our available surplus stock.</li>
                 <li><strong>Fulfillment:</strong> To arrange private transfers and coordinate animal courier delivery.</li>
                 <li><strong>Updates:</strong> To send you notifications about new clutches or available surplus (only if you have opted in).</li>
                 <li><strong>Records:</strong> To maintain records of transfer as required by animal welfare practices.</li>
              </ul>
           </section>

           {/* Section 3: Sharing */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Lock size={20} className="text-emerald-500" /> Data Sharing & Security
              </h3>
              <p className="mb-3">
                 We <strong>do not sell, trade, or rent</strong> your personal identification information to others.
              </p>
              <p className="mb-2">We may share generic aggregated demographic information not linked to any personal identification information with trusted third parties for analytics.</p>
              <p>
                 <strong>Service Providers:</strong> We may share necessary details (Name, Address, Phone) with licensed specialized reptile couriers (e.g., Ridgeway, Reptile Courier EU) strictly for the purpose of delivering your animal.
              </p>
           </section>

           {/* Section 4: Cookies */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Cookie size={20} className="text-emerald-500" /> Cookies & Local Storage
              </h3>
              <p>
                 This website uses Local Storage to save your preferences (such as Light/Dark mode) and application state (dashboard data). These are stored locally on your device and are not tracked by us for analytics purposes.
              </p>
           </section>

           {/* Section 5: Contact */}
           <section>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                 <Mail size={20} className="text-emerald-500" /> Contact Us
              </h3>
              <p>
                 If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at:
              </p>
              <a href="mailto:progenixbp@gmail.com" className="text-emerald-500 font-bold hover:underline mt-2 inline-block">progenixbp@gmail.com</a>
           </section>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end">
           <button 
              onClick={onClose}
              className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
           >
              Close
           </button>
        </div>

      </div>
    </div>
  );
};
