
import React from 'react';
import { PreyShoppingList as IPreyShoppingList, PreyItem } from '../types';
import { ShoppingCart, Package, Info, Truck } from 'lucide-react';

interface ShoppingListProps {
  data: IPreyShoppingList;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ data }) => {
  const currencySymbol = data.items.length > 0 ? data.items[0].currency : '£';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShoppingCart className="text-emerald-500" size={20} />
          Feeder Shopping List
        </h3>
        <p className="text-xs text-slate-500 mt-1">Calculated for a 35-day supply cycle.</p>
      </div>
      
      <div className="p-0 flex-1">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 bg-white dark:bg-slate-900 uppercase border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4 font-bold tracking-wider">Item Size</th>
              <th className="px-6 py-4 text-center font-bold tracking-wider">Qty Needed</th>
              <th className="px-6 py-4 text-right font-bold tracking-wider">Est. Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 flex flex-col items-center">
                  <Info size={24} className="mb-2 opacity-50" />
                  No items needed. Your collection is fed!
                </td>
              </tr>
            ) : (
              data.items.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Package size={16} className="text-slate-400" />
                    </div>
                    {item.size}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full text-xs font-bold">
                      {item.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-600 dark:text-slate-400">
                    {item.cost ? `${item.currency}${item.cost.toFixed(2)}` : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {data.items.length > 0 && (
        <div className="mt-auto p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/20">
            <div className="space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{currencySymbol}{data.itemsCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500 flex items-center gap-2"><Truck size={14} /> Delivery</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">{currencySymbol}{data.deliveryCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-900 dark:text-white">Total</span>
                    <span className="text-emerald-500">{currencySymbol}{data.totalCost.toFixed(2)}</span>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
