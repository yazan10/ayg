import React from 'react';
import './SkeletonBase.css';

interface PostSkeletonProps {
  count?: number;
}

export const PostSkeleton: React.FC<PostSkeletonProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton-loader skeleton-post">
          <div className="wrapper">
            <div className="circle"></div>
            <div className="line-1"></div>
            <div className="line-2"></div>
            <div className="skeleton-post-image"></div>
            <div className="skeleton-post-actions">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="skeleton-post-caption"></div>
            <div className="line-4" style={{ top: 'auto', bottom: '0' }}></div>
          </div>
        </div>
      ))}
    </>
  );
};

export const PostSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <PostSkeleton count={count} />
    </div>
  );
};
