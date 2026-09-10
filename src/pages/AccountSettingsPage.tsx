import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { ConfirmDeactivateCard } from '../components/ui/ConfirmDeactivateCard';
import { Settings, Shield, Trash2, PauseCircle, AlertTriangle, LogOut, User, Mail, AtSign, Ban, EyeOff } from 'lucide-react';

export const AccountSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, deactivateAccount, deleteAccount, logout } = useAuth();
  const { lang } = useStore();

  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDeactivate = async () => {
    const res = await deactivateAccount();
    if (res.success) {
      setShowDeactivateConfirm(false);
      setSuccessMessage(res.message);
      setTimeout(() => {
        navigate('/login');
      }, 1200);
    }
  };

  const handleDelete = async () => {
    const res = await deleteAccount();
    if (res.success) {
      setShowDeleteConfirm(false);
      setSuccessMessage(res.message);
      setTimeout(() => {
        navigate('/register');
      }, 1200);
    }
  };

  if (!currentUser) {
    return (
      <div>
        <PageHeader title={lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'} />
        <div className="max-w-lg mx-auto p-6 text-center">
          <p className="text-sm text-neutral-500">{lang === 'ar' ? 'الرجاء تسجيل الدخول أولاً' : 'Please login first'}</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold">
            {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-font">
      <PageHeader
        title={lang === 'ar' ? 'إعدادات الحساب' : 'Account Settings'}
        subtitle={lang === 'ar' ? 'إدارة حسابك — تعطيل أو حذف' : 'Manage your account — Deactivate or Delete'}
      />

      <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
            <Shield className="w-4 h-4" />
            {successMessage}
          </div>
        )}

        {/* Account Info Card */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-black">
                {lang === 'ar' ? 'معلومات الحساب' : 'Account Information'}
              </h2>
              <p className="text-xs text-neutral-500">
                {lang === 'ar' ? 'تفاصيل حسابك الحالي' : 'Your current account details'}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-100">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-black text-black truncate">{currentUser.name}</div>
                <div className="text-xs text-neutral-500 font-mono">@{currentUser.username}</div>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold border border-emerald-200">
                {lang === 'ar' ? 'نشط' : 'Active'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                <User className="w-4 h-4 text-neutral-400" />
                <div>
                  <div className="text-[11px] text-neutral-500">الاسم</div>
                  <div className="text-sm font-bold text-black">{currentUser.name}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
                <AtSign className="w-4 h-4 text-neutral-400" />
                <div>
                  <div className="text-[11px] text-neutral-500">اسم المستخدم</div>
                  <div className="text-sm font-bold text-black font-mono">@{currentUser.username}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl sm:col-span-2">
                <Mail className="w-4 h-4 text-neutral-400" />
                <div>
                  <div className="text-[11px] text-neutral-500">البريد الإلكتروني</div>
                  <div className="text-sm font-bold text-black">{currentUser.email}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <h3 className="text-sm font-black text-red-900">
                {lang === 'ar' ? 'المنطقة الخطرة' : 'Danger Zone'}
              </h3>
            </div>
            <p className="text-xs text-red-700 mt-1">
              {lang === 'ar' ? 'إجراءات حساسة — يرجى التأكد قبل المتابعة' : 'Sensitive actions — please confirm before proceeding'}
            </p>
          </div>

          <div className="divide-y divide-neutral-100">
            {/* Deactivate Section */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                  <PauseCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black">
                    {lang === 'ar' ? 'تعطيل الحساب' : 'Deactivate Account'}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed max-w-md">
                    {lang === 'ar'
                      ? 'سيتم إخفاء ملفك ومنشوراتك مؤقتاً. يمكنك استعادة حسابك في أي وقت بتسجيل الدخول مجدداً بنفس البريد وكلمة المرور.'
                      : 'Your profile will be hidden temporarily. You can restore it anytime by logging in again.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeactivateConfirm(true)}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <PauseCircle className="w-4 h-4" />
                {lang === 'ar' ? 'تعطيل الحساب' : 'Deactivate'}
              </button>
            </div>

            {/* Delete Section */}
            <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-black">
                    {lang === 'ar' ? 'حذف الحساب نهائياً' : 'Delete Account Permanently'}
                  </h4>
                  <p className="text-xs text-neutral-600 mt-1 leading-relaxed max-w-md">
                    {lang === 'ar'
                      ? 'سيتم حذف جميع بياناتك ومنشوراتك ومحادثاتك بشكل دائم ولا يمكن التراجع عن هذا الإجراء. سيتم تسجيل خروجك فوراً.'
                      : 'All your data will be permanently removed. This action cannot be undone. You will be logged out immediately.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <Trash2 className="w-4 h-4" />
                {lang === 'ar' ? 'حذف الحساب' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Ban className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-black flex items-center gap-1.5">
                {lang === 'ar' ? 'الحسابات المحظورة' : 'Blocked Accounts'}
                <EyeOff className="w-3 h-3 text-neutral-400" />
              </div>
              <div className="text-xs text-neutral-500">{lang === 'ar' ? 'إدارة قائمة الحظر' : 'Manage blocked accounts'}</div>
            </div>
          </div>
          <button
            onClick={() => navigate('/blocked')}
            className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-sm font-bold"
          >
            {lang === 'ar' ? 'عرض' : 'View'}
          </button>
        </div>

        {/* Alternative: Logout */}
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-neutral-200 flex items-center justify-center">
              <LogOut className="w-4 h-4 text-neutral-600" />
            </div>
            <div>
              <div className="text-sm font-bold text-black">{lang === 'ar' ? 'تسجيل الخروج فقط' : 'Just Logout'}</div>
              <div className="text-xs text-neutral-500">{lang === 'ar' ? 'الخروج بدون تعطيل أو حذف' : 'Logout without deactivating'}</div>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2 bg-white border border-neutral-300 hover:bg-neutral-100 text-black rounded-xl text-sm font-bold"
          >
            {lang === 'ar' ? 'تسجيل خروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Confirmation Modals */}
      {showDeactivateConfirm && (
        <ConfirmDeactivateCard
          type="deactivate"
          lang={lang}
          onConfirm={handleDeactivate}
          onCancel={() => setShowDeactivateConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDeactivateCard
          type="delete"
          lang={lang}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};
