import React, { useState } from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import './StoreInvoice.css';

interface StoreInvoiceProps {
  order: Order;
  onCheckout?: () => void;
  showActions?: boolean;
}

export const StoreInvoice: React.FC<StoreInvoiceProps> = ({ order, onCheckout, showActions = false }) => {
  const { lang } = useStore();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const isRtl = lang === 'ar';

  // Calculate details
  const subtotal = order.totalAmount;
  const shipping = 0; // Free shipping
  const tax = Math.round(subtotal * 0.05); // 5% tax for demo
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0; // 10% discount
  const total = subtotal + shipping + tax - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) {
      setPromoError(lang === 'ar' ? 'أدخل كود الخصم' : 'Enter promo code');
      return;
    }
    const validCodes = ['AYGRAM10', 'WELCOME', 'خصم10', 'aygram'];
    if (validCodes.includes(promoCode.trim().toUpperCase()) || validCodes.includes(promoCode.trim())) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError(lang === 'ar' ? 'كود غير صالح' : 'Invalid code');
      setPromoApplied(false);
    }
  };

  return (
    <div className="invoice-container" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="invoice-card cart">
        <label className="title">
          <span>{lang === 'ar' ? 'الفاتورة' : 'CHECKOUT'}</span>
          <span className="order-number">{order.orderNumber}</span>
        </label>

        <div className="steps">
          <div className="step">
            <div>
              <span>{lang === 'ar' ? 'الشحن' : 'SHIPPING'}</span>
              <p className="address-line">{order.customerAddress}</p>
              <p className="address-line">{order.city}</p>
              <p className="address-line">{order.customerName} • {order.customerPhone}</p>
              <p className="address-line" style={{ fontSize: '10px', color: '#8a6a67', marginTop: '4px' }}>
                {order.storeName}
              </p>
            </div>

            <hr />

            <div>
              <span>{lang === 'ar' ? 'طريقة الدفع' : 'PAYMENT METHOD'}</span>
              <p>{order.paymentMethod === 'credit_card' ? 'Visa / Mada' : order.paymentMethod === 'mada' ? 'Mada' : order.paymentMethod === 'apple_pay' ? 'Apple Pay' : lang === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</p>
              <p style={{ fontSize: '10px', color: '#8a6a67' }}>
                {order.paymentStatus === 'test_mode' ? (lang === 'ar' ? 'وضع تجريبي آمن' : 'Sandbox Mode') : order.paymentStatus}
                {' • '}
                {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}
              </p>
            </div>

            <hr />

            {/* Items */}
            <div>
              <span>{lang === 'ar' ? 'المنتجات' : 'ITEMS'} ({order.items.length})</span>
              <div className="items-list">
                {order.items.map((item, idx) => (
                  <div key={idx} className="item-row">
                    <img src={item.image} alt={item.productName} />
                    <div className="item-info">
                      <div className="item-name">{item.productName}</div>
                      <div className="item-qty">x{item.quantity}</div>
                    </div>
                    <span className="item-price">{item.price * item.quantity} SAR</span>
                  </div>
                ))}
              </div>
            </div>

            <hr />

            <div className="promo">
              <span>{lang === 'ar' ? 'هل لديك كود خصم؟' : 'HAVE A PROMO CODE?'}</span>
              <form className="form" onSubmit={handleApplyPromo}>
                <input
                  className="input_field"
                  placeholder={lang === 'ar' ? 'أدخل كود الخصم' : 'Enter a Promo Code'}
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                />
                <button type="submit" disabled={promoApplied}>
                  {promoApplied ? (lang === 'ar' ? 'تم ✓' : 'Applied ✓') : lang === 'ar' ? 'تطبيق' : 'Apply'}
                </button>
              </form>
              {promoError && (
                <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '6px' }}>{promoError}</p>
              )}
              {promoApplied && (
                <p style={{ fontSize: '11px', color: '#16a34a', marginTop: '6px', fontWeight: 700 }}>
                  {lang === 'ar' ? 'تم تطبيق خصم 10%!' : '10% discount applied!'}
                </p>
              )}
            </div>

            <hr />

            <div className="payments">
              <span>{lang === 'ar' ? 'الفاتورة' : 'PAYMENT'}</span>
              <div className="details">
                <span>{lang === 'ar' ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                <span>{subtotal.toFixed(2)} SAR</span>

                <span>{lang === 'ar' ? 'الشحن:' : 'Shipping:'}</span>
                <span style={{ color: '#16a34a' }}>{lang === 'ar' ? 'مجاني' : 'Free'}</span>

                <span>{lang === 'ar' ? 'الضريبة (5%):' : 'Tax (5%):'}</span>
                <span>{tax.toFixed(2)} SAR</span>

                {promoApplied && (
                  <>
                    <span style={{ color: '#16a34a' }}>{lang === 'ar' ? 'الخصم (10%):' : 'Discount (10%):'}</span>
                    <span style={{ color: '#16a34a' }}>-{discount.toFixed(2)} SAR</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="invoice-card checkout">
        <div className="footer">
          <label className="price">{total.toFixed(2)} SAR</label>
          {showActions && onCheckout ? (
            <button className="checkout-btn" onClick={onCheckout}>
              {lang === 'ar' ? 'تأكيد الطلب' : 'Checkout'}
            </button>
          ) : (
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5a3a38', background: '#F3D2C9', padding: '6px 12px', borderRadius: '8px' }}>
              {order.orderStatus === 'processing'
                ? lang === 'ar' ? 'قيد التجهيز' : 'Processing'
                : order.orderStatus === 'shipped'
                  ? lang === 'ar' ? 'تم الشحن' : 'Shipped'
                  : order.orderStatus}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
