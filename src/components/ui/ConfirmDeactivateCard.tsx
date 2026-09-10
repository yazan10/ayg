import React from 'react';
import './ConfirmDeactivateCard.css';

interface ConfirmDeactivateCardProps {
  type: 'deactivate' | 'delete';
  onConfirm: () => void;
  onCancel: () => void;
  lang?: 'ar' | 'en';
}

export const ConfirmDeactivateCard: React.FC<ConfirmDeactivateCardProps> = ({
  type,
  onConfirm,
  onCancel,
  lang = 'ar',
}) => {
  const isDeactivate = type === 'deactivate';

  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div className={`image ${type}`}>
            <svg
              aria-hidden="true"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                strokeLinejoin="round"
                strokeLinecap="round"
              ></path>
            </svg>
          </div>

          <div className="content">
            <span className="title">
              {isDeactivate
                ? lang === 'ar'
                  ? 'تعطيل الحساب'
                  : 'Deactivate account'
                : lang === 'ar'
                  ? 'حذف الحساب نهائياً'
                  : 'Delete account'}
            </span>

            <p className="message">
              {isDeactivate
                ? lang === 'ar'
                  ? 'هل أنت متأكد من تعطيل حسابك؟ سيتم إخفاء ملفك ومنشوراتك مؤقتاً ويمكنك استعادته لاحقاً بتسجيل الدخول مجدداً.'
                  : 'Are you sure you want to deactivate your account? Your profile will be hidden temporarily and can be restored by logging in again.'
                : lang === 'ar'
                  ? 'هل أنت متأكد من حذف حسابك نهائياً؟ سيتم حذف جميع بياناتك ومنشوراتك ومحادثاتك بشكل دائم. لا يمكن التراجع عن هذا الإجراء.'
                  : 'Are you sure you want to delete your account? All of your data will be permanently removed. This action cannot be undone.'}
            </p>
          </div>

          <div className="actions">
            <button
              className={`desactivate ${type}`}
              type="button"
              onClick={onConfirm}
            >
              {isDeactivate
                ? lang === 'ar'
                  ? 'تعطيل'
                  : 'Deactivate'
                : lang === 'ar'
                  ? 'حذف نهائي'
                  : 'Delete'}
            </button>

            <button
              className="cancel"
              type="button"
              onClick={onCancel}
            >
              {lang === 'ar' ? 'إلغاء' : 'Cancel'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
