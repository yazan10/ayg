import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { CreditCard, AlertCircle, CheckCircle2, Lock } from 'lucide-react';
import { Order } from '../types';
import { StoreInvoice } from '../components/ui/StoreInvoice';
import { PaymentMethodSelector } from '../components/ui/PaymentMethodSelector';

export const CheckoutPage: React.FC = () => {
  const { cart, placeOrder, adminSettings, lang, t } = useStore();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(lang === 'ar' ? 'الرياض' : 'Riyadh');
  const [customerAddress, setCustomerAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<string>('credit_card');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const totalCartAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'إتمام الطلب' : 'Checkout'} />
        <div className="p-8 text-center">
          <p className="text-sm text-neutral-500 mb-4">{lang === 'ar' ? 'السلة فارغة' : 'Cart is empty'}</p>
          <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">{t.startShopping}</button>
        </div>
      </div>
    );
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) val = val.slice(0, 2) + '/' + val.slice(2);
    setCardExpiry(val);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;
    setIsProcessing(true);
    setTimeout(() => {
      const mappedMethod = (paymentMethod === 'google' ? 'credit_card' : paymentMethod === 'paypal' ? 'credit_card' : paymentMethod) as 'credit_card' | 'mada' | 'apple_pay' | 'cod';
      const order = placeOrder({ customerName, customerPhone, customerAddress, city, paymentMethod: mappedMethod });
      setPlacedOrder(order);
      setIsProcessing(false);
    }, 1200);
  };

  if (placedOrder) {
    return (
      <div>
        <PageHeader title={t.orderSuccess} backTo="/" />
        <div className="p-4 sm:p-6 max-w-lg mx-auto space-y-6">
          <div className="text-center space-y-3">
            <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <div>
              <h3 className="text-xl font-black text-black">{t.orderSuccess}</h3>
              <p className="text-sm text-neutral-600 mt-1">{t.orderSuccessDesc}</p>
            </div>
          </div>

          <StoreInvoice order={placedOrder} />

          <div className="flex gap-3">
            <button onClick={() => navigate('/orders')} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold"> {lang === 'ar' ? 'عرض طلباتي' : 'View Orders'}</button>
            <button onClick={() => navigate('/')} className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-sm font-bold">{lang === 'ar' ? 'متابعة التسوق' : 'Continue Shopping'}</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'إتمام الطلب وبوابة الدفع الآمن' : 'Secure Checkout & Payment'} subtitle={`${cart.length} ${lang === 'ar' ? 'عنصر' : 'items'} • ${totalCartAmount} SAR`} />
      <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2"><h4 className="font-bold text-sm text-black">{lang === 'ar' ? 'بوابة الدفع الإلكتروني' : 'Payment Gateway'}</h4><span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">{t.underDevelopment}</span></div>
            <p className="text-xs text-neutral-700 leading-relaxed mt-1">{lang === 'ar' ? adminSettings.paymentNotice : adminSettings.paymentNoticeEn}</p>
          </div>
        </div>

        <div className="flex justify-center">
          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} lang={lang} />
        </div>

        <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-800 to-sky-600 p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between"><span className="text-xs font-mono opacity-80">DEBIT / CREDIT</span><span className="font-black text-sm tracking-widest text-sky-200">aygramPay</span></div>
          <div className="font-mono text-base tracking-widest text-center py-2">{cardNumber || '•••• •••• •••• ••••'}</div>
          <div className="flex justify-between text-[11px] font-mono"><div><span className="block text-[9px] opacity-70">{t.cardHolder}</span><span className="font-bold truncate block max-w-[140px]">{cardHolder || 'CARDHOLDER NAME'}</span></div><div><span className="block text-[9px] opacity-70">EXPIRES</span><span className="font-bold">{cardExpiry || 'MM/YY'}</span></div></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Card Details - Only for card/paypal/google */}
          {(paymentMethod === 'credit_card' || paymentMethod === 'mada' || paymentMethod === 'google' || paymentMethod === 'paypal' || paymentMethod === 'visa') && (
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div><label className="block font-bold mb-1">{t.cardNumber}</label><input type="text" dir="ltr" placeholder="4120 0000 0000 0000" value={cardNumber} onChange={handleCardNumberChange} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block font-bold mb-1">{t.cardExpiry}</label><input type="text" dir="ltr" placeholder="12/28" value={cardExpiry} onChange={handleExpiryChange} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600" /></div>
                <div><label className="block font-bold mb-1">{t.cardCvv}</label><input type="password" dir="ltr" maxLength={4} placeholder="•••" value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600" /></div>
              </div>
              <div><label className="block font-bold mb-1">{t.cardHolder}</label><input type="text" placeholder="Ahmed Al-Salem" value={cardHolder} onChange={e => setCardHolder(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 uppercase" /></div>
            </div>
          )}

          <div className="border-t pt-4 space-y-3">
            <h4 className="font-bold text-base">{lang === 'ar' ? 'بيانات الشحن' : 'Shipping Information'}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block font-bold mb-1 text-sm">{t.fullName} *</label><input type="text" required placeholder="محمد العتيبي" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
              <div><label className="block font-bold mb-1 text-sm">{t.phone} *</label><input type="tel" required dir="ltr" placeholder="0501234567" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div><label className="block font-bold mb-1 text-sm">{t.city} *</label><select value={city} onChange={e => setCity(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600"><option value="الرياض">الرياض</option><option value="جدة">جدة</option><option value="الدمام">الدمام</option><option value="مكة المكرمة">مكة</option><option value="دبي">دبي</option></select></div>
              <div><label className="block font-bold mb-1 text-sm">{t.shippingAddress} *</label><input type="text" required placeholder="حي النرجس، شارع أنس" value={customerAddress} onChange={e => setCustomerAddress(e.target.value)} className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600" /></div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-3">
            <div className="flex justify-between font-bold text-lg"><span>{t.total}</span><span className="text-blue-600">{totalCartAmount} SAR</span></div>
            <button type="submit" disabled={isProcessing} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50">
              <Lock className="w-4 h-4" /><span>{isProcessing ? (lang === 'ar' ? 'جاري المعالجة...' : 'Processing...') : t.placeOrder}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
