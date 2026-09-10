import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Trash2, ShoppingBag, ArrowLeft, ArrowRight } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, lang, t } = useStore();
  const navigate = useNavigate();
  const totalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="flex flex-col min-h-[70vh]">
      <PageHeader title={t.cartTitle} subtitle={`${cart.length} ${lang === 'ar' ? 'عنصر' : 'items'}`} />

      <div className="flex-1 p-4 sm:p-6 space-y-4 max-w-2xl mx-auto w-full">
        {cart.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto" />
            <p className="text-sm font-bold text-neutral-600">{lang === 'ar' ? 'سلة المشتريات فارغة حالياً' : 'Your cart is currently empty'}</p>
            <Link to="/" className="inline-block text-sm font-bold text-blue-600 hover:underline">{t.startShopping}</Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="p-3 sm:p-4 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
                  <Link to={`/product/${item.product.id}`} className="shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover border border-neutral-200" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.id}`} className="text-sm font-bold text-black hover:text-blue-600 line-clamp-1">
                      {lang === 'ar' ? item.product.name : item.product.nameEn}
                    </Link>
                    <p className="text-sm font-black text-blue-700 mt-0.5">{item.product.price} {item.product.currency}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-neutral-300 rounded-lg bg-neutral-50 text-xs">
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)} className="px-2.5 py-1 hover:bg-neutral-200">-</button>
                        <span className="px-3 py-1 font-bold font-mono">{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)} className="px-2.5 py-1 hover:bg-neutral-200">+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.product.id)} className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-end font-black text-sm text-black shrink-0">
                    {item.product.price * item.quantity} {item.product.currency}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3 sticky bottom-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-neutral-600"><span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span><span>{totalAmount} SAR</span></div>
                <div className="flex justify-between text-neutral-600"><span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span><span className="text-emerald-600 font-bold">{lang === 'ar' ? 'مجاني' : 'Free'}</span></div>
                <div className="flex justify-between font-black text-base text-black pt-2 border-t"><span>{t.total}</span><span className="text-blue-700">{totalAmount} SAR</span></div>
              </div>
              <button onClick={() => navigate('/checkout')} className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md flex items-center justify-center gap-2">
                <span>{t.checkout}</span>{lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
              <p className="text-[11px] text-center text-neutral-500">{t.freeShipping}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
