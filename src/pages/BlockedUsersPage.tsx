import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Ban, UserCheck, ShieldAlert } from 'lucide-react';

export const BlockedUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const { blockedUsers, unblockUser, lang } = useStore();

  return (
    <div>
      <PageHeader title={lang === 'ar' ? 'الحسابات المحظورة' : 'Blocked Accounts'} subtitle={`${blockedUsers.length} ${lang === 'ar' ? 'محظور' : 'blocked'}`} />

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {blockedUsers.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 p-8 space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="font-black text-base">{lang === 'ar' ? 'لا يوجد حسابات محظورة' : 'No blocked accounts'}</h3>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              {lang === 'ar' ? 'عند حظر أي حساب سيظهر هنا ويمكنك إلغاء الحظر في أي وقت.' : 'Blocked accounts will appear here. You can unblock anytime.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedUsers.map(block => (
              <div key={block.id} className="bg-white rounded-2xl border border-neutral-200 p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={block.avatar} alt={block.name} className="w-12 h-12 rounded-full object-cover border-2 border-red-100" />
                  <div>
                    <div className="text-sm font-black text-black">{block.name}</div>
                    <div className="text-xs text-neutral-500 font-mono">@{block.username}</div>
                    <div className="text-[11px] text-neutral-400">{new Date(block.createdAt).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-US')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/user/${block.username}`)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black rounded-xl text-xs font-bold border border-neutral-200"
                  >
                    {lang === 'ar' ? 'عرض' : 'View'}
                  </button>
                  <button
                    onClick={() => unblockUser(block.userId)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    {lang === 'ar' ? 'إلغاء الحظر' : 'Unblock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2">
          <Ban className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {lang === 'ar'
              ? 'الحسابات المحظورة لن تتمكن من رؤية ملفك أو منشوراتك أو مراسلتك، وسيتم إخفاء محادثاتكم تلقائياً.'
              : 'Blocked accounts cannot see your profile or message you, and conversations are hidden automatically.'}
          </p>
        </div>
      </div>
    </div>
  );
};
