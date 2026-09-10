import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { CURRENCIES } from '../types';
import { Wallet, ArrowUpRight, Gift, ShoppingBag, TrendingUp, Coins, CreditCard, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { CurrencySelectorModal } from '../components/CurrencySelectorModal';

export const WalletPage: React.FC = () => {
  const { wallet, currency, formatPrice, withdrawEarnings, lang } = useStore();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'iban' | 'stc' | 'paypal'>('iban');
  const [accountDetails, setAccountDetails] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);
  const currentCur = CURRENCIES[currency] || CURRENCIES.SAR;

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError('');
    const amt = parseFloat(withdrawAmount);
    const amtSAR = amt / currentCur.rateFromSAR;
    if (isNaN(amtSAR) || amtSAR <= 0) { setWithdrawError(lang === 'ar' ? 'الرجاء إدخال مبلغ صالح' : 'Please enter a valid amount'); return; }
    if (amtSAR > wallet.balanceSAR) { setWithdrawError(lang === 'ar' ? 'رصيدك لا يكفي' : 'Insufficient balance'); return; }
    const success = withdrawEarnings(amtSAR, withdrawMethod === 'iban' ? 'IBAN Bank Transfer' : withdrawMethod === 'stc' ? 'STC Pay' : 'PayPal', accountDetails);
    if (success) {
      setWithdrawSuccess(true);
      setTimeout(() => { setWithdrawSuccess(false); setIsWithdrawOpen(false); setWithdrawAmount(''); setAccountDetails(''); }, 1500);
    }
  };

  return (
    <div>
      <PageHeader
        title={lang === 'ar' ? 'محفظة الأرباح' : 'Creator Wallet'}
        subtitle={lang === 'ar' ? 'أرباح المبيعات وهدايا البث الحي' : 'Sales & live gifts income'}
        actions={
          <button onClick={() => setIsCurrencyModalOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-100 text-xs font-bold">
            <span>{currentCur.flag}</span><span>{currency}</span>
          </button>
        }
      />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-blue-950 p-6 text-white shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-300">{lang === 'ar' ? 'الرصيد القابل للسحب حالياً' : 'Available Balance'}</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 flex items-center gap-1"><Sparkles className="w-3 h-3" />{lang === 'ar' ? 'نشط ومحدث' : 'Live Synced'}</span>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black tracking-tight font-mono">{formatPrice(wallet.balanceSAR)}</div>
              <div className="text-xs text-neutral-400 mt-1">{lang === 'ar' ? `يعادل بالريال: ${wallet.balanceSAR.toLocaleString()} ر.س` : `Equivalent in SAR: ${wallet.balanceSAR.toLocaleString()} SAR`}</div>
            </div>
            <div className="pt-2 flex gap-2">
              <button onClick={() => setIsWithdrawOpen(!isWithdrawOpen)} className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-sm flex items-center justify-center gap-2">
                <ArrowUpRight className="w-4 h-4" />{lang === 'ar' ? 'طلب سحب الأرباح' : 'Request Payout'}
              </button>
              <button onClick={() => setIsCurrencyModalOpen(true)} className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-1.5"><Coins className="w-4 h-4" />{lang === 'ar' ? 'العملة' : 'Currency'}</button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1"><div className="flex items-center gap-2 text-blue-700"><ShoppingBag className="w-4 h-4" /><span className="text-xs font-bold">{lang === 'ar' ? 'أرباح المتاجر' : 'Store Sales'}</span></div><div className="text-lg font-bold font-mono">{formatPrice(wallet.salesEarningsSAR)}</div></div>
          <div className="p-4 rounded-xl bg-pink-50/60 border border-pink-100 space-y-1"><div className="flex items-center gap-2 text-pink-700"><Gift className="w-4 h-4" /><span className="text-xs font-bold">{lang === 'ar' ? 'هدايا البث الحي' : 'Live Gifts'}</span></div><div className="text-lg font-bold font-mono">{formatPrice(wallet.liveGiftsEarningsSAR)}</div></div>
          <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-1"><div className="flex items-center gap-2 text-purple-700"><TrendingUp className="w-4 h-4" /><span className="text-xs font-bold">{lang === 'ar' ? 'إجمالي الأرباح' : 'All-time'}</span></div><div className="text-lg font-bold font-mono">{formatPrice(wallet.totalEarnedSAR)}</div></div>
        </div>

        {isWithdrawOpen && (
          <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
            <div className="flex items-center justify-between"><h3 className="text-sm font-bold flex items-center gap-2"><CreditCard className="w-4 h-4 text-emerald-600" />{lang === 'ar' ? 'طلب سحب رصيد' : 'Submit Withdrawal'}</h3><button onClick={() => setIsWithdrawOpen(false)} className="text-xs text-neutral-500">{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button></div>
            {withdrawSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 flex items-center gap-3 text-sm font-bold"><CheckCircle2 className="w-5 h-5" /><span>{lang === 'ar' ? 'تم تقديم طلب السحب بنجاح!' : 'Withdrawal submitted!'}</span></div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} className="space-y-3">
                {withdrawError && <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{withdrawError}</span></div>}
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">{lang === 'ar' ? `المبلغ (${currentCur.code})` : `Amount (${currentCur.code})`}</label>
                  <div className="flex gap-2">
                    <input type="number" step="0.01" value={withdrawAmount} onChange={e => setWithdrawAmount(e.target.value)} placeholder="0.00" className="flex-1 px-3 py-3 rounded-xl border border-neutral-300 text-sm font-bold focus:outline-blue-600" required />
                    <button type="button" onClick={() => setWithdrawAmount((wallet.balanceSAR * currentCur.rateFromSAR).toFixed(2))} className="px-4 py-3 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-black text-xs font-bold">{lang === 'ar' ? 'الكل' : 'Max'}</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">{lang === 'ar' ? 'طريقة الاستلام' : 'Payout Method'}</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setWithdrawMethod('iban')} className={`p-2.5 rounded-xl text-xs font-bold border ${withdrawMethod === 'iban' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white'}`}>IBAN بنكي</button>
                    <button type="button" onClick={() => setWithdrawMethod('stc')} className={`p-2.5 rounded-xl text-xs font-bold border ${withdrawMethod === 'stc' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white'}`}>STC Pay</button>
                    <button type="button" onClick={() => setWithdrawMethod('paypal')} className={`p-2.5 rounded-xl text-xs font-bold border ${withdrawMethod === 'paypal' ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-neutral-200 bg-white'}`}>PayPal</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-neutral-600 block mb-1">{withdrawMethod === 'iban' ? (lang === 'ar' ? 'رقم الآيبان' : 'IBAN') : withdrawMethod === 'stc' ? (lang === 'ar' ? 'رقم جوال STC Pay' : 'STC Pay Number') : 'PayPal Email'}</label>
                  <input type="text" value={accountDetails} onChange={e => setAccountDetails(e.target.value)} placeholder={withdrawMethod === 'iban' ? 'SA00 0000 0000' : withdrawMethod === 'stc' ? '05xxxxxxxx' : 'account@paypal.com'} className="w-full px-3 py-3 rounded-xl border border-neutral-300 text-sm font-mono focus:outline-blue-600" required />
                </div>
                <button type="submit" className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl">{lang === 'ar' ? 'تأكيد السحب الفوري' : 'Confirm Withdrawal'}</button>
              </form>
            )}
          </div>
        )}

        <div className="space-y-3">
          <div className="flex items-center justify-between"><h3 className="text-sm font-bold">{lang === 'ar' ? 'سجل العمليات' : 'Recent Transactions'}</h3><span className="text-xs text-neutral-500">{wallet.transactions.length} {lang === 'ar' ? 'عملية' : 'records'}</span></div>
          <div className="space-y-2">
            {wallet.transactions.map(tx => {
              const isPositive = tx.amountSAR > 0;
              return (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.type === 'live_gift' ? 'bg-pink-100 text-pink-600' : 'bg-emerald-100 text-emerald-600'}`}>{tx.type === 'live_gift' ? <Gift className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}</div>
                    <div><div className="text-sm font-bold">{lang === 'ar' ? tx.title : (tx.titleEn || tx.title)}</div><div className="text-xs text-neutral-400">{tx.date} • {tx.senderUsername ? `@${tx.senderUsername}` : tx.status}</div></div>
                  </div>
                  <div className="text-end"><div className={`text-sm font-bold font-mono ${isPositive ? 'text-emerald-600' : 'text-black'}`}>{isPositive ? '+' : ''}{formatPrice(tx.amountSAR)}</div><span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${tx.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{tx.status}</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <CurrencySelectorModal isOpen={isCurrencyModalOpen} onClose={() => setIsCurrencyModalOpen(false)} />
    </div>
  );
};
