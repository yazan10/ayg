import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const MaintenanceScreen: React.FC = () => {
  const { adminSettings, lang } = useStore();

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-3">
            <Wrench className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-black">
            {lang === 'ar' ? 'وضع الصيانة' : 'Maintenance Mode'}
          </h1>
          <p className="text-sm text-white/90 mt-1">
            {lang === 'ar' ? 'المنصة تحت الصيانة حالياً' : 'Platform under maintenance'}
          </p>
        </div>
        <div className="p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-600">
            <ShieldAlert className="w-5 h-5" />
            <span className="text-sm font-bold">
              {lang === 'ar' ? 'نعود قريباً' : 'Back soon'}
            </span>
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed">
            {lang === 'ar' ? adminSettings.maintenanceMessage : adminSettings.maintenanceMessageEn}
          </p>
          <p className="text-xs text-neutral-500">
            {lang === 'ar'
              ? 'الإدارة فقط يمكنها الدخول حالياً — شكراً لصبرك'
              : 'Only admins can access now — thanks for your patience'}
          </p>
        </div>
      </div>
    </div>
  );
};
