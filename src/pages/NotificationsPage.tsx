import React from 'react';
import { useStore } from '../context/StoreContext';
import { PageHeader } from '../components/layout/PageHeader';
import { Heart, MessageCircle, UserPlus, Package, Film, Bell } from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead, toggleFollowUser, lang } = useStore();

  return (
    <div className="flex flex-col">
      <PageHeader
        title={lang === 'ar' ? 'النشاط والإشعارات' : 'Activity & Notifications'}
        subtitle={`${notifications.filter(n => !n.isRead).length} ${lang === 'ar' ? 'غير مقروءة' : 'unread'}`}
        actions={
          <button onClick={markAllNotificationsRead} className="text-xs font-bold text-blue-600 hover:underline px-2 py-1">
            {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
          </button>
        }
      />
      <div className="p-3 sm:p-4 space-y-2 max-w-2xl mx-auto w-full">
        {notifications.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Bell className="w-12 h-12 text-neutral-300 mx-auto" />
            <p className="text-sm text-neutral-400">{lang === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}</p>
          </div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className={`p-4 rounded-2xl flex items-center gap-3 border ${notif.isRead ? 'bg-white border-neutral-200 hover:bg-neutral-50' : 'bg-blue-50/70 border-blue-100'}`}>
              <div className="relative shrink-0">
                <img src={notif.actorAvatar} alt={notif.actorName} className="w-12 h-12 rounded-full object-cover border border-neutral-200" />
                <span className={`absolute -bottom-1 -end-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${notif.type === 'like' ? 'bg-red-500' : notif.type === 'comment' ? 'bg-blue-500' : notif.type === 'follow' ? 'bg-purple-500' : notif.type === 'reel' ? 'bg-pink-500' : 'bg-blue-600'}`}>
                  {notif.type === 'like' && <Heart className="w-3 h-3 fill-white" />}
                  {notif.type === 'comment' && <MessageCircle className="w-3 h-3 fill-white" />}
                  {notif.type === 'follow' && <UserPlus className="w-3 h-3" />}
                  {notif.type === 'reel' && <Film className="w-3 h-3" />}
                  {notif.type === 'order' && <Package className="w-3 h-3" />}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-black leading-snug">
                  <span className="font-bold me-1">@{notif.actorUsername}</span>
                  {lang === 'ar' ? notif.text : notif.textEn}
                </p>
                <span className="text-xs text-neutral-400 font-mono mt-1 block">{notif.time}</span>
              </div>
              {notif.targetImage ? (
                <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-neutral-200">
                  <img src={notif.targetImage} alt="Post" className="w-full h-full object-cover" />
                </div>
              ) : notif.type === 'follow' ? (
                <button onClick={() => toggleFollowUser(notif.actorUsername)} className="px-3 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700">
                  {lang === 'ar' ? 'رد المتابعة' : 'Follow back'}
                </button>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
