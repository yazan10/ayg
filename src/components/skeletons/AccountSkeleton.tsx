import React from 'react';
import './SkeletonBase.css';

interface AccountSkeletonProps {
  count?: number;
  variant?: 'card' | 'list';
}

export const AccountSkeleton: React.FC<AccountSkeletonProps> = ({ count = 3, variant = 'card' }) => {
  if (variant === 'list') {
    return (
      <>
        {Array.from({ length: count }).map((_, index) => (
          <div key={index} className="skeleton-loader" style={{ height: '80px', marginBottom: '8px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="wrapper" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div className="circle" style={{ width: '48px', height: '48px', flexShrink: 0 }}></div>
              <div style={{ flex: 1, position: 'relative', height: '48px' }}>
                <div className="line-1" style={{ position: 'absolute', top: '8px', left: '0', width: '120px' }}></div>
                <div className="line-2" style={{ position: 'absolute', top: '28px', left: '0', width: '180px' }}></div>
              </div>
            </div>
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-loader skeleton-account">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="line-3"></div>
            <div className="line-4"></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const AccountSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AccountSkeleton count={count} variant="card" />
    </div>
  );
};
