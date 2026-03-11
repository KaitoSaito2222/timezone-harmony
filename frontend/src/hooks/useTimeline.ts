import { useState, useRef, useEffect } from 'react';

export function useTimeline() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showBusinessHours, setShowBusinessHours] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const syncingFrom = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const savedBH = localStorage.getItem('showBusinessHours');
    if (savedBH === 'false') setShowBusinessHours(false);
    const savedLayout = localStorage.getItem('timelineLayout');
    if (savedLayout === 'horizontal') setLayoutMode('horizontal');
  }, []);

  useEffect(() => {
    localStorage.setItem('showBusinessHours', String(showBusinessHours));
  }, [showBusinessHours]);

  useEffect(() => {
    localStorage.setItem('timelineLayout', layoutMode);
  }, [layoutMode]);

  const handleScroll = (index: number) => {
    // プログラム的に同期された他カラムからのイベントは無視
    if (syncingFrom.current !== null && syncingFrom.current !== index) return;

    syncingFrom.current = index;
    cancelAnimationFrame(rafRef.current);

    const scrollTop = scrollRefs.current[index]?.scrollTop ?? 0;
    rafRef.current = requestAnimationFrame(() => {
      scrollRefs.current.forEach((ref, i) => {
        if (ref && i !== index) ref.scrollTop = scrollTop;
      });
      // 他カラムのscrollイベントが落ち着いてからリセット
      requestAnimationFrame(() => {
        syncingFrom.current = null;
      });
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
