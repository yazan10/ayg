import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './lib/firebase';

// Global image error handler - replace broken images with grey default
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      const img = target as HTMLImageElement;
      if (!img.dataset.fallbackApplied) {
        img.dataset.fallbackApplied = 'true';
        img.src = 'https://ui-avatars.com/api/?name=aygram&background=d1d5db&color=6b7280&size=200&rounded=true&bold=true&format=svg';
        img.style.background = '#e2e8f0';
        img.classList.add('broken');
      }
    }
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
