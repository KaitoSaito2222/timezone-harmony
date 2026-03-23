import { useState, useRef } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export function useTimeline() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showBusinessHours, setShowBusinessHours] = useLocalStorage<boolean>('showBusinessHours', true);
  const [layoutMode, setLayoutMode] = useLocalStorage<'vertical' | 'horizontal'>('timelineLayout', 'vertical');
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const syncingFrom = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const handleScroll = (index: number) => {
    // Ignore scroll events from other columns that were synced programmatically
    if (syncingFrom.current !== null && syncingFrom.current !== index) return;

    syncingFrom.current = index;
    cancelAnimationFrame(rafRef.current);

    const scrollTop = scrollRefs.current[index]?.scrollTop ?? 0;
    rafRef.current = requestAnimationFrame(() => {
      scrollRefs.current.forEach((ref, i) => {
        if (ref && i !== index) ref.scrollTop = scrollTop;
      });
      // Reset after programmatic scroll events settle
      setTimeout(() => {
        syncingFrom.current = null;
      }, 0);
    });
  };

  const toggleLayoutMode = () =>
    setLayoutMode((prev) => (prev === 'vertical' ? 'horizontal' : 'vertical'));

  return {
    selectedRow,
    setSelectedRow,
    showBusinessHours,
    setShowBusinessHours,
    layoutMode,
    toggleLayoutMode,
    scrollRefs,
    handleScroll,
  };
}
