import { useState, useRef, useEffect } from 'react';

export function useTimeline() {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showBusinessHours, setShowBusinessHours] = useState(true);
  const [layoutMode, setLayoutMode] = useState<'vertical' | 'horizontal'>('vertical');
  const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);
  const isSyncing = useRef(false);

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
    if (isSyncing.current) return;
    isSyncing.current = true;
    const scrollTop = scrollRefs.current[index]?.scrollTop ?? 0;
    requestAnimationFrame(() => {
      scrollRefs.current.forEach((ref, i) => {
        if (ref && i !== index) ref.scrollTop = scrollTop;
      });
      isSyncing.current = false;
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
