import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { CommentsPage } from './pages/CommentsPage';
import { CreatePage } from './pages/CreatePage';
import { WalletPage } from './pages/WalletPage';
import { LivePage } from './pages/LivePage';
import { GoLivePage } from './pages/GoLivePage';
import { ApiPage } from './pages/ApiPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { CreateStorePage } from './pages/CreateStorePage';
import { StoryPage } from './pages/StoryPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VerifyOtpPage } from './pages/VerifyOtpPage';
import { ProfileMenuPage } from './pages/ProfileMenuPage';
import { PricingPage } from './pages/PricingPage';
import { StoresPage } from './pages/StoresPage';
import { AccountsPage } from './pages/AccountsPage';
import { AccountSettingsPage } from './pages/AccountSettingsPage';
import { BlockedUsersPage } from './pages/BlockedUsersPage';
import { UserProfile } from './pages/UserProfile';
import { MyAccountsPage } from './pages/MyAccountsPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ExploreView } from './components/ExploreView';
import { ReelsView } from './components/ReelsView';
import { DirectMessagesView } from './components/DirectMessagesView';
import { OrdersView } from './components/OrdersView';
import { UserProfileView } from './components/UserProfileView';
import { AppPageLoader } from './components/ui/AppPageLoader';
import { useAppPageLoader } from './hooks/useAppPageLoader';
import { CallProvider } from './context/CallContext';
import { CallScreen } from './components/calls/CallScreen';
import { CallFeedback } from './components/calls/CallFeedback';
import { useStore } from './context/StoreContext';
import { MaintenanceScreen } from './components/MaintenanceScreen';
import { Ban } from 'lucide-react';

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  if (isLoading) return <div className="p-8 text-center text-sm text-neutral-500">جاري التحقق...</div>;
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const ReelsRoute: React.FC = () => {
  const { adminSettings, lang } = useStore() as any;
  if (adminSettings?.reelsEnabled === false) {
    return (
      <div className="max-w-lg mx-auto p-8 text-center space-y-4 py-16">
        <div className="w-20 h-20 rounded-2xl bg-red-50 border-2 border-red-200 flex items-center justify-center mx-auto">
          <Ban className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-lg font-black text-black">{lang === 'ar' ? 'قسم الريلز مغلق حالياً' : 'Reels Closed'}</h2>
        <p className="text-sm text-neutral-600 leading-relaxed">
          {lang === 'ar' ? 'تم إغلاق قسم الريلز مؤقتاً — ممنوع رفع الفيديوهات حالياً. يمكنك نشر صور المنتجات والقصص فقط.' : 'Reels is temporarily closed — video uploads are disabled. You can post product images and stories.'}
        </p>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
          {lang === 'ar' ? 'سيُفتح قريباً — تابع التحديثات' : 'Will reopen soon — stay tuned'}
        </div>
      </div>
    );
  }
  return <ReelsView />;
};

function AppRoutes() {
  const { isLoading, message } = useAppPageLoader({
    initialDelay: 2000,
    slowNetworkDelay: 1500,
  });
  const { adminSettings, isAdmin } = useStore() as any;
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Maintenance mode - only admins can access
  if (adminSettings?.maintenanceMode && !isAdmin && !isAdminRoute) {
    return <MaintenanceScreen />;
  }

  return (
    <>
      {/* App Page Loader - Shows on: initial load, weak internet, login */}
      {isLoading && <AppPageLoader message={message} />}

      {/* Call Screens - Global */}
      <CallScreen />
      <CallFeedback />

      <Routes>
        {/* Public Auth Routes - no layout */}
        <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><RegisterPage /></PublicOnlyRoute>} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Main App with Layout */}
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="explore" element={<ExploreView />} />
          <Route path="reels" element={<ReelsRoute />} />
          <Route path="messages" element={<DirectMessagesView />} />
          <Route path="orders" element={<ProtectedRoute><OrdersView /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><UserProfileView /></ProtectedRoute>} />
          <Route path="profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="profile/menu" element={<ProfileMenuPage />} />
          <Route path="settings/account" element={<ProtectedRoute><AccountSettingsPage /></ProtectedRoute>} />
          <Route path="blocked" element={<ProtectedRoute><BlockedUsersPage /></ProtectedRoute>} />
          <Route path="my-accounts" element={<ProtectedRoute><MyAccountsPage /></ProtectedRoute>} />
          <Route path="user/:username" element={<UserProfile />} />
          <Route path="profile/:username" element={<UserProfile />} />
          <Route path="store/:storeId" element={<StorePage />} />
          <Route path="product/:productId" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="comments/:targetId" element={<CommentsPage />} />
          <Route path="create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
          <Route path="create-store" element={<ProtectedRoute><CreateStorePage /></ProtectedRoute>} />
          <Route path="wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
          <Route path="live/:liveId" element={<LivePage />} />
          <Route path="go-live" element={<ProtectedRoute><GoLivePage /></ProtectedRoute>} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="accounts" element={<AccountsPage />} />
          <Route path="api" element={<ApiPage />} />
          <Route path="admin" element={<AdminPage />} />
          <Route path="story/:storyId" element={<StoryPage />} />
          {/* Fallback 404 - Uiverse TV Design */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <CallProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CallProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
