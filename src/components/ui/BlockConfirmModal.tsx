import React from 'react';
import { Ban, UserCheck, ShieldAlert } from 'lucide-react';
import './BlockConfirmModal.css';

interface BlockConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isBlocked: boolean;
  userName: string;
  username: string;
  avatar?: string;
  lang?: 'ar' | 'en';
}

export const BlockConfirmModal: React.FC<BlockConfirmModalProps> = ({ isOpen, onClose, onConfirm, isBlocked, userName, username, avatar, lang = 'ar' }) => {
  if (!isOpen) return null;

  return (
    <div className="block-overlay" onClick={onClose}>
      <div className="block-card" onClick={e => e.stopPropagation()}>
        <div className="block-header">
          <div className={`block-icon ${isBlocked ? 'unblock' : 'block'}`}>
            {isBlocked ? <UserCheck className="w-6 h-6" /> : <Ban className="w-6 h-6" />}
          </div>
          <h3 className="block-title">
            {isBlocked
              ? lang === 'ar' ? 'إلغاء الحظر؟' : 'Unblock user?'
              : lang === 'ar' ? 'حظر هذا الحساب؟' : 'Block this account?'}
          </h3>
          <p className="block-message">
            {isBlocked
              ? lang === 'ar'
                ? `هل تريد إلغاء حظر @${username}؟ سيتمكن من رؤية ملفك ومنشوراتك ومراسلتك مجدداً.`
                : `Unblock @${username}? They will be able to see your profile and message you again.`
              : lang === 'ar'
                ? `هل أنت متأكد من حظر @${username}؟ لن يتمكن من رؤية ملفك أو منشوراتك أو مراسلتك، وسيتم إخفاء محادثاتكم.`
                : `Block @${username}? They won't be able to see your profile or message you.`}
          </p>

          <div className="block-user-preview">
            {avatar ? (
              <img src={avatar} alt={userName} />
            ) : (
              <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
            <div className="block-user-preview-info">
              <div className="block-user-preview-name">{userName}</div>
              <div className="block-user-preview-username">@{username}</div>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${isBlocked ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
              {isBlocked ? (lang === 'ar' ? 'محظور' : 'Blocked') : (lang === 'ar' ? 'سيُحظر' : 'Will be blocked')}
            </span>
          </div>
        </div>

        <div className="block-actions">
          <button className="btn-cancel" onClick={onClose}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button className={isBlocked ? 'btn-unblock' : 'btn-block'} onClick={onConfirm}>
            {isBlocked ? (
              <>
                <UserCheck className="w-4 h-4" />
                {lang === 'ar' ? 'إلغاء الحظر' : 'Unblock'}
              </>
            ) : (
              <>
                <Ban className="w-4 h-4" />
                {lang === 'ar' ? 'حظر' : 'Block'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
