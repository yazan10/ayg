import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ShoppingBag, 
  Sparkles,
  Lock,
  ArrowRight
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    placeOrder, 
    adminSettings, 
    lang, 
    t 
  } = useStore();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [city, setCity] = useState(lang === 'ar' ? 'الرياض' : 'Riyadh');
  const [customerAddress, setCustomerAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'mada' | 'apple_pay' | 'cod'>('credit_card');

  // Interactive Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Placed Order Result State
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCheckoutOpen) return null;

  const totalCartAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 16);
    // Format 4 4 4 4
    const formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = val.slice(0, 2) + '/' + val.slice(2);
    }
    setCardExpiry(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) return;

    setIsProcessing(true);

    // Simulate safe processing
    setTimeout(() => {
      const order = placeOrder({
        customerName,
        customerPhone,
        customerAddress,
        city,
        paymentMethod
      });
      setPlacedOrder(order);
      setIsProcessing(false);
    }, 1200);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setPlacedOrder(null);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        className="w-full h-full sm:h-auto sm:max-h-[95vh] sm:max-w-xl bg-white sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden text-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-black">
                {lang === 'ar' ? 'إتمام الطلب وبوابة الدفع الآمن' : 'Secure Checkout & Payment'}
              </h3>
              <p className="text-[10px] text-neutral-500 font-mono">
                {cart.length} {lang === 'ar' ? 'عناصر في السلة' : 'items in cart'}
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {placedOrder ? (
            /* Order Placed Success View */
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-black text-black">{t.orderSuccess}</h3>
                <p className="text-xs text-neutral-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  {t.orderSuccessDesc}
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-start text-xs space-y-2.5 max-w-md mx-auto">
                <div className="flex justify-between items-center border-b pb-2">
                  <span className="text-neutral-500">{lang === 'ar' ? 'رقم الطلب' : 'Order Number'}</span>
                  <span className="font-mono font-bold text-blue-600 text-sm">{placedOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">{lang === 'ar' ? 'المتجر' : 'Store'}</span>
                  <span className="font-bold text-black">{placedOrder.storeName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">{lang === 'ar' ? 'العميل' : 'Customer'}</span>
                  <span className="font-bold text-black">{placedOrder.customerName} ({placedOrder.customerPhone})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-neutral-500">{lang === 'ar' ? 'عنوان التوصيل' : 'Delivery Address'}</span>
                  <span className="text-black font-medium">{placedOrder.city} - {placedOrder.customerAddress}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2 font-bold text-black text-sm">
                  <span>{lang === 'ar' ? 'الإجمالي المدفوع (تجريبي)' : 'Total Amount (Test)'}</span>
                  <span className="text-blue-600">{placedOrder.totalAmount} SAR</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleClose}
                  className="w-full max-w-md py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/10 transition-colors"
                >
                  {lang === 'ar' ? 'العودة للتسوق والمتاجر' : 'Return to Stores'}
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Payment Feature Under Development Notice Card */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-black">
                      {lang === 'ar' ? 'بوابة الدفع الإلكتروني' : 'Payment Gateway'}
                    </h4>
                    <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.2 rounded-full">
                      {t.underDevelopment}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    {lang === 'ar' ? adminSettings.paymentNotice : adminSettings.paymentNoticeEn}
                  </p>
                </div>
              </div>

              {/* Supported Cards Logos Bar */}
              <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-600">
                  {lang === 'ar' ? 'البطاقات المدعومة:' : 'Supported:'}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-white border text-[10px] font-bold text-emerald-700">مدى Mada</span>
                  <span className="px-2 py-0.5 rounded bg-white border text-[10px] font-bold text-blue-800">Visa</span>
                  <span className="px-2 py-0.5 rounded bg-white border text-[10px] font-bold text-red-600">Mastercard</span>
                  <span className="px-2 py-0.5 rounded bg-white border text-[10px] font-bold text-neutral-800">Pay</span>
                </div>
              </div>

              {/* Realistic Credit Card Preview (Deep Royal Blue) */}
              <div className="relative w-full max-w-sm mx-auto h-44 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-800 to-sky-600 p-5 text-white shadow-xl shadow-blue-950/20 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded bg-sky-300/80"></div>
                    <span className="text-xs font-mono tracking-wider opacity-80">DEBIT / CREDIT</span>
                  </div>
                  <span className="font-black text-sm tracking-widest text-sky-200">aygramPay</span>
                </div>

                <div className="font-mono text-base tracking-widest text-center py-2">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="block text-[9px] opacity-70 uppercase">{t.cardHolder}</span>
                    <span className="font-bold truncate max-w-[140px] block">
                      {cardHolder || 'CARDHOLDER NAME'}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] opacity-70 uppercase">EXPIRES</span>
                    <span className="font-bold">{cardExpiry || 'MM/YY'}</span>
                  </div>
                </div>
              </div>

              {/* Payment Card Input Fields */}
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block font-bold mb-1 text-black">{t.cardNumber}</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="4120 0000 0000 0000"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600 text-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.cardExpiry}</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="12/28"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600 text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.cardCvv}</label>
                    <input
                      type="password"
                      dir="ltr"
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none font-mono focus:border-blue-600 text-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1 text-black">{t.cardHolder}</label>
                  <input
                    type="text"
                    placeholder="Ahmed Al-Salem"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 uppercase text-black"
                  />
                </div>
              </div>

              {/* Shipping & Customer Information */}
              <div className="border-t border-neutral-200 pt-4 space-y-3 text-xs">
                <h4 className="font-bold text-sm text-black">
                  {lang === 'ar' ? 'بيانات الشحن والاستلام' : 'Shipping Information'}
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.fullName} *</label>
                    <input
                      type="text"
                      required
                      placeholder="محمد العتيبي"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.phone} *</label>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      placeholder="0501234567"
                      value={customerPhone}
                      onChange={e => setCustomerPhone(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.city} *</label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                    >
                      <option value="الرياض">الرياض (Riyadh)</option>
                      <option value="جدة">جدة (Jeddah)</option>
                      <option value="الدمام">الدمام (Dammam)</option>
                      <option value="مكة المكرمة">مكة المكرمة (Makkah)</option>
                      <option value="دبي">دبي (Dubai)</option>
                      <option value="أبوظبي">أبوظبي (Abu Dhabi)</option>
                      <option value="الدوحة">الدوحة (Doha)</option>
                      <option value="الكويت">الكويت (Kuwait)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1 text-black">{t.shippingAddress} *</label>
                    <input
                      type="text"
                      required
                      placeholder="حي النرجس، شارع أنس بن مالك"
                      value={customerAddress}
                      onChange={e => setCustomerAddress(e.target.value)}
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl outline-none focus:border-blue-600 text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Total Summary & Submit */}
              <div className="border-t border-neutral-200 pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm font-bold text-black">
                  <span>{t.total}</span>
                  <span className="text-lg font-black text-blue-600">{totalCartAmount} SAR</span>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? (lang === 'ar' ? 'جاري معالجة الدفع التجريبي الآمن...' : 'Processing secure test checkout...') 
                      : t.placeOrder}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
