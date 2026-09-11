import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNetworkStatus } from './useNetworkStatus';

interface UseAppPageLoaderOptions {
  initialDelay?: number; // ms for initial site load
  slowNetworkDelay?: number; // ms to show loader when slow
}

export const useAppPageLoader = (options: UseAppPageLoaderOptions = {}) => {
  const { initialDelay = 1800, slowNetworkDelay = 1200 } = options;
  const location = useLocation();
  const { isOnline, isSlowConnection } = useNetworkStatus();

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSlowLoading, setIsSlowLoading] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  // 1. Initial site load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  // 2. Weak internet detection
  useEffect(() => {
    if (!isOnline || isSlowConnection) {
      setIsSlowLoading(true);
      const timer = setTimeout(() => {
        setIsSlowLoading(false);
      }, slowNetworkDelay);
      return () => clearTimeout(timer);
    } else {
      setIsSlowLoading(false);
    }
  }, [isOnline, isSlowConnection, slowNetworkDelay]);

  // 3. Login route loading - show loader briefly when navigating to auth routes
  useEffect(() => {
    const isAuthRoute = ['/login', '/register', '/finishSignIn'].some(route =>
      location.pathname.startsWith(route)
    );

    if (isAuthRoute) {
      setIsRouteLoading(true);
      const timer = setTimeout(() => {
        setIsRouteLoading(false);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const isLoading = isInitialLoading || isSlowLoading || isRouteLoading;

  const getMessage = (): string | undefined => {
    if (isInitialLoading) return 'جاري تحميل aygram...';
    if (!isOnline) return 'الإنترنت غير متصل — جاري إعادة المحاولة...';
    if (isSlowConnection) return 'اتصال ضعيف — جاري التحميل...';
    if (isRouteLoading) return 'جاري فتح صفحة الدخول...';
    return undefined;
  };

  return {
    isLoading,
    isInitialLoading,
    isSlowLoading,
    isRouteLoading,
    isOnline,
    isSlowConnection,
    message: getMessage(),
  };
};
