import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import './ui/MobileMenu.css';

export const InstagramBottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, lang, adminSettings } = useStore() as any;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mobile-menu-wrapper">
      <div className="menu">
        <button
          onClick={() => navigate('/')}
          className={isActive('/') ? 'active' : ''}
          aria-label={lang === 'ar' ? 'الرئيسية' : 'Home'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z"
            ></path>
            <path
              d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z"
            ></path>
          </svg>
          <span>{lang === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          onClick={() => navigate('/explore')}
          className={isActive('/explore') ? 'active' : ''}
          aria-label={lang === 'ar' ? 'استكشاف' : 'Explore'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              d="M19.5 21a3 3 0 0 0 3-3v-4.5a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3V18a3 3 0 0 0 3 3h15ZM1.5 10.146V6a3 3 0 0 1 3-3h5.379a2.25 2.25 0 0 1 1.59.659l2.122 2.121c.14.141.331.22.53.22H19.5a3 3 0 0 1 3 3v1.146A4.483 4.483 0 0 0 19.5 9h-15a4.483 4.483 0 0 0-3 1.146Z"
            ></path>
          </svg>
          <span>{lang === 'ar' ? 'استكشاف' : 'Explore'}</span>
        </button>

        <button
          onClick={() => navigate('/create')}
          className={isActive('/create') ? 'active' : ''}
          aria-label={lang === 'ar' ? 'إنشاء' : 'Create'}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span>{lang === 'ar' ? 'نشر' : 'Create'}</span>
        </button>

        {adminSettings?.reelsEnabled !== false && (
          <button
            onClick={() => navigate('/reels')}
            className={isActive('/reels') ? 'active' : ''}
            aria-label={lang === 'ar' ? 'ريلز' : 'Reels'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
              <line x1="7" y1="2" x2="7" y2="22"></line>
              <line x1="17" y1="2" x2="17" y2="22"></line>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="2" y1="7" x2="7" y2="7"></line>
              <line x1="2" y1="17" x2="7" y2="17"></line>
              <line x1="17" y1="17" x2="22" y2="17"></line>
              <line x1="17" y1="7" x2="22" y2="7"></line>
            </svg>

            <span>{lang === 'ar' ? 'ريلز' : 'Reels'}</span>
          </button>
        )}

        <button
          onClick={() => navigate('/profile')}
          className={isActive('/profile') ? 'active' : ''}
          aria-label={lang === 'ar' ? 'حسابي' : 'Profile'}
        >
          <div className="profile-avatar">
            <img src={currentUser.avatar} alt="Profile" />
          </div>
          <span>{lang === 'ar' ? 'حسابي' : 'Profile'}</span>
        </button>
      </div>
    </div>
  );
};
