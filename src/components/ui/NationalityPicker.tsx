import React, { useState, useMemo } from 'react';
import { Search, Globe, Check, Lock, X } from 'lucide-react';
import { NATIONALITIES, Nationality } from '../../data/nationalities';
import './NationalityPicker.css';

interface NationalityPickerProps {
  isOpen: boolean;
  onSelect: (nationality: Nationality) => void;
  onClose: () => void;
  selectedCode?: string;
}

export const NationalityPicker: React.FC<NationalityPickerProps> = ({ isOpen, onSelect, onClose, selectedCode }) => {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Nationality | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return NATIONALITIES;
    const q = search.trim().toLowerCase();
    return NATIONALITIES.filter(n =>
      n.nameAr.includes(q) ||
      n.nameEn.toLowerCase().includes(q) ||
      n.code.toLowerCase().includes(q)
    );
  }, [search]);

  const allowedCount = NATIONALITIES.filter(n => n.allowed).length;

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selected && selected.allowed) {
      onSelect(selected);
    }
  };

  return (
    <div className="nationality-overlay" onClick={onClose}>
      <div className="nationality-card" onClick={e => e.stopPropagation()}>
        <div className="nationality-header">
          <div className="flex items-center justify-between">
            <h3>
              <Globe className="w-5 h-5 text-blue-600" />
              اختر جنسيتك
            </h3>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p>
            اختر جنسيتك من القائمة — يوجد <strong>100</strong> جنسية، المتاح حالياً <strong className="text-emerald-600">{allowedCount}</strong> فقط: الفلسطيني، عرب الداخل (إسرائيل)، الأردن، مصر، السعودية، سوريا، اليمن، المغرب، روسيا. الباقي سيُفتح قريباً.
          </p>
        </div>

        <div className="nationality-search">
          <div className="nationality-search-wrapper">
            <Search className="w-4 h-4" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن جنسيتك... (فلسطين، الأردن، مصر...)"
              autoFocus
            />
          </div>
        </div>

        <div className="nationality-grid">
          {filtered.map(n => {
            const isSelected = selected?.code === n.code || selectedCode === n.code;
            return (
              <button
                key={n.code}
                onClick={() => n.allowed && setSelected(n)}
                disabled={!n.allowed}
                className={`nationality-item ${isSelected ? 'selected' : ''} ${!n.allowed ? 'disabled' : ''}`}
                title={n.allowed ? 'متاح للتسجيل' : 'غير متاح حالياً — سيُفتح قريباً'}
              >
                <span className="flag">{n.flag}</span>
                <div className="info">
                  <div className="name-ar">{n.nameAr}</div>
                  <div className="name-en">{n.nameEn} • {n.code}</div>
                </div>
                {n.allowed ? (
                  <span className="badge allowed">متاح ✓</span>
                ) : (
                  <span className="badge blocked flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    قريباً
                  </span>
                )}
                {isSelected && n.allowed && (
                  <Check className="w-4 h-4 text-blue-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <div className="nationality-footer">
          <button className="btn-cancel" onClick={onClose}>
            إلغاء
          </button>
          <button
            className="btn-confirm"
            onClick={handleConfirm}
            disabled={!selected || !selected.allowed}
          >
            تأكيد {selected ? `${selected.flag} ${selected.nameAr}` : ''}
          </button>
        </div>
      </div>
    </div>
  );
};
