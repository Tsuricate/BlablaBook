import { useEffect, useRef } from 'react';

type Params = {
  onLoadMore: () => void;
  hasNext: boolean;
  loading: boolean;
  rootMargin?: string;
  enabled?: boolean;
};

export const useInfiniteScroll = ({
  onLoadMore,
  hasNext,
  loading,
  rootMargin = '200px',
  enabled = true,
}: Params) => {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!sentinelRef.current) return;
    if (!hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry.isIntersecting) return;
        if (loading) return;

        onLoadMore();
      },
      { rootMargin }
    );

    observer.observe(sentinelRef.current);

    return () => observer.disconnect();
  }, [onLoadMore, hasNext, loading, enabled, rootMargin]);

  return sentinelRef;
};
