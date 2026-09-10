import React from 'react';
import { useStore } from '../context/StoreContext';
import { CURRENCIES, CurrencyCode } from '../types';
import { Check, X, Coins, ArrowRight } from 'lucide-react';

interface CurrencySelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CurrencySelectorModal: React.FC<CurrencySelectorModalProps> = ({ isOpen, onClose }) => {
  const { currency, setCurrency, lang } = useStore();

  if (!isOpen) return null;

  const currencyList = Object.values(CURRENCIES);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs transition-opacity p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar on mobile */}
        <div className="w-12 h-1.5 bg-neutral-300 rounded-full mx-auto mt-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-black">
                {lang === 'ar' ? 'اختر عملة المنصة' : 'Select Currency'}
              </h3>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'يتم تحويل وتحديث كافة الأسعار والأرباح تلقائياً' : 'All prices and earnings convert automatically'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Currency Options */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {currencyList.map((cur) => {
            const isSelected = cur.code === currency;
            return (
              <button
                key={cur.code}
                onClick={() => {
                  setCurrency(cur.code as CurrencyCode);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-start ${
                  isSelected 
                    ? 'border-blue-600 bg-blue-50/70 shadow-xs' 
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cur.flag}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-black">
                        {lang === 'ar' ? cur.nameAr : cur.nameEn}
                      </span>
                      <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-md bg-neutral-200 text-neutral-800">
                        {cur.code}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500">
                      {lang === 'ar' 
                        ? `الرمز: ${cur.symbol} • سعر الصرف: 1 ر.س = ${cur.rateFromSAR} ${cur.code}`
                        : `Symbol: ${cur.symbolEn} • Rate: 1 SAR = ${cur.rateFromSAR} ${cur.code}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-blue-700 font-mono">
                    {cur.symbol}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-600">
          <span>{lang === 'ar' ? 'العملات المدعومة: SAR, ILS, JOD, USD' : 'Supported: SAR, ILS, JOD, USD'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800 transition-colors"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
