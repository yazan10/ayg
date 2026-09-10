import React from 'react';
import { useStore } from '../context/StoreContext';
import { 
  Heart, 
  MessageCircle, 
  UserPlus, 
  Package, 
  Film, 
  X, 
  Check, 
  Bell
} from 'lucide-react';

export const NotificationsModal: React.FC = () => {
  const { 
    notifications, 
    isNotificationsOpen, 
    setIsNotificationsOpen, 
    markAllNotificationsRead,
    toggleFollowUser,
    lang 
  } = useStore();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center sm:justify-end sm:p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full sm:w-96 max-h-[85vh] bg-white sm:rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200 mt-14 sm:mt-0">
        {/* Header */}
        <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm text-black">
              {lang === 'ar' ? 'النشاط والإشعارات' : 'Activity & Notifications'}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-bold"
            >
              {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 p-2">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              {lang === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No new notifications'}
            </div>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl flex items-center gap-3 transition-colors ${
                  notif.isRead ? 'hover:bg-neutral-50' : 'bg-blue-50/50'
                }`}
              >
                {/* Actor Avatar with Type Badge */}
                <div className="relative shrink-0">
                  <img
                    src={notif.actorAvatar}
                    alt={notif.actorName}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                  />
                  <span className={`absolute -bottom-1 -end-1 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white ${
                    notif.type === 'like' ? 'bg-red-500' :
                    notif.type === 'comment' ? 'bg-blue-500' :
                    notif.type === 'follow' ? 'bg-purple-500' :
                    notif.type === 'reel' ? 'bg-pink-500' : 'bg-blue-600'
                  }`}>
                    {notif.type === 'like' && <Heart className="w-2.5 h-2.5 fill-white" />}
                    {notif.type === 'comment' && <MessageCircle className="w-2.5 h-2.5 fill-white" />}
                    {notif.type === 'follow' && <UserPlus className="w-2.5 h-2.5" />}
                    {notif.type === 'reel' && <Film className="w-2.5 h-2.5" />}
                    {notif.type === 'order' && <Package className="w-2.5 h-2.5" />}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-black leading-snug">
                    <span className="font-bold text-black me-1">@{notif.actorUsername}</span>
                    {lang === 'ar' ? notif.text : notif.textEn}
                  </p>
                  <span className="text-[10px] text-neutral-400 font-mono mt-0.5 block">{notif.time}</span>
                </div>

                {/* Optional Right action (Target thumbnail or follow button) */}
                {notif.targetImage ? (
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                    <img src={notif.targetImage} alt="Post" className="w-full h-full object-cover" />
                  </div>
                ) : notif.type === 'follow' ? (
                  <button
                    onClick={() => toggleFollowUser(notif.actorUsername)}
                    className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold shrink-0 hover:bg-blue-700 transition-colors"
                  >
                    {lang === 'ar' ? 'رد المتابعة' : 'Follow back'}
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
