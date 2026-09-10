import { useState, useEffect } from 'react';

/**
 * Hook for skeleton loading simulation
 * @param delay - loading duration in ms (default 1200ms)
 * @param dependency - optional dependency array to re-trigger loading
 */
export const useSkeletonLoading = (delay: number = 1200, dependency: unknown[] = []) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [...dependency, delay]);

  return isLoading;
};

/**
 * Hook for data loading with skeleton
 * Simulates network fetch for posts/accounts/chats
 */
export const useDataLoading = <T,>(data: T, delay: number = 1200) => {
  const [isLoading, setIsLoading] = useState(true);
  const [displayData, setDisplayData] = useState<T | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setDisplayData(null);

    const timer = setTimeout(() => {
      setDisplayData(data);
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [data, delay]);

  return { isLoading, data: displayData };
};
