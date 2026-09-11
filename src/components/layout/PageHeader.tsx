import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, showBack = true, backTo, actions }) => {
  const navigate = useNavigate();
  const { lang } = useStore();
  const isRtl = lang === 'ar';

  const handleBack = () => {
    if (backTo) navigate(backTo);
    else navigate(-1);
  };

  return (
    <div className="sticky top-[56px] sm:top-[60px] z-20 bg-white/95 backdrop-blur-md border-b border-neutral-200 px-4 h-14 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-black transition-colors"
          >
            {isRtl ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          </button>
        )}
        <div>
          <h1 className="text-sm font-black text-black leading-none">{title}</h1>
          {subtitle && <p className="text-[11px] text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};
