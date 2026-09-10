import React from 'react';
import './AppPageLoader.css';

interface AppPageLoaderProps {
  message?: string;
  showBrand?: boolean;
}

export const AppPageLoader: React.FC<AppPageLoaderProps> = ({
  message,
  showBrand = true,
}) => {
  return (
    <div className="app-page-loader" role="status" aria-label="Loading">
      {/* Brand */}
      {showBrand && (
        <div className="app-loader-brand">
          <div className="app-loader-brand-icon">ay</div>
          <span className="app-loader-brand-text">aygram</span>
        </div>
      )}

      {/* From Uiverse.io by andrew-manzyk */}
      <div className="loader">
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="text"><span>Loading</span></div>
        <div className="line"></div>
      </div>

      {message && (
        <p className="app-loader-subtitle">{message}</p>
      )}
    </div>
  );
};
