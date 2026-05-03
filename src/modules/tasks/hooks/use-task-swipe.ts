'use client';

import { useState, useCallback } from 'react';

interface SwipeState {
  x: number;
  swiping: boolean;
  threshold: number;
}

export function useTaskSwipe(threshold = 80) {
  const [swipe, setSwipe] = useState<SwipeState>({ x: 0, swiping: false, threshold });

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setSwipe(prev => ({ ...prev, startX: e.touches[0].clientX, swiping: true }));
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!swipe.swiping) return;
    const delta = e.touches[0].clientX - (swipe as any).startX;
    setSwipe(prev => ({ ...prev, x: delta }));
  }, [swipe.swiping]);

  const onTouchEnd = useCallback((onRight: () => void, onLeft: () => void) => {
    if (swipe.x > swipe.threshold) onRight();
    else if (swipe.x < -swipe.threshold) onLeft();
    setSwipe(prev => ({ ...prev, x: 0, swiping: false }));
  }, [swipe.x, swipe.threshold]);

  return { swipe, onTouchStart, onTouchMove, onTouchEnd };
}
