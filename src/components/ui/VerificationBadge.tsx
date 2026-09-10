import React from 'react';

interface VerificationBadgeProps {
  tier?: 'blue' | 'gold' | 'none';
  size?: 'sm' | 'md' | 'lg';
  verified?: boolean;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ tier, verified, size = 'sm' }) => {
  const effectiveTier = tier || (verified ? 'blue' : 'none');
  if (effectiveTier === 'none' || effectiveTier === undefined) return null;

  const isGold = effectiveTier === 'gold';

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px] border-[1.5px]',
    md: 'w-[18px] h-[18px] text-[11px] border-[1.5px]',
    lg: 'w-5 h-5 text-xs border-2',
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full text-white font-black shrink-0 shadow-sm ${sizeClasses[size]} ${isGold ? 'bg-gradient-to-br from-amber-400 to-yellow-600 border-white' : 'bg-[#0095F6] border-white'}`}
      style={{
        boxShadow: isGold
          ? '0 1px 3px rgba(212, 175, 55, 0.4), 0 0 0 1px rgba(255,255,255,0.8) inset'
          : '0 1px 3px rgba(0, 149, 246, 0.35), 0 0 0 1px rgba(255,255,255,0.9) inset',
      }}
      title={isGold ? 'موثق ذهبي' : 'موثق'}
    >
      <svg viewBox="0 0 24 24" fill="none" className={size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'}>
        <path
          d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"
          fill="white"
          stroke="white"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
};

// Instagram exact blue badge - single color
export const InstagramBlueBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-[18px] h-[18px]',
  };
  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };
  return (
    <span className={`inline-flex items-center justify-center rounded-full bg-[#0095F6] border border-white shadow-sm ${sizeClasses[size]}`} style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.15)' }}>
      <svg viewBox="0 0 24 24" fill="white" className={iconSizes[size]}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
      </svg>
    </span>
  );
};

export const InstagramGoldBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'sm' }) => {
  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-[18px] h-[18px]',
  };
  const iconSizes = {
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] border border-white shadow-sm ${sizeClasses[size]}`}
      style={{ boxShadow: '0 1px 3px rgba(255,215,0,0.5)' }}
    >
      <svg viewBox="0 0 24 24" fill="white" className={iconSizes[size]}>
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="white" />
      </svg>
    </span>
  );
};
