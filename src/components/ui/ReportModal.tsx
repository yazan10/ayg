import React, { useState } from 'react';
import { X, Flag, ShieldAlert, AlertTriangle, Ban, Copyright, MessageSquare, User, Store, EyeOff, Skull, Siren } from 'lucide-react';
import { ReportReason, ReportTargetType } from '../../types';
import './ReportModal.css';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, description: string) => void;
  targetName?: string;
  targetUsername?: string;
  targetAvatar?: string;
  targetType: ReportTargetType;
  lang?: 'ar' | 'en';
}

const REASONS: Array<{ value: ReportReason; icon: React.ReactNode; titleAr: string; titleEn: string; descAr: string; descEn: string }> = [
  { value: 'porn', icon: <EyeOff className="w-4 h-4" />, titleAr: 'محتوى إباحي', titleEn: 'Pornographic', descAr: 'محتوى جنسي أو إباحي', descEn: 'Pornographic content' },
  { value: 'blasphemy', icon: <Siren className="w-4 h-4" />, titleAr: 'كفر أو إساءة دينية', titleEn: 'Blasphemy', descAr: 'إساءة للدين أو المقدسات', descEn: 'Religious offense' },
  { value: 'impersonation', icon: <User className="w-4 h-4" />, titleAr: 'انتحال شخصية', titleEn: 'Impersonation', descAr: 'انتحال شخصية أو حساب مزيف', descEn: 'Impersonation' },
  { value: 'extortion', icon: <ShieldAlert className="w-4 h-4" />, titleAr: 'ابتزاز', titleEn: 'Extortion', descAr: 'ابتزاز أو تهديد للحصول على مال/خدمة', descEn: 'Blackmail or extortion' },
  { value: 'defamation', icon: <Flag className="w-4 h-4" />, titleAr: 'تشهير', titleEn: 'Defamation', descAr: 'تشهير أو نشر أكاذيب عن شخص/جهة', descEn: 'Defamation' },
  { value: 'dangerous', icon: <AlertTriangle className="w-4 h-4" />, titleAr: 'نشر مواضيع خطيرة', titleEn: 'Dangerous Content', descAr: 'نشر معلومات خطيرة أو مضللة', descEn: 'Dangerous topics' },
  { value: 'terrorism', icon: <Siren className="w-4 h-4" />, titleAr: 'إرهاب', titleEn: 'Terrorism', descAr: 'ترويج للإرهاب أو التطرف', descEn: 'Terrorism' },
  { value: 'harassment', icon: <Ban className="w-4 h-4" />, titleAr: 'تحرش', titleEn: 'Harassment', descAr: 'تحرش أو مضايقة', descEn: 'Harassment' },
  { value: 'spam', icon: <Flag className="w-4 h-4" />, titleAr: 'إزعاج أو إعلان', titleEn: 'Spam', descAr: 'إعلانات متكررة أو مزعج', descEn: 'Spam' },
  { value: 'abuse', icon: <ShieldAlert className="w-4 h-4" />, titleAr: 'إساءة أو تنمر', titleEn: 'Abuse', descAr: 'إساءة، تنمر، تهديد', descEn: 'Abuse' },
  { value: 'copyright', icon: <Copyright className="w-4 h-4" />, titleAr: 'انتهاك حقوق', titleEn: 'Copyright', descAr: 'محتوى محمي بدون إذن', descEn: 'Copyright' },
  { value: 'other', icon: <MessageSquare className="w-4 h-4" />, titleAr: 'أخرى', titleEn: 'Other', descAr: 'سبب آخر', descEn: 'Other' },
];

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit, targetName, targetUsername, targetAvatar, targetType, lang = 'ar' }) => {
  const [selectedReason, setSelectedReason] = useState<ReportReason | null>(null);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, description);
    setSelectedReason(null);
    setDescription('');
  };

  const handleClose = () => {
    setSelectedReason(null);
    setDescription('');
    onClose();
  };

  const getTargetIcon = () => {
    if (targetType === 'store') return <Store className="w-4 h-4" />;
    if (targetType === 'user') return <User className="w-4 h-4" />;
    return <Flag className="w-4 h-4" />;
  };

  return (
    <div className="report-overlay" onClick={handleClose}>
      <div className="report-card" onClick={e => e.stopPropagation()}>
        <div className="report-header">
          <h3>
            <Flag className="w-5 h-5 text-red-600" />
            {lang === 'ar' ? 'الإبلاغ' : 'Report'}
          </h3>
          <button onClick={handleClose} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="report-body">
          <div className="report-target">
            {targetAvatar ? (
              <img src={targetAvatar} alt={targetName} />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                {getTargetIcon()}
              </div>
            )}
            <div className="report-target-info">
              <div className="report-target-name">{targetName || targetUsername || 'مجهول'}</div>
              {targetUsername && <div className="report-target-username">@{targetUsername} • {targetType}</div>}
            </div>
            <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-bold border border-red-200">
              {lang === 'ar' ? 'إبلاغ' : 'Report'}
            </span>
          </div>

          <div className="report-reasons">
            <span className="report-reason-label">{lang === 'ar' ? 'اختر السبب *' : 'Select reason *'}</span>
            {REASONS.map(r => (
              <button
                key={r.value}
                onClick={() => setSelectedReason(r.value)}
                className={`report-reason-option ${selectedReason === r.value ? 'selected' : ''}`}
              >
                <input type="radio" checked={selectedReason === r.value} onChange={() => setSelectedReason(r.value)} readOnly />
                <div className="reason-icon">{r.icon}</div>
                <div className="report-reason-text">
                  <div className="report-reason-title">{lang === 'ar' ? r.titleAr : r.titleEn}</div>
                  <div className="report-reason-desc">{lang === 'ar' ? r.descAr : r.descEn}</div>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="report-reason-label" style={{ marginBottom: '6px', display: 'block' }}>
              {lang === 'ar' ? 'تفاصيل إضافية (اختياري)' : 'Additional details (optional)'}
            </label>
            <textarea
              className="report-textarea"
              placeholder={lang === 'ar' ? 'اشرح سبب الإبلاغ بمزيد من التفصيل...' : 'Explain in more detail...'}
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
            />
            <div className="text-[11px] text-neutral-400 text-end mt-1">{description.length}/500</div>
          </div>
        </div>

        <div className="report-footer">
          <button className="btn-cancel" onClick={handleClose}>
            {lang === 'ar' ? 'إلغاء' : 'Cancel'}
          </button>
          <button className="btn-submit" onClick={handleSubmit} disabled={!selectedReason}>
            {lang === 'ar' ? 'إرسال البلاغ' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
};
