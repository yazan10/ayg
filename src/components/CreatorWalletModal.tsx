import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { CURRENCIES, CurrencyCode } from '../types';
import { 
  X, 
  Wallet, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Gift, 
  ShoppingBag, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { CurrencySelectorModal } from './CurrencySelectorModal';

interface CreatorWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatorWalletModal: React.FC<CreatorWalletModalProps> = ({ isOpen, onClose }) => {
  const { wallet, currency, setCurrency, formatPrice, withdrawEarnings, lang } = useStore();

  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'iban' | 'stc' | 'paypal'>('iban');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  if (!isOpen) return null;

  const currentCur = CURRENCIES[currency] || CURRENCIES.SAR;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = parseFloat(withdrawAmount);
    // Convert entered amount from current currency back to SAR
    const amtSAR = amt / currentCur.rateFromSAR;

    if (isNaN(amtSAR) || amtSAR <= 0) {
      setWithdrawError(lang === 'ar' ? 'الرجاء إدخال مبلغ صالح للسحب' : 'Please enter a valid amount');
      return;
    }

    if (amtSAR > wallet.balanceSAR) {
      setWithdrawError(lang === 'ar' ? 'رصيدك الحالي لا يكفي لهذا المبلغ' : 'Insufficient balance');
      return;
    }

    const success = withdrawEarnings(
      amtSAR, 
      withdrawMethod === 'iban' ? 'IBAN Bank Transfer' : withdrawMethod === 'stc' ? 'STC Pay' : 'PayPal',
      accountDetails
    );

    if (success) {
      setWithdrawSuccess(true);
      setTimeout(() => {
        setWithdrawSuccess(false);
        setIsWithdrawOpen(false);
        setWithdrawAmount('');
        setAccountDetails('');
      }, 1500);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4"
        onClick={onClose}
      >
        <div 
          className="w-full max-w-xl bg-white rounded-3xl border border-neutral-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-black flex items-center gap-2">
                  {lang === 'ar' ? 'محفظة الأرباح وصناع المحتوى' : 'Creator Earnings & Wallet'}
                </h2>
                <p className="text-xs text-neutral-500">
                  {lang === 'ar' ? 'أرباح المبيعات وهدايا البث الحي الحقيقية' : 'Real-time sales & live stream gifts income'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Currency Selector Pill */}
              <button
                onClick={() => setIsCurrencyModalOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold text-black transition-colors"
                title="تغيير العملة"
              >
                <span>{currentCur.flag}</span>
                <span>{currency}</span>
                <span className="text-neutral-400 text-[10px]">({currentCur.symbol})</span>
              </button>

              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            {/* Primary Balance Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-950 p-6 text-white shadow-xl">
              <div className="relative z-10 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-neutral-300 font-medium tracking-wide">
                    {lang === 'ar' ? 'الرصيد القابل للسحب حالياً' : 'Available Withdrawable Balance'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {lang === 'ar' ? 'نشط ومحدث' : 'Live Synced'}
                  </span>
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
                    {formatPrice(wallet.balanceSAR)}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {lang === 'ar' 
                      ? `يعادل بالريال: ${wallet.balanceSAR.toLocaleString()} ر.س` 
                      : `Equivalent in SAR: ${wallet.balanceSAR.toLocaleString()} SAR`}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => setIsWithdrawOpen(true)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'طلب سحب الأرباح' : 'Request Payout'}</span>
                  </button>
                  <button
                    onClick={() => setIsCurrencyModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Coins className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تغيير العملة' : 'Currency'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Income Streams Breakdown (3 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1">
                <div className="flex items-center gap-2 text-blue-700">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="text-xs font-bold">{lang === 'ar' ? 'أرباح المتاجر' : 'Store Sales'}</span>
                </div>
                <div className="text-lg font-bold text-black font-mono">
                  {formatPrice(wallet.salesEarningsSAR)}
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {lang === 'ar' ? 'عمولات بيع المنتجات' : 'Product commissions'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-100 space-y-1">
                <div className="flex items-center gap-2 text-pink-700">
                  <Gift className="w-4 h-4" />
                  <span className="text-xs font-bold">{lang === 'ar' ? 'هدايا البث الحي' : 'Live Gifts'}</span>
                </div>
                <div className="text-lg font-bold text-black font-mono">
                  {formatPrice(wallet.liveGiftsEarningsSAR)}
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {lang === 'ar' ? 'أرباح هدايا البث المباشر' : 'Live stream virtual gifts'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1">
                <div className="flex items-center gap-2 text-purple-700">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي الأرباح' : 'All-time Earned'}</span>
                </div>
                <div className="text-lg font-bold text-black font-mono">
                  {formatPrice(wallet.totalEarnedSAR)}
                </div>
                <span className="text-[10px] text-neutral-500 block">
                  {lang === 'ar' ? 'منذ انضمامك للمنصة' : 'Since joining'}
                </span>
              </div>
            </div>

            {/* Withdraw Modal Drawer */}
            {isWithdrawOpen && (
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-black flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    {lang === 'ar' ? 'طلب سحب رصيد فوري' : 'Submit Withdrawal'}
                  </h3>
                  <button 
                    onClick={() => setIsWithdrawOpen(false)}
                    className="text-xs text-neutral-500 hover:text-black"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>

                {withdrawSuccess ? (
                  <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-3 text-xs font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>{lang === 'ar' ? 'تم تقديم طلب السحب بنجاح! سيتم التحويل خلال دقائق.' : 'Withdrawal submitted! Transferring shortly.'}</span>
                  </div>
                ) : (
                  <form onSubmit={handleWithdrawSubmit} className="space-y-3.5">
                    {withdrawError && (
                      <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{withdrawError}</span>
                      </div>
                    )}

                    <div>
                      <label className="text-xs font-medium text-neutral-600 block mb-1">
                        {lang === 'ar' ? `المبلغ المراد سحبه (${currentCur.code})` : `Amount to withdraw (${currentCur.code})`}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          step="0.01"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          placeholder="0.00"
                          className="flex-1 px-3 py-2 rounded-xl border border-neutral-300 text-sm font-bold text-black focus:outline-blue-600 bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setWithdrawAmount((wallet.balanceSAR * currentCur.rateFromSAR).toFixed(2))}
                          className="px-3 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold"
                        >
                          {lang === 'ar' ? 'الكل' : 'Max'}
                        </button>
                      </div>
                    </div>

                    {/* Method Selector */}
                    <div>
                      <label className="text-xs font-medium text-neutral-600 block mb-1">
                        {lang === 'ar' ? 'طريقة الاستلام' : 'Payout Method'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setWithdrawMethod('iban')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            withdrawMethod === 'iban' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                          }`}
                        >
                          IBAN بنكي
                        </button>
                        <button
                          type="button"
                          onClick={() => setWithdrawMethod('stc')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            withdrawMethod === 'stc' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                          }`}
                        >
                          STC Pay
                        </button>
                        <button
                          type="button"
                          onClick={() => setWithdrawMethod('paypal')}
                          className={`p-2 rounded-lg text-xs font-bold border transition-colors ${
                            withdrawMethod === 'paypal' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white text-neutral-700'
                          }`}
                        >
                          PayPal
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-neutral-600 block mb-1">
                        {withdrawMethod === 'iban' 
                          ? (lang === 'ar' ? 'رقم الآيبان (IBAN)' : 'IBAN Account Number')
                          : withdrawMethod === 'stc'
                          ? (lang === 'ar' ? 'رقم جوال STC Pay' : 'STC Pay Mobile Number')
                          : (lang === 'ar' ? 'بريد PayPal' : 'PayPal Email')}
                      </label>
                      <input
                        type="text"
                        value={accountDetails}
                        onChange={(e) => setAccountDetails(e.target.value)}
                        placeholder={withdrawMethod === 'iban' ? 'SA00 0000 0000 0000 0000 00' : withdrawMethod === 'stc' ? '05xxxxxxxx' : 'account@paypal.com'}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-sm font-medium text-black focus:outline-blue-600 bg-white font-mono"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      {lang === 'ar' ? 'تأكيد السحب الفوري' : 'Confirm Withdrawal'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Transactions History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-black">
                  {lang === 'ar' ? 'سجل العمليات والأرباح' : 'Recent Transactions'}
                </h3>
                <span className="text-xs text-neutral-500">
                  {wallet.transactions.length} {lang === 'ar' ? 'عملية' : 'records'}
                </span>
              </div>

              <div className="space-y-2">
                {wallet.transactions.map((tx) => {
                  const isPositive = tx.amountSAR > 0;
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                          tx.type === 'live_gift' 
                            ? 'bg-pink-100 text-pink-600' 
                            : tx.type === 'sale_commission' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-emerald-100 text-emerald-600'
                        }`}>
                          {tx.type === 'live_gift' ? (
                            <Gift className="w-4 h-4" />
                          ) : tx.type === 'sale_commission' ? (
                            <ShoppingBag className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-black">
                            {lang === 'ar' ? tx.title : (tx.titleEn || tx.title)}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {tx.date} • {tx.senderUsername ? `@${tx.senderUsername}` : tx.status}
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <div className={`text-xs font-bold font-mono ${
                          isPositive ? 'text-emerald-600' : 'text-neutral-900'
                        }`}>
                          {isPositive ? '+' : ''}{formatPrice(tx.amountSAR)}
                        </div>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                          tx.status === 'completed' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                          {lang === 'ar' 
                            ? (tx.status === 'completed' ? 'مكتمل' : 'قيد المعالجة')
                            : tx.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <CurrencySelectorModal 
        isOpen={isCurrencyModalOpen} 
        onClose={() => setIsCurrencyModalOpen(false)} 
      />
    </>
  );
};
