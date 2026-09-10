import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    setIsCheckoutOpen, 
    lang, 
    t 
  } = useStore();

  if (!isCartOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between text-neutral-900 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-black">{t.cartTitle}</h3>
            <span className="text-xs text-neutral-500 font-mono">({cart.length})</span>
          </div>

          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-neutral-500 hover:text-black rounded-lg hover:bg-neutral-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto" />
              <p className="text-xs font-bold text-neutral-600">
                {lang === 'ar' ? 'سلة المشتريات فارغة حالياً' : 'Your cart is currently empty'}
              </p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                {t.startShopping}
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={item.product.id}
                className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between gap-3"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover border border-neutral-200 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-black truncate">
                    {lang === 'ar' ? item.product.name : item.product.nameEn}
                  </h4>
                  <p className="text-xs font-black text-blue-700 mt-0.5">
                    {item.product.price} {item.product.currency}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-neutral-300 rounded-md bg-white text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 hover:bg-neutral-100"
                      >
                        -
                      </button>
                      <span className="px-2 py-0.5 font-bold font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 hover:bg-neutral-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-neutral-400 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-end font-bold text-xs text-black">
                  {item.product.price * item.quantity} {item.product.currency}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-neutral-200 bg-neutral-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>{lang === 'ar' ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{totalAmount} SAR</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>{lang === 'ar' ? 'الشحن' : 'Shipping'}</span>
                <span className="text-emerald-600 font-bold">{lang === 'ar' ? 'مجاني' : 'Free'}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-black pt-2 border-t">
                <span>{t.total}</span>
                <span className="text-blue-700">{totalAmount} SAR</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCartOpen(false);
                setIsCheckoutOpen(true);
              }}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/10 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>{t.checkout}</span>
              {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
