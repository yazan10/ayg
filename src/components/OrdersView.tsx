import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, PackageCheck, Truck, CheckCircle2, FileText, CreditCard } from 'lucide-react';
import { StoreInvoice } from './ui/StoreInvoice';

export const OrdersView: React.FC = () => {
  const navigate = useNavigate();
  const { orders, lang, t } = useStore();

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const processingCount = orders.filter(o => o.orderStatus === 'processing').length;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 space-y-5 pb-12 sm:pb-16">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
        <div>
          <h2 className="text-lg font-black text-black flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {t.myOrders}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {lang === 'ar' ? 'متابعة شحناتك والطلبات التي قمت بشرائها' : 'Track your active store orders & deliveries'}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-mono font-black bg-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
            {orders.length} {lang === 'ar' ? 'طلبات' : 'orders'}
          </span>
          {orders.length > 0 && (
            <span className="text-[11px] text-neutral-500">
              {totalSpent.toFixed(2)} SAR • {processingCount} قيد التجهيز
            </span>
          )}
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 p-6 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-black text-base text-black">{t.noOrdersYet}</h3>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto leading-relaxed">
            {lang === 'ar'
              ? 'تصفح منتجات المتاجر وأتمم طلبك الأول بنظام الدفع الآمن. فواتيرك ستظهر هنا بشكل منظم.'
              : 'Browse store catalog and test your first order today. Your invoices will appear here organized.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <button
              onClick={() => navigate('/')}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-black shadow transition-colors"
            >
              {t.startShopping}
            </button>
            <button
              onClick={() => navigate('/stores')}
              className="px-5 py-2.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-black rounded-xl text-xs font-bold"
            >
              {lang === 'ar' ? 'تصفح المتاجر' : 'Browse Stores'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map(order => (
            <div key={order.id} className="space-y-4">
              <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
                <div className="flex items-center justify-between text-[11px] font-bold text-neutral-600">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تم استلام الطلب' : 'Received'}</span>
                  </span>
                  <span className="text-blue-600 flex items-center gap-1">
                    <PackageCheck className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'قيد التجهيز' : 'Packing'}</span>
                  </span>
                  <span className="text-neutral-400 flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'التوصيل' : 'Delivery'}</span>
                  </span>
                </div>
                <div className="w-full bg-neutral-100 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full w-2/3 rounded-full" />
                </div>
                <p className="text-[11px] text-neutral-500 mt-2 text-center">
                  {new Date(order.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  })}
                  {' • '}
                  <span className="font-mono font-bold text-black">{order.orderNumber}</span>
                  {' • '}
                  <span className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full border border-blue-200">
                    <CreditCard className="w-3 h-3" />
                    {order.paymentMethod}
                  </span>
                </p>
              </div>

              <StoreInvoice order={order} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
